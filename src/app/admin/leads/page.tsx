import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { fetchLeads } from "@/lib/admin-data";
import { isLeadsStorageConfigured } from "@/lib/leads";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadsTable } from "@/components/admin/DashboardUI";
import { stakeholderTypes } from "@/lib/registration-schema";
import { PIPELINE_STATUSES, PRIORITIES } from "@/lib/admin-data";

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
  if (!isAdminConfigured()) redirect("/admin/login");
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const params = await searchParams;
  const type = params.type;
  const status = params.status;
  const priority = params.priority;
  const q = params.q?.trim();

  const leads = isLeadsStorageConfigured()
    ? await fetchLeads({ type, status, priority, q, limit: 200 })
    : [];

  const exportQuery = new URLSearchParams();
  if (type) exportQuery.set("type", type);
  if (status) exportQuery.set("status", status);
  if (priority) exportQuery.set("priority", priority);
  if (q) exportQuery.set("q", q);

  return (
    <AdminShell
      title="Leads"
      subtitle={`${leads.length} records · CRM pipeline`}
      actions={
        <a
          href={`/api/admin/export?${exportQuery.toString()}`}
          className="rounded-lg bg-[#00A071] px-3.5 py-2 text-xs font-medium text-white"
        >
          Export CSV
        </a>
      }
    >
      {/* Filter bar */}
      <form
        method="get"
        className="mb-5 grid gap-3 rounded-2xl border border-[#E4E3E0] bg-white p-4 md:grid-cols-12"
      >
        <div className="md:col-span-4">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#928C86]">
            Search
          </label>
          <input
            type="search"
            name="q"
            defaultValue={q || ""}
            placeholder="Name, email, organisation…"
            className="w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/50 px-3 py-2.5 text-sm outline-none focus:border-[#00A071] focus:ring-2 focus:ring-[#00A071]/15"
          />
        </div>
        <div className="md:col-span-3">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#928C86]">
            Stakeholder
          </label>
          <select
            name="type"
            defaultValue={type || ""}
            className="w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/50 px-3 py-2.5 text-sm outline-none focus:border-[#00A071]"
          >
            <option value="">All types</option>
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
            defaultValue={status || ""}
            className="w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/50 px-3 py-2.5 text-sm outline-none focus:border-[#00A071]"
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
            defaultValue={priority || ""}
            className="w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/50 px-3 py-2.5 text-sm outline-none focus:border-[#00A071]"
          >
            <option value="">All</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end md:col-span-1">
          <button
            type="submit"
            className="w-full rounded-lg bg-[#1B1916] px-3 py-2.5 text-sm font-medium text-white"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Quick chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { href: "/admin/leads", label: "All", on: !type && !status && !priority },
          {
            href: "/admin/leads?type=Founder",
            label: "Founders",
            on: type === "Founder",
          },
          {
            href: "/admin/leads?type=Limited%20Partner",
            label: "LPs",
            on: type === "Limited Partner",
          },
          {
            href: "/admin/leads?type=Venture%20Capital%20Fund",
            label: "VCs",
            on: type === "Venture Capital Fund",
          },
          {
            href: "/admin/leads?status=New",
            label: "New",
            on: status === "New",
          },
          {
            href: "/admin/leads?priority=High",
            label: "High priority",
            on: priority === "High",
          },
        ].map((chip) => (
          <Link
            key={chip.href}
            href={chip.href}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 transition ${
              chip.on
                ? "bg-[#00A071] text-white ring-[#00A071]"
                : "bg-white text-[#1B1916] ring-[#E4E3E0] hover:ring-[#1B1916]"
            }`}
          >
            {chip.label}
          </Link>
        ))}
      </div>

      <LeadsTable leads={leads} />
    </AdminShell>
  );
}
