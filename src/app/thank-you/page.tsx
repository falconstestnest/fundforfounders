import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function ThankYouPage({ searchParams }: Props) {
  const { from } = await searchParams;
  const isContact = from === "contact";

  return (
    <div className="pt-20 lg:pt-24">
      <section className="section-pad">
        <div className="container-site max-w-2xl text-center">
          <p className="eyebrow justify-center">Received</p>
          <h1 className="font-display mt-4 text-4xl tracking-tight md:text-5xl">
            {isContact ? "Message received." : "Thank you for registering."}
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-stone">
            {isContact
              ? "We will respond if a follow-up is appropriate."
              : "We will share relevant launch updates and opportunities based on how you asked to participate."}
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm text-stone">
            This is not an offer to invest or a commitment of capital.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary focus-ring">
              Back to home
            </Link>
            <Link href="/thesis" className="btn-secondary focus-ring">
              Read our thesis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
