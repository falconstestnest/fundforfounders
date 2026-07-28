import { NextResponse, type NextRequest } from "next/server";
import { requireActorFromRequest } from "@/lib/crm/auth";
import { addNote, listNotes } from "@/lib/crm/notes";
import { writeAudit } from "@/lib/crm/audit";
import { NOTE_TYPES, type NoteType } from "@/lib/crm/types";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    requireActorFromRequest(req, "leads.view");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const notes = await listNotes(id);
  return NextResponse.json({ ok: true, notes });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  let actor;
  try {
    actor = requireActorFromRequest(req, "leads.notes");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  let body: { content?: string; noteType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const content = (body.content || "").trim();
  if (content.length < 1) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }
  const noteType = (body.noteType || "General") as NoteType;
  if (!NOTE_TYPES.includes(noteType)) {
    return NextResponse.json({ error: "Invalid note type" }, { status: 400 });
  }

  const note = await addNote({
    leadId: id,
    actor,
    content,
    noteType,
  });
  await writeAudit({
    actor,
    leadId: id,
    action: "Note added",
    field: "note",
    newValue: noteType,
    meta: { noteId: note.id },
  });

  return NextResponse.json({ ok: true, note });
}
