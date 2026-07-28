"use client";

import { useState } from "react";
import type { AdminUser } from "@/lib/crm/types";

export function UsersClient({
  initialUsers,
}: {
  initialUsers: AdminUser[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Failed");
        return;
      }
      setUsers((u) => [...u, data.user]);
      setName("");
      setEmail("");
      setPassword("");
      setMsg("User created");
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="overflow-hidden rounded-2xl border border-[#E4E3E0] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E4E3E0] bg-[#F3F3F2]/80 text-[11px] font-semibold uppercase tracking-wide text-[#928C86]">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-[#928C86]">
                    No users yet. Bootstrap login with ADMIN_SECRET creates the
                    first Super Admin on next password login.
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="border-t border-[#E4E3E0]">
                  <td className="px-5 py-3 font-medium text-[#1B1916]">
                    {u.name}
                  </td>
                  <td className="px-5 py-3 text-[#928C86]">{u.email}</td>
                  <td className="px-5 py-3">{u.role}</td>
                  <td className="px-5 py-3">
                    {u.active ? (
                      <span className="text-[#007354]">Active</span>
                    ) : (
                      <span className="text-red-700">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form
        onSubmit={createUser}
        className="rounded-2xl border border-[#E4E3E0] bg-white p-6 lg:col-span-5"
      >
        <h2 className="text-sm font-semibold">Add team member</h2>
        <label className="mt-4 block text-xs text-[#928C86]">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
        />
        <label className="mt-3 block text-xs text-[#928C86]">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
        />
        <label className="mt-3 block text-xs text-[#928C86]">
          Password (min 8)
        </label>
        <input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
        />
        <label className="mt-3 block text-xs text-[#928C86]">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
        >
          <option value="Super Admin">Super Admin</option>
          <option value="Admin">Admin</option>
          <option value="Viewer">Viewer</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-[#00A071] py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create user"}
        </button>
        {msg && (
          <p className="mt-3 text-center text-sm text-[#007354]">{msg}</p>
        )}
      </form>
    </div>
  );
}
