import Link from "next/link";
import { NetworkBackground } from "@/components/NetworkBackground";
import { FadeIn } from "@/components/FadeIn";
import { RegistrationForm } from "@/components/RegistrationForm";
import { HOMEPAGE_CARDS } from "@/lib/stakeholders";
import { siteConfig } from "@/lib/config";

const roadmap = [
  "Podcast Launch",
  "Founder Applications",
  "Pitch Competitions",
  "Investor Network",
  "Fund Formation",
  "Fund I",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center pt-20 lg:min-h-[92vh] lg:pt-24">
        <NetworkBackground />
        <div className="container-site relative z-10 py-16 md:py-24">
          <p className="eyebrow">Launching Soon</p>
          <h1 className="font-display mt-5 max-w-4xl text-[2.75rem] leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.98]">
            Finding founders before the world sees their potential.
          </h1>
          <p className="prose-measure mt-6 text-lg text-stone md:text-xl">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/join" className="btn-primary focus-ring">
              Join the Network
            </Link>
            <Link
              href="/join?type=Founder"
              className="btn-secondary focus-ring"
            >
              Apply as a Founder
            </Link>
          </div>
          <Link
            href="/thesis"
            className="link-arrow focus-ring mt-8"
          >
            Read our investment thesis{" "}
            <span className="card-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </section>

      {/* Subtle positioning */}
      <section className="section-pad border-t border-border">
        <div className="container-site">
          <FadeIn>
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl leading-tight tracking-tight text-ink md:text-5xl">
                Built for ideas that can redefine industries.
              </h2>
              <p className="prose-measure mt-6 text-lg text-stone">
                Technology or otherwise, we are interested in businesses that
                solve meaningful problems, challenge established markets and
                improve how people live.
              </p>
              <Link href="/thesis#what-we-look-for" className="link-arrow focus-ring mt-6">
                What we look for <span className="card-arrow">→</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="section-pad bg-paper/60">
        <div className="container-site">
          <FadeIn>
            <h2 className="font-display max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
              A network designed for the people who build, back and enable
              progress.
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOMEPAGE_CARDS.map((card, i) => (
              <FadeIn key={card.title} delay={i * 60}>
                <Link
                  href={card.href}
                  className="card-lift focus-ring group flex h-full flex-col rounded-2xl border border-border bg-paper p-6 md:p-8"
                >
                  <span className="font-mono text-xs text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-2xl tracking-tight text-ink">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-stone">
                    {card.description}
                  </p>
                  <span className="link-arrow mt-6 text-sm">
                    Continue <span className="card-arrow">→</span>
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Brand promise */}
      <section className="section-pad">
        <div className="container-site">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl leading-tight tracking-tight md:text-5xl">
                {siteConfig.brandPromise}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-stone">
                We believe the difficult conversations should happen before an
                investment is signed. Once aligned, we work to build
                relationships that continue through growth, setbacks, future
                rounds and exits.
              </p>
              <Link href="/founders" className="link-arrow focus-ring mt-8 justify-center">
                How we work with founders <span className="card-arrow">→</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Podcast */}
      <section className="section-pad border-y border-border bg-forest text-ivory">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <p className="eyebrow !text-gold">The Podcast</p>
            <h2 className="font-display mt-4 text-3xl leading-tight tracking-tight md:text-5xl">
              {siteConfig.podcastTitle}
            </h2>
            <p className="mt-5 max-w-lg text-lg text-ivory/75">
              Conversations with investors, founders and ecosystem leaders about
              the conviction, risk and human decisions behind every investment.
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-gold/90">
              First episodes launching soon
            </p>
            <Link
              href="/podcast"
              className="btn-primary focus-ring mt-8 !bg-ivory !text-forest hover:!bg-paper"
            >
              Get Podcast Updates
            </Link>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="rounded-3xl border border-ivory/15 bg-ivory/5 p-8 md:p-10">
              <div className="flex h-40 items-end gap-1.5 opacity-60">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gold/70"
                    style={{
                      height: `${20 + ((i * 17) % 70)}%`,
                    }}
                  />
                ))}
              </div>
              <p className="mt-6 font-display text-xl text-ivory/90">
                Episode archive coming soon
              </p>
              <p className="mt-2 text-sm text-ivory/55">
                Guest conversations will appear here as they publish.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Roadmap */}
      <section className="section-pad">
        <div className="container-site">
          <FadeIn>
            <p className="eyebrow">Our direction</p>
            <h2 className="font-display mt-3 text-3xl tracking-tight md:text-4xl">
              Building toward a serious investment institution.
            </h2>
            <p className="prose-measure mt-4 text-stone">
              Milestones indicate intent, not guaranteed dates or regulatory
              outcomes.
            </p>
          </FadeIn>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roadmap.map((item, i) => (
              <FadeIn key={item} delay={i * 40}>
                <li className="rounded-2xl border border-border bg-paper px-5 py-5">
                  <span className="font-mono text-xs text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 font-medium text-ink">{item}</p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/* Digital-first — subtle */}
      <section className="border-t border-border py-16 md:py-20">
        <div className="container-site">
          <FadeIn>
            <p className="max-w-2xl text-lg text-stone md:text-xl">
              Exploring transparent, digital-first infrastructure for the future
              of private capital.
            </p>
            <Link href="/thesis#digital-first" className="link-arrow focus-ring mt-4">
              Read our long-term vision <span className="card-arrow">→</span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="section-pad bg-paper/70">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <FadeIn>
              <h2 className="font-display text-3xl leading-tight tracking-tight md:text-5xl">
                Be part of what comes next.
              </h2>
              <p className="prose-measure mt-5 text-lg text-stone">
                Tell us how you would like to participate, and we will share
                relevant launch updates, applications and partnership
                opportunities.
              </p>
            </FadeIn>
          </div>
          <div className="lg:col-span-7">
            <FadeIn delay={80}>
              <RegistrationForm />
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
