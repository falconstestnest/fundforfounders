"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LeadRow } from "@/lib/supabase";
import { PIPELINE_STATUSES, PRIORITIES } from "@/lib/admin-data";
import { PriorityPill, StatusPill } from "./DashboardUI";

export function LeadDetailClient({ lead }: { lead: LeadRow }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [priority, setPriority] = useState(lead.priority);
  const [notes, setNotes] = useState(lead.notes || "");
  const [owner, setOwner] = useState(lead.internal_owner || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          priority,
          notes: notes || null,
          internal_owner: owner || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Save failed");
        return;
      }
      setMsg("Saved");
      router.refresh();
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  }

  const details =
    lead.details && typeof lead.details === "object"
      ? (lead.details as Record<string, unknown>)
      : {};

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Profile */}
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
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Type", lead.stakeholder_type],
              ["Organisation", lead.organisation || "—"],
              ["Designation", lead.designation || "—"],
              ["Mobile", lead.mobile || "—"],
              ["City", lead.city || "—"],
              ["Country", lead.country || "—"],
              ["LinkedIn", lead.linkedin || "—"],
              ["How heard", lead.how_heard || "—"],
              ["Source", lead.source || "—"],
              ["Pitch deck", lead.pitch_deck_filename || "—"],
            ].map(([k, v]) => (
              <div key={k as string}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#928C86]">
                  {k}
                </dt>
                <dd className="mt-1 break-all text-sm text-[#1B1916]">
                  {typeof v === "string" && v.startsWith("http") ? (
                    <a
                      href={v}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00A071] underline"
                    >
                      {v}
                    </a>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {lead.notes && (
            <div className="mt-6 rounded-xl bg-[#F3F3F2] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#928C86]">
                Current notes
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[#1B1916]">
                {lead.notes}
              </p>
            </div>
          )}
        </section>

        {Object.keys(details).length > 0 && (
          <section className="rounded-2xl border border-[#E4E3E0] bg-white p-6">
            <h3 className="text-sm font-semibold">Type-specific details</h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(details).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-[#F3F3F2]/80 px-3 py-2.5">
                  <dt className="text-[11px] font-medium text-[#928C86]">{k}</dt>
                  <dd className="mt-0.5 text-sm text-[#1B1916]">
                    {typeof v === "boolean"
                      ? v
                        ? "Yes"
                        : "No"
                      : String(v ?? "—")}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {/* Workflow panel */}
      <div className="lg:col-span-5">
        <section className="sticky top-4 rounded-2xl border border-[#E4E3E0] bg-white p-6 shadow-[0_8px_30px_-20px_rgba(27,25,22,0.25)]">
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
            placeholder="Team member name"
            className="mt-1.5 w-full rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
          />

          <label className="mt-4 block text-xs font-medium text-[#928C86]">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Call notes, next steps, IC comments…"
            className="mt-1.5 w-full resize-y rounded-lg border border-[#E4E3E0] px-3 py-2.5 text-sm"
          />

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="mt-5 w-full rounded-lg bg-[#00A071] py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {msg && (
            <p
              className={`mt-3 text-center text-sm ${msg === "Saved" ? "text-[#007354]" : "text-red-700"}`}
            >
              {msg}
            </p>
          )}

          <div className="mt-6 border-t border-[#E4E3E0] pt-4 text-xs text-[#928C86]">
            <p>
              Created{" "}
              {new Date(lead.created_at).toLocaleString("en-IN")}
            </p>
            <p className="mt-1">
              Updated{" "}
              {new Date(lead.updated_at).toLocaleString("en-IN")}
            </p>
            <a
              href={`mailto:${lead.email}`}
              className="mt-3 inline-block font-medium text-[#00A071] hover:underline"
            >
              Email lead →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
