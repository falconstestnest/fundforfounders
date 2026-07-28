import Link from "next/link";
import { siteConfig, navLinks } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ivory">
      {/* Mailing strip — Sequoia-like community invite */}
      <div className="border-b border-white/10">
        <div className="container-site flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center md:py-14">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
              Stay close
            </p>
            <h2 className="font-display mt-3 text-2xl tracking-tight text-white md:text-3xl">
              Get the best updates from the FundForFounders network.
            </h2>
          </div>
          <Link href="/join" className="btn-primary focus-ring shrink-0">
            Join the Network
          </Link>
        </div>
      </div>

      <div className="container-site py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="logo-mark text-lg text-white">
              Fund<span>For</span>Founders
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              A founder-first investment network. Helping ambitious founders
              connect with serious capital — from idea to enduring company.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="focus-ring text-white/70 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="focus-ring text-white/70 transition hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              Connect
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring text-white/70 transition hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring text-white/70 transition hover:text-white"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="focus-ring text-white/70 transition hover:text-white"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="focus-ring text-white/70 transition hover:text-white"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="focus-ring text-white/70 transition hover:text-white"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-white/40">
            {siteConfig.disclaimer}
          </p>
          <p className="mt-4 text-xs text-white/30">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
