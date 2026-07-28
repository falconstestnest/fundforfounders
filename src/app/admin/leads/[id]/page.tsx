import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { fetchLead } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadDetailClient } from "@/components/admin/LeadDetailClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: Props) {
  if (!isAdminConfigured()) redirect("/admin/login");
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const lead = await fetchLead(id);
  if (!lead) notFound();

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
      <LeadDetailClient lead={lead} />
    </AdminShell>
  );
}
