"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AdminLogoutButton } from "./AdminLogoutButton";

const NAV = [
  {
    href: "/admin",
    label: "Overview",
    icon: "◆",
    match: (p: string) => p === "/admin",
  },
  {
    href: "/admin/pipeline",
    label: "Pipeline",
    icon: "▣",
    match: (p: string) => p.startsWith("/admin/pipeline"),
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: "☰",
    match: (p: string) => p.startsWith("/admin/leads"),
  },
  {
    href: "/admin/network",
    label: "Network",
    icon: "◎",
    match: (p: string) => p.startsWith("/admin/network"),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: "○",
    match: (p: string) => p.startsWith("/admin/users"),
  },
  {
    href: "/admin/audit",
    label: "Audit",
    icon: "≡",
    match: (p: string) => p.startsWith("/admin/audit"),
  },
] as const;

export function AdminShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-shell fixed inset-0 z-[200] flex bg-[#F3F3F2] text-[#1B1916]">
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#E4E3E0] bg-[#1B1916] text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="block" onClick={() => setOpen(false)}>
            <p className="text-[15px] font-semibold tracking-tight">
              Fund<span className="text-[#00A071]">For</span>Founders
            </p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
              Network OS
            </p>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
            Workspace
          </p>
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-[#00A071] text-white"
                    : "text-white/70 hover:bg-white/8 hover:text-white"
                }`}
              >
                <span className="w-4 text-center text-xs opacity-80">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="mb-3 block text-xs text-white/45 transition hover:text-white/80"
          >
            ← Public website
          </Link>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
            <p className="text-xs font-medium text-white/90">Admin</p>
            <p className="mt-0.5 text-[11px] text-white/45">
              Pre-launch pipeline
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#E4E3E0] bg-white/80 px-4 backdrop-blur md:h-16 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E3E0] bg-white lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight md:text-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="truncate text-xs text-[#928C86] md:text-sm">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <AdminLogoutButton />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
