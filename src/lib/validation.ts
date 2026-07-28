import { z } from "zod";
import { STAKEHOLDER_TYPES } from "./stakeholders";

const optionalString = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .or(z.literal(""));

export const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email.").max(200),
  phone: z.string().trim().min(7, "Please enter a valid phone number.").max(40),
  country: z.string().trim().min(2, "Please enter your country.").max(100),
  city: z.string().trim().min(1, "Please enter your city.").max(100),
  organisation: optionalString,
  designation: optionalString,
  linkedin: optionalString,
  stakeholderType: z.enum(STAKEHOLDER_TYPES),
  howHeard: optionalString,
  message: optionalString,
  consent: z.boolean().refine((v) => v === true, {
    message: "Please accept the privacy notice to continue.",
  }),
  // Honeypot
  website: optionalString,
  // Dynamic fields
  startupName: optionalString,
  websiteUrl: optionalString,
  sector: optionalString,
  stage: optionalString,
  yearFounded: optionalString,
  teamSize: optionalString,
  businessSummary: optionalString,
  problem: optionalString,
  traction: optionalString,
  revenueRange: optionalString,
  fundingRequired: optionalString,
  previousFunding: optionalString,
  pitchCompetition: z.boolean().optional(),
  podcastInterest: z.boolean().optional(),
  chequeSize: optionalString,
  preferredStage: optionalString,
  preferredSectors: optionalString,
  preferredGeography: optionalString,
  pastInvestments: optionalString,
  pitchPanels: z.boolean().optional(),
  coInvestment: z.boolean().optional(),
  organisationType: optionalString,
  commitmentRange: optionalString,
  emergingManager: z.boolean().optional(),
  fundName: optionalString,
  fundSize: optionalString,
  fundVintage: optionalString,
  dealFlow: z.boolean().optional(),
  institution: optionalString,
  department: optionalString,
  jurisdiction: optionalString,
  areaOfInterest: optionalString,
  partnershipInterest: optionalString,
  mandate: optionalString,
  minCommitment: optionalString,
  maxCommitment: optionalString,
  source: optionalString,
  utmSource: optionalString,
  utmMedium: optionalString,
  utmCampaign: optionalString,
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  organisation: optionalString,
  message: z.string().trim().min(10, "Please share a short message.").max(4000),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please accept the privacy notice to continue.",
  }),
  website: optionalString,
});

export type ContactInput = z.infer<typeof contactSchema>;

export function sanitiseText(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}
