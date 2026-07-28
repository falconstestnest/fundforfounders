import type { StakeholderType } from "@/lib/registration-schema";

/**
 * Complete transactional email catalog for FundForFounders.
 * Design: ivory / ink / forest green — matches live site.
 */

export type EmailAudience = "user" | "internal";

export type EmailTemplateId =
  | "user_registration_founder"
  | "user_registration_investor"
  | "user_registration_lp"
  | "user_registration_vc"
  | "user_registration_fof"
  | "user_registration_government"
  | "user_registration_ecosystem"
  | "user_registration_media"
  | "user_registration_generic"
  | "user_contact_received"
  | "internal_registration"
  | "internal_registration_priority"
  | "internal_contact";

export type EmailCatalogEntry = {
  id: EmailTemplateId;
  name: string;
  audience: EmailAudience;
  purpose: string;
  when: string;
  subjectExample: string;
  stakeholderTypes?: StakeholderType[];
};

export const EMAIL_CATALOG: EmailCatalogEntry[] = [
  {
    id: "user_registration_founder",
    name: "Founder registration confirmation",
    audience: "user",
    purpose: "Confirm founder / startup team application was received",
    when: "After Join form submit as Founder or Startup Team Member",
    subjectExample: "We received your founder application — FundForFounders",
    stakeholderTypes: ["Founder", "Startup Team Member"],
  },
  {
    id: "user_registration_investor",
    name: "Investor network confirmation",
    audience: "user",
    purpose: "Confirm angel / HNI / international investor interest",
    when: "After Join form as Angel Investor, HNI, or International Investor",
    subjectExample: "You're on the investor network list — FundForFounders",
    stakeholderTypes: ["Angel Investor", "HNI", "International Investor"],
  },
  {
    id: "user_registration_lp",
    name: "LP / family office confirmation",
    audience: "user",
    purpose: "Confirm LP or family office expression of interest",
    when: "After Join form as Limited Partner or Family Office",
    subjectExample: "LP interest received — FundForFounders",
    stakeholderTypes: ["Limited Partner", "Family Office"],
  },
  {
    id: "user_registration_vc",
    name: "VC partnership confirmation",
    audience: "user",
    purpose: "Confirm VC fund partnership interest",
    when: "After Join form as Venture Capital Fund",
    subjectExample: "Partnership interest received — FundForFounders",
    stakeholderTypes: ["Venture Capital Fund"],
  },
  {
    id: "user_registration_fof",
    name: "Fund of funds confirmation",
    audience: "user",
    purpose: "Confirm institutional FoF interest",
    when: "After Join form as Fund of Funds",
    subjectExample: "Institutional interest received — FundForFounders",
    stakeholderTypes: ["Fund of Funds"],
  },
  {
    id: "user_registration_government",
    name: "Institution / government confirmation",
    audience: "user",
    purpose: "Confirm government or public institution connection",
    when: "After Join form as Government Agency or Public Institution",
    subjectExample: "Institutional connection received — FundForFounders",
    stakeholderTypes: ["Government Agency", "Public Institution"],
  },
  {
    id: "user_registration_ecosystem",
    name: "Ecosystem partner confirmation",
    audience: "user",
    purpose: "Confirm incubator, university, mentor, or partner interest",
    when: "After Join form as ecosystem-related types",
    subjectExample: "Ecosystem partnership interest received — FundForFounders",
    stakeholderTypes: [
      "Incubator",
      "Accelerator",
      "University",
      "Corporate Innovation Team",
      "Mentor",
      "Service Provider",
      "Ecosystem Partner",
    ],
  },
  {
    id: "user_registration_media",
    name: "Media list confirmation",
    audience: "user",
    purpose: "Confirm press / media list signup",
    when: "After Join form as Media",
    subjectExample: "You're on the media list — FundForFounders",
    stakeholderTypes: ["Media"],
  },
  {
    id: "user_registration_generic",
    name: "General registration confirmation",
    audience: "user",
    purpose: "Fallback confirmation for Other / unmapped types",
    when: "After Join form as Other",
    subjectExample: "We received your registration — FundForFounders",
    stakeholderTypes: ["Other"],
  },
  {
    id: "user_contact_received",
    name: "Contact form confirmation",
    audience: "user",
    purpose: "Confirm a contact enquiry was received",
    when: "After Contact form submit",
    subjectExample: "We received your message — FundForFounders",
  },
  {
    id: "internal_registration",
    name: "Internal: new registration",
    audience: "internal",
    purpose: "Notify team of a new lead with full field dump",
    when: "Every successful Join form submit (non-priority types)",
    subjectExample: "FFF registration: Founder — Jane Doe",
  },
  {
    id: "internal_registration_priority",
    name: "Internal: priority registration",
    audience: "internal",
    purpose: "High-visibility alert for LP, FoF, VC, Government, International",
    when: "Join form for priority stakeholder types",
    subjectExample: "[Priority] FFF registration: Limited Partner — Jane Doe",
  },
  {
    id: "internal_contact",
    name: "Internal: contact enquiry",
    audience: "internal",
    purpose: "Notify team of a contact form message",
    when: "Every successful Contact form submit",
    subjectExample: "FFF contact: Jane Doe",
  },
];

export function templateIdForStakeholder(
  type: StakeholderType,
): Exclude<
  EmailTemplateId,
  | "user_contact_received"
  | "internal_registration"
  | "internal_registration_priority"
  | "internal_contact"
> {
  for (const entry of EMAIL_CATALOG) {
    if (
      entry.audience === "user" &&
      entry.stakeholderTypes?.includes(type) &&
      entry.id.startsWith("user_registration_")
    ) {
      return entry.id as ReturnType<typeof templateIdForStakeholder>;
    }
  }
  return "user_registration_generic";
}
