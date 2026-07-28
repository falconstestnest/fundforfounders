import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionActor, isAdminConfigured } from "@/lib/crm/auth";
import { searchLeads } from "@/lib/crm/leads-query";
import { PRESET_VIEWS } from "@/lib/crm/presets";
import { isLeadsStorageConfigured } from "@/lib/leads";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadsTable } from "@/components/admin/DashboardUI";
import { stakeholderTypes } from "@/lib/registration-schema";
import { PIPELINE_STATUSES, PRIORITIES } from "@/lib/admin-data";
import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | undefined>>;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!isAdminConfigured()) redirect("/admin/login");
  if (!(await getSessionActor())) redirect("/admin/login");

  const params = await searchParams;
  const page = Number(params.page || 1);

  const result = isLeadsStorageConfigured()
    ? await searchLeads({
        q: params.q,
        type: params.type,
        status: params.status,
        priority: params.priority,
        owner: params.owner,
        unassigned: params.unassigned === "1",
        overdue: params.overdue === "1",
        dormant: params.dormant === "1",
        recent: params.recent === "1",
        view: params.view,
        page,
        pageSize: 25,
      })
    : { leads: [], total: 0, page: 1, pageSize: 25, totalPages: 0 };

  let customViews: { id: string; name: string; filters: unknown }[] = [];
  try {
    const db = getSql();
    customViews = (await db`
      SELECT id, name, filters FROM saved_views ORDER BY created_at DESC LIMIT 20
    `) as { id: string; name: string; filters: unknown }[];
  } catch {
    /* table may not exist yet on first boot */
  }

  const exportQuery = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) exportQuery.set(k, v);
  }

  function pageHref(p: number) {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v && k !== "page") q.set(k, v);
    }
    q.set("page", String(p));
    return `/admin/leads?${q.toString()}`;
  }

  return (
    <AdminShell
      title="Leads"
      subtitle={`${result.total} matching · page ${result.page} of ${result.totalPages || 1}`}
      actions={
        <a
          href={`/api/admin/export?${exportQuery.toString()}`}
          className="rounded-lg bg-[#00A071] px-3.5 py-2 text-xs font-medium text-white"
        >
          Export CSV
        </a>
      }
    >
      {/* Saved views */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${
            !params.view
              ? "bg-[#00A071] text-white ring-[#00A071]"
              : "bg-white text-[#1B1916] ring-[#E4E3E0]"
          }`}
        >
          All
        </Link>
        {PRESET_VIEWS.map((v) => (
          <Link
            key={v.id}
            href={`/admin/leads?view=${v.id}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${
              params.view === v.id
                ? "bg-[#00A071] text-white ring-[#00A071]"
                : "bg-white text-[#1B1916] ring-[#E4E3E0]"
            }`}
          >
            {v.name}
          </Link>
        ))}
        {customViews.map((v) => (
          <span
            key={v.id}
            className="rounded-full bg-[#F3F3F2] px-3 py-1.5 text-xs font-medium text-[#928C86] ring-1 ring-[#E4E3E0]"
            title="Custom saved view"
          >
            {v.name}
          </span>
        ))}
      </div>

      <form
        method="get"
        className="mb-5 grid gap-3 rounded-2xl border border-[#E4E3E0] bg-white p-4 md:grid-cols-12"
      >
        {params.view && <input type="hidden" name="view" value={params.view} />}
        <div className="md:col-span-4">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#928C86]">
            Search
          </label>
          <input
            type="search"
            name="q"
            defaultValue={params.q || ""}
            placeholder="Name, email, org, notes, LinkedIn…"
            className="w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/50 px-3 py-2.5 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#928C86]">
            Type
          </label>
          <select
            name="type"
            defaultValue={params.type || ""}
            className="w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/50 px-3 py-2.5 text-sm"
          >
            <option value="">All</option>
            {stakeholderTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#928C86]">
            Status
          </label>
          <select
            name="status"
            defaultValue={params.status || ""}
            className="w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/50 px-3 py-2.5 text-sm"
          >
            <option value="">All</option>
            {PIPELINE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#928C86]">
            Priority
          </label>
          <select
            name="priority"
            defaultValue={params.priority || ""}
            className="w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/50 px-3 py-2.5 text-sm"
          >
            <option value="">All</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2 md:col-span-2">
          <button
            type="submit"
            className="w-full rounded-lg bg-[#1B1916] px-3 py-2.5 text-sm font-medium text-white"
          >
            Search
          </button>
        </div>
      </form>

      <LeadsTable leads={result.leads} />

      {result.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {result.page > 1 && (
            <Link
              href={pageHref(result.page - 1)}
              className="rounded-lg border border-[#E4E3E0] bg-white px-4 py-2 text-sm"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-[#928C86]">
            Page {result.page} / {result.totalPages}
          </span>
          {result.page < result.totalPages && (
            <Link
              href={pageHref(result.page + 1)}
              className="rounded-lg border border-[#E4E3E0] bg-white px-4 py-2 text-sm"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </AdminShell>
  );
}
