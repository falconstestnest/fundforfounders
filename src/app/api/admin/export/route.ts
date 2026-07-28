import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { dbListLeads, isDatabaseConfigured } from "@/lib/db";
import { isLeadsStorageConfigured } from "@/lib/leads";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import type { LeadRow } from "@/lib/supabase";

export const runtime = "nodejs";

function csvEscape(val: unknown): string {
  const s = val === null || val === undefined ? "" : String(val);
  return `"${s.replace(/"/g, '""')}"`;
}

async function fetchAll(filters: {
  type?: string | null;
  status?: string | null;
  priority?: string | null;
  q?: string | null;
}): Promise<LeadRow[]> {
  const f = {
    type: filters.type || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    q: filters.q || undefined,
    limit: 5000,
  };

  if (isDatabaseConfigured()) {
    return dbListLeads(f);
  }

  if (isSupabaseConfigured()) {
    let query = getSupabaseAdmin()
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (f.type) query = query.eq("stakeholder_type", f.type);
    if (f.status) query = query.eq("status", f.status);
    if (f.priority) query = query.eq("priority", f.priority);
    if (f.q) {
      query = query.or(
        `full_name.ilike.%${f.q}%,email.ilike.%${f.q}%,organisation.ilike.%${f.q}%`,
      );
    }

    const { data, error } = await query;
    if (error || !data) throw new Error(error?.message || "Export failed");
    return data as LeadRow[];
  }

  throw new Error("No database configured");
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isLeadsStorageConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(req.url);

  let data: LeadRow[];
  try {
    data = await fetchAll({
      type: searchParams.get("type"),
      status: searchParams.get("status"),
      priority: searchParams.get("priority"),
      q: searchParams.get("q"),
    });
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
