import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Podcast",
  description: `${siteConfig.podcastTitle} — conversations with investors, founders and ecosystem leaders.`,
};

export default function PodcastPage() {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="border-b border-border">
        <div className="container-site grid gap-12 py-20 md:grid-cols-12 md:gap-10 md:py-28">
          <div className="md:col-span-7">
            <p className="eyebrow">Podcast</p>
            <h1 className="mt-4 max-w-[14ch] text-3xl font-medium tracking-tight text-ink md:text-5xl md:leading-[1.08]">
              {siteConfig.podcastTitle}
            </h1>
            <p className="prose-measure mt-6 text-base leading-relaxed text-stone md:text-lg">
              Conversations with investors, founders, and ecosystem leaders
              about conviction, risk, and the human decisions behind every
              investment.
            </p>
            <p className="mt-6 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-stone">
              First episodes in production
            </p>
            <Link
              href="/join?type=Media"
              className="btn-primary focus-ring mt-8"
            >
              Get podcast updates
            </Link>
          </div>
          <div className="md:col-span-5">
            <FadeIn>
              <div className="border border-border bg-paper px-6 py-10 md:px-8">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-stone">
                  Archive
                </p>
                <p className="mt-4 text-lg font-medium tracking-tight text-ink">
                  No episodes published yet.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  When conversations go live, they will list here with guest
                  names and listening links. We will not invent episode titles
                  or placeholders that look like real content.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="container-site py-16 md:py-20">
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {[
            {
              title: "Guest applications",
              body: "Founders and investors with a story of conviction and consequence.",
              href: "/join?type=Founder",
              cta: "Apply as a guest",
            },
            {
              title: "Sponsor interest",
              body: "Partners who share a long-term view of founders and capital.",
              href: "/contact",
              cta: "Contact us",
            },
            {
              title: "Media list",
              body: "Press and platforms for launch coverage and distribution.",
              href: "/join?type=Media",
              cta: "Join the media list",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="bg-ivory px-6 py-8 md:px-8 md:py-10"
            >
              <h2 className="text-lg font-medium tracking-tight text-ink">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone">
                {card.body}
              </p>
              <Link href={card.href} className="link-arrow focus-ring mt-6 text-sm">
                {card.cta} <span className="card-arrow" aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
