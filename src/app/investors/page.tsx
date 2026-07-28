import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "For Investors",
  description:
    "Register interest in the FundForFounders investor network — angels, LPs, family offices, VCs and institutional partners.",
};

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
    <div className="pt-20 lg:pt-24">
      <section className="section-pad !pb-12">
        <div className="container-site">
          <p className="eyebrow">For Investors</p>
          <h1 className="font-display mt-4 max-w-4xl text-4xl leading-[1.05] tracking-tight md:text-6xl">
            Join a network built for serious capital.
          </h1>
          <p className="prose-measure mt-6 text-lg text-stone md:text-xl">
            Angels, HNIs, family offices, LPs, VCs, funds of funds and
            international investors can register interest, receive updates and
            explore future participation — subject to eligibility and
            documentation.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/join?type=Angel%20Investor"
              className="btn-primary focus-ring"
            >
              Join the Investor Network
            </Link>
            <Link
              href="/join?type=Limited%20Partner"
              className="btn-secondary focus-ring"
            >
              Express LP Interest
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-paper/50">
        <div className="container-site">
          <FadeIn>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              Why join the network
            </h2>
          </FadeIn>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <FadeIn key={r.title} delay={i * 40}>
                <article className="h-full rounded border border-border bg-paper p-6">
                  <h3 className="font-display text-xl text-ink">{r.title}</h3>
                  <p className="mt-3 text-sm text-stone">{r.body}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <FadeIn>
            <h2 className="font-display text-3xl tracking-tight">
              How we describe participation
            </h2>
            <p className="mt-5 text-stone">
              We use careful language. You can register interest, join the
              network, receive updates and explore future participation. We do
              not promise returns, assured allocation, risk-free investment or a
              confirmed fund until formal approvals exist.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/join?type=Venture%20Capital%20Fund"
                className="btn-secondary focus-ring !min-h-11 !text-sm"
              >
                Explore Partnership (VCs)
              </Link>
              <Link
                href="/join?type=Fund%20of%20Funds"
                className="btn-secondary focus-ring !min-h-11 !text-sm"
              >
                Register Institutional Interest
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-border bg-ivory py-12">
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
