import type { Metadata } from "next";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Join the network",
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
      <section className="border-b border-border py-16 md:py-24">
        <div className="container-site max-w-3xl">
          {!type && (
            <div className="mb-2">
              <p className="text-sm leading-relaxed text-stone">
                {siteConfig.disclaimer}
              </p>
            </div>
          )}
          {type && (
            <div className="mb-10">
              <p className="eyebrow">Join the network</p>
              <h1 className="mt-3 text-3xl font-medium tracking-tight text-ink md:text-4xl">
                Be part of what comes next.
              </h1>
              <p className="mt-4 max-w-xl text-stone">
                You selected <span className="text-ink font-medium">{type}</span>.
                Complete the form below.
              </p>
            </div>
          )}
          <RegistrationForm initialType={type} />
        </div>
      </section>
    </div>
  );
}
