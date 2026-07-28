import { redirect } from "next/navigation";
import { getSessionActor, isAdminConfigured } from "@/lib/crm/auth";
import { hasPermission } from "@/lib/crm/types";
import { listAuditGlobal } from "@/lib/crm/audit";
import { AdminShell } from "@/components/admin/AdminShell";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  if (!isAdminConfigured()) redirect("/admin/login");
  const actor = await getSessionActor();
  if (!actor) redirect("/admin/login");
  if (!hasPermission(actor.role, "audit.view")) {
    return (
      <AdminShell title="Audit" subtitle="Access denied">
        <p className="text-sm text-[#928C86]">Your role cannot view audit logs.</p>
      </AdminShell>
    );
  }

  const logs = await listAuditGlobal(200);

  return (
    <AdminShell
      title="Audit log"
      subtitle="Status, owner, notes, merges, logins"
    >
      <div className="overflow-hidden rounded-2xl border border-[#E4E3E0] bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[#E4E3E0] bg-[#F3F3F2]/80 text-[11px] font-semibold uppercase tracking-wide text-[#928C86]">
            <tr>
              <th className="px-5 py-3">When</th>
              <th className="px-5 py-3">Actor</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Change</th>
              <th className="px-5 py-3">Lead</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-[#928C86]"
                >
                  No audit events yet. Pipeline moves and notes will appear here.
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-[#E4E3E0]">
                <td className="px-5 py-3 text-xs text-[#928C86] whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3 font-medium">{log.actor_name}</td>
                <td className="px-5 py-3">{log.action}</td>
                <td className="px-5 py-3 text-xs text-[#928C86]">
                  {log.field
                    ? `${log.field}: ${log.old_value ?? "—"} → ${log.new_value ?? "—"}`
                    : log.new_value || "—"}
                </td>
                <td className="px-5 py-3">
                  {log.lead_id ? (
                    <Link
                      href={`/admin/leads/${log.lead_id}`}
                      className="text-[#00A071] hover:underline"
                    >
                      Open
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
