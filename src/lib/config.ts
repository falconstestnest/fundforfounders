export const siteConfig = {
  name: "FundForFounders",
  tagline: "Finding founders before the world sees their potential.",
  brandPromise: "Clear before the cheque. Committed after it.",
  description:
    "A founder-first investment network connecting ambitious builders with serious capital and long-term partners.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://fundforfounders.com",
  email: process.env.CONTACT_EMAIL || "hello@fundforfounders.com",
  internalEmail:
    process.env.INTERNAL_NOTIFY_EMAIL ||
    process.env.CONTACT_EMAIL ||
    "hello@fundforfounders.com",
  fromEmail:
    process.env.RESEND_FROM_EMAIL || "FundForFounders <onboarding@resend.dev>",
  podcastTitle: "The Story Behind the Cheque",
  social: {
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ||
      "https://www.linkedin.com/company/fund-for-founder",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com",
  },
  /** Official RBI Digital Rupee (e₹ / CBDC) public information */
  digitalRupee: {
    name: "Digital Rupee (e₹) — Reserve Bank of India",
    faqUrl:
      "https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3686",
    conceptNoteUrl:
      "https://rbidocs.rbi.org.in/rdocs/PublicationReport/Pdfs/CONCEPTNOTEACB531172E0B4DFC9A6E506C2C24FFB6.PDF",
    rbiHome: "https://www.rbi.org.in/",
  },
  disclaimer:
    "FundForFounders is currently under development. Nothing on this website constitutes an offer, solicitation, investment recommendation or commitment to invest.",
} as const;

/** Minimal primary nav — Join is the header CTA */
export const navLinks = [
  { href: "/thesis", label: "Thesis" },
  { href: "/founders", label: "Founders" },
  { href: "/investors", label: "Investors" },
  { href: "/podcast", label: "Podcast" },
] as const;

export const mobileNavLinks = [
  { href: "/", label: "Home" },
  { href: "/thesis", label: "Our Thesis" },
  { href: "/podcast", label: "Podcast" },
  { href: "/founders", label: "For Founders" },
  { href: "/investors", label: "For Investors" },
  { href: "/join", label: "Join the Network" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;
