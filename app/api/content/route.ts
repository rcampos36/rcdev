import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
import type { SiteContent } from "@/lib/content-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SiteContent;
    if (!body?.projects || !body?.services || !body?.contact || !body?.footer || !body?.navigation) {
      return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
    }

    const saved = await saveContent(body);
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Failed to save content", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
