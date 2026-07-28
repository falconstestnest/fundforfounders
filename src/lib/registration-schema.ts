import { z } from "zod";

export const stakeholderTypes = [
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

export type StakeholderType = (typeof stakeholderTypes)[number];

export const HIGH_PRIORITY_TYPES: StakeholderType[] = [
  "Limited Partner",
  "Family Office",
  "Venture Capital Fund",
  "Fund of Funds",
  "Government Agency",
  "International Investor",
];

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (v) => !v || v === "" || /^https?:\/\/.+/i.test(v),
    "Please enter a valid URL",
  );

// Common fields for everyone
const commonSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Valid email is required"),
  mobile: z.string().trim().min(8, "Mobile number is required"),
  country: z.string().trim().min(2, "Country is required"),
  city: z.string().trim().min(2, "City is required"),
  organisation: z.string().trim().optional().or(z.literal("")),
  linkedin: optionalUrl,
  howHeard: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, {
    message: "You must agree to the privacy policy",
  }),
  // Honeypot — must stay empty
  websiteHoneypot: z.string().optional().or(z.literal("")),
});

// Founder-specific
const founderSchema = z.object({
  startupName: z.string().trim().min(2, "Startup name is required"),
  website: optionalUrl,
  sector: z.string().trim().min(1, "Sector is required"),
  stage: z.enum(["Idea", "Pre-seed", "Seed", "Series A+", "Other"], {
    message: "Please select a stage",
  }),
  foundedYear: z.string().trim().optional().or(z.literal("")),
  teamSize: z.string().trim().optional().or(z.literal("")),
  businessSummary: z
    .string()
    .trim()
    .min(30, "Please write at least 30 characters"),
  problem: z.string().trim().min(20, "Please describe the problem"),
  traction: z.string().trim().optional().or(z.literal("")),
  revenueRange: z.string().trim().optional().or(z.literal("")),
  fundingRequired: z.string().trim().optional().or(z.literal("")),
  previousFunding: z.string().trim().optional().or(z.literal("")),
  pitchDeck: z.any().optional(),
  interestedInPitchCompetition: z.boolean().optional(),
  interestedInPodcast: z.boolean().optional(),
});

// Investor (Angel / HNI / International)
const investorSchema = z.object({
  chequeSize: z.string().trim().optional().or(z.literal("")),
  preferredStage: z.string().trim().optional().or(z.literal("")),
  preferredSectors: z.string().trim().optional().or(z.literal("")),
  preferredGeography: z.string().trim().optional().or(z.literal("")),
  pastInvestments: z.string().trim().optional().or(z.literal("")),
  interestedInPitchPanels: z.boolean().optional(),
  interestedInPodcast: z.boolean().optional(),
  interestedInCoInvest: z.boolean().optional(),
});

// LP / Family Office
const lpSchema = z.object({
  capitalRange: z.string().trim().optional().or(z.literal("")),
  commitmentRange: z.string().trim().optional().or(z.literal("")),
  preferredFundStages: z.string().trim().optional().or(z.literal("")),
  geographicMandate: z.string().trim().optional().or(z.literal("")),
  sectorInterests: z.string().trim().optional().or(z.literal("")),
  emergingManagerInterest: z.boolean().optional(),
  coInvestmentInterest: z.boolean().optional(),
});

// VC Fund
const vcSchema = z.object({
  fundName: z.string().trim().min(2, "Fund name is required"),
  fundSizeRange: z.string().trim().optional().or(z.literal("")),
  fundVintage: z.string().trim().optional().or(z.literal("")),
  investmentStages: z.string().trim().optional().or(z.literal("")),
  sectors: z.string().trim().optional().or(z.literal("")),
  geographies: z.string().trim().optional().or(z.literal("")),
  typicalCheque: z.string().trim().optional().or(z.literal("")),
  coInvestmentInterest: z.boolean().optional(),
  dealFlowPartnership: z.boolean().optional(),
  website: optionalUrl,
});

