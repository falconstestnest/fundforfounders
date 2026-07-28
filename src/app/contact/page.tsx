import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact FundForFounders for press, partnerships and general enquiries.",
};

export default function ContactPage() {
  return (
    <div className="pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-[calc(4.25rem+env(safe-area-inset-top))]">
      <section className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-4 text-[1.875rem] font-medium tracking-tight text-ink sm:text-4xl md:text-5xl">
              Get in touch.
            </h1>
            <p className="prose-measure mt-5 text-[0.9375rem] leading-relaxed text-stone sm:text-lg">
              For press, institutional introductions, partnerships or general
              questions — write to us.
            </p>
            <p className="mt-6 text-sm text-stone">
              Email:{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-forest underline"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
