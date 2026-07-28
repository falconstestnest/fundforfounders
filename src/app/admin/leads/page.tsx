import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  type LeadRow,
} from "@/lib/supabase";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  type?: string;
  status?: string;
  priority?: string;
  q?: string;
}>;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!isAdminConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20">
        <h1 className="font-display text-2xl text-ink">Admin not configured</h1>
        <p className="mt-3 text-stone">
          Set <code className="text-ink">ADMIN_SECRET</code> in your environment
          to enable the leads dashboard.
        </p>
      </div>
    );
  }

  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20">
        <h1 className="font-display text-2xl text-ink">Supabase not configured</h1>
        <p className="mt-3 text-stone">
          Add <code className="text-ink">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-ink">SUPABASE_SERVICE_ROLE_KEY</code>, then run{" "}
          <code className="text-ink">supabase/migrations/001_leads.sql</code> in
          the SQL Editor.
        </p>
        <AdminLogoutButton />
      </div>
    );
  }

  const params = await searchParams;
  const type = params.type;
  const status = params.status;
  const priority = params.priority;
  const q = params.q?.trim();

  let query = getSupabaseAdmin()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (type) query = query.eq("stakeholder_type", type);
  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,email.ilike.%${q}%,organisation.ilike.%${q}%`,
    );
  }

  const { data: leads, error } = await query;

  if (error) {
    return (
      <div className="p-10 text-error">
        Error loading leads: {error.message}
      </div>
    );
  }

  const rows = (leads || []) as LeadRow[];
  const exportQuery = new URLSearchParams();
  if (type) exportQuery.set("type", type);
  if (status) exportQuery.set("status", status);
  if (priority) exportQuery.set("priority", priority);
  if (q) exportQuery.set("q", q);

  return (
    <div className="min-h-screen bg-ivory p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
              Admin
            </p>
            <h1 className="font-display mt-1 text-3xl tracking-tight text-ink">
              Leads
            </h1>
            <p className="mt-1 text-stone">{rows.length} records (max 200)</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/api/admin/export?${exportQuery.toString()}`}
              className="btn-primary focus-ring !min-h-10 !text-sm"
            >
              Export CSV
            </a>
            <AdminLogoutButton />
          </div>
        </div>

        <form className="mb-6 flex flex-col gap-3 sm:flex-row" method="get">
          <input
            type="search"
            name="q"
            defaultValue={q || ""}
            placeholder="Search name, email, organisation…"
            className="input-field max-w-md"
          />
          {type && <input type="hidden" name="type" value={type} />}
          {status && <input type="hidden" name="status" value={status} />}
          {priority && <input type="hidden" name="priority" value={priority} />}
          <button type="submit" className="btn-secondary focus-ring !min-h-12">
            Search
          </button>
        </form>

        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip href="/admin/leads" active={!type && !status && !priority}>
            All
          </FilterChip>
          <FilterChip
            href="/admin/leads?type=Founder"
            active={type === "Founder"}
          >
            Founders
          </FilterChip>
          <FilterChip
            href="/admin/leads?type=Limited%20Partner"
            active={type === "Limited Partner"}
          >
            LPs
          </FilterChip>
          <FilterChip
            href="/admin/leads?type=Venture%20Capital%20Fund"
            active={type === "Venture Capital Fund"}
          >
            VCs
          </FilterChip>
          <FilterChip
            href="/admin/leads?type=Angel%20Investor"
            active={type === "Angel Investor"}
          >
            Angels
          </FilterChip>
          <FilterChip
            href="/admin/leads?status=New"
            active={status === "New"}
          >
            New
          </FilterChip>
          <FilterChip
            href="/admin/leads?priority=High"
            active={priority === "High"}
          >
            High priority
          </FilterChip>
        </div>

        <div className="overflow-hidden rounded border border-border bg-paper">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-ivory text-left">
                <tr>
                  <th className="px-5 py-3 font-medium text-ink">Name</th>
                  <th className="px-5 py-3 font-medium text-ink">Type</th>
                  <th className="px-5 py-3 font-medium text-ink">Organisation</th>
                  <th className="px-5 py-3 font-medium text-ink">Status</th>
                  <th className="px-5 py-3 font-medium text-ink">Priority</th>
                  <th className="px-5 py-3 font-medium text-ink">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-stone"
                    >
                      No leads yet. Submissions will appear here after Supabase
                      is connected.
                    </td>
                  </tr>
                )}
                {rows.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-t border-border hover:bg-ivory/60"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-ink">
                        {lead.full_name}
                      </div>
                      <div className="text-xs text-stone">{lead.email}</div>
                      {lead.mobile && (
                        <div className="text-xs text-stone">{lead.mobile}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-ink">
                      {lead.stakeholder_type}
                    </td>
                    <td className="px-5 py-3.5 text-stone">
                      {lead.organisation || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {lead.priority === "High" ||
                      lead.priority === "Urgent" ? (
                        <span className="font-medium text-warning">
                          {lead.priority}
                        </span>
                      ) : (
                        <span className="text-stone">{lead.priority}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-stone">
                      {new Date(lead.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-xs text-stone">
          <Link href="/" className="text-forest underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded px-3.5 py-1.5 text-sm border transition ${
        active
          ? "border-forest bg-forest text-white"
          : "border-border bg-paper text-ink hover:border-ink"
      }`}
    >
      {children}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    New: "bg-blue-50 text-blue-800",
    Reviewed: "bg-gray-100 text-gray-700",
    Qualified: "bg-green-50 text-green-800",
    Contacted: "bg-purple-50 text-purple-800",
    "Meeting Scheduled": "bg-indigo-50 text-indigo-800",
    Active: "bg-emerald-50 text-emerald-800",
    Nurture: "bg-amber-50 text-amber-800",
    "Not Relevant": "bg-red-50 text-red-800",
    Archived: "bg-stone-100 text-stone-600",
  };
  return (
    <span
      className={`inline-flex rounded px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}
