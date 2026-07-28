import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { fetchLeads, PIPELINE_STATUSES, formatRelative } from "@/lib/admin-data";
import { isLeadsStorageConfigured } from "@/lib/leads";
import { AdminShell } from "@/components/admin/AdminShell";
import { Avatar, PriorityPill } from "@/components/admin/DashboardUI";

export const dynamic = "force-dynamic";

const BOARD = PIPELINE_STATUSES.filter(
  (s) => s !== "Archived" && s !== "Not Relevant",
);

export default async function PipelinePage() {
  if (!isAdminConfigured()) redirect("/admin/login");
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const leads = isLeadsStorageConfigured()
    ? await fetchLeads({ limit: 300 })
    : [];

  const columns = BOARD.map((status) => ({
    status,
    items: leads.filter((l) => l.status === status),
  }));

  return (
    <AdminShell
      title="Pipeline"
      subtitle="Kanban view · accelerator-style funding workflow"
      actions={
        <Link
          href="/admin/leads"
          className="rounded-lg border border-[#E4E3E0] bg-white px-3.5 py-2 text-xs font-medium"
        >
          Table view
        </Link>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2 text-xs text-[#928C86]">
        <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#E4E3E0]">
          {leads.length} open in board
        </span>
        <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#E4E3E0]">
          Drag not required — open card to change status
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div
            key={col.status}
            className="flex w-[280px] shrink-0 flex-col rounded-2xl border border-[#E4E3E0] bg-[#F3F3F2]/80"
          >
            <div className="flex items-center justify-between border-b border-[#E4E3E0] px-3.5 py-3">
              <h2 className="text-xs font-semibold text-[#1B1916]">
                {col.status}
              </h2>
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#928C86] ring-1 ring-[#E4E3E0]">
                {col.items.length}
              </span>
            </div>
            <ul className="flex max-h-[calc(100vh-14rem)] flex-col gap-2 overflow-y-auto p-2.5">
              {col.items.length === 0 && (
                <li className="rounded-xl border border-dashed border-[#E4E3E0] bg-white/50 px-3 py-8 text-center text-xs text-[#928C86]">
                  Empty stage
                </li>
              )}
              {col.items.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="block rounded-xl border border-[#E4E3E0] bg-white p-3 shadow-[0_1px_0_rgba(27,25,22,0.04)] transition hover:border-[#00A071]/40 hover:shadow-md"
                  >
                    <div className="flex items-start gap-2.5">
                      <Avatar name={lead.full_name} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#1B1916]">
                          {lead.full_name}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[#928C86]">
                          {lead.stakeholder_type}
                        </p>
                      </div>
                    </div>
                    {lead.organisation && (
                      <p className="mt-2 truncate text-xs text-[#1B1916]/80">
                        {lead.organisation}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <PriorityPill priority={lead.priority} />
                      <span className="text-[10px] text-[#928C86]">
                        {formatRelative(lead.created_at)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
