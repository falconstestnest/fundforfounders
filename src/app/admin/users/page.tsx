import { redirect } from "next/navigation";
import {
  getSessionActor,
  isAdminConfigured,
  listUsers,
} from "@/lib/crm/auth";
import { hasPermission } from "@/lib/crm/types";
import { AdminShell } from "@/components/admin/AdminShell";
import { UsersClient } from "@/components/admin/UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  if (!isAdminConfigured()) redirect("/admin/login");
  const actor = await getSessionActor();
  if (!actor) redirect("/admin/login");
  if (!hasPermission(actor.role, "users.manage")) {
    return (
      <AdminShell title="Users" subtitle="Access denied">
        <p className="text-sm text-[#928C86]">
          Super Admin only. Your role: {actor.role}
        </p>
      </AdminShell>
    );
  }

  const users = await listUsers();

  return (
    <AdminShell
      title="Users"
      subtitle="Team access · Super Admin control"
    >
      <UsersClient initialUsers={users} />
    </AdminShell>
  );
}
