import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact FundForFounders for press, partnerships and general enquiries.",
};

export default function ContactPage() {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Contact</p>
            <h1 className="font-display mt-4 text-4xl tracking-tight md:text-5xl">
              Get in touch.
            </h1>
            <p className="prose-measure mt-5 text-lg text-stone">
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
