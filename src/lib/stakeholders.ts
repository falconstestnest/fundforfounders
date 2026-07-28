export const STAKEHOLDER_TYPES = [
  "Founder",
  "Startup Team Member",
  "Angel Investor",
  "HNI",
  "Limited Partner",
  "Family Office",
  "Venture Capital Fund",
  "Fund of Funds",
  "International Investor",
  "Government Agency",
  "Public Institution",
  "Incubator",
  "Accelerator",
  "University",
  "Corporate Innovation Team",
  "Mentor",
  "Media",
  "Service Provider",
  "Ecosystem Partner",
  "Other",
] as const;

export type StakeholderType = (typeof STAKEHOLDER_TYPES)[number];

export type FieldGroup =
  | "common"
  | "founder"
  | "investor"
  | "lp"
  | "vc"
  | "fof"
  | "government"
  | "ecosystem"
  | "media";

const FOUNDER_TYPES: StakeholderType[] = ["Founder", "Startup Team Member"];
const INVESTOR_TYPES: StakeholderType[] = [
  "Angel Investor",
  "HNI",
  "International Investor",
];
const LP_TYPES: StakeholderType[] = ["Limited Partner", "Family Office"];
const VC_TYPES: StakeholderType[] = ["Venture Capital Fund"];
const FOF_TYPES: StakeholderType[] = ["Fund of Funds"];
const GOV_TYPES: StakeholderType[] = [
  "Government Agency",
  "Public Institution",
];
const ECOSYSTEM_TYPES: StakeholderType[] = [
  "Incubator",
  "Accelerator",
  "University",
  "Corporate Innovation Team",
  "Mentor",
  "Service Provider",
  "Ecosystem Partner",
];
const MEDIA_TYPES: StakeholderType[] = ["Media"];

export function fieldGroupFor(type: StakeholderType): FieldGroup {
  if (FOUNDER_TYPES.includes(type)) return "founder";
  if (INVESTOR_TYPES.includes(type)) return "investor";
  if (LP_TYPES.includes(type)) return "lp";
  if (VC_TYPES.includes(type)) return "vc";
  if (FOF_TYPES.includes(type)) return "fof";
  if (GOV_TYPES.includes(type)) return "government";
  if (ECOSYSTEM_TYPES.includes(type)) return "ecosystem";
  if (MEDIA_TYPES.includes(type)) return "media";
  return "common";
}

/** Homepage stakeholder cards → preselected form types */
export const HOMEPAGE_CARDS = [
  {
    title: "Founders",
    description:
      "Build something the world needs. Apply to join the early pipeline.",
    type: "Founder" as StakeholderType,
    href: "/join?type=Founder",
  },
  {
    title: "Investors",
    description:
      "Discover curated startups, pitch sessions and network opportunities.",
    type: "Angel Investor" as StakeholderType,
    href: "/join?type=Angel%20Investor",
  },
  {
    title: "Limited Partners",
    description:
      "Follow the formation of a future founder-first investment platform.",
    type: "Limited Partner" as StakeholderType,
    href: "/join?type=Limited%20Partner",
  },
  {
    title: "Global VCs",
    description:
      "Access regional founders, emerging sectors and partnership opportunities.",
    type: "Venture Capital Fund" as StakeholderType,
    href: "/join?type=Venture%20Capital%20Fund",
  },
  {
    title: "Government and Institutions",
    description:
      "Partner on ecosystem building, events and regional startup missions.",
    type: "Government Agency" as StakeholderType,
    href: "/join?type=Government%20Agency",
  },
  {
    title: "Funds of Funds",
    description:
      "Register institutional interest in an emerging investment manager.",
    type: "Fund of Funds" as StakeholderType,
    href: "/join?type=Fund%20of%20Funds",
  },
] as const;

export const STAGES = [
  "Idea",
  "Pre-seed",
  "Seed",
  "Series A+",
  "Growth",
  "Other",
] as const;

export const SECTORS = [
  "Technology / AI",
  "Consumer brands",
  "Retail",
  "Food and beverage",
  "Agriculture",
  "Manufacturing",
  "Logistics",
  "Healthcare",
  "Education",
  "Hospitality",
  "Climate",
  "Financial services",
  "Traditional sector reinvention",
  "Other",
] as const;

export const HOW_HEARD = [
  "LinkedIn",
  "Referral",
  "Podcast",
  "Event",
  "Search",
  "Press",
  "Government / ecosystem partner",
  "Other",
] as const;

export const HIGH_PRIORITY_TYPES: StakeholderType[] = [
  "Limited Partner",
  "Family Office",
  "Venture Capital Fund",
  "Fund of Funds",
  "Government Agency",
  "International Investor",
];
