import { get, list, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export const CONTENT_BLOB_PATH = "cms/content.json";
export const CMS_IMAGE_PREFIX = "/api/cms-image/";
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "images");
const BLOB_ACCESS = "private" as const;

export function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export function blobCredentialStatus() {
  return {
    blob: hasBlobStore(),
    storeId: Boolean(process.env.BLOB_STORE_ID),
    oidc: Boolean(process.env.VERCEL_OIDC_TOKEN),
    rwToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    vercel: Boolean(process.env.VERCEL),
  };
}

export function blobMissingMessage() {
  return "Vercel Blob needs a credential. In the Blob store open the .env.local tab, copy BLOB_READ_WRITE_TOKEN into this project’s Production environment variables, then Redeploy.";
}

export function filesystemReadOnlyMessage() {
  return "This host cannot write files. Connect a Vercel Blob store to save images and content in production.";
}

function publicImageUrl(pathname: string) {
  return `${CMS_IMAGE_PREFIX}${pathname
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/")}`;
}

function wrapBlobError(error: unknown): Error {
  const message = error instanceof Error ? error.message : "Blob upload failed";
  if (/failed to fetch|network|oidc|token|unauthorized|403|401/i.test(message)) {
    return new Error(blobMissingMessage());
  }
  return error instanceof Error ? error : new Error(message);
}

function toPutBody(body: File | Blob | Buffer | Uint8Array | string) {
  if (typeof body === "string") return body;
  if (body instanceof File || body instanceof Blob) return body;
  const bytes = body instanceof Buffer ? body : Buffer.from(body);
  return new Blob([bytes]);
}

export async function writeContentBlob(json: string) {
  const blob = await put(CONTENT_BLOB_PATH, json, {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });
  return blob.url;
}

export async function readContentBlob() {
  if (!hasBlobStore()) return null;

  try {
    const result = await get(CONTENT_BLOB_PATH, { access: BLOB_ACCESS, useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return await new Response(result.stream).text();
    }
  } catch (error) {
    console.error("Failed to read blob content via get()", error);
  }

  try {
    const { blobs } = await list({ prefix: CONTENT_BLOB_PATH, limit: 20 });
    const match = blobs.find(
      (item) => item.pathname === CONTENT_BLOB_PATH || item.pathname.endsWith(`/${CONTENT_BLOB_PATH}`)
    );
    if (!match?.url) return null;
    const result = await get(match.url, { access: BLOB_ACCESS, useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return await new Response(result.stream).text();
    }
    return null;
  } catch (error) {
    console.error("Failed to read blob content via list()", error);
    return null;
  }
}

export async function saveImageToBlob(
  filename: string,
  body: File | Blob | Buffer | Uint8Array,
  contentType: string
) {
  try {
    const blob = await put(`uploads/${filename}`, toPutBody(body), {
      access: BLOB_ACCESS,
      addRandomSuffix: true,
      contentType,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return publicImageUrl(blob.pathname);
  } catch (error) {
    throw wrapBlobError(error);
  }
}

export async function readBlobImage(pathname: string) {
  const safePath = pathname.replace(/^\/+/, "");
  if (!safePath.startsWith("uploads/") || safePath.includes("..") || safePath.includes("\\")) {
    return null;
  }

  const result = await get(safePath, { access: BLOB_ACCESS });
  if (result?.statusCode !== 200 || !result.stream) return null;

  return {
    body: await new Response(result.stream).arrayBuffer(),
    contentType: result.blob.contentType || "application/octet-stream",
    cacheControl: result.blob.cacheControl || "public, max-age=31536000, immutable",
  };
}

export async function saveImageToDisk(filename: string, bytes: Buffer) {
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, filename), bytes);
  return `/images/${filename}`;
}

export async function readLocalImage(filename: string) {
  const safeName = path.basename(filename);
  if (safeName !== filename || safeName.includes("..")) {
    throw new Error("Invalid filename");
  }
  return fs.readFile(path.join(LOCAL_UPLOAD_DIR, safeName));
}

export function toDataUrl(bytes: Buffer, contentType: string) {
  return `data:${contentType};base64,${bytes.toString("base64")}`;
}
