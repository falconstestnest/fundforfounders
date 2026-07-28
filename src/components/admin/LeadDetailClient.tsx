"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { LeadRow } from "@/lib/supabase";
import { PIPELINE_STATUSES, PRIORITIES } from "@/lib/admin-data";
import type { LeadScores } from "@/lib/crm/scoring";
import type { TimelineItem } from "@/lib/crm/types";
import { NOTE_TYPES, type NoteType } from "@/lib/crm/types";
import { PriorityPill, StatusPill } from "./DashboardUI";

type Dup = {
  id: string;
  full_name: string;
  email: string;
  organisation: string | null;
  reasons: string[];
  score: number;
};

export function LeadDetailClient({
  lead: initial,
  timeline: initialTimeline,
  scores,
  duplicates,
}: {
  lead: LeadRow;
  timeline: TimelineItem[];
  scores: LeadScores;
  duplicates: Dup[];
}) {
  const router = useRouter();
  const [lead, setLead] = useState(initial);
  const [timeline, setTimeline] = useState(initialTimeline);
  const [status, setStatus] = useState(lead.status);
  const [priority, setPriority] = useState(lead.priority);
  const [owner, setOwner] = useState(lead.internal_owner || "");
  const [followUp, setFollowUp] = useState(
    (lead as { follow_up_at?: string | null }).follow_up_at?.slice(0, 16) || "",
  );
  const [noteType, setNoteType] = useState<NoteType>("General");
  const [noteContent, setNoteContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [merging, setMerging] = useState(false);

  const details =
    lead.details && typeof lead.details === "object"
      ? (lead.details as Record<string, unknown>)
      : {};

  async function saveWorkflow() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          priority,
          internal_owner: owner || null,
          follow_up_at: followUp ? new Date(followUp).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Save failed");
        return;
      }
      setLead(data.lead);
      setMsg("Saved");
      router.refresh();
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    if (!noteContent.trim()) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent, noteType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Could not add note");
        return;
      }
      setNoteContent("");
      setTimeline((t) => [
        {
          id: `note-${data.note.id}`,
          kind: "note",
          title: `${data.note.note_type} note`,
          body: data.note.content,
          author: data.note.author_name,
          at: data.note.created_at,
        },
        ...t,
      ]);
      setMsg("Note added");
      router.refresh();
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function mergeInto(keepId: string, dropId: string) {
    if (!confirm("Merge these leads? This cannot be undone easily.")) return;
    setMerging(true);
    try {
      const res = await fetch("/api/admin/leads/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keepId, dropId }),
      });
      if (!res.ok) {
        setMsg("Merge failed");
        return;
      }
      setMsg("Merged");
      router.push(`/admin/leads/${keepId}`);
      router.refresh();
    } catch {
      setMsg("Merge error");
    } finally {
      setMerging(false);
    }
  }

  const scoreCards = useMemo(
    () => [
      {
        label: "Engagement",
        score: scores.engagement.score,
        factors: scores.engagement.factors,
      },
      {
        label: "Completeness",
        score: scores.completeness.score,
        factors: scores.completeness.factors,
      },
      {
        label: "Follow-up urgency",
        score: scores.urgency.score,
        factors: scores.urgency.factors,
      },
      {
        label: "Strategic relevance",
        score: scores.strategic.score,
        factors: scores.strategic.factors,
      },
    ],
    [scores],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-7">
        <section className="rounded-2xl border border-[#E4E3E0] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#00A071]">
                Lead profile
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                {lead.full_name}
              </h2>
              <p className="mt-1 text-sm text-[#928C86]">{lead.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill status={lead.status} />
              <PriorityPill priority={lead.priority} />
              <span className="inline-flex rounded-full bg-[#F3F3F2] px-2.5 py-0.5 text-[11px] font-medium text-[#1B1916] ring-1 ring-[#E4E3E0]">
                Completeness {scores.completeness.score}%
              </span>
            </div>
          </div>

          {scores.completeness.missing.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p className="font-medium">Incomplete profile</p>
              <p className="mt-1 text-xs">
                Missing: {scores.completeness.missing.join(", ")}
              </p>
            </div>
          )}

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Type", lead.stakeholder_type],
              ["Organisation", lead.organisation || "—"],
              ["Mobile", lead.mobile || "—"],
              ["City", lead.city || "—"],
              ["Country", lead.country || "—"],
              ["LinkedIn", lead.linkedin || "—"],
              ["Owner", lead.internal_owner || "Unassigned"],
              [
                "Startup",
                (lead as { startup_name?: string }).startup_name ||
                  String(details.startupName || "—"),
              ],
            ].map(([k, v]) => (
              <div key={k as string}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#928C86]">
                  {k}
                </dt>
                <dd className="mt-1 break-all text-sm text-[#1B1916]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Intelligence */}
        <section className="rounded-2xl border border-[#E4E3E0] bg-white p-6">
          <h3 className="text-sm font-semibold text-[#1B1916]">
            Lead intelligence
          </h3>
          <p className="mt-1 text-xs text-[#928C86]">
            Explainable operational scores — not investment advice.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {scoreCards.map((c) => (
              <details
                key={c.label}
                className="rounded-xl border border-[#E4E3E0] bg-[#F3F3F2]/50 p-3"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#928C86]">
                      {c.label}
                    </span>
                    <span className="text-lg font-semibold tabular-nums text-[#1B1916]">
                      {c.score}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[#00A071]"
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </summary>
                <ul className="mt-3 space-y-1.5 border-t border-[#E4E3E0] pt-3 text-[11px]">
                  {c.factors.map((f, i) => (
                    <li key={i} className="flex justify-between gap-2">
                      <span className="text-[#1B1916]">
                        {f.label}: {f.reason}
                      </span>
                      <span className="tabular-nums text-[#928C86]">
                        {f.points > 0 ? `+${f.points}` : f.points}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#928C86]">
            Recommended priority:{" "}
            <strong className="text-[#1B1916]">
              {scores.priorityRecommendation.level}
            </strong>
          </p>
        </section>

        {/* Duplicates */}
        {duplicates.length > 0 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
            <h3 className="text-sm font-semibold text-[#1B1916]">
              Possible duplicates
            </h3>
            <p className="mt-1 text-xs text-[#928C86]">
              Flagged only — merge requires confirmation.
            </p>
            <ul className="mt-4 space-y-3">
              {duplicates.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E3E0] bg-white px-4 py-3"
                >
                  <div>
                    <Link
                      href={`/admin/leads/${d.id}`}
                      className="text-sm font-medium text-[#00A071] hover:underline"
                    >
                      {d.full_name}
                    </Link>
                    <p className="text-xs text-[#928C86]">
                      {d.email} · {d.reasons.join(", ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={merging}
                    onClick={() => mergeInto(lead.id, d.id)}
                    className="rounded-lg bg-[#1B1916] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  >
                    Merge into this lead
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Timeline */}
        <section className="rounded-2xl border border-[#E4E3E0] bg-white p-6">
          <h3 className="text-sm font-semibold">Activity timeline</h3>
          <div className="mt-4 space-y-0">
            {timeline.length === 0 && (
              <p className="py-6 text-center text-sm text-[#928C86]">
                No activity yet. Add a note to start the timeline.
              </p>
            )}
            {timeline.map((item) => (
              <div
                key={item.id}
                className="relative border-l-2 border-[#E4E3E0] py-3 pl-4 first:pt-0"
              >
                <span className="absolute -left-[5px] top-4 h-2 w-2 rounded-full bg-[#00A071]" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-[#1B1916]">
                    {item.title}
                  </p>
                  <time className="text-[11px] text-[#928C86]">
                    {new Date(item.at).toLocaleString("en-IN")}
                  </time>
                </div>
                <p className="text-[11px] text-[#928C86]">{item.author}</p>
                {item.body && (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-[#1B1916]/90">
                    {item.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar workflow */}
      <div className="space-y-4 lg:col-span-5">
        <section className="sticky top-4 space-y-4">
          <div className="rounded-2xl border border-[#E4E3E0] bg-white p-6 shadow-[0_8px_30px_-20px_rgba(27,25,22,0.25)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#00A071]">
              Workflow
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">
              Update pipeline
            </h3>

            <label className="mt-5 block text-xs font-medium text-[#928C86]">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadRow["status"])}
              className="mt-1.5 w-full rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
            >
              {PIPELINE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-xs font-medium text-[#928C86]">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as LeadRow["priority"])
              }
              className="mt-1.5 w-full rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-xs font-medium text-[#928C86]">
              Internal owner
            </label>
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Team member"
              className="mt-1.5 w-full rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
            />

            <label className="mt-4 block text-xs font-medium text-[#928C86]">
              Follow-up due
            </label>
            <input
              type="datetime-local"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
            />

            <button
              type="button"
              onClick={saveWorkflow}
              disabled={saving}
              className="mt-5 w-full rounded-lg bg-[#00A071] py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>

          <div className="rounded-2xl border border-[#E4E3E0] bg-white p-6">
            <h3 className="text-sm font-semibold">Add note</h3>
            <label className="mt-3 block text-xs font-medium text-[#928C86]">
              Type
            </label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as NoteType)}
              className="mt-1.5 w-full rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
            >
              {NOTE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label className="mt-3 block text-xs font-medium text-[#928C86]">
              Content
            </label>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={4}
              placeholder="Call notes, meeting summary…"
              className="mt-1.5 w-full resize-y rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
            />
            <button
              type="button"
              onClick={addNote}
              disabled={saving || !noteContent.trim()}
              className="mt-3 w-full rounded-lg border border-[#1B1916] bg-white py-2.5 text-sm font-medium text-[#1B1916] disabled:opacity-50"
            >
              Add to timeline
            </button>
          </div>

          {msg && (
            <p
              className={`text-center text-sm ${
                msg.includes("fail") || msg.includes("error") || msg.includes("Merge f")
                  ? "text-red-700"
                  : "text-[#007354]"
              }`}
            >
              {msg}
            </p>
          )}

          <a
            href={`mailto:${lead.email}`}
            className="block text-center text-sm font-medium text-[#00A071] hover:underline"
          >
            Email lead →
          </a>
        </section>
      </div>
    </div>
  );
}
