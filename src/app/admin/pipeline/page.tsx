import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionActor, isAdminConfigured } from "@/lib/crm/auth";
import { listPipelineLeads } from "@/lib/crm/leads-query";
import { isLeadsStorageConfigured } from "@/lib/leads";
import { AdminShell } from "@/components/admin/AdminShell";
import { PipelineBoard } from "@/components/admin/PipelineBoard";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  if (!isAdminConfigured()) redirect("/admin/login");
  const actor = await getSessionActor();
  if (!actor) redirect("/admin/login");

  const leads = isLeadsStorageConfigured() ? await listPipelineLeads() : [];

  return (
    <AdminShell
      title="Pipeline"
      subtitle="Drag cards or use Move to · changes persist + audit"
      actions={
        <Link
          href="/admin/leads"
          className="rounded-lg border border-[#E4E3E0] bg-white px-3.5 py-2 text-xs font-medium"
        >
          Table view
        </Link>
      }
    >
      <PipelineBoard initialLeads={leads} />
    </AdminShell>
  );
}
