import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function ThankYouPage({ searchParams }: Props) {
  const { from } = await searchParams;
  const isContact = from === "contact";

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
          <p className="eyebrow">{isContact ? "Contact" : "Partners"}</p>
          <h1 className="mt-3 text-[1.625rem] font-medium leading-snug tracking-tight text-ink sm:text-3xl">
            {isContact ? "Message received." : "Your interest is with us."}
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone">
            {isContact
              ? "We will respond if a follow-up is appropriate."
              : "We treat partnership interest with care. When there is something relevant to your seat — not a mass blast — we will be in touch."}
          </p>
          {!isContact && (
            <>
              <p className="mt-4 text-sm leading-relaxed text-stone">
                This is not an offer, solicitation, or commitment to invest.
              </p>
              <ul className="mt-8 space-y-2 rounded-xl border border-border bg-paper p-4 text-left text-sm text-stone">
                <li className="flex gap-2">
                  <span className="text-forest" aria-hidden>
                    ·
                  </span>
                  Profile recorded against your partner path
                </li>
                <li className="flex gap-2">
                  <span className="text-forest" aria-hidden>
                    ·
                  </span>
                  Follow-up only when the fit is real
                </li>
                <li className="flex gap-2">
                  <span className="text-forest" aria-hidden>
                    ·
                  </span>
                  No generic newsletter behaviour
                </li>
              </ul>
            </>
          )}
          <div className="mt-10 flex flex-col gap-3 sm:items-center">
            <Link
              href="/"
              className="btn-primary focus-ring min-h-12 w-full sm:w-auto"
            >
              Back to home
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
    </div>
  );
}
