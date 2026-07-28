import Link from "next/link";
import { siteConfig, navLinks } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-forest text-ivory">
      <div className="container-site section-pad !py-16 md:!py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-2xl tracking-tight">
              {siteConfig.name}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/75">
              A founder-first investment network connecting ambitious founders
              with serious capital and long-term partners.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow !text-gold">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="focus-ring text-ivory/80 transition hover:text-ivory"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="focus-ring text-ivory/80 transition hover:text-ivory"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow !text-gold">Connect</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring text-ivory/80 transition hover:text-ivory"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring text-ivory/80 transition hover:text-ivory"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="focus-ring text-ivory/80 transition hover:text-ivory"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="focus-ring text-ivory/80 transition hover:text-ivory"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="focus-ring text-ivory/80 transition hover:text-ivory"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-ivory/15 pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-ivory/55">
            {siteConfig.disclaimer}
          </p>
          <p className="mt-4 text-xs text-ivory/45">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
