import { NextResponse, type NextRequest } from "next/server";
import { requireActorFromRequest } from "@/lib/crm/auth";
import { getSql, isDatabaseConfigured } from "@/lib/db";
import { PRESET_VIEWS } from "@/lib/crm/presets";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    requireActorFromRequest(req, "leads.view");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let custom: unknown[] = [];
  if (isDatabaseConfigured()) {
    const db = getSql();
    custom = await db`
      SELECT id, name, owner_id, is_shared, filters, created_at
      FROM saved_views
      ORDER BY created_at DESC
      LIMIT 50
    `;
  }

  return NextResponse.json({
    ok: true,
    presets: PRESET_VIEWS,
    custom,
  });
}

export async function POST(req: NextRequest) {
  let actor;
  try {
    actor = requireActorFromRequest(req, "leads.edit");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database required" }, { status: 503 });
  }

  let body: { name?: string; filters?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const name = (body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const db = getSql();
  const rows = await db`
    INSERT INTO saved_views (name, owner_id, is_shared, filters)
    VALUES (
      ${name},
      ${actor.id},
      ${true},
      ${JSON.stringify(body.filters || {})}
    )
    RETURNING *
  `;
  return NextResponse.json({ ok: true, view: rows[0] });
}
