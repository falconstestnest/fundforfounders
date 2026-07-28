import type { Metadata } from "next";
import { RegistrationForm } from "@/components/RegistrationForm";
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
      <section className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Join the Network</p>
            <h1 className="font-display mt-4 text-4xl leading-[1.05] tracking-tight md:text-5xl">
              Be part of what comes next.
            </h1>
            <p className="prose-measure mt-5 text-lg text-stone">
              Tell us how you would like to participate. We will share relevant
              launch updates, applications and partnership opportunities.
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-stone">
              {siteConfig.disclaimer}
            </p>
          </div>
          <div className="lg:col-span-7">
            <RegistrationForm initialType={type} />
          </div>
        </div>
      </section>
    </div>
  );
}
