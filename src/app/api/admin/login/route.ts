import { NextResponse, type NextRequest } from "next/server";
import {
  CRM_SESSION_COOKIE,
  LEGACY_COOKIE,
  createSessionToken,
  ensureBootstrapSuperAdmin,
  findUserByEmail,
  getAdminSecret,
  verifyPassword,
} from "@/lib/crm/auth";
import { writeAudit } from "@/lib/crm/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const password = body.password || "";
  const email = (body.email || "").trim().toLowerCase();

  // Bootstrap super admin row if empty
  try {
    await ensureBootstrapSuperAdmin();
  } catch (e) {
    console.error("bootstrap admin", e);
  }

  // Prefer user login when email provided
  if (email) {
    const user = await findUserByEmail(email);
    if (!user || !user.active) {
      return NextResponse.json(
        { ok: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }
    const token = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "Super Admin" | "Admin" | "Viewer",
    });
    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    res.cookies.set(CRM_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    // Clear legacy cookie
    res.cookies.set(LEGACY_COOKIE, "", { path: "/", maxAge: 0 });
    try {
      await writeAudit({
        actor: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "Super Admin",
          isLegacy: false,
        },
        action: "Logged in",
      });
    } catch {
      /* ignore */
    }
    return res;
  }

  // Legacy password-only Super Admin
  const secret = getAdminSecret();
  if (!secret || password !== secret) {
    return NextResponse.json(
      { ok: false, error: "Invalid password" },
      { status: 401 },
    );
  }

  // Try map to bootstrap user
  const bootstrap = await findUserByEmail("superadmin@fundforfounders.local");
  if (bootstrap) {
    const token = createSessionToken({
      id: bootstrap.id,
      email: bootstrap.email,
      name: bootstrap.name,
      role: "Super Admin",
    });
    const res = NextResponse.json({
      ok: true,
      user: {
        id: bootstrap.id,
        email: bootstrap.email,
        name: bootstrap.name,
        role: "Super Admin",
      },
    });
    res.cookies.set(CRM_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    res.cookies.set(LEGACY_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  // Pure legacy
  const res = NextResponse.json({
    ok: true,
    user: { id: null, email: "admin@local", name: "Super Admin", role: "Super Admin" },
  });
  res.cookies.set(LEGACY_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CRM_SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  res.cookies.set(LEGACY_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
