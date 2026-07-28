"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-lg border border-[#E4E3E0] bg-white px-3 py-2 text-xs font-medium text-[#1B1916] transition hover:border-[#1B1916]"
    >
      Log out
    </button>
  );
}
