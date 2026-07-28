import { NextResponse, type NextRequest } from "next/server";
import {
  hashPassword,
  listUsers,
  requireActorFromRequest,
} from "@/lib/crm/auth";
import { getSql, isDatabaseConfigured } from "@/lib/db";
import { writeAudit } from "@/lib/crm/audit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    requireActorFromRequest(req, "users.manage");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return NextResponse.json(
      { error: msg === "FORBIDDEN" ? "Forbidden" : "Unauthorized" },
      { status: msg === "FORBIDDEN" ? 403 : 401 },
    );
  }
  const users = await listUsers();
  return NextResponse.json({ ok: true, users });
}

export async function POST(req: NextRequest) {
  let actor;
  try {
    actor = requireActorFromRequest(req, "users.manage");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return NextResponse.json(
      { error: msg === "FORBIDDEN" ? "Forbidden" : "Unauthorized" },
      { status: msg === "FORBIDDEN" ? 403 : 401 },
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database required" }, { status: 503 });
  }

  let body: {
    email?: string;
    name?: string;
    password?: string;
    role?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const name = (body.name || "").trim();
  const password = body.password || "";
  const role = body.role || "Admin";

  if (!email || !name || password.length < 8) {
    return NextResponse.json(
      { error: "Name, email, and password (8+) required" },
      { status: 400 },
    );
  }
  if (!["Super Admin", "Admin", "Viewer"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const hash = await hashPassword(password);
  const db = getSql();
  try {
    const rows = await db`
      INSERT INTO admin_users (email, name, password_hash, role, active)
      VALUES (${email}, ${name}, ${hash}, ${role}, ${true})
      RETURNING id, email, name, role, active, created_at
    `;
    await writeAudit({
      actor,
      action: "User created",
      newValue: email,
      meta: { role },
    });
    return NextResponse.json({ ok: true, user: rows[0] });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not create user (email may exist)" },
      { status: 400 },
    );
  }
}
