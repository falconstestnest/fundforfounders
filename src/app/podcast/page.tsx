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
      <section className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">The Podcast</p>
            <h1 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight md:text-6xl">
              {siteConfig.podcastTitle}
            </h1>
            <p className="prose-measure mt-6 text-lg text-stone md:text-xl">
              Conversations with investors, founders and ecosystem leaders about
              the conviction, risk and human decisions behind every investment.
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-moss">
              First episodes launching soon
            </p>
            <Link
              href="/join?type=Media"
              className="btn-primary focus-ring mt-8"
            >
              Get Podcast Updates
            </Link>
          </div>
          <FadeIn>
            <div className="podcast-card rounded border border-border bg-paper p-8 md:p-10">
              <div className="flex h-44 items-end gap-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className="podcast-wave-bar flex-1 bg-forest/20"
                    style={{ height: `${18 + ((i * 23) % 75)}%` }}
                  />
                ))}
              </div>
              <p className="mt-8 font-display text-2xl">Episode archive</p>
              <p className="mt-2 text-sm text-stone">
                No episodes published yet. When the first conversations go live,
                they will appear here with guest details and listening links.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-paper/50">
        <div className="container-site grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Guest applications",
              body: "Founders and investors with a story of conviction and consequence.",
              href: "/join?type=Founder",
              cta: "Apply as a guest",
            },
            {
              title: "Sponsor interest",
              body: "Brand-aligned partners who share a long-term view of founders and capital.",
              href: "/contact",
              cta: "Contact us",
            },
            {
              title: "Media & distribution",
              body: "Press and platforms interested in featuring or distributing the show.",
              href: "/join?type=Media",
              cta: "Join the media list",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="card-lift rounded border border-border bg-paper p-6"
            >
              <h2 className="font-display text-2xl">{card.title}</h2>
              <p className="mt-3 text-sm text-stone">{card.body}</p>
              <Link href={card.href} className="link-arrow focus-ring mt-6">
                {card.cta} <span className="card-arrow">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
