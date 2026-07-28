import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { HOMEPAGE_CARDS } from "@/lib/stakeholders";
import { siteConfig } from "@/lib/config";

const roadmap = [
  { label: "Podcast Launch", note: "Stories from the network" },
  { label: "Founder Applications", note: "Early pipeline open" },
  { label: "Pitch Competitions", note: "Curated sessions" },
  { label: "Investor Network", note: "Angels, LPs, VCs" },
  { label: "Fund Formation", note: "Subject to structure" },
  { label: "Fund I", note: "Long-term destination" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — Sequoia-scale statement */}
      <section className="hero-wash relative flex min-h-[92vh] items-end pb-16 pt-28 md:min-h-[100svh] md:items-center md:pb-24 md:pt-24">
        <div className="container-site relative z-10 w-full">
          <p className="eyebrow">Launching Soon</p>
          <h1 className="headline-xl mt-6 max-w-[15ch] text-[2.75rem] text-ink sm:text-6xl md:max-w-[18ch] md:text-7xl lg:text-[5.25rem] xl:text-[5.75rem]">
            We help ambitious founders build enduring companies.
          </h1>
          <p className="mt-8 max-w-xl text-base text-stone md:text-lg">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/join" className="btn-primary focus-ring">
              Join the Network
            </Link>
            <Link
              href="/join?type=Founder"
              className="btn-secondary focus-ring"
            >
              Apply as a Founder
            </Link>
            <Link
              href="/thesis"
              className="link-arrow focus-ring sm:ml-2"
            >
              Our thesis <span className="card-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Ethos strip */}
      <section className="section-pad">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <FadeIn>
              <p className="eyebrow">What we believe</p>
              <h2 className="font-display mt-4 text-3xl tracking-tight text-ink md:text-4xl">
                Built for ideas that redefine industries.
              </h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FadeIn delay={60}>
              <p className="text-lg leading-relaxed text-stone md:text-xl">
                Technology or otherwise, we are interested in businesses that
                solve meaningful problems, challenge established markets and
                improve how people live.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-ink md:text-xl">
                Clear before the cheque. Committed after it.
              </p>
              <Link
                href="/thesis#what-we-look-for"
                className="link-arrow focus-ring mt-8"
              >
                What we look for <span className="card-arrow">→</span>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Network — list style like institutional story grids */}
      <section className="section-pad">
        <div className="container-site">
          <FadeIn>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow">The network</p>
                <h2 className="font-display mt-4 text-3xl tracking-tight md:text-4xl lg:text-5xl">
                  For the people who build, back and enable progress.
                </h2>
              </div>
              <Link href="/join" className="btn-secondary focus-ring shrink-0">
                Register interest
              </Link>
            </div>
          </FadeIn>

          <ul className="mt-14 divide-y divide-border border-y border-border">
            {HOMEPAGE_CARDS.map((card, i) => (
              <li key={card.title}>
                <FadeIn delay={i * 40}>
                  <Link
                    href={card.href}
                    className="network-row group focus-ring flex flex-col gap-3 rounded-sm py-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10 sm:py-8"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="w-8 shrink-0 text-xs font-semibold tabular-nums text-forest">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="network-row-title text-xl font-medium tracking-tight text-ink md:text-2xl">
                          {card.title}
                        </h3>
                        <p className="mt-1.5 max-w-xl text-sm text-stone md:text-base">
                          {card.description}
                        </p>
                      </div>
                    </div>
                    <span className="card-arrow ml-12 shrink-0 text-stone sm:ml-0">
                      →
                    </span>
                  </Link>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dark band — brand promise */}
      <section className="bg-ink text-ivory">
        <div className="container-site section-pad">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
                How we work
              </p>
              <h2 className="font-display mt-5 text-3xl leading-[1.1] tracking-tight text-white md:text-5xl">
                {siteConfig.brandPromise}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
                Difficult conversations before an investment is signed. Once
                aligned, relationships that continue through growth, setbacks,
                future rounds and exits.
              </p>
              <Link
                href="/founders"
                className="btn-primary focus-ring mt-10"
              >
                How we work with founders
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Podcast */}
      <section className="section-pad">
        <div className="container-site grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <FadeIn>
              <p className="eyebrow">Podcast</p>
              <h2 className="font-display mt-4 text-3xl tracking-tight md:text-4xl">
                {siteConfig.podcastTitle}
              </h2>
              <p className="mt-5 text-stone md:text-lg">
                Conversations with investors, founders and ecosystem leaders
                about the conviction, risk and human decisions behind every
                investment.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                First episodes launching soon
              </p>
              <Link href="/podcast" className="btn-primary focus-ring mt-8">
                Get podcast updates
              </Link>
            </FadeIn>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <FadeIn delay={80}>
              <div className="podcast-card border border-border bg-paper p-8 md:p-10">
                <div className="flex h-36 items-end gap-1">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className="podcast-wave-bar flex-1 bg-forest/20"
                      style={{ height: `${18 + ((i * 19) % 78)}%` }}
                    />
                  ))}
                </div>
                <p className="mt-8 text-lg font-medium tracking-tight text-ink">
                  Episode archive
                </p>
                <p className="mt-2 text-sm text-stone">
                  Guest conversations will appear here as they publish.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Direction / roadmap */}
      <section className="section-pad">
        <div className="container-site">
          <FadeIn>
            <p className="eyebrow">Our direction</p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl tracking-tight md:text-4xl">
              Building toward a serious investment institution.
            </h2>
            <p className="prose-measure mt-4 text-stone">
              Milestones indicate intent — not guaranteed dates or regulatory
              outcomes.
            </p>
          </FadeIn>
          <ol className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {roadmap.map((item, i) => (
              <FadeIn key={item.label} delay={i * 35}>
                <li className="roadmap-item flex h-full flex-col border border-transparent bg-ivory p-6 md:p-8">
                  <span className="roadmap-index text-xs font-semibold tabular-nums text-forest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 text-lg font-medium tracking-tight text-ink">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-stone">{item.note}</p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      <hr className="rule" />

      {/* Digital-first */}
      <section className="py-16 md:py-20">
        <div className="container-site">
          <FadeIn>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="max-w-2xl text-lg text-ink md:text-xl">
                Exploring transparent, digital-first infrastructure for the
                future of private capital.
              </p>
              <Link
                href="/thesis#digital-first"
                className="link-arrow focus-ring shrink-0"
              >
                Long-term vision <span className="card-arrow">→</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="border-t border-border bg-paper section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <FadeIn>
              <p className="eyebrow">Participate</p>
              <h2 className="font-display mt-4 text-3xl tracking-tight md:text-4xl">
                Be part of what comes next.
              </h2>
              <p className="prose-measure mt-5 text-stone">
                Tell us how you would like to participate. We will share
                relevant launch updates, applications and partnership
                opportunities.
              </p>
            </FadeIn>
          </div>
          <div className="lg:col-span-8">
            <FadeIn delay={80}>
              <RegistrationForm onSuccessRedirect />
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
