import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for FundForFounders website registrations and communications.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-[calc(4.25rem+env(safe-area-inset-top))]">
      <article className="section-pad">
        <div className="container-site max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="font-display mt-3 text-4xl tracking-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-stone">Last updated: July 2026</p>

          <div className="mt-10 space-y-8 text-stone">
            <section>
              <h2 className="font-display text-2xl text-ink">Who we are</h2>
              <p className="mt-3">
                {siteConfig.name} (&quot;we&quot;, &quot;us&quot;) operates this
                pre-launch website to introduce the initiative and collect
                structured expressions of interest from founders, investors and
                ecosystem partners.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">
                Information we collect
              </h2>
              <p className="mt-3">
                When you submit a form, we may collect your name, email, phone,
                location, organisation, stakeholder type, professional profile
                links and any information you choose to share about your company
                or investment interests. We may also collect technical data such
                as browser type, approximate location and referral source for
                security and analytics.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">
                How we use information
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>To respond to registrations and enquiries</li>
                <li>To segment stakeholders and share relevant updates</li>
                <li>To improve the website and prevent abuse</li>
                <li>To prepare for future product and fund operations (where lawful)</li>
              </ul>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">Legal basis</h2>
              <p className="mt-3">
                We process personal data based on your consent (form
                submission), our legitimate interests in building a professional
                network, and any legal obligations that apply.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">Sharing</h2>
              <p className="mt-3">
                We use service providers for hosting, email delivery and
                analytics. We do not sell your personal data. We may share
                information if required by law or to protect rights and safety.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">Retention</h2>
              <p className="mt-3">
                We retain registration data for as long as needed to manage the
                pre-launch network and related communications, or until you
                request deletion where applicable.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">Your rights</h2>
              <p className="mt-3">
                Depending on your location, you may have rights to access,
                correct, delete or restrict processing of your personal data, and
                to withdraw consent. Contact{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-forest underline"
                >
                  {siteConfig.email}
                </a>
                .
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">Contact</h2>
              <p className="mt-3">
                Privacy questions:{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-forest underline"
                >
                  {siteConfig.email}
                </a>
              </p>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}
