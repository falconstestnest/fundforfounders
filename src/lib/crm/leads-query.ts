import { getSql, isDatabaseConfigured } from "@/lib/db";
import type { LeadRow } from "@/lib/supabase";
import type { LeadFilters } from "./types";
import { PRESET_VIEWS } from "./presets";

export type PaginatedLeads = {
  leads: LeadRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function applyPreset(filters: LeadFilters): LeadFilters {
  if (!filters.view) return filters;
  const preset = PRESET_VIEWS.find((p) => p.id === filters.view);
  if (!preset) return filters;
  return { ...preset.filters, ...filters, view: filters.view };
}

export async function searchLeads(
  raw: LeadFilters,
): Promise<PaginatedLeads> {
  if (!isDatabaseConfigured()) {
    return { leads: [], total: 0, page: 1, pageSize: 25, totalPages: 0 };
  }

  const f = applyPreset(raw);
  const page = Math.max(1, f.page || 1);
  const pageSize = Math.min(100, Math.max(10, f.pageSize || 25));
  const offset = (page - 1) * pageSize;
  const db = getSql();
  const q = f.q?.trim() ? `%${f.q.trim()}%` : null;

  // Dynamic SQL via sequential filters — build with neon tagged templates carefully
  // Use a broad query then filter in SQL with all optional conditions

  const rows = await db`
    SELECT *
    FROM leads
    WHERE
      (${f.type || null}::text IS NULL OR stakeholder_type = ${f.type || null})
      AND (${f.status || null}::text IS NULL OR status = ${f.status || null})
      AND (${f.priority || null}::text IS NULL OR priority = ${f.priority || null})
      AND (
        ${f.unassigned ? true : false} = false
        OR internal_owner IS NULL
        OR trim(internal_owner) = ''
      )
      AND (
        ${f.overdue ? true : false} = false
        OR (follow_up_at IS NOT NULL AND follow_up_at < now())
      )
      AND (
        ${f.dormant ? true : false} = false
        OR (
          last_activity_at < now() - interval '14 days'
          AND status NOT IN ('Archived', 'Not Relevant', 'Active')
        )
      )
      AND (
        ${f.recent ? true : false} = false
        OR last_activity_at >= now() - interval '7 days'
      )
      AND (
        ${f.owner || null}::text IS NULL
        OR internal_owner ILIKE ${f.owner ? `%${f.owner}%` : null}
      )
      AND (
        ${q}::text IS NULL
        OR full_name ILIKE ${q}
        OR email ILIKE ${q}
        OR organisation ILIKE ${q}
        OR city ILIKE ${q}
        OR country ILIKE ${q}
        OR linkedin ILIKE ${q}
        OR startup_name ILIKE ${q}
        OR website ILIKE ${q}
        OR notes ILIKE ${q}
        OR details::text ILIKE ${q}
      )
    ORDER BY
      CASE priority
        WHEN 'Urgent' THEN 0
        WHEN 'High' THEN 1
        WHEN 'Normal' THEN 2
        ELSE 3
      END,
      last_activity_at DESC NULLS LAST,
      created_at DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  const countRows = await db`
    SELECT count(*)::int AS total
    FROM leads
    WHERE
      (${f.type || null}::text IS NULL OR stakeholder_type = ${f.type || null})
      AND (${f.status || null}::text IS NULL OR status = ${f.status || null})
      AND (${f.priority || null}::text IS NULL OR priority = ${f.priority || null})
      AND (
        ${f.unassigned ? true : false} = false
        OR internal_owner IS NULL
        OR trim(internal_owner) = ''
      )
      AND (
        ${f.overdue ? true : false} = false
        OR (follow_up_at IS NOT NULL AND follow_up_at < now())
      )
      AND (
        ${f.dormant ? true : false} = false
        OR (
          last_activity_at < now() - interval '14 days'
          AND status NOT IN ('Archived', 'Not Relevant', 'Active')
        )
      )
      AND (
        ${f.recent ? true : false} = false
        OR last_activity_at >= now() - interval '7 days'
      )
      AND (
        ${f.owner || null}::text IS NULL
        OR internal_owner ILIKE ${f.owner ? `%${f.owner}%` : null}
      )
      AND (
        ${q}::text IS NULL
        OR full_name ILIKE ${q}
        OR email ILIKE ${q}
        OR organisation ILIKE ${q}
        OR city ILIKE ${q}
        OR country ILIKE ${q}
        OR linkedin ILIKE ${q}
        OR startup_name ILIKE ${q}
        OR website ILIKE ${q}
        OR notes ILIKE ${q}
        OR details::text ILIKE ${q}
      )
  `;

  const total = Number(countRows[0]?.total || 0);
  return {
    leads: rows as LeadRow[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 0,
  };
}

export async function listPipelineLeads(): Promise<LeadRow[]> {
  if (!isDatabaseConfigured()) return [];
  const db = getSql();
  return (await db`
    SELECT * FROM leads
    WHERE status NOT IN ('Archived', 'Not Relevant')
    ORDER BY status, pipeline_order ASC, created_at DESC
    LIMIT 500
  `) as LeadRow[];
}

export async function moveLeadStage(opts: {
  id: string;
  status: string;
  pipelineOrder: number;
}): Promise<LeadRow | null> {
  const db = getSql();
  const rows = await db`
    UPDATE leads SET
      status = ${opts.status},
      pipeline_order = ${opts.pipelineOrder},
      last_activity_at = now(),
      updated_at = now()
    WHERE id = ${opts.id}
    RETURNING *
  `;
  return (rows[0] as LeadRow) || null;
}

export async function mergeLeads(opts: {
  keepId: string;
  dropId: string;
}): Promise<LeadRow | null> {
  const db = getSql();
  const keepRows = await db`SELECT * FROM leads WHERE id = ${opts.keepId}`;
  const dropRows = await db`SELECT * FROM leads WHERE id = ${opts.dropId}`;
  const keep = keepRows[0] as LeadRow | undefined;
  const drop = dropRows[0] as LeadRow | undefined;
  if (!keep || !drop) return null;

  // Move notes and audits to keep
  await db`UPDATE lead_notes SET lead_id = ${opts.keepId} WHERE lead_id = ${opts.dropId}`;
  await db`UPDATE audit_logs SET lead_id = ${opts.keepId} WHERE lead_id = ${opts.dropId}`;

  // Fill empty keep fields from drop
  const fill = (a: string | null | undefined, b: string | null | undefined) =>
    a && a.trim() ? a : b || null;

  const details = {
    ...((drop.details as object) || {}),
    ...((keep.details as object) || {}),
    _merged_from: drop.id,
  };

  const updated = await db`
    UPDATE leads SET
      mobile = ${fill(keep.mobile, drop.mobile)},
      country = ${fill(keep.country, drop.country)},
      city = ${fill(keep.city, drop.city)},
      organisation = ${fill(keep.organisation, drop.organisation)},
      designation = ${fill(keep.designation, drop.designation)},
      linkedin = ${fill(keep.linkedin, drop.linkedin)},
      notes = ${
        [keep.notes, drop.notes].filter(Boolean).join("\n\n---\n\n") || null
      },
      details = ${JSON.stringify(details)},
      startup_name = ${fill(
        (keep as { startup_name?: string }).startup_name || null,
        (drop as { startup_name?: string }).startup_name || null,
      )},
      website = ${fill(
        (keep as { website?: string }).website || null,
        (drop as { website?: string }).website || null,
      )},
      last_activity_at = now(),
      updated_at = now()
    WHERE id = ${opts.keepId}
    RETURNING *
  `;

  await db`DELETE FROM leads WHERE id = ${opts.dropId}`;
  return (updated[0] as LeadRow) || null;
}
