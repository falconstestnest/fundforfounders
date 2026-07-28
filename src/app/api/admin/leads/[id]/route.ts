import { NextResponse, type NextRequest } from "next/server";
import { requireActorFromRequest } from "@/lib/crm/auth";
import { writeAudit } from "@/lib/crm/audit";
import { fetchLead, updateLead, PIPELINE_STATUSES, PRIORITIES } from "@/lib/admin-data";
import type { LeadPriority, LeadStatus } from "@/lib/supabase";
import { buildTimeline } from "@/lib/crm/notes";
import { computeLeadScores } from "@/lib/crm/scoring";
import { findDuplicates } from "@/lib/crm/duplicates";
import { searchLeads } from "@/lib/crm/leads-query";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    requireActorFromRequest(req, "leads.view");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const lead = await fetchLead(id);
  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const timeline = await buildTimeline(id);
  const scores = computeLeadScores(lead);
  const pool = (await searchLeads({ pageSize: 100, page: 1 })).leads;
  const duplicates = findDuplicates(lead, pool);

  return NextResponse.json({
    ok: true,
    lead,
    timeline,
    scores,
    duplicates: duplicates.slice(0, 8).map((d) => ({
      id: d.lead.id,
      full_name: d.lead.full_name,
      email: d.lead.email,
      organisation: d.lead.organisation,
      reasons: d.reasons,
      score: d.score,
    })),
  });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  let actor;
  try {
    actor = requireActorFromRequest(req, "leads.edit");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return NextResponse.json(
      { error: msg === "FORBIDDEN" ? "Forbidden" : "Unauthorized" },
      { status: msg === "FORBIDDEN" ? 403 : 401 },
    );
  }

  const { id } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const existing = await fetchLead(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const patch: {
    status?: LeadStatus;
    priority?: LeadPriority;
    notes?: string | null;
    internal_owner?: string | null;
  } = {};

  if (typeof body.status === "string") {
    try {
      requireActorFromRequest(req, "leads.status");
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
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
    // Legacy single notes field still supported but prefer lead_notes
    patch.notes = body.notes as string | null;
  }
  if (body.internal_owner === null || typeof body.internal_owner === "string") {
    try {
      requireActorFromRequest(req, "leads.assign");
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    patch.internal_owner = body.internal_owner as string | null;
  }

  // Pipeline order + status move
  if (
    typeof body.pipeline_order === "number" ||
    typeof body.status === "string"
  ) {
    const db = getSql();
    const status = (patch.status || existing.status) as string;
    const order =
      typeof body.pipeline_order === "number"
        ? body.pipeline_order
        : ((existing as { pipeline_order?: number }).pipeline_order ?? 0);

    const rows = await db`
      UPDATE leads SET
        status = ${status},
        priority = ${patch.priority || existing.priority},
        notes = ${patch.notes !== undefined ? patch.notes : existing.notes},
        internal_owner = ${
          patch.internal_owner !== undefined
            ? patch.internal_owner
            : existing.internal_owner
        },
        pipeline_order = ${order},
        follow_up_at = ${
          body.follow_up_at === null
            ? null
            : typeof body.follow_up_at === "string"
              ? body.follow_up_at
              : (existing as { follow_up_at?: string }).follow_up_at || null
        },
        last_activity_at = now(),
        updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `;
    const lead = rows[0];

    if (patch.status && patch.status !== existing.status) {
      await writeAudit({
        actor,
        leadId: id,
        action: "Status changed",
        field: "status",
        oldValue: existing.status,
        newValue: patch.status,
      });
    }
    if (patch.priority && patch.priority !== existing.priority) {
      await writeAudit({
        actor,
        leadId: id,
        action: "Priority changed",
        field: "priority",
        oldValue: existing.priority,
        newValue: patch.priority,
      });
    }
    if (
      patch.internal_owner !== undefined &&
      patch.internal_owner !== existing.internal_owner
    ) {
      await writeAudit({
        actor,
        leadId: id,
        action: "Owner assigned",
        field: "internal_owner",
        oldValue: existing.internal_owner,
        newValue: patch.internal_owner,
      });
    }

    return NextResponse.json({ ok: true, lead });
  }

  const lead = await updateLead(id, patch);
  if (!lead) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  if (patch.status && patch.status !== existing.status) {
    await writeAudit({
      actor,
      leadId: id,
      action: "Status changed",
      field: "status",
      oldValue: existing.status,
      newValue: patch.status,
    });
  }
  if (patch.priority && patch.priority !== existing.priority) {
    await writeAudit({
      actor,
      leadId: id,
      action: "Priority changed",
      field: "priority",
      oldValue: existing.priority,
      newValue: patch.priority,
    });
  }
  if (
    patch.internal_owner !== undefined &&
    patch.internal_owner !== existing.internal_owner
  ) {
    await writeAudit({
      actor,
      leadId: id,
      action: "Owner assigned",
      field: "internal_owner",
      oldValue: existing.internal_owner,
      newValue: patch.internal_owner,
    });
  }

  return NextResponse.json({ ok: true, lead });
}
