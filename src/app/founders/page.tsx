import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "For Founders",
  description:
    "Apply to join the FundForFounders early pipeline — founder-first conversations, pitch pathways and long-term partnership intent.",
};

const process = [
  {
    title: "Submit profile",
    body: "Share your company, stage and the problem you are solving.",
  },
  {
    title: "Initial review",
    body: "We review for fit with conviction, market insight and clarity.",
  },
  {
    title: "Founder conversation",
    body: "A human conversation — not a form auto-score.",
  },
  {
    title: "Pitch or deeper evaluation",
    body: "Where relevant, pitch sessions or deeper diligence follow.",
  },
  {
    title: "Due diligence",
    body: "Structured evaluation when mutual interest is clear.",
  },
  {
    title: "Investment, introduction or pipeline",
    body: "Outcomes may include investment interest, introductions or future pipeline — never a guarantee.",
  },
];

const faqs = [
  {
    q: "Do I need to be a technology company?",
    a: "No. We are open to technology and non-technology businesses with category-defining ambition.",
  },
  {
    q: "What stages do you consider?",
    a: "Idea through early growth — especially pre-seed and seed — with openness to exceptional later-stage founders where the relationship fits.",
  },
  {
    q: "Is geography limited to India?",
    a: "Primary market is India (including Kerala and other regions), with openness to international founders where the network can be useful.",
  },
  {
    q: "Does applying mean I will receive investment?",
    a: "No. Submission does not guarantee selection or investment. FundForFounders is still under development.",
  },
];

export default function FoundersPage() {
  return (
    <div className="pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-[calc(4.25rem+env(safe-area-inset-top))]">
      <section className="section-pad !pb-10">
        <div className="container-site">
          <p className="eyebrow">For Founders</p>
          <h1 className="mt-4 max-w-[14ch] text-[1.875rem] font-medium leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
            Build something the world needs.
          </h1>
          <p className="prose-measure mt-5 text-[0.9375rem] leading-relaxed text-stone sm:mt-6 sm:text-lg md:text-xl">
            FundForFounders is creating an early pipeline for ambitious founders
            — with clarity before any cheque, and a long-term partnership mindset
            after alignment.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
            <Link
              href="/join?type=Founder"
              className="btn-primary focus-ring min-h-12 w-full sm:w-auto"
            >
              Start your application
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
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <FadeIn>
            <h2 className="font-display text-3xl tracking-tight">
              Who should apply
            </h2>
            <ul className="mt-6 space-y-3 text-stone">
              <li>• Idea-stage founders with sharp problem insight</li>
              <li>• Teams building early traction</li>
              <li>• Pre-seed and seed raises</li>
              <li>• Technology and non-technology businesses</li>
              <li>• Founders in Kerala, India or international markets</li>
              <li>• Those interested in pitch competitions or ecosystem support</li>
            </ul>
          </FadeIn>
          <FadeIn delay={80}>
            <h2 className="font-display text-3xl tracking-tight">
              What we evaluate
            </h2>
            <ul className="mt-6 space-y-3 text-stone">
              <li>• Meaningful problem and customer love</li>
              <li>• Founder conviction and market insight</li>
              <li>• Differentiation and path to scale</li>
              <li>• Operational strength and long-term potential</li>
              <li>• Positive economic, social or environmental contribution</li>
            </ul>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <FadeIn>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              Application process
            </h2>
            <p className="prose-measure mt-4 text-stone">
              Submission does not guarantee selection or investment.
            </p>
          </FadeIn>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {process.map((step, i) => (
              <FadeIn key={step.title} delay={i * 40}>
                <li className="h-full rounded border border-border bg-paper p-6">
                  <span className="text-xs font-semibold tabular-nums text-forest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-xl">{step.title}</h3>
                  <p className="mt-2 text-sm text-stone">{step.body}</p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad border-t border-border bg-ink text-ivory">
        <div className="container-site max-w-3xl">
          <FadeIn>
            <h2 className="font-display text-3xl tracking-tight text-white">
              Clear before the cheque. Committed after it.
            </h2>
            <p className="mt-5 text-lg text-white/60">
              Difficult conversations on valuation, governance, ownership and
              expectations should happen before an investment is signed. Once
              aligned, our ambition is to remain useful partners through growth,
              setbacks and future rounds.
            </p>
            <Link
              href="/join?type=Founder"
              className="btn-primary focus-ring mt-8 min-h-12 w-full sm:w-auto"
            >
              Apply as a Founder
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site max-w-3xl">
          <h2 className="font-display text-3xl tracking-tight">Founder FAQ</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="accordion px-5 py-4">
                <summary className="focus-ring rounded font-medium text-ink">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="accordion-icon text-moss" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <div className="accordion-body">
                  <div className="accordion-body-inner">
                    <p className="mt-3 pb-1 text-sm leading-relaxed text-stone">
                      {f.a}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
