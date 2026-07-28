import {
  HIGH_PRIORITY_TYPES,
  type StakeholderType,
} from "./registration-schema";
import type { RegistrationPayload } from "./email";
import { dbInsertLead, isDatabaseConfigured } from "./db";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  type LeadRow,
} from "./supabase";

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
    organisation: asOptionalString(data.organisation),
    designation: asOptionalString(data.designation),
    linkedin: asOptionalString(data.linkedin),
    stakeholder_type: type,
    how_heard: asOptionalString(data.howHeard),
    notes: asOptionalString(data.message),
    consent: Boolean(data.consent),
    consent_at: data.consent ? new Date().toISOString() : null,
    consent_version: "1.0",
    details,
    pitch_deck_filename:
      asOptionalString(data.pitchDeckFileName) ||
      asOptionalString(data.pitchDeckFilename),
    status: "New" as const,
    priority: high ? ("High" as const) : ("Normal" as const),
    source: "website",
  };
}

export function isLeadsStorageConfigured(): boolean {
  return isDatabaseConfigured() || isSupabaseConfigured();
}

export async function insertLead(
  data: RegistrationPayload & { pitchDeckFileName?: string },
): Promise<{ ok: true; lead: LeadRow } | { ok: false; error: string }> {
  if (!isLeadsStorageConfigured()) {
    console.warn("No DATABASE_URL or Supabase — skipping lead insert");
    return { ok: false, error: "storage_not_configured" };
  }

  const row = buildLeadInsert(data);

  // Prefer Neon / Postgres DATABASE_URL
  if (isDatabaseConfigured()) {
    try {
      const lead = await dbInsertLead(row);
      return { ok: true, lead };
    } catch (err) {
      console.error("Neon insert error:", err);
      return {
        ok: false,
        error: err instanceof Error ? err.message : "insert_failed",
      };
    }
  }

  // Fallback: Supabase service role
  try {
    const supabase = getSupabaseAdmin();
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
