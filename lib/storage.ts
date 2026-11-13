import { BlobAccessError, get, list, put, type PutBlobResult } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export const CONTENT_BLOB_PATH = "cms/content.json";
export const CMS_IMAGE_PREFIX = "/api/cms-image/";
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "images");

type BlobAccess = "public" | "private";

let cachedAccess: BlobAccess | null = null;

export function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export function blobMissingMessage() {
  return "Vercel Blob is connected as a Private store. Redeploy so this app can upload with private access, then try the image again.";
}

export function filesystemReadOnlyMessage() {
  return "This host cannot write files. Connect a Vercel Blob store to save images and content in production.";
}

function preferredAccess(): BlobAccess {
  if (process.env.BLOB_ACCESS === "public" || process.env.BLOB_ACCESS === "private") {
    return process.env.BLOB_ACCESS;
  }
  return cachedAccess ?? "private";
}

function isAccessError(error: unknown) {
  if (error instanceof BlobAccessError) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /access|private|public/i.test(message);
}

function publicImageUrl(pathname: string) {
  return `${CMS_IMAGE_PREFIX}${pathname
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/")}`;
}

async function putSiteBlob(
  pathname: string,
  body: Buffer | string,
  options: {
    addRandomSuffix?: boolean;
    allowOverwrite?: boolean;
    contentType: string;
    cacheControlMaxAge?: number;
  }
): Promise<{ blob: PutBlobResult; access: BlobAccess }> {
  const first = preferredAccess();
  const second: BlobAccess = first === "private" ? "public" : "private";

  try {
    const blob = await put(pathname, body, { ...options, access: first });
    cachedAccess = first;
    return { blob, access: first };
  } catch (error) {
    if (!isAccessError(error)) throw error;
    const blob = await put(pathname, body, { ...options, access: second });
    cachedAccess = second;
    return { blob, access: second };
  }
}

async function getSiteBlob(pathname: string, useCache = true) {
  const first = preferredAccess();
  const second: BlobAccess = first === "private" ? "public" : "private";

  try {
    const result = await get(pathname, { access: first, useCache });
    if (result) {
      cachedAccess = first;
      return result;
    }
  } catch (error) {
    if (!isAccessError(error)) throw error;
  }

  const result = await get(pathname, { access: second, useCache });
  if (result) cachedAccess = second;
  return result;
}

export async function writeContentBlob(json: string) {
  const { blob } = await putSiteBlob(CONTENT_BLOB_PATH, json, {
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
    const result = await getSiteBlob(CONTENT_BLOB_PATH, false);
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
    const response = await fetch(match.url, { cache: "no-store" });
    if (!response.ok) return null;
    return response.text();
  } catch (error) {
    console.error("Failed to read blob content via list()", error);
    return null;
  }
}

export async function saveImageToBlob(filename: string, bytes: Buffer, contentType: string) {
  const { blob, access } = await putSiteBlob(`uploads/${filename}`, bytes, {
    addRandomSuffix: true,
    contentType,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });

  if (access === "private") {
    return publicImageUrl(blob.pathname);
  }

  return blob.url;
}

export async function readBlobImage(pathname: string) {
  const safePath = pathname.replace(/^\/+/, "");
  if (!safePath.startsWith("uploads/") || safePath.includes("..") || safePath.includes("\\")) {
    return null;
  }

  const result = await getSiteBlob(safePath);
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
