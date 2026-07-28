import Link from "next/link";
import { siteConfig, navLinks } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ink text-ivory pb-[env(safe-area-inset-bottom)]">
      <div className="container-site py-12 sm:py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="logo-mark text-base text-white">
              Fund<span>For</span>Founders
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              Founder-first investment network. Serious capital. Long-term
              relationships.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/30">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="footer-link focus-ring text-white/65"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="footer-link focus-ring text-white/65"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/30">
              Legal
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="footer-link focus-ring text-white/65"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="footer-link focus-ring text-white/65"
                >
                  Terms
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="footer-link focus-ring text-white/65"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="max-w-2xl text-[0.6875rem] leading-relaxed text-white/35">
            {siteConfig.disclaimer}
          </p>
          <p className="mt-4 text-[0.6875rem] text-white/25">
            © {year} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
