import {
  HIGH_PRIORITY_TYPES,
  type StakeholderType,
} from "./registration-schema";
import type { RegistrationPayload } from "./email";
import { getSupabaseAdmin, isSupabaseConfigured, type LeadRow } from "./supabase";

const COMMON_KEYS = new Set([
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
]);

function asOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t.length ? t : null;
}

export function buildLeadInsert(
  data: RegistrationPayload & { pitchDeckFileName?: string },
) {
  const details: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (COMMON_KEYS.has(key)) continue;
    if (value === undefined || value === null || value === "") continue;
    details[key] = value;
  }

  const type = data.stakeholderType as StakeholderType;
  const high = HIGH_PRIORITY_TYPES.includes(type);

  return {
    full_name: data.fullName,
    email: data.email,
    mobile: asOptionalString(data.mobile),
    country: asOptionalString(data.country),
    city: asOptionalString(data.city),
    organisation: asOptionalString(data.organisation as string | undefined),
    designation: asOptionalString(data.designation as string | undefined),
    linkedin: asOptionalString(data.linkedin as string | undefined),
    stakeholder_type: type,
    how_heard: asOptionalString(data.howHeard as string | undefined),
    notes: asOptionalString(data.message as string | undefined),
    consent: Boolean(data.consent),
    consent_at: data.consent ? new Date().toISOString() : null,
    consent_version: "1.0",
    details,
    pitch_deck_filename:
      asOptionalString(data.pitchDeckFileName) ||
      asOptionalString(data.pitchDeckFilename as string | undefined),
    status: "New" as const,
    priority: high ? ("High" as const) : ("Normal" as const),
    source: "website",
  };
}

export async function insertLead(
  data: RegistrationPayload & { pitchDeckFileName?: string },
): Promise<{ ok: true; lead: LeadRow } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured — skipping lead insert");
    return { ok: false, error: "supabase_not_configured" };
  }

  try {
    const supabase = getSupabaseAdmin();
    const row = buildLeadInsert(data);
    const { data: lead, error } = await supabase
      .from("leads")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true, lead: lead as LeadRow };
  } catch (err) {
    console.error("Supabase insert exception:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "insert_failed",
    };
  }
}
