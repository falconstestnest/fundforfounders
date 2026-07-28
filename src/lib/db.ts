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
  const startup =
    typeof row.details?.startupName === "string"
      ? row.details.startupName
      : null;
  const website =
    typeof row.details?.website === "string"
      ? row.details.website
      : typeof row.details?.websiteUrl === "string"
        ? row.details.websiteUrl
        : null;
  const result = await db`
    INSERT INTO leads (
      full_name, email, mobile, country, city, organisation, designation,
      linkedin, stakeholder_type, how_heard, notes, consent, consent_at,
      consent_version, details, pitch_deck_filename, status, priority, source,
      last_activity_at, startup_name, website, pipeline_order
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
      ${row.source},
      now(),
      ${startup},
      ${website},
      ${0}
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

export async function dbGetLead(id: string): Promise<LeadRow | null> {
  const db = getSql();
  const rows = await db`SELECT * FROM leads WHERE id = ${id} LIMIT 1`;
  return (rows[0] as LeadRow) || null;
}

export async function dbUpdateLead(
  id: string,
  patch: {
    status?: string;
    priority?: string;
    notes?: string | null;
    internal_owner?: string | null;
  },
): Promise<LeadRow | null> {
  const db = getSql();
  const current = await dbGetLead(id);
  if (!current) return null;

  const status = patch.status ?? current.status;
  const priority = patch.priority ?? current.priority;
  const notes =
    patch.notes !== undefined ? patch.notes : current.notes;
  const internal_owner =
    patch.internal_owner !== undefined
      ? patch.internal_owner
      : current.internal_owner;

  const rows = await db`
    UPDATE leads SET
      status = ${status},
      priority = ${priority},
      notes = ${notes},
      internal_owner = ${internal_owner},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return (rows[0] as LeadRow) || null;
}

export type DashboardStats = {
  total: number;
  newThisWeek: number;
  highPriority: number;
  founders: number;
  investors: number;
  institutions: number;
  byStatus: { status: string; count: number }[];
  byType: { type: string; count: number }[];
  byPriority: { priority: string; count: number }[];
  byCountry: { country: string; count: number }[];
  recent: LeadRow[];
  priorityQueue: LeadRow[];
  daily: { day: string; count: number }[];
};

export async function dbDashboardStats(): Promise<DashboardStats> {
  const db = getSql();

  const [totals] = await db`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (
        WHERE created_at >= now() - interval '7 days'
      )::int AS new_this_week,
      count(*) FILTER (
        WHERE priority IN ('High', 'Urgent')
          AND status NOT IN ('Archived', 'Not Relevant')
      )::int AS high_priority,
      count(*) FILTER (
        WHERE stakeholder_type IN ('Founder', 'Startup Team Member')
      )::int AS founders,
      count(*) FILTER (
        WHERE stakeholder_type IN (
          'Angel Investor', 'HNI', 'International Investor',
          'Limited Partner', 'Family Office', 'Venture Capital Fund',
          'Fund of Funds'
        )
      )::int AS investors,
      count(*) FILTER (
        WHERE stakeholder_type IN (
          'Government Agency', 'Public Institution', 'Incubator',
          'Accelerator', 'University', 'Corporate Innovation Team',
          'Ecosystem Partner'
        )
      )::int AS institutions
    FROM leads
  `;

  const byStatus = (await db`
    SELECT status, count(*)::int AS count
    FROM leads
    GROUP BY status
    ORDER BY count DESC
  `) as { status: string; count: number }[];

  const byType = (await db`
    SELECT stakeholder_type AS type, count(*)::int AS count
    FROM leads
    GROUP BY stakeholder_type
    ORDER BY count DESC
    LIMIT 12
  `) as { type: string; count: number }[];

  const byPriority = (await db`
    SELECT priority, count(*)::int AS count
    FROM leads
    GROUP BY priority
    ORDER BY count DESC
  `) as { priority: string; count: number }[];

  const byCountry = (await db`
    SELECT coalesce(nullif(trim(country), ''), 'Unknown') AS country,
           count(*)::int AS count
    FROM leads
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 8
  `) as { country: string; count: number }[];

  const recent = (await db`
    SELECT * FROM leads
    ORDER BY created_at DESC
    LIMIT 8
  `) as LeadRow[];

  const priorityQueue = (await db`
    SELECT * FROM leads
    WHERE priority IN ('High', 'Urgent')
      AND status NOT IN ('Archived', 'Not Relevant')
    ORDER BY
      CASE priority WHEN 'Urgent' THEN 0 WHEN 'High' THEN 1 ELSE 2 END,
      created_at DESC
    LIMIT 10
  `) as LeadRow[];

  const daily = (await db`
    SELECT to_char(day, 'Mon DD') AS day, count::int AS count
    FROM (
      SELECT date_trunc('day', created_at) AS day, count(*) AS count
      FROM leads
      WHERE created_at >= now() - interval '13 days'
      GROUP BY 1
      ORDER BY 1
    ) t
  `) as { day: string; count: number }[];

  return {
    total: Number(totals?.total || 0),
    newThisWeek: Number(totals?.new_this_week || 0),
    highPriority: Number(totals?.high_priority || 0),
    founders: Number(totals?.founders || 0),
    investors: Number(totals?.investors || 0),
    institutions: Number(totals?.institutions || 0),
    byStatus,
    byType,
    byPriority,
    byCountry,
    recent,
    priorityQueue,
    daily,
  };
}

