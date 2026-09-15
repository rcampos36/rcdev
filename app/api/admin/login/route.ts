import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, getAdminPassword, sessionCookieOptions, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password ?? "";
    const expected = getAdminPassword();

    if (!expected) {
      return NextResponse.json(
        { error: "Admin password is not configured. Set ADMIN_PASSWORD." },
        { status: 500 }
      );
    }

    if (password !== expected) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in" }, { status: 400 });
  }
}
