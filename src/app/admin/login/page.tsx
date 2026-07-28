"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
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
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin/leads");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border border-border bg-paper p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
          Admin
        </p>
        <h1 className="font-display mt-3 text-2xl tracking-tight text-ink">
          FundForFounders
        </h1>
        <p className="mt-2 text-sm text-stone">
          Enter the admin secret to view leads.
        </p>
        <label className="mt-6 block text-sm font-medium text-ink" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mt-1.5"
          required
        />
        {error && (
          <p className="mt-3 text-sm text-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="btn-primary mt-6 w-full"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
