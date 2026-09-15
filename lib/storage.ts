import { list, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export const CONTENT_BLOB_PATH = "cms/content.json";
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export function blobMissingMessage() {
  return "Image uploads need Vercel Blob in production. Create a Blob store in the Vercel dashboard for this project, then redeploy so BLOB_READ_WRITE_TOKEN is available.";
}

export function filesystemReadOnlyMessage() {
  return "This host cannot write files. Add a Vercel Blob store (BLOB_READ_WRITE_TOKEN) to save images and content in production.";
}

let cachedContentUrl: string | null = null;

export async function writeContentBlob(json: string) {
  const blob = await put(CONTENT_BLOB_PATH, json, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });
  cachedContentUrl = blob.url;
  return blob.url;
}

export async function readContentBlob() {
  if (!hasBlobStore()) return null;

  if (!cachedContentUrl) {
    const { blobs } = await list({ prefix: CONTENT_BLOB_PATH, limit: 20 });
    const match = blobs.find(
      (item) => item.pathname === CONTENT_BLOB_PATH || item.pathname.endsWith(`/${CONTENT_BLOB_PATH}`)
    );
    cachedContentUrl = match?.url ?? null;
  }

  if (!cachedContentUrl) return null;

  const response = await fetch(cachedContentUrl, { cache: "no-store" });
  if (!response.ok) return null;
  return response.text();
}

export async function saveImageToBlob(filename: string, bytes: Buffer, contentType: string) {
  const blob = await put(`uploads/${filename}`, bytes, {
    access: "public",
    addRandomSuffix: true,
    contentType,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
  return blob.url;
}

export async function saveImageToDisk(filename: string, bytes: Buffer) {
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, filename), bytes);
  return `/api/media/${filename}`;
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
