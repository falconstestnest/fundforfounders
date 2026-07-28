import type { ReactNode } from "react";
import Link from "next/link";
import {
  formatDate,
  formatRelative,
  initials,
} from "@/lib/admin-data";
import type { LeadRow } from "@/lib/supabase";

export function KpiCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "green" | "ink" | "amber";
}) {
  const bar =
    accent === "green"
      ? "bg-[#00A071]"
      : accent === "amber"
        ? "bg-[#B06300]"
        : "bg-[#1B1916]";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E4E3E0] bg-white p-5 shadow-[0_1px_0_rgba(27,25,22,0.03)]">
      <div className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#928C86]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#1B1916] tabular-nums">
        {value}
      </p>
      {hint && (
        <p className="mt-2 text-xs leading-relaxed text-[#928C86]">{hint}</p>
      )}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[#E4E3E0] bg-white shadow-[0_1px_0_rgba(27,25,22,0.03)] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#E4E3E0] px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight text-[#1B1916]">
          {title}
        </h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    New: "bg-sky-50 text-sky-800 ring-sky-200",
    Reviewed: "bg-zinc-100 text-zinc-700 ring-zinc-200",
    Qualified: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    Contacted: "bg-violet-50 text-violet-800 ring-violet-200",
    "Meeting Scheduled": "bg-indigo-50 text-indigo-800 ring-indigo-200",
    Active: "bg-[#00A071]/10 text-[#007354] ring-[#00A071]/25",
    Nurture: "bg-amber-50 text-amber-900 ring-amber-200",
    "Not Relevant": "bg-red-50 text-red-800 ring-red-200",
    Archived: "bg-stone-100 text-stone-600 ring-stone-200",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${map[status] || "bg-zinc-100 text-zinc-700 ring-zinc-200"}`}
    >
      {status}
    </span>
  );
}

export function PriorityPill({ priority }: { priority: string }) {
  if (priority === "Urgent") {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-800 ring-1 ring-inset ring-red-200">
        Urgent
      </span>
    );
  }
  if (priority === "High") {
    return (
      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-inset ring-amber-200">
        High
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-zinc-50 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200">
      {priority}
    </span>
  );
}

export function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B1916] text-[11px] font-semibold text-white">
      {initials(name) || "?"}
    </span>
  );
}

export function HorizontalBars({
  items,
  color = "#00A071",
}: {
  items: { label: string; count: number }[];
  color?: string;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  if (!items.length) {
    return (
      <p className="py-8 text-center text-sm text-[#928C86]">No data yet</p>
    );
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-2 text-xs">
            <span className="truncate font-medium text-[#1B1916]">
              {item.label}
            </span>
            <span className="tabular-nums text-[#928C86]">{item.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#F3F3F2]">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(item.count / max) * 100}%`,
                background: color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SparkBars({
  items,
}: {
  items: { day: string; count: number }[];
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  if (!items.length) {
    return (
      <p className="py-10 text-center text-sm text-[#928C86]">
        No activity in the last 14 days
      </p>
    );
  }
  return (
    <div className="flex h-36 items-end gap-1.5">
      {items.map((item) => (
        <div
          key={item.day}
          className="group flex flex-1 flex-col items-center gap-1"
        >
          <div
            className="w-full min-h-[4px] rounded-t bg-[#00A071]/85 transition group-hover:bg-[#007354]"
            style={{ height: `${Math.max(8, (item.count / max) * 100)}%` }}
            title={`${item.day}: ${item.count}`}
          />
          <span className="hidden text-[9px] text-[#928C86] sm:block">
            {item.day.split(" ")[1] || item.day}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LeadRowCard({ lead }: { lead: LeadRow }) {
  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2.5 transition hover:border-[#E4E3E0] hover:bg-[#F3F3F2]/80"
    >
      <Avatar name={lead.full_name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#1B1916]">
          {lead.full_name}
        </p>
        <p className="truncate text-xs text-[#928C86]">
          {lead.stakeholder_type}
          {lead.organisation ? ` · ${lead.organisation}` : ""}
        </p>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <StatusPill status={lead.status} />
        <p className="mt-1 text-[11px] text-[#928C86]">
          {formatRelative(lead.created_at)}
        </p>
      </div>
    </Link>
  );
}

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  if (!leads.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E4E3E0] bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-[#1B1916]">No leads yet</p>
        <p className="mt-1 text-sm text-[#928C86]">
          Submissions from the public form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E4E3E0] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-[#E4E3E0] bg-[#F3F3F2]/80 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#928C86]">
            <tr>
              <th className="px-5 py-3.5">Lead</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Organisation</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Priority</th>
              <th className="px-5 py-3.5">Location</th>
              <th className="px-5 py-3.5">Joined</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-t border-[#E4E3E0] transition hover:bg-[#F3F3F2]/50"
              >
                <td className="px-5 py-3.5">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-center gap-3"
                  >
                    <Avatar name={lead.full_name} />
                    <div>
                      <p className="font-medium text-[#1B1916]">
                        {lead.full_name}
                      </p>
                      <p className="text-xs text-[#928C86]">{lead.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-[#1B1916]">
                  {lead.stakeholder_type}
                </td>
                <td className="px-5 py-3.5 text-[#928C86]">
                  {lead.organisation || "—"}
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill status={lead.status} />
                </td>
                <td className="px-5 py-3.5">
                  <PriorityPill priority={lead.priority} />
                </td>
                <td className="px-5 py-3.5 text-[#928C86]">
                  {[lead.city, lead.country].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-5 py-3.5 text-[#928C86]">
                  {formatDate(lead.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
