import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Our Thesis",
  description:
    "We invest beyond labels — ambitious technology and non-technology businesses that transform markets and create enduring value.",
};

const sectors = [
  "Technology",
  "AI",
  "Consumer brands",
  "Retail",
  "Food and beverage",
  "Agriculture",
  "Manufacturing",
  "Logistics",
  "Healthcare",
  "Education",
  "Hospitality",
  "Climate",
  "Financial services",
  "Traditional sectors ready for reinvention",
];

const lookFor = [
  "Meaningful problem",
  "Founder conviction",
  "Market insight",
  "Differentiation",
  "Scalability",
  "Customer love",
  "Operational strength",
  "Long-term potential",
  "Positive economic, social or environmental contribution",
];

const clearTopics = [
  "Valuation",
  "Governance",
  "Ownership",
  "Reporting",
  "Dilution",
  "Founder roles",
  "Future fundraising",
  "Exit expectations",
];

const ambitionExamples = [
  "Starbucks",
  "IKEA",
  "Patagonia",
  "Lululemon",
  "Nike",
  "Costco",
  "Airbnb",
  "Uber",
  "Dropbox",
  "Blinkit",
  "Canva",
  "Shopify",
];

const digitalTopics = [
  "Digital Rupee settlement",
  "Transparent transaction records",
  "Improved audit trails",
  "Digital fund administration",
  "Faster approved distributions",
  "Regulated financial infrastructure",
];

export default function ThesisPage() {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="section-pad !pb-12">
        <div className="container-site">
          <p className="eyebrow">Our Thesis</p>
          <h1 className="font-display mt-4 max-w-4xl text-4xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            We invest beyond labels.
          </h1>
          <p className="prose-measure mt-6 text-lg text-stone md:text-xl">
            We are interested in ambitious technology and non-technology
            businesses that can transform markets, improve everyday life and
            create enduring value.
          </p>
        </div>
      </section>

      <section className="border-t border-border section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <FadeIn>
              <h2 className="font-display text-3xl tracking-tight md:text-4xl">
                Ideas that change how the world works
              </h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-7">
            <FadeIn delay={60}>
              <p className="text-lg text-stone">
                The platform is open to founders building across categories —
                not only software, and not only India&apos;s metro corridors.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {sectors.map((s) => (
                  <li
                    key={s}
                    className="rounded border border-border bg-paper px-3.5 py-1.5 text-sm text-ink"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-paper/50 section-pad">
        <div className="container-site">
          <FadeIn>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              Category-defining ambition
            </h2>
            <p className="prose-measure mt-5 text-lg text-stone">
              We look for founders with the ambition to define a category — the
              way iconic companies reshaped everyday behaviour. The names below
              are illustrative examples of company-building ambition only.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {ambitionExamples.map((name) => (
                <li
                  key={name}
                  className="rounded border border-border bg-ivory px-3.5 py-1.5 text-sm text-ink"
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-2xl text-xs leading-relaxed text-stone">
              These company names are used solely as illustrative examples of
              category-defining ambition. They are not affiliated with
              FundForFounders and do not imply endorsement, investment or
              partnership.
            </p>
          </FadeIn>
        </div>
      </section>

      <section id="what-we-look-for" className="section-pad border-t border-border">
        <div className="container-site">
          <FadeIn>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              What we look for
            </h2>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lookFor.map((item, i) => (
                <li
                  key={item}
                  className="rounded border border-border bg-paper p-5"
                >
                  <span className="text-xs font-semibold tabular-nums text-forest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 font-medium text-ink">{item}</p>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-ink text-ivory">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest">
              Philosophy
            </p>
            <h2 className="font-display mt-4 text-3xl tracking-tight text-white md:text-4xl">
              Clear before the cheque
            </h2>
            <p className="mt-5 text-lg text-white/60">
              We expect open discussion before any investment is signed — so
              alignment is real, not assumed.
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {clearTopics.map((t) => (
                <li
                  key={t}
                  className="border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                >
                  {t}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <FadeIn>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              Friends for life
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-stone">
              Our ambition is to remain trusted partners to founders beyond a
              single funding round or exit.
            </p>
            <p className="mt-4 text-stone">
              That is a relationship goal — not a contractual guarantee. We
              believe long-term partnership is earned through clarity, presence
              and useful support when it matters.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Digital-First Capital + official RBI Digital Rupee link */}
      <section
        id="digital-first"
        className="section-pad border-t border-border bg-paper/60"
      >
        <div className="container-site">
          <FadeIn>
            <p className="eyebrow">Long-term vision</p>
            <h2 className="font-display mt-3 text-3xl tracking-tight md:text-4xl">
              Digital-first capital
            </h2>
            <p className="prose-measure mt-5 text-lg text-stone">
              Over time, FundForFounders intends to explore use of the Digital
              Rupee in legally permitted investment and transaction
              infrastructure — subject to regulation, banking capability and the
              formal fund structure.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {digitalTopics.map((t) => (
                <li
                  key={t}
                  className="rounded border border-border bg-ivory px-4 py-4 text-sm text-ink"
                >
                  {t}
                </li>
              ))}
            </ul>
            <p className="prose-measure mt-8 text-sm leading-relaxed text-stone">
              Any use of the Digital Rupee will be subject to applicable laws,
              regulatory approvals, banking infrastructure and the final legal
              structure of the investment platform. This is exploratory intent —
              not a live product claim.
            </p>

            <div className="mt-10 max-w-2xl rounded border border-border bg-paper p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-forest">
                Official reference
              </p>
              <h3 className="font-display mt-2 text-2xl tracking-tight text-ink">
                India&apos;s Digital Rupee (e₹)
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone">
                The Digital Rupee (e₹) is India&apos;s Central Bank Digital
                Currency (CBDC), issued by the Reserve Bank of India. For
                authoritative public information, see the RBI&apos;s official
                materials — not third-party summaries.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={siteConfig.digitalRupee.faqUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary focus-ring !min-h-11 !px-5 !text-sm"
                >
                  RBI Digital Rupee FAQs
                  <span aria-hidden>↗</span>
                </a>
                <a
                  href={siteConfig.digitalRupee.conceptNoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary focus-ring !min-h-11 !px-5 !text-sm"
                >
                  RBI CBDC concept note (PDF)
                  <span aria-hidden>↗</span>
                </a>
              </div>
              <p className="mt-4 text-xs text-stone">
                Links open the official Reserve Bank of India website / document
                library. FundForFounders is independent of the RBI and does not
                claim any partnership or endorsement.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad border-t border-border">
        <div className="container-site flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">
              Ready to participate?
            </h2>
            <p className="mt-2 text-stone">
              Join the network as a founder, investor or institution.
            </p>
          </div>
          <Link href="/join" className="btn-primary focus-ring">
            Join the Network
          </Link>
        </div>
      </section>
    </div>
  );
}
