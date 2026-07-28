import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

function csvEscape(val: unknown): string {
  const s = val === null || val === undefined ? "" : String(val);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const q = searchParams.get("q");

  let query = getSupabaseAdmin()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (type) query = query.eq("stakeholder_type", type);
  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,email.ilike.%${q}%,organisation.ilike.%${q}%`,
    );
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Export failed", error);
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
