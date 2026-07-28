import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Application received",
  robots: { index: false, follow: false },
};

export default function ApplicationReceivedPage() {
  return (
    <div className="min-h-[100svh] pt-[calc(3.5rem+env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <section className="px-4 py-10 sm:py-16">
        <div className="success-panel mx-auto max-w-md text-left sm:text-center">
          <div className="success-check mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-forest sm:mx-auto">
            <svg
              className="h-6 w-6 text-ivory"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="eyebrow">Founders</p>
          <h1 className="mt-3 text-[1.625rem] font-medium leading-snug tracking-tight text-ink sm:text-3xl">
            We received your application.
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone">
            Thank you for trusting us with your company. A human will review
            what you shared — not an auto-score.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-stone">
            If there is a fit for conversation or the early pipeline, we will
            write back. Submission does not guarantee selection or investment.
          </p>

          <ol className="mt-8 space-y-3 rounded-xl border border-border bg-paper p-4 text-left text-sm">
            <li className="flex gap-3">
              <span className="shrink-0 font-medium tabular-nums text-forest">
                01
              </span>
              <span className="text-stone">
                <strong className="font-medium text-ink">Confirmation</strong>
                {" — "}
                Check your inbox for a short acknowledgement.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-medium tabular-nums text-forest">
                02
              </span>
              <span className="text-stone">
                <strong className="font-medium text-ink">Review</strong>
                {" — "}
                We read for problem clarity, founder conviction, and fit.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 font-medium tabular-nums text-forest">
                03
              </span>
              <span className="text-stone">
                <strong className="font-medium text-ink">Next step</strong>
                {" — "}
                If relevant, a human conversation — never a cold blast.
              </span>
            </li>
          </ol>

          <div className="mt-10 flex flex-col gap-3 sm:items-center">
            <Link
              href="/thesis"
              className="btn-primary focus-ring min-h-12 w-full sm:w-auto"
            >
              Read our thesis
            </Link>
            <Link
              href="/founders"
              className="btn-secondary focus-ring min-h-12 w-full sm:w-auto"
            >
              Founder pathway
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
