import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionActor, isAdminConfigured } from "@/lib/crm/auth";
import { fetchLead } from "@/lib/admin-data";
import { buildTimeline } from "@/lib/crm/notes";
import { computeLeadScores } from "@/lib/crm/scoring";
import { findDuplicates } from "@/lib/crm/duplicates";
import { searchLeads } from "@/lib/crm/leads-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadDetailClient } from "@/components/admin/LeadDetailClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: Props) {
  if (!isAdminConfigured()) redirect("/admin/login");
  if (!(await getSessionActor())) redirect("/admin/login");

  const { id } = await params;
  const lead = await fetchLead(id);
  if (!lead) notFound();

  const [timeline, pool] = await Promise.all([
    buildTimeline(id),
    searchLeads({ pageSize: 100, page: 1 }),
  ]);
  const scores = computeLeadScores(lead);
  const duplicates = findDuplicates(lead, pool.leads)
    .slice(0, 8)
    .map((d) => ({
      id: d.lead.id,
      full_name: d.lead.full_name,
      email: d.lead.email,
      organisation: d.lead.organisation,
      reasons: d.reasons,
      score: d.score,
    }));

  return (
    <AdminShell
      title="Lead detail"
      subtitle={lead.stakeholder_type}
      actions={
        <Link
          href="/admin/leads"
          className="rounded-lg border border-[#E4E3E0] bg-white px-3.5 py-2 text-xs font-medium"
        >
          ← All leads
        </Link>
      }
    >
      <LeadDetailClient
        lead={lead}
        timeline={timeline}
        scores={scores}
        duplicates={duplicates}
      />
    </AdminShell>
  );
}
