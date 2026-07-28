import { NextResponse, type NextRequest } from "next/server";
import { requireActorFromRequest } from "@/lib/crm/auth";
import { searchLeads } from "@/lib/crm/leads-query";
import type { LeadRow } from "@/lib/supabase";

export const runtime = "nodejs";

function csvEscape(val: unknown): string {
  const s = val === null || val === undefined ? "" : String(val);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  try {
    requireActorFromRequest(req, "leads.export");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  let data: LeadRow[];
  try {
    const result = await searchLeads({
      type: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      q: searchParams.get("q") || undefined,
      view: searchParams.get("view") || undefined,
      unassigned: searchParams.get("unassigned") === "1",
      overdue: searchParams.get("overdue") === "1",
      page: 1,
      pageSize: 5000,
    });
    data = result.leads;
  } catch (err) {
    console.error("Export failed", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }

  const headers = [
    "id",
    "full_name",
    "email",
    "mobile",
    "country",
    "city",
    "organisation",
    "designation",
    "linkedin",
    "stakeholder_type",
    "status",
    "priority",
    "how_heard",
    "source",
    "pitch_deck_filename",
    "notes",
    "created_at",
    "details",
  ];

  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = (row as Record<string, unknown>)[h];
        if (h === "details" && val && typeof val === "object") {
          return csvEscape(JSON.stringify(val));
        }
        return csvEscape(val);
      })
      .join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="fundforfounders-leads-${date}.csv"`,
    },
  });
}
