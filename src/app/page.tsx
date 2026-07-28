import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { HOMEPAGE_CARDS } from "@/lib/stakeholders";
import { siteConfig } from "@/lib/config";

/** Intent markers — not a product roadmap with false certainty */
const direction = [
  { label: "Stories", note: "Conversations first" },
  { label: "Founders", note: "Early pipeline" },
  { label: "Network", note: "Partners and capital" },
  { label: "Institution", note: "Structure, when ready" },
];

export default function HomePage() {
  return (
    <>
      {/* ——— Hero: one idea, full viewport ——— */}
      <section className="relative flex min-h-[100svh] flex-col justify-end pb-14 pt-[calc(5rem+env(safe-area-inset-top))] sm:pb-20 md:justify-center md:pb-28 md:pt-32">
        <div className="container-site relative z-10 w-full">
          <p className="section-index">
            <span className="tabular-nums text-forest">01</span>
            <span>Under formation</span>
          </p>
          <h1 className="type-display mt-6 max-w-[11em] sm:mt-8">
            Finding founders before the world sees their potential.
          </h1>
          <p className="type-lead mt-6 sm:mt-8">
            A founder-first investment network. Serious capital. Long-term
            partners.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/join?type=Founder"
              className="btn-primary focus-ring min-h-12 w-full sm:w-auto"
            >
              Apply as a founder
            </Link>
            <Link
              href="/join"
              className="btn-secondary focus-ring min-h-12 w-full sm:w-auto"
            >
              Partner interest
            </Link>
          </div>
          <Link
            href="/thesis"
            className="link-arrow focus-ring mt-8 text-sm"
          >
            Read the thesis{" "}
            <span className="card-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
        <p className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 type-caption tracking-[0.16em] uppercase text-stone/70 md:block">
          Scroll
        </p>
      </section>

      {/* ——— Ethos: what do we believe? ——— */}
      <section className="border-t border-border" aria-labelledby="ethos-heading">
        <div className="container-site section-pad">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <FadeIn>
                <p className="section-index">
                  <span className="tabular-nums text-forest">02</span>
                  <span>Belief</span>
                </p>
                <h2 id="ethos-heading" className="type-section mt-5 max-w-[12ch]">
                  Ideas that redefine industries.
                </h2>
              </FadeIn>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <FadeIn delay={40}>
                <p className="type-lead">
                  Technology or otherwise. Businesses that solve meaningful
                  problems and improve how people live.
                </p>
                <Link
                  href="/thesis#what-we-look-for"
                  className="link-arrow focus-ring mt-10"
                >
                  What we look for{" "}
                  <span className="card-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Network: who is this for? ——— */}
      <section
        className="border-t border-border bg-paper"
        aria-labelledby="network-heading"
      >
        <div className="container-site section-pad">
          <FadeIn>
            <p className="section-index">
              <span className="tabular-nums text-forest">03</span>
              <span>The network</span>
            </p>
            <h2
              id="network-heading"
              className="type-section mt-5 max-w-[16ch]"
            >
              Builders, backers, and enablers.
            </h2>
          </FadeIn>

          <ul className="mt-14 border-t border-border md:mt-16">
            {HOMEPAGE_CARDS.map((card, i) => (
              <li key={card.title} className="border-b border-border">
                <FadeIn delay={Math.min(i * 25, 100)}>
                  <Link
                    href={card.href}
                    className="network-row group focus-ring flex flex-col gap-1.5 py-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-12 sm:py-8"
                  >
                    <div className="flex min-w-0 items-baseline gap-5 sm:gap-8">
                      <span className="w-7 shrink-0 text-xs font-medium tabular-nums tracking-wide text-stone">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="network-row-title type-title !text-lg md:!text-xl">
                          {card.title}
                        </h3>
                        <p className="type-small mt-1.5 max-w-md">
                          {card.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className="card-arrow ml-12 shrink-0 text-stone sm:ml-0"
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                </FadeIn>
              </li>
            ))}
          </ul>
          <p className="type-caption mt-10">
            Each path is different. We only ask what matters for your seat.
          </p>
        </div>
      </section>

      {/* ——— Founder philosophy: one conviction ——— */}
      <section
        className="bg-ink"
        aria-labelledby="philosophy-heading"
      >
        <div className="container-site section-pad">
          <FadeIn>
            <p className="section-index !text-white/40">
              <span className="tabular-nums text-forest">04</span>
              <span>Founders</span>
            </p>
            <h2
              id="philosophy-heading"
              className="type-section mt-6 max-w-2xl !text-white"
            >
              {siteConfig.brandPromise}
            </h2>
            <p className="type-body mt-6 max-w-md !text-white/45">
              Hard conversations first. Then relationships through growth,
              setbacks, and future rounds.
            </p>
            <Link
              href="/founders"
              className="link-arrow focus-ring mt-10 !border-white/25 !text-white hover:!border-forest hover:!text-forest"
            >
              How we work with founders{" "}
              <span className="card-arrow" aria-hidden>
                →
              </span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ——— Podcast: one surface ——— */}
      <section
        className="border-t border-border"
        aria-labelledby="podcast-heading"
      >
        <div className="container-site section-pad grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <FadeIn>
              <p className="section-index">
                <span className="tabular-nums text-forest">05</span>
                <span>Podcast</span>
              </p>
              <h2 id="podcast-heading" className="type-section mt-5">
                {siteConfig.podcastTitle}
              </h2>
              <p className="type-body mt-5">
                Conviction, risk, and the human decisions behind capital.
              </p>
              <Link href="/podcast" className="link-arrow focus-ring mt-10">
                Podcast updates{" "}
                <span className="card-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </FadeIn>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:flex md:items-end">
            <FadeIn delay={40}>
              <div className="w-full border-l-2 border-forest/30 pl-6 sm:pl-8">
                <p className="type-caption uppercase tracking-[0.14em]">
                  Status
                </p>
                <p className="type-title mt-3 !text-lg">
                  First episodes in production.
                </p>
                <p className="type-small mt-2 max-w-sm">
                  No archive yet. Guests and links will appear when ready.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ——— Roadmap / direction ——— */}
      <section
        className="border-t border-border bg-paper"
        aria-labelledby="roadmap-heading"
      >
        <div className="container-site section-pad">
          <FadeIn>
            <p className="section-index">
              <span className="tabular-nums text-forest">06</span>
              <span>Direction</span>
            </p>
            <h2 id="roadmap-heading" className="type-section mt-5 max-w-[18ch]">
              Toward a serious investment institution.
            </h2>
            <p className="type-small mt-4">
              Intent only. Dates and regulatory outcomes are not promised.
            </p>
          </FadeIn>

          <ol className="mt-14 border-t border-border md:mt-16">
            {direction.map((item, i) => (
              <li key={item.label} className="border-b border-border">
                <FadeIn delay={i * 30}>
                  <div className="flex flex-col gap-1 py-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10 sm:py-8">
                    <div className="flex items-baseline gap-5 sm:gap-8">
                      <span className="w-7 shrink-0 text-xs font-medium tabular-nums tracking-wide text-forest">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="type-title !text-base md:!text-lg">
                        {item.label}
                      </p>
                    </div>
                    <p className="type-small pl-12 sm:pl-0 sm:text-right">
                      {item.note}
                    </p>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Join ——— */}
      <section
        id="register"
        className="border-t border-border"
        aria-labelledby="join-heading"
      >
        <div className="container-site section-pad">
          <FadeIn>
            <p className="section-index">
              <span className="tabular-nums text-forest">07</span>
              <span>Participate</span>
            </p>
            <h2 id="join-heading" className="type-section mt-5 max-w-[14ch]">
              Be part of what comes next.
            </h2>
            <p className="type-body mt-5">
              Founders apply through a short conversation. Partners follow a
              path built for their seat.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/join?type=Founder"
                className="btn-primary focus-ring min-h-12 w-full sm:w-auto"
              >
                Founder application
              </Link>
              <Link
                href="/join"
                className="btn-secondary focus-ring min-h-12 w-full sm:w-auto"
              >
                Partner registration
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
