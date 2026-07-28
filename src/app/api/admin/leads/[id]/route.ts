import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { fetchLead, updateLead, PIPELINE_STATUSES, PRIORITIES } from "@/lib/admin-data";
import type { LeadPriority, LeadStatus } from "@/lib/supabase";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const lead = await fetchLead(id);
  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, lead });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const patch: {
    status?: LeadStatus;
    priority?: LeadPriority;
    notes?: string | null;
    internal_owner?: string | null;
  } = {};

  if (typeof body.status === "string") {
    if (!PIPELINE_STATUSES.includes(body.status as LeadStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    patch.status = body.status as LeadStatus;
  }
  if (typeof body.priority === "string") {
    if (!PRIORITIES.includes(body.priority as LeadPriority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }
    patch.priority = body.priority as LeadPriority;
  }
  if (body.notes === null || typeof body.notes === "string") {
    patch.notes = body.notes as string | null;
  }
  if (body.internal_owner === null || typeof body.internal_owner === "string") {
    patch.internal_owner = body.internal_owner as string | null;
  }

  const lead = await updateLead(id, patch);
  if (!lead) {
    return NextResponse.json({ error: "Not found or update failed" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, lead });
}
