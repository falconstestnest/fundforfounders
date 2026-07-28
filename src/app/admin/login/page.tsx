"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim() || undefined,
          password,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-shell fixed inset-0 z-[200] flex items-center justify-center bg-[#F3F3F2] px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-lg font-semibold tracking-tight text-[#1B1916]">
            Fund<span className="text-[#00A071]">For</span>Founders
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#928C86]">
            Network OS · CRM
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-[#E4E3E0] bg-white p-8 shadow-[0_20px_50px_-30px_rgba(27,25,22,0.35)]"
        >
          <h1 className="text-xl font-semibold tracking-tight text-[#1B1916]">
            Secure sign-in
          </h1>
          <p className="mt-2 text-sm text-[#928C86]">
            Super Admin and team accounts. Email optional for legacy secret
            login.
          </p>

          <label
            className="mt-6 block text-xs font-semibold uppercase tracking-[0.1em] text-[#928C86]"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="superadmin@fundforfounders.local"
            className="mt-2 w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/40 px-3.5 py-3 text-sm outline-none focus:border-[#00A071] focus:ring-2 focus:ring-[#00A071]/15"
          />

          <label
            className="mt-4 block text-xs font-semibold uppercase tracking-[0.1em] text-[#928C86]"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/40 px-3.5 py-3 text-sm outline-none focus:border-[#00A071] focus:ring-2 focus:ring-[#00A071]/15"
            required
          />
          {error && (
            <p className="mt-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-[#00A071] py-3 text-sm font-medium text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Enter Network OS"}
          </button>
        </form>
      </div>
    </div>
  );
}
