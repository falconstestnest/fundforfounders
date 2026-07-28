import { NextResponse, type NextRequest } from "next/server";
import { requireActorFromRequest } from "@/lib/crm/auth";
import { mergeLeads } from "@/lib/crm/leads-query";
import { writeAudit } from "@/lib/crm/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let actor;
  try {
    actor = requireActorFromRequest(req, "leads.merge");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return NextResponse.json(
      { error: msg === "FORBIDDEN" ? "Forbidden" : "Unauthorized" },
      { status: msg === "FORBIDDEN" ? 403 : 401 },
    );
  }

  let body: { keepId?: string; dropId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.keepId || !body.dropId || body.keepId === body.dropId) {
    return NextResponse.json({ error: "keepId and dropId required" }, { status: 400 });
  }

  const lead = await mergeLeads({ keepId: body.keepId, dropId: body.dropId });
  if (!lead) {
    return NextResponse.json({ error: "Merge failed" }, { status: 400 });
  }

  await writeAudit({
    actor,
    leadId: body.keepId,
    action: "Leads merged",
    meta: { dropped: body.dropId },
  });

  return NextResponse.json({ ok: true, lead });
}
