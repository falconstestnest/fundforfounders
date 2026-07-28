import Link from "next/link";
import { siteConfig, navLinks } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ink text-ivory pb-[env(safe-area-inset-bottom)]">
      <div className="container-site py-14 sm:py-16 md:py-20">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="logo-mark text-sm text-white md:text-base">
              Fund<span>For</span>Founders
            </p>
            <p className="type-small mt-5 max-w-[16rem] !text-white/40">
              Founder-first investment network under formation.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
              Explore
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="footer-link focus-ring text-white/60"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/join"
                  className="footer-link focus-ring text-white/60"
                >
                  Join
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="footer-link focus-ring text-white/60"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
              Legal
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="footer-link focus-ring text-white/60"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="footer-link focus-ring text-white/60"
                >
                  Terms
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="footer-link focus-ring text-white/60"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="type-caption max-w-2xl !text-white/30">
            {siteConfig.disclaimer}
          </p>
          <p className="type-caption mt-4 !text-white/20">
            © {year} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
