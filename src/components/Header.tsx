"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, mobileNavLinks, siteConfig } from "@/lib/config";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 ${
        scrolled || open
          ? "border-b border-border bg-ivory/95 shadow-[0_1px_0_rgba(27,25,22,0.03)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-14 items-center justify-between md:h-[4.25rem]">
        <Link
          href="/"
          className="logo-mark focus-ring text-[0.9375rem] text-ink"
          onClick={() => setOpen(false)}
        >
          Fund<span>For</span>Founders
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link focus-ring text-[0.8125rem] font-medium ${
                isActive(link.href) ? "nav-link-active" : ""
              }`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/join"
            className="btn-primary focus-ring hidden !min-h-9 !px-4 !text-[0.8125rem] sm:inline-flex"
          >
            Join
          </Link>
          <button
            type="button"
            className="menu-toggle focus-ring flex items-center justify-center rounded border border-border bg-paper"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-4 flex-col gap-1.5">
              <span
                className={`menu-line h-px w-full bg-ink ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`menu-line h-px w-full bg-ink ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`menu-line h-px w-full bg-ink ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="mobile-drawer border-t border-border bg-ivory lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="container-site flex max-h-[calc(100dvh-3.5rem)] flex-col gap-0.5 overflow-y-auto py-5">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring rounded px-2 py-3 text-base font-medium ${
                  isActive(link.href) ? "text-forest" : "text-ink"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/join"
              className="btn-primary focus-ring mt-4 w-full"
              onClick={() => setOpen(false)}
            >
              Join the network
            </Link>
          </nav>
        </div>
      )}

      <span className="sr-only">{siteConfig.name}</span>
    </header>
  );
}
