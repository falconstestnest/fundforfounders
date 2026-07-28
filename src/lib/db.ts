import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { LeadRow } from "./supabase";

let sql: NeonQueryFunction<false, false> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Missing DATABASE_URL");
  }
  if (!sql) {
    sql = neon(url);
  }
  return sql;
}

export type LeadInsert = {
  full_name: string;
  email: string;
  mobile: string | null;
  country: string | null;
  city: string | null;
  organisation: string | null;
  designation: string | null;
  linkedin: string | null;
  stakeholder_type: string;
  how_heard: string | null;
  notes: string | null;
  consent: boolean;
  consent_at: string | null;
  consent_version: string;
  details: Record<string, unknown>;
  pitch_deck_filename: string | null;
  status: string;
  priority: string;
  source: string;
};

export async function dbInsertLead(row: LeadInsert): Promise<LeadRow> {
  const db = getSql();
  const result = await db`
    INSERT INTO leads (
      full_name, email, mobile, country, city, organisation, designation,
      linkedin, stakeholder_type, how_heard, notes, consent, consent_at,
      consent_version, details, pitch_deck_filename, status, priority, source
    ) VALUES (
      ${row.full_name},
      ${row.email},
      ${row.mobile},
      ${row.country},
      ${row.city},
      ${row.organisation},
      ${row.designation},
      ${row.linkedin},
      ${row.stakeholder_type},
      ${row.how_heard},
      ${row.notes},
      ${row.consent},
      ${row.consent_at},
      ${row.consent_version},
      ${JSON.stringify(row.details)},
      ${row.pitch_deck_filename},
      ${row.status},
      ${row.priority},
      ${row.source}
    )
    RETURNING *
  `;
  return result[0] as LeadRow;
}

export async function dbListLeads(filters: {
  type?: string;
  status?: string;
  priority?: string;
  q?: string;
  limit?: number;
}): Promise<LeadRow[]> {
  const db = getSql();
  const limit = filters.limit ?? 200;

  // Build dynamic filters with tagged templates carefully
  if (filters.type && filters.status && filters.priority && filters.q) {
    const q = `%${filters.q}%`;
    return (await db`
      SELECT * FROM leads
      WHERE stakeholder_type = ${filters.type}
        AND status = ${filters.status}
        AND priority = ${filters.priority}
        AND (
          full_name ILIKE ${q}
          OR email ILIKE ${q}
          OR organisation ILIKE ${q}
        )
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  if (filters.type && filters.status) {
    return (await db`
      SELECT * FROM leads
      WHERE stakeholder_type = ${filters.type}
        AND status = ${filters.status}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  if (filters.type && filters.priority) {
    return (await db`
      SELECT * FROM leads
      WHERE stakeholder_type = ${filters.type}
        AND priority = ${filters.priority}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  if (filters.type && filters.q) {
    const q = `%${filters.q}%`;
    return (await db`
      SELECT * FROM leads
      WHERE stakeholder_type = ${filters.type}
        AND (
          full_name ILIKE ${q}
          OR email ILIKE ${q}
          OR organisation ILIKE ${q}
        )
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  if (filters.status && filters.priority) {
    return (await db`
      SELECT * FROM leads
      WHERE status = ${filters.status}
        AND priority = ${filters.priority}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  if (filters.status && filters.q) {
    const q = `%${filters.q}%`;
    return (await db`
      SELECT * FROM leads
      WHERE status = ${filters.status}
        AND (
          full_name ILIKE ${q}
          OR email ILIKE ${q}
          OR organisation ILIKE ${q}
        )
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  if (filters.priority && filters.q) {
    const q = `%${filters.q}%`;
    return (await db`
      SELECT * FROM leads
      WHERE priority = ${filters.priority}
        AND (
          full_name ILIKE ${q}
          OR email ILIKE ${q}
          OR organisation ILIKE ${q}
        )
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  if (filters.type) {
    return (await db`
      SELECT * FROM leads
      WHERE stakeholder_type = ${filters.type}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  if (filters.status) {
    return (await db`
      SELECT * FROM leads
      WHERE status = ${filters.status}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  if (filters.priority) {
    return (await db`
      SELECT * FROM leads
      WHERE priority = ${filters.priority}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  if (filters.q) {
    const q = `%${filters.q}%`;
    return (await db`
      SELECT * FROM leads
      WHERE full_name ILIKE ${q}
         OR email ILIKE ${q}
         OR organisation ILIKE ${q}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as LeadRow[];
  }

  return (await db`
    SELECT * FROM leads
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as LeadRow[];
}
