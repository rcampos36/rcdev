import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";
import {
  blobMissingMessage,
  hasBlobStore,
  saveImageToBlob,
  saveImageToDisk,
  toDataUrl,
} from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function isUploadBlob(value: FormDataEntryValue | null): value is File {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as File).arrayBuffer === "function" &&
      typeof (value as File).size === "number"
  );
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await verifySessionToken(token))) {
      return jsonError("Unauthorized", 401);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return jsonError("The image is too large. Try a smaller file.", 413);
    }

    const file = formData.get("file");
    if (!isUploadBlob(file)) {
      return jsonError("No file uploaded", 400);
    }

    const extension = ALLOWED_TYPES[file.type] || "jpg";
    if (file.type && !ALLOWED_TYPES[file.type]) {
      return jsonError("Use a JPG, PNG, WEBP, or GIF image", 400);
    }

    if (file.size > 4 * 1024 * 1024) {
      return jsonError("Image must be 4MB or smaller", 400);
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const contentType = file.type || "image/jpeg";

    if (hasBlobStore()) {
      const url = await saveImageToBlob(safeName, bytes, contentType);
      return NextResponse.json({ url });
    }

    try {
      const url = await saveImageToDisk(safeName, bytes);
      return NextResponse.json({ url });
    } catch (diskError) {
      console.error("Local image write failed", diskError);
      if (bytes.byteLength <= 750_000) {
        return NextResponse.json({ url: toDataUrl(bytes, contentType) });
      }
      return jsonError(blobMissingMessage(), 500);
    }
  } catch (error) {
    console.error("Image upload failed", error);
    const message = error instanceof Error ? error.message : "Failed to upload image";
    return jsonError(
      /token|oidc|blob/i.test(message) ? blobMissingMessage() : message,
      500
    );
  }
}
