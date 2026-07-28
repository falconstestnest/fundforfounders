import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { fetchDashboardStats } from "@/lib/admin-data";
import { isLeadsStorageConfigured } from "@/lib/leads";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  HorizontalBars,
  KpiCard,
  LeadRowCard,
  Panel,
  SparkBars,
  StatusPill,
  PriorityPill,
} from "@/components/admin/DashboardUI";
import { formatRelative } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#F3F3F2] p-6">
        <div className="max-w-md rounded-2xl border border-[#E4E3E0] bg-white p-8">
          <h1 className="text-xl font-semibold">Admin not configured</h1>
          <p className="mt-2 text-sm text-[#928C86]">
            Set <code>ADMIN_SECRET</code> on Vercel to enable Network OS.
          </p>
        </div>
      </div>
    );
  }

  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  if (!isLeadsStorageConfigured()) {
    return (
      <AdminShell title="Overview" subtitle="Database offline">
        <p className="text-sm text-[#928C86]">
          Configure <code>DATABASE_URL</code> to load the dashboard.
        </p>
      </AdminShell>
    );
  }

  const stats = await fetchDashboardStats();
  const conversion =
    stats.total > 0
      ? Math.round(
          ((stats.byStatus.find((s) => s.status === "Qualified")?.count || 0) +
            (stats.byStatus.find((s) => s.status === "Active")?.count || 0) +
            (stats.byStatus.find((s) => s.status === "Contacted")?.count ||
              0)) /
            stats.total *
            100,
        )
      : 0;

  return (
    <AdminShell
      title="Overview"
      subtitle="Investor network & founder pipeline"
      actions={
        <Link
          href="/api/admin/export"
          className="hidden rounded-lg bg-[#1B1916] px-3.5 py-2 text-xs font-medium text-white sm:inline-flex"
        >
          Export CSV
        </Link>
      }
    >
      {/* KPI strip — accelerator dashboard style */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total leads"
          value={stats.total}
          hint="All network registrations"
          accent="ink"
        />
        <KpiCard
          label="New this week"
          value={stats.newThisWeek}
          hint="Last 7 days"
          accent="green"
        />
        <KpiCard
          label="High priority"
          value={stats.highPriority}
          hint="Urgent + High, open status"
          accent="amber"
        />
        <KpiCard
          label="Engaged rate"
          value={`${conversion}%`}
          hint="Contacted / Qualified / Active"
          accent="green"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E4E3E0] bg-white px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#928C86]">
            Founders
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.founders}
          </p>
        </div>
        <div className="rounded-2xl border border-[#E4E3E0] bg-white px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#928C86]">
            Capital side
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.investors}
          </p>
          <p className="mt-1 text-[11px] text-[#928C86]">
            Angels, LPs, VCs, FoF
          </p>
        </div>
        <div className="rounded-2xl border border-[#E4E3E0] bg-white px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#928C86]">
            Institutions
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.institutions}
          </p>
          <p className="mt-1 text-[11px] text-[#928C86]">
            Gov, ecosystem, universities
          </p>
        </div>
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <Panel
          title="Registrations · 14 days"
          className="lg:col-span-7"
          action={
            <Link
              href="/admin/leads"
              className="text-xs font-medium text-[#00A071] hover:underline"
            >
              View all
            </Link>
          }
        >
          <SparkBars items={stats.daily} />
        </Panel>

        <Panel title="Pipeline stages" className="lg:col-span-5">
          <HorizontalBars
            items={stats.byStatus.map((s) => ({
              label: s.status,
              count: s.count,
            }))}
            color="#1B1916"
          />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Panel title="Network mix" className="lg:col-span-5">
          <HorizontalBars
            items={stats.byType.map((t) => ({
              label: t.type,
              count: t.count,
            }))}
          />
        </Panel>

        <Panel
          title="Priority queue"
          className="lg:col-span-7"
          action={
            <Link
              href="/admin/leads?priority=High"
              className="text-xs font-medium text-[#00A071] hover:underline"
            >
              Open queue
            </Link>
          }
        >
          {stats.priorityQueue.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#928C86]">
              No high-priority open leads
            </p>
          ) : (
            <ul className="divide-y divide-[#E4E3E0]">
              {stats.priorityQueue.map((lead) => (
                <li key={lead.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="truncate text-sm font-medium text-[#1B1916] hover:text-[#00A071]"
                    >
                      {lead.full_name}
                    </Link>
                    <p className="truncate text-xs text-[#928C86]">
                      {lead.stakeholder_type}
                      {lead.organisation ? ` · ${lead.organisation}` : ""}
                    </p>
                  </div>
                  <PriorityPill priority={lead.priority} />
                  <StatusPill status={lead.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Bottom: recent + geography */}
      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Panel
          title="Recent activity"
          className="lg:col-span-7"
          action={
            <Link
              href="/admin/pipeline"
              className="text-xs font-medium text-[#00A071] hover:underline"
            >
              Pipeline board
            </Link>
          }
        >
          <div className="space-y-0.5">
            {stats.recent.map((lead) => (
              <LeadRowCard key={lead.id} lead={lead} />
            ))}
          </div>
        </Panel>

        <Panel title="Geography" className="lg:col-span-5">
          <HorizontalBars
            items={stats.byCountry.map((c) => ({
              label: c.country,
              count: c.count,
            }))}
            color="#007354"
          />
          <p className="mt-4 text-[11px] leading-relaxed text-[#928C86]">
            Last update includes leads as of{" "}
            {stats.recent[0]
              ? formatRelative(stats.recent[0].created_at)
              : "—"}
            . Pipeline stages match PRD workflow: New → Reviewed → Qualified →
            Contacted → Active.
          </p>
        </Panel>
      </div>
    </AdminShell>
  );
}
