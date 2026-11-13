import { NextRequest, NextResponse } from "next/server";
import { readBlobImage } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const pathname = path.map(decodeURIComponent).join("/");

  try {
    const image = await readBlobImage(pathname);
    if (!image) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new NextResponse(image.body, {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": image.cacheControl,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to serve CMS image", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
