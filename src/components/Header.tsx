"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, mobileNavLinks, siteConfig } from "@/lib/config";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,box-shadow] duration-300 ${
        scrolled || open
          ? "border-b border-border bg-ivory/95 shadow-[0_1px_0_rgba(27,25,22,0.04)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-site flex h-14 items-center justify-between md:h-16">
        <Link
          href="/"
          className="logo-mark focus-ring text-[0.95rem] text-ink md:text-base"
          onClick={() => setOpen(false)}
        >
          Fund<span>For</span>Founders
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring text-[0.8125rem] font-medium text-ink/70 transition-colors hover:text-ink"
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
            className="focus-ring flex h-10 w-10 items-center justify-center rounded border border-border bg-paper lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-4 flex-col gap-1.5">
              <span
                className={`h-px w-full bg-ink transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-full bg-ink transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-full bg-ink transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-ivory lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="container-site flex max-h-[calc(100dvh-3.5rem)] flex-col gap-0.5 overflow-y-auto py-5">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded px-2 py-3 text-base font-medium text-ink"
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
              Join the Network
            </Link>
          </nav>
        </div>
      )}

      {/* silent brand for a11y name */}
      <span className="sr-only">{siteConfig.name}</span>
    </header>
  );
}
