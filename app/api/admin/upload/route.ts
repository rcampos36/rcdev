import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";
import {
  blobMissingMessage,
  hasBlobStore,
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

function isServerlessHost() {
  return Boolean(process.env.VERCEL);
}

function isUploadBlob(value: FormDataEntryValue | null): value is File {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as File).arrayBuffer === "function" &&
      typeof (value as File).size === "number"
  );
}

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json({ blob: hasBlobStore() });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as HandleUploadBody;
      const isCompletion = body?.type === "blob.upload-completed";

      if (!isCompletion) {
        const unauthorized = await requireAdmin(request);
        if (unauthorized) return unauthorized;
        if (!hasBlobStore()) {
          return NextResponse.json({ error: blobMissingMessage() }, { status: 500 });
        }
      }

      const result = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        }),
      });

      return NextResponse.json(result);
    }

    const unauthorized = await requireAdmin(request);
    if (unauthorized) return unauthorized;

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "The image is too large for this host. Try a smaller file." },
        { status: 413 }
      );
    }

    const file = formData.get("file");
    if (!isUploadBlob(file)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const extension = ALLOWED_TYPES[file.type] || "jpg";
    if (file.type && !ALLOWED_TYPES[file.type]) {
      return NextResponse.json({ error: "Use a JPG, PNG, WEBP, or GIF image" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be 5MB or smaller" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    if (isServerlessHost()) {
      return NextResponse.json(
        { error: blobMissingMessage() },
        { status: 500 }
      );
    }

    try {
      const url = await saveImageToDisk(safeName, bytes);
      return NextResponse.json({ url });
    } catch (diskError) {
      console.error("Local image write failed", diskError);
      if (bytes.byteLength <= 750_000) {
        return NextResponse.json({ url: toDataUrl(bytes, file.type || "image/jpeg") });
      }
      return NextResponse.json({ error: blobMissingMessage() }, { status: 500 });
    }
  } catch (error) {
    console.error("Image upload failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image" },
      { status: 500 }
    );
  }
}
