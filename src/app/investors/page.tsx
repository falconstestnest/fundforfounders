import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "For Investors",
  description:
    "Partner with FundForFounders — angels, VCs, LPs, family offices, funds of funds, government and corporate partners.",
};

const paths = [
  {
    type: "Angel Investor",
    title: "Angel / HNI",
    body: "Early cheques, co-invest, pitch panels. Curated opportunities — not a newsletter.",
  },
  {
    type: "Venture Capital Fund",
    title: "Venture capital",
    body: "Deal flow, co-invest dialogue, and regional access where the fit is real.",
  },
  {
    type: "Limited Partner",
    title: "Limited partner",
    body: "Expression of institutional interest only. No solicitation. No commitment implied.",
  },
  {
    type: "Family Office",
    title: "Family office",
    body: "Direct and fund exposure with a long horizon. Confidential dialogue.",
  },
  {
    type: "Fund of Funds",
    title: "Fund of funds",
    body: "Emerging manager and platform review when materials are ready.",
  },
  {
    type: "Government Agency",
    title: "Government",
    body: "Mission-aligned programmes, events, and ecosystem partnerships.",
  },
  {
    type: "Corporate Innovation Team",
    title: "Corporate",
    body: "Innovation mandates, pilots, and founder access that match your priorities.",
  },
];

const reasons = [
  {
    title: "Curated founder pipeline",
    body: "Early access to regional and international founders building with conviction.",
  },
  {
    title: "Pitch sessions",
    body: "Participate in curated pitch formats as the network launches.",
  },
  {
    title: "Co-investment interest",
    body: "Express interest in future co-investment opportunities subject to eligibility.",
  },
  {
    title: "LP pathway",
    body: "Follow formation of a future founder-first investment platform.",
  },
  {
    title: "Regional access",
    body: "Connect with founders and ecosystems beyond saturated coastal corridors.",
  },
  {
    title: "International partnerships",
    body: "Build relationships across India and global capital networks.",
  },
];

export default function InvestorsPage() {
  return (
    <div className="pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-[calc(4.25rem+env(safe-area-inset-top))]">
      <section className="section-pad !pb-10">
        <div className="container-site">
          <p className="eyebrow">For partners</p>
          <h1 className="mt-4 max-w-[16ch] text-[1.875rem] font-medium leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
            Future partners — not subscribers.
          </h1>
          <p className="prose-measure mt-5 text-[0.9375rem] leading-relaxed text-stone sm:mt-6 sm:text-lg md:text-xl">
            Angels, family offices, LPs, VCs, funds of funds, government and
            corporate teams each follow a path built for their seat. We collect
            what matters — and nothing that does not.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
            <Link
              href="/join"
              className="btn-primary focus-ring min-h-12 w-full sm:w-auto"
            >
              Choose your path
            </Link>
            <Link
              href="/thesis"
              className="btn-secondary focus-ring min-h-12 w-full sm:w-auto"
            >
              Read our thesis
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-paper/50">
        <div className="container-site">
          <FadeIn>
            <p className="eyebrow">Your seat</p>
            <h2 className="mt-3 max-w-xl text-2xl font-medium tracking-tight text-ink md:text-3xl">
              A premium path for every partner type.
            </h2>
            <p className="prose-measure mt-3 text-sm leading-relaxed text-stone">
              The form adapts. Intelligent questions. Meaningful information.
              Less noise.
            </p>
          </FadeIn>
          <ul className="mt-10 divide-y divide-border border-t border-border">
            {paths.map((p, i) => (
              <li key={p.type}>
                <FadeIn delay={Math.min(i * 30, 120)}>
                  <Link
                    href={`/join?type=${encodeURIComponent(p.type)}`}
                    className="network-row group focus-ring flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-6"
                  >
                    <div className="min-w-0">
                      <h3 className="text-base font-medium tracking-tight text-ink sm:text-lg">
                        {p.title}
                      </h3>
                      <p className="mt-1 max-w-xl text-sm leading-relaxed text-stone">
                        {p.body}
                      </p>
                    </div>
                    <span
                      className="card-arrow shrink-0 text-stone"
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

      <section className="section-pad border-t border-border">
        <div className="container-site">
          <FadeIn>
            <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
              Why partner with the network
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <FadeIn key={r.title} delay={i * 40}>
                <article className="panel-static h-full rounded p-5 sm:p-6">
                  <h3 className="text-base font-medium tracking-tight text-ink sm:text-lg">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {r.body}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border">
        <div className="container-site max-w-3xl">
          <FadeIn>
            <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
              How we describe participation
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone sm:mt-5 sm:text-base">
              We use careful language. You can register interest, join the
              network, receive updates and explore future participation. We do
              not promise returns, assured allocation, risk-free investment or a
              confirmed fund until formal approvals exist.
            </p>
            <Link
              href="/join"
              className="btn-primary focus-ring mt-8 min-h-12 w-full sm:w-auto"
            >
              Begin partner registration
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-border bg-ivory py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:py-12">
        <div className="container-site">
          <p className="max-w-3xl text-sm leading-relaxed text-stone">
            <strong className="text-ink">Disclaimer.</strong>{" "}
            {siteConfig.disclaimer} Registration is not an offer to sell or a
            solicitation to buy securities. Future participation is subject to
            eligibility, documentation and applicable law.
          </p>
        </div>
      </section>
    </div>
  );
}
