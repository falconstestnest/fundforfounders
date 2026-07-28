import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the FundForFounders website.",
};

export default function TermsPage() {
  return (
    <div className="pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-[calc(4.25rem+env(safe-area-inset-top))]">
      <article className="section-pad">
        <div className="container-site max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="font-display mt-3 text-4xl tracking-tight md:text-5xl">
            Terms of Use
          </h1>
          <p className="mt-4 text-sm text-stone">Last updated: July 2026</p>

          <div className="mt-10 space-y-8 text-stone">
            <section>
              <h2 className="font-display text-2xl text-ink">Acceptance</h2>
              <p className="mt-3">
                By using this website you agree to these terms. If you do not
                agree, please do not use the site.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">
                Nature of the website
              </h2>
              <p className="mt-3">
                This is a pre-launch informational and registration website.{" "}
                {siteConfig.disclaimer}
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">No investment advice</h2>
              <p className="mt-3">
                Content on this site is for general information only. It is not
                financial, legal or investment advice. Nothing here is an offer
                or solicitation to buy or sell securities or fund interests.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">User submissions</h2>
              <p className="mt-3">
                You represent that information you submit is accurate and that
                you have the right to share it. Do not submit confidential
                material you are not authorised to disclose. Pitch decks and
                business information are shared at your own risk until formal
                data-room processes exist.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">
                Intellectual property
              </h2>
              <p className="mt-3">
                Site content, branding and design are owned by FundForFounders or
                its licensors. You may not copy or reuse them without permission,
                except for personal non-commercial viewing.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">Third-party links</h2>
              <p className="mt-3">
                Links to third-party sites (including official government or
                regulator pages) are provided for convenience. We do not control
                and are not responsible for their content or policies.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">Limitation of liability</h2>
              <p className="mt-3">
                To the fullest extent permitted by law, FundForFounders is not
                liable for any indirect or consequential loss arising from use of
                this website or reliance on its content.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">Changes</h2>
              <p className="mt-3">
                We may update these terms from time to time. Continued use after
                changes constitutes acceptance of the updated terms.
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl text-ink">Contact</h2>
              <p className="mt-3">
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
