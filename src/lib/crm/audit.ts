import { getSql, isDatabaseConfigured } from "@/lib/db";
import type { AuditLog } from "./types";
import type { SessionActor } from "./auth";

export async function writeAudit(opts: {
  actor: SessionActor;
  leadId?: string | null;
  action: string;
  field?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> {
  if (!isDatabaseConfigured()) return;
  const db = getSql();
  await db`
    INSERT INTO audit_logs (
      lead_id, actor_id, actor_name, action, field, old_value, new_value, meta
    ) VALUES (
      ${opts.leadId ?? null},
      ${opts.actor.id},
      ${opts.actor.name},
      ${opts.action},
      ${opts.field ?? null},
      ${opts.oldValue ?? null},
      ${opts.newValue ?? null},
      ${JSON.stringify(opts.meta || {})}
    )
  `;
  if (opts.leadId) {
    await db`
      UPDATE leads SET last_activity_at = now(), updated_at = now()
      WHERE id = ${opts.leadId}
    `;
  }
}

export async function listAuditForLead(leadId: string): Promise<AuditLog[]> {
  if (!isDatabaseConfigured()) return [];
  const db = getSql();
  return (await db`
    SELECT * FROM audit_logs
    WHERE lead_id = ${leadId}
    ORDER BY created_at DESC
    LIMIT 200
  `) as AuditLog[];
}

export async function listAuditGlobal(limit = 100): Promise<AuditLog[]> {
  if (!isDatabaseConfigured()) return [];
  const db = getSql();
  return (await db`
    SELECT * FROM audit_logs
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as AuditLog[];
}
