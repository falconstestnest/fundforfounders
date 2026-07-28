import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Application Received",
  robots: { index: false, follow: false },
};

export default function ApplicationReceivedPage() {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="section-pad">
        <div className="success-panel container-site max-w-2xl text-center">
          <div className="success-check mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-forest">
            <svg
              className="h-7 w-7 text-ivory"
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
          <h1 className="font-display mt-4 text-4xl tracking-tight md:text-5xl">
            Application received.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-stone">
            Thank you for sharing your company with FundForFounders. Our team
            will review your submission. Submission does not guarantee selection
            or investment.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/founders" className="btn-primary focus-ring">
              Founder resources
            </Link>
            <Link href="/thesis" className="btn-secondary focus-ring">
              Our thesis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
