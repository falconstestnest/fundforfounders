import { NextResponse, type NextRequest } from "next/server";
import { requireActorFromRequest } from "@/lib/crm/auth";
import { listAuditGlobal } from "@/lib/crm/audit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    requireActorFromRequest(req, "audit.view");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    return NextResponse.json(
      { error: msg === "FORBIDDEN" ? "Forbidden" : "Unauthorized" },
      { status: msg === "FORBIDDEN" ? 403 : 401 },
    );
  }
  const logs = await listAuditGlobal(150);
  return NextResponse.json({ ok: true, logs });
}
