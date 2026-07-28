import type { Metadata } from "next";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Join the Network",
  description:
    "Register as a founder, investor, LP, VC, institution or ecosystem partner with FundForFounders.",
};

type Props = {
  searchParams: Promise<{ type?: string }>;
};

export default async function JoinPage({ searchParams }: Props) {
  const params = await searchParams;
  const type = params.type ? decodeURIComponent(params.type) : undefined;

  return (
    <div className="pt-20 lg:pt-24">
      <section className="section-pad bg-ivory">
        <div className="container-site">
          <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
            <p className="eyebrow !text-gold">Join the Network</p>
            <h1 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Be part of what comes next.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-stone">
              Tell us how you would like to participate. We will share relevant
              launch updates, applications and partnership opportunities.
            </p>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-stone">
              {siteConfig.disclaimer}
            </p>
          </div>
          <RegistrationForm initialType={type} />
        </div>
      </section>
    </div>
  );
}