// Fund of Funds
const fofSchema = z.object({
  mandate: z.string().trim().optional().or(z.literal("")),
  preferredFundStage: z.string().trim().optional().or(z.literal("")),
  minCommitment: z.string().trim().optional().or(z.literal("")),
  maxCommitment: z.string().trim().optional().or(z.literal("")),
  geographicPreference: z.string().trim().optional().or(z.literal("")),
  emergingManagerInterest: z.boolean().optional(),
  dueDiligenceNotes: z.string().trim().optional().or(z.literal("")),
});

// Government / Public Institution
const governmentSchema = z.object({
  institution: z.string().trim().min(2, "Institution name is required"),
  department: z.string().trim().optional().or(z.literal("")),
  designation: z.string().trim().optional().or(z.literal("")),
  jurisdiction: z.string().trim().optional().or(z.literal("")),
  areaOfInterest: z.string().trim().optional().or(z.literal("")),
  partnershipInterest: z.boolean().optional(),
  eventInterest: z.boolean().optional(),
});

// Ecosystem (Incubator, Accelerator, University, etc.)
const ecosystemSchema = z.object({
  partnershipInterest: z.string().trim().optional().or(z.literal("")),
  referralInterest: z.boolean().optional(),
  eventCollaboration: z.boolean().optional(),
});

export function getSchemaForType(type: StakeholderType) {
  const base = commonSchema.extend({
    stakeholderType: z.literal(type),
  });

  switch (type) {
    case "Founder":
    case "Startup Team Member":
      return base.merge(founderSchema);
    case "Angel Investor":
    case "HNI":
    case "International Investor":
      return base.merge(investorSchema);
    case "Limited Partner":
    case "Family Office":
      return base.merge(lpSchema);
    case "Venture Capital Fund":
      return base.merge(vcSchema);
    case "Fund of Funds":
      return base.merge(fofSchema);
    case "Government Agency":
    case "Public Institution":
      return base.merge(governmentSchema);
    case "Incubator":
    case "Accelerator":
    case "University":
    case "Corporate Innovation Team":
    case "Mentor":
    case "Ecosystem Partner":
      return base.merge(ecosystemSchema);
    default:
      return base;
  }
}

/** Server-side: parse any stakeholder payload after type is known */
export function parseRegistrationPayload(body: unknown) {
  if (!body || typeof body !== "object") {
    return {
      success: false as const,
      error: "Invalid payload",
      fields: {} as Record<string, string>,
    };
  }

  const raw = body as Record<string, unknown>;

  // Coerce booleans from JSON / form
  if (raw.consent === true || raw.consent === "true" || raw.consent === "on") {
    raw.consent = true;
  }

  const type = raw.stakeholderType;
  if (
    typeof type !== "string" ||
    !stakeholderTypes.includes(type as StakeholderType)
  ) {
    return {
      success: false as const,
      error: "Please select a stakeholder type.",
      fields: { stakeholderType: "Please select a category" },
    };
  }

  // Honeypot
  if (
    typeof raw.websiteHoneypot === "string" &&
    raw.websiteHoneypot.trim().length > 0
  ) {
    return { success: true as const, honeypot: true as const, data: null };
  }

  const schema = getSchemaForType(type as StakeholderType);
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    const flat = parsed.error.flatten();
    for (const [key, messages] of Object.entries(flat.fieldErrors)) {
      if (messages?.[0]) fields[key] = messages[0];
    }
    return {
      success: false as const,
      error: "Please check the highlighted fields.",
      fields,
    };
  }

  return {
    success: true as const,
    honeypot: false as const,
    data: parsed.data as Record<string, unknown> & {
      fullName: string;
      email: string;
      mobile: string;
      country: string;
      city: string;
      stakeholderType: StakeholderType;
      consent: boolean;
    },
  };
}

export type RegistrationFormData = z.infer<ReturnType<typeof getSchemaForType>>;
