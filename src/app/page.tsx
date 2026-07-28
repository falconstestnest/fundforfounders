import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { HOMEPAGE_CARDS } from "@/lib/stakeholders";
import { siteConfig } from "@/lib/config";

/** Four directional markers — not a product roadmap with false certainty */
const direction = [
  { label: "Stories", note: "Podcast and conversations" },
  { label: "Founders", note: "Applications and pipeline" },
  { label: "Network", note: "Investors and partners" },
  { label: "Institution", note: "Fund structure, when ready" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — mobile-first: readable type, full-width CTAs */}
      <section className="relative flex min-h-[min(92svh,900px)] items-end pb-12 pt-[calc(4.5rem+env(safe-area-inset-top))] sm:pb-16 md:min-h-[88svh] md:items-center md:pb-24 md:pt-28">
        <div className="container-site relative z-10 w-full">
          <p className="eyebrow">Launching soon</p>
          <h1 className="headline-xl mt-4 max-w-[12em] text-ink">
            Finding founders before the world sees their potential.
          </h1>
          <p className="prose-measure mt-5 text-[0.9375rem] leading-[1.65] text-stone sm:mt-7 sm:text-base md:text-lg">
            A founder-first investment network connecting ambitious builders
            with serious capital and long-term partners.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-5">
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
              Partner with us
            </Link>
          </div>
          <Link href="/thesis" className="link-arrow focus-ring mt-5 text-sm">
            Read our thesis <span className="card-arrow" aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Ethos — open measure, no decorative gradient */}
      <section className="border-t border-border">
        <div className="container-site grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-8 lg:py-32">
          <div className="lg:col-span-4">
            <FadeIn>
              <p className="eyebrow">Belief</p>
              <h2 className="mt-4 max-w-[14ch] text-2xl font-medium tracking-tight text-ink md:text-3xl">
                Built for ideas that redefine industries.
              </h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FadeIn delay={40}>
              <p className="max-w-[36rem] text-lg leading-[1.7] text-stone">
                Technology or otherwise. We look for businesses that solve
                meaningful problems, challenge established markets, and improve
                how people live.
              </p>
              <p className="mt-8 max-w-[32rem] text-lg font-medium leading-[1.5] tracking-tight text-ink">
                {siteConfig.brandPromise}
              </p>
              <Link
                href="/thesis#what-we-look-for"
                className="link-arrow focus-ring mt-8"
              >
                What we look for <span className="card-arrow" aria-hidden>→</span>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Network list */}
      <section className="border-t border-border bg-paper">
        <div className="container-site py-20 md:py-28 lg:py-32">
          <FadeIn>
            <div className="max-w-2xl">
              <p className="eyebrow">The network</p>
              <h2 className="mt-4 text-2xl font-medium tracking-tight text-ink md:text-3xl lg:text-[2.5rem] lg:leading-tight">
                For people who build, back, and enable progress.
              </h2>
            </div>
          </FadeIn>

          <ul className="mt-14 border-t border-border">
            {HOMEPAGE_CARDS.map((card, i) => (
              <li key={card.title} className="border-b border-border">
                <FadeIn delay={Math.min(i * 30, 120)}>
                  <Link
                    href={card.href}
                    className="network-row group focus-ring flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-12 sm:py-7"
                  >
                    <div className="flex min-w-0 items-baseline gap-5 sm:gap-8">
                      <span className="w-7 shrink-0 text-[0.6875rem] font-medium tabular-nums tracking-wide text-stone">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="network-row-title text-lg font-medium tracking-tight text-ink md:text-xl">
                          {card.title}
                        </h3>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-stone">
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
        </div>
      </section>

      {/* Quiet institutional strip — one sentence, no second CTA war */}
      <section className="bg-ink">
        <div className="container-site py-20 md:py-24">
          <FadeIn>
            <p className="max-w-2xl text-2xl font-medium leading-snug tracking-tight text-white md:text-3xl">
              Clear before the cheque.
              <br />
              Committed after it.
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">
              Difficult conversations first. Then relationships that continue
              through growth, setbacks, and future rounds.
            </p>
            <Link
              href="/founders"
              className="link-arrow focus-ring mt-8 !border-white/30 !text-white hover:!border-forest hover:!text-forest"
            >
              How we work with founders{" "}
              <span className="card-arrow" aria-hidden>
                →
              </span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Podcast — honest empty state, no fake waveform */}
      <section className="border-t border-border">
        <div className="container-site grid gap-12 py-20 md:grid-cols-12 md:gap-8 md:py-28">
          <div className="md:col-span-5">
            <FadeIn>
              <p className="eyebrow">Podcast</p>
              <h2 className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
                {siteConfig.podcastTitle}
              </h2>
              <p className="mt-5 max-w-md text-stone leading-relaxed">
                Conversations with investors, founders, and ecosystem leaders
                about conviction, risk, and the human decisions behind capital.
              </p>
              <Link href="/podcast" className="link-arrow focus-ring mt-8">
                Get podcast updates{" "}
                <span className="card-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </FadeIn>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <FadeIn delay={50}>
              <div className="border border-border bg-paper px-6 py-10 md:px-8 md:py-12">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-stone">
                  Status
                </p>
                <p className="mt-3 text-lg font-medium tracking-tight text-ink">
                  First episodes in production.
                </p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone">
                  No archive yet. When conversations publish, they will appear
                  here with guests and listening links.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Direction — timeline, not a product roadmap grid */}
      <section className="border-t border-border bg-paper">
        <div className="container-site py-20 md:py-28">
          <FadeIn>
            <p className="eyebrow">Direction</p>
            <h2 className="mt-4 max-w-xl text-2xl font-medium tracking-tight md:text-3xl">
              Building toward a serious investment institution.
            </h2>
            <p className="prose-measure mt-4 text-sm text-stone">
              Intent, not guarantees. Dates and regulatory outcomes are not
              promised.
            </p>
          </FadeIn>

          <ol className="mt-14 grid gap-0 border-t border-border sm:grid-cols-2 lg:grid-cols-4">
            {direction.map((item, i) => (
              <li
                key={item.label}
                className="border-b border-border py-8 sm:border-r sm:px-6 sm:first:pl-0 sm:odd:border-r lg:px-8 lg:last:border-r-0 lg:[&:nth-child(2n)]:border-r"
              >
                <FadeIn delay={i * 40}>
                  <span className="text-[0.6875rem] font-medium tabular-nums tracking-wide text-stone">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 text-base font-medium tracking-tight text-ink">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-stone">{item.note}</p>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Conversion — send people into the journey, not a wall of fields */}
      <section id="register" className="border-t border-border">
        <div className="container-site py-14 sm:py-20 md:py-28">
          <FadeIn>
            <p className="eyebrow">Participate</p>
            <h2 className="mt-3 max-w-lg text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              Be part of what comes next.
            </h2>
            <p className="prose-measure mt-4 text-[0.9375rem] leading-relaxed text-stone">
              Founders apply through a short conversation. Partners register
              through a path built for their seat — not a newsletter signup.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/join?type=Founder"
                className="btn-primary focus-ring min-h-12 w-full sm:w-auto"
              >
                Start founder application
              </Link>
              <Link
                href="/join"
                className="btn-secondary focus-ring min-h-12 w-full sm:w-auto"
              >
                Partner interest
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
