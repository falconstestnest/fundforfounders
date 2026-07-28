import { getSql, isDatabaseConfigured } from "@/lib/db";
import type { LeadNote, NoteType, TimelineItem } from "./types";
import type { SessionActor } from "./auth";
import { listAuditForLead } from "./audit";

export async function listNotes(leadId: string): Promise<LeadNote[]> {
  if (!isDatabaseConfigured()) return [];
  const db = getSql();
  return (await db`
    SELECT * FROM lead_notes
    WHERE lead_id = ${leadId}
    ORDER BY created_at DESC
  `) as LeadNote[];
}

export async function addNote(opts: {
  leadId: string;
  actor: SessionActor;
  content: string;
  noteType: NoteType;
}): Promise<LeadNote> {
  const db = getSql();
  const rows = await db`
    INSERT INTO lead_notes (lead_id, author_id, author_name, note_type, content)
    VALUES (
      ${opts.leadId},
      ${opts.actor.id},
      ${opts.actor.name},
      ${opts.noteType},
      ${opts.content}
    )
    RETURNING *
  `;
  await db`
    UPDATE leads SET last_activity_at = now(), updated_at = now()
    WHERE id = ${opts.leadId}
  `;
  return rows[0] as LeadNote;
}

export async function buildTimeline(leadId: string): Promise<TimelineItem[]> {
  const [notes, audits] = await Promise.all([
    listNotes(leadId),
    listAuditForLead(leadId),
  ]);

  const items: TimelineItem[] = [];

  for (const n of notes) {
    items.push({
      id: `note-${n.id}`,
      kind: n.note_type === "Meeting" ? "meeting" : n.note_type === "Email" ? "email" : "note",
      title: `${n.note_type} note`,
      body: n.content,
      author: n.author_name,
      at: n.created_at,
      meta: { noteType: n.note_type },
    });
  }

  for (const a of audits) {
    let kind: TimelineItem["kind"] = "system";
    if (a.field === "status" || a.action.includes("status")) kind = "status";
    else if (a.field === "priority") kind = "priority";
    else if (a.field === "internal_owner" || a.action.includes("owner"))
      kind = "owner";
    else if (a.action.includes("email")) kind = "email";

    items.push({
      id: `audit-${a.id}`,
      kind,
      title: a.action,
      body:
        a.field && (a.old_value || a.new_value)
          ? `${a.field}: ${a.old_value ?? "—"} → ${a.new_value ?? "—"}`
          : undefined,
      author: a.actor_name,
      at: a.created_at,
      meta: a.meta,
    });
  }

  return items.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );
}
