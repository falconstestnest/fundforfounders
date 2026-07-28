import { siteConfig } from "@/lib/config";
import {
  HIGH_PRIORITY_TYPES,
  type StakeholderType,
} from "@/lib/registration-schema";
import { templateIdForStakeholder, type EmailTemplateId } from "./catalog";

export type RegistrationPayload = Record<string, unknown> & {
  fullName: string;
  email: string;
  mobile: string;
  country: string;
  city: string;
  stakeholderType: StakeholderType;
  organisation?: string;
  designation?: string;
  linkedin?: string;
  howHeard?: string;
  message?: string;
  consent?: boolean;
  pitchDeckFileName?: string;
  pitchDeckFilename?: string;
  startupName?: string;
  sector?: string;
  stage?: string;
  businessSummary?: string;
  problem?: string;
};
import {
  detailTable,
  emailLayout,
  escapeHtml,
  firstName,
  mutedParagraph,
  paragraph,
} from "./layout";

export type BuiltEmail = {
  id: EmailTemplateId;
  subject: string;
  html: string;
  text: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function registrationCopy(type: StakeholderType): {
  eyebrow: string;
  title: (name: string) => string;
  body: string[];
  ctaLabel: string;
  ctaHref: string;
  subject: string;
} {
  const name = (n: string) => n;
  switch (templateIdForStakeholder(type)) {
    case "user_registration_founder":
      return {
        eyebrow: "Founder application",
        title: (n) => `Thank you, ${name(n)}.`,
        body: [
          "We received your application to join the FundForFounders early pipeline.",
          "Our team will review your submission carefully. If there is a fit for conversation, pitch pathways or future pipeline, we will be in touch.",
          "Submission does not guarantee selection or investment.",
        ],
        ctaLabel: "Read how we work with founders",
        ctaHref: `${siteConfig.url}/founders`,
        subject: "We received your founder application — FundForFounders",
      };
    case "user_registration_investor":
      return {
        eyebrow: "Investor network",
        title: (n) => `Welcome, ${name(n)}.`,
        body: [
          "You are on the FundForFounders investor network list.",
          "We will share relevant launch updates, pitch sessions and partnership opportunities as the network takes shape — subject to eligibility and documentation.",
          "This is not an offer to invest or a solicitation of capital.",
        ],
        ctaLabel: "Explore the investor page",
        ctaHref: `${siteConfig.url}/investors`,
        subject: "You're on the investor network list — FundForFounders",
      };
    case "user_registration_lp":
      return {
        eyebrow: "LP interest",
        title: (n) => `Thank you, ${name(n)}.`,
        body: [
          "We received your expression of LP / family office interest in FundForFounders.",
          "As the platform forms, we will share institutional updates appropriate to your mandate — never as an offer of securities until formally approved.",
          "Registration is not a commitment to invest or an allocation of fund interests.",
        ],
        ctaLabel: "Read our investment thesis",
        ctaHref: `${siteConfig.url}/thesis`,
        subject: "LP interest received — FundForFounders",
      };
    case "user_registration_vc":
      return {
        eyebrow: "Partnership interest",
        title: (n) => `Thank you, ${name(n)}.`,
        body: [
          "We received your Venture Capital Fund partnership interest.",
          "We will follow up on deal-flow collaboration, co-investment dialogue and regional founder access as the network launches.",
        ],
        ctaLabel: "For investors",
        ctaHref: `${siteConfig.url}/investors`,
        subject: "Partnership interest received — FundForFounders",
      };
    case "user_registration_fof":
      return {
        eyebrow: "Institutional interest",
        title: (n) => `Thank you, ${name(n)}.`,
        body: [
          "We received your Fund of Funds institutional interest.",
          "We will share updates on manager formation, thesis and governance materials when they are ready for institutional review.",
        ],
        ctaLabel: "Read our thesis",
        ctaHref: `${siteConfig.url}/thesis`,
        subject: "Institutional interest received — FundForFounders",
      };
    case "user_registration_government":
      return {
        eyebrow: "Institutional connection",
        title: (n) => `Thank you, ${name(n)}.`,
        body: [
          "We received your government / public institution connection request.",
          "We welcome dialogue on ecosystem building, events and startup missions as FundForFounders develops.",
        ],
        ctaLabel: "Visit FundForFounders",
        ctaHref: siteConfig.url,
        subject: "Institutional connection received — FundForFounders",
      };
    case "user_registration_ecosystem":
      return {
        eyebrow: "Ecosystem partnership",
        title: (n) => `Thank you, ${name(n)}.`,
        body: [
          "We received your interest in partnering as an ecosystem organisation.",
          "We will share relevant opportunities for referrals, events and regional collaboration.",
        ],
        ctaLabel: "Join the network",
        ctaHref: `${siteConfig.url}/join`,
        subject: "Ecosystem partnership interest received — FundForFounders",
      };
    case "user_registration_media":
      return {
        eyebrow: "Media list",
        title: (n) => `Thank you, ${name(n)}.`,
        body: [
          "You are on the FundForFounders media list.",
          "We will share press updates, podcast launches and story opportunities as they go live.",
        ],
        ctaLabel: "Podcast page",
        ctaHref: `${siteConfig.url}/podcast`,
        subject: "You're on the media list — FundForFounders",
      };
    default:
      return {
        eyebrow: "Registration",
        title: (n) => `Thank you, ${name(n)}.`,
        body: [
          "We received your registration with FundForFounders.",
          "We will share relevant launch updates based on how you asked to participate.",
        ],
        ctaLabel: "Visit FundForFounders",
        ctaHref: siteConfig.url,
        subject: "We received your registration — FundForFounders",
      };
  }
}

export function buildUserRegistrationEmail(
  data: RegistrationPayload,
): BuiltEmail {
  const fn = firstName(data.fullName);
  const copy = registrationCopy(data.stakeholderType);
  const id = templateIdForStakeholder(data.stakeholderType);

  const bodyHtml = [
    ...copy.body.map((p) => paragraph(escapeHtml(p))),
    mutedParagraph(
      `Registered as: <strong style="color:#1B1916;">${escapeHtml(data.stakeholderType)}</strong>`,
    ),
  ].join("");

  const html = emailLayout({
    preheader: copy.body[0],
    eyebrow: copy.eyebrow,
    title: copy.title(fn),
    bodyHtml,
    cta: { label: copy.ctaLabel, href: copy.ctaHref },
    footerNote: escapeHtml(siteConfig.disclaimer),
  });

  return {
    id,
    subject: copy.subject,
    html,
    text: stripHtml(html),
  };
}

export function buildInternalRegistrationEmail(
  data: RegistrationPayload,
): BuiltEmail {
  const priority = HIGH_PRIORITY_TYPES.includes(data.stakeholderType);
  const id: EmailTemplateId = priority
    ? "internal_registration_priority"
    : "internal_registration";

  const detailMap: Array<{
    label: string;
    value: string | boolean | null | undefined;
  }> = [
    { label: "Name", value: data.fullName },
    { label: "Email", value: data.email },
    { label: "Mobile", value: data.mobile },
    { label: "Country", value: data.country },
    { label: "City", value: data.city },
    { label: "Organisation", value: data.organisation },
    { label: "Designation", value: data.designation },
    { label: "LinkedIn", value: data.linkedin },
    { label: "Type", value: data.stakeholderType },
    { label: "How heard", value: data.howHeard },
    { label: "Message", value: data.message },
    {
      label: "Pitch deck",
      value: data.pitchDeckFileName || data.pitchDeckFilename,
    },
  ];

  // Include remaining string/boolean fields
  for (const [key, value] of Object.entries(data)) {
    if (
      [
        "fullName",
        "email",
        "mobile",
        "country",
        "city",
        "organisation",
        "designation",
        "linkedin",
        "stakeholderType",
        "howHeard",
        "message",
        "consent",
        "websiteHoneypot",
        "pitchDeck",
        "pitchDeckFileName",
        "pitchDeckFilename",
      ].includes(key)
    ) {
      continue;
    }
    if (typeof value === "string" || typeof value === "boolean") {
      detailMap.push({ label: key, value });
    }
  }

  const bodyHtml = [
    paragraph(
      priority
        ? "A <strong>high-priority</strong> registration was submitted on the website."
        : "A new registration was submitted on the website.",
    ),
    detailTable(detailMap),
    mutedParagraph("Reply directly to this email to respond to the lead."),
  ].join("");

  const html = emailLayout({
    preheader: `${data.stakeholderType} — ${data.fullName}`,
    eyebrow: "New registration",
    title: `${data.stakeholderType}`,
    bodyHtml,
    priority,
    cta: {
      label: "Open admin leads",
      href: `${siteConfig.url}/admin/leads`,
    },
  });

  const prefix = priority ? "[Priority] " : "";
  return {
    id,
    subject: `${prefix}FFF registration: ${data.stakeholderType} — ${data.fullName}`,
    html,
    text: stripHtml(html),
  };
}

export function buildUserContactEmail(data: {
  fullName: string;
  email: string;
  organisation?: string;
  message: string;
}): BuiltEmail {
  const fn = firstName(data.fullName);
  const html = emailLayout({
    preheader: "We received your message to FundForFounders.",
    eyebrow: "Contact",
    title: `Message received, ${fn}.`,
    bodyHtml: [
      paragraph(
        "Thank you for writing to FundForFounders. We have received your message and will respond if a follow-up is appropriate.",
      ),
      mutedParagraph(
        "If your enquiry is urgent, you can also email us directly at the address in the footer.",
      ),
    ].join(""),
    cta: { label: "Visit the website", href: siteConfig.url },
  });

  return {
    id: "user_contact_received",
    subject: "We received your message — FundForFounders",
    html,
    text: stripHtml(html),
  };
}

export function buildInternalContactEmail(data: {
  fullName: string;
  email: string;
  organisation?: string;
  message: string;
}): BuiltEmail {
  const bodyHtml = [
    paragraph("A new contact form message was submitted."),
    detailTable([
      { label: "Name", value: data.fullName },
      { label: "Email", value: data.email },
      { label: "Organisation", value: data.organisation },
      { label: "Message", value: data.message },
    ]),
  ].join("");

  const html = emailLayout({
    preheader: `Contact from ${data.fullName}`,
    eyebrow: "Contact form",
    title: data.fullName,
    bodyHtml,
    cta: {
      label: "Reply to sender",
      href: `mailto:${data.email}`,
    },
  });

  return {
    id: "internal_contact",
    subject: `FFF contact: ${data.fullName}`,
    html,
    text: stripHtml(html),
  };
}

/** Sample payloads for design QA / test sends */
export function sampleRegistration(
  type: StakeholderType,
): RegistrationPayload {
  return {
    fullName: "Jimmy Manalel",
    email: "jimmymanalelru@gmail.com",
    mobile: "+91 90000 00000",
    country: "India",
    city: "Kochi",
    organisation: "FundForFounders Demo",
    designation: "Founder",
    linkedin: "https://linkedin.com/in/example",
    stakeholderType: type,
    howHeard: "Referral",
    message: "This is a design test of the FundForFounders email system.",
    consent: true,
    startupName: type.includes("Founder") || type === "Startup Team Member"
      ? "Demo Startup"
      : undefined,
    sector: "Technology / AI",
    stage: "Pre-seed",
    businessSummary:
      "Demo business summary for email template testing purposes only.",
    problem: "Meaningful problem description for template preview.",
  };
}
