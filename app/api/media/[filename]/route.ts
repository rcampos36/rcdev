import { NextRequest, NextResponse } from "next/server";
import { readLocalImage } from "@/lib/storage";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;

  try {
    const bytes = await readLocalImage(filename);
    const extension = filename.split(".").pop()?.toLowerCase() ?? "";
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": TYPES[extension] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
