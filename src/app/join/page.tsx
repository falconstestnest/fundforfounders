import type { Metadata } from "next";
import NetworkJourney from "@/components/journey/NetworkJourney";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Apply as a founder or register as an investor, LP, VC, or institution — progressive journey, not a bulk form.",
};

type Props = {
  searchParams: Promise<{ type?: string }>;
};

export default async function JoinPage({ searchParams }: Props) {
  const params = await searchParams;
  const type = params.type ? decodeURIComponent(params.type) : undefined;

  return (
    <div className="min-h-[100svh] pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-[calc(4.25rem+env(safe-area-inset-top))]">
      <section className="px-0 py-6 sm:py-10 md:py-14">
        <div className="container-site">
          <NetworkJourney initialType={type} />
        </div>
      </section>
    </div>
  );
}
