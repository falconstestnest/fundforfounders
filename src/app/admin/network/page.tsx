import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { fetchDashboardStats, fetchLeads } from "@/lib/admin-data";
import { isLeadsStorageConfigured } from "@/lib/leads";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  HorizontalBars,
  KpiCard,
  LeadsTable,
  Panel,
} from "@/components/admin/DashboardUI";

export const dynamic = "force-dynamic";

const CAPITAL = [
  "Angel Investor",
  "HNI",
  "International Investor",
  "Limited Partner",
  "Family Office",
  "Venture Capital Fund",
  "Fund of Funds",
];

const FOUNDERS = ["Founder", "Startup Team Member"];

export default async function NetworkPage() {
  if (!isAdminConfigured()) redirect("/admin/login");
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  if (!isLeadsStorageConfigured()) {
    return (
      <AdminShell title="Network" subtitle="No database">
        <p className="text-sm text-[#928C86]">Connect DATABASE_URL first.</p>
      </AdminShell>
    );
  }

  const [stats, all] = await Promise.all([
    fetchDashboardStats(),
    fetchLeads({ limit: 100 }),
  ]);

  const capitalLeads = all.filter((l) => CAPITAL.includes(l.stakeholder_type));
  const founderLeads = all.filter((l) => FOUNDERS.includes(l.stakeholder_type));

  const capitalByType = CAPITAL.map((type) => ({
    label: type,
    count: all.filter((l) => l.stakeholder_type === type).length,
  })).filter((x) => x.count > 0);

  return (
    <AdminShell
      title="Network"
      subtitle="Founders, capital partners & institutions"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard
          label="Founder pipeline"
          value={stats.founders}
          hint="Founders + startup team"
          accent="green"
        />
        <KpiCard
          label="Capital partners"
          value={stats.investors}
          hint="Angels · LPs · VCs · FoF"
          accent="ink"
        />
        <KpiCard
          label="Institutions"
          value={stats.institutions}
          hint="Gov & ecosystem"
          accent="amber"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Capital side breakdown">
          <HorizontalBars items={capitalByType} color="#1B1916" />
        </Panel>
        <Panel title="Full network mix">
          <HorizontalBars
            items={stats.byType.map((t) => ({
              label: t.type,
              count: t.count,
            }))}
          />
        </Panel>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-sm font-semibold">Capital partners</h2>
            <p className="text-xs text-[#928C86]">
              Investors & institutions most recently registered
            </p>
          </div>
        </div>
        <LeadsTable leads={capitalLeads.slice(0, 15)} />
      </div>

      <div className="mt-10">
        <div className="mb-3">
          <h2 className="text-sm font-semibold">Founder applications</h2>
          <p className="text-xs text-[#928C86]">Early pipeline companies</p>
        </div>
        <LeadsTable leads={founderLeads.slice(0, 15)} />
      </div>
    </AdminShell>
  );
}
