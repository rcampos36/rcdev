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

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function isServerlessHost() {
  return Boolean(process.env.VERCEL);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json({ error: "Use a JPG, PNG, WEBP, or GIF image" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be 5MB or smaller" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  try {
    if (hasBlobStore()) {
      const url = await saveImageToBlob(safeName, bytes, file.type);
      return NextResponse.json({ url });
    }

    if (isServerlessHost()) {
      return NextResponse.json({ error: blobMissingMessage() }, { status: 500 });
    }

    try {
      const url = await saveImageToDisk(safeName, bytes);
      return NextResponse.json({ url });
    } catch (diskError) {
      console.error("Local image write failed", diskError);
      if (bytes.byteLength <= 750_000) {
        return NextResponse.json({ url: toDataUrl(bytes, file.type) });
      }
      return NextResponse.json({ error: blobMissingMessage() }, { status: 500 });
    }
  } catch (error) {
    console.error("Image upload failed", error);
    return NextResponse.json(
      { error: hasBlobStore() ? "Failed to upload image" : blobMissingMessage() },
      { status: 500 }
    );
  }
}
