"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { LeadRow } from "@/lib/supabase";
import { BOARD_LABELS, BOARD_STAGES } from "@/lib/crm/types";
import { Avatar, PriorityPill } from "./DashboardUI";
import { formatRelative } from "@/lib/admin-data";

function stageId(status: string) {
  return `stage:${status}`;
}

function parseStage(id: string): string | null {
  if (id.startsWith("stage:")) return id.slice(6);
  return null;
}

function SortableCard({
  lead,
  onMove,
}: {
  lead: LeadRow;
  onMove: (id: string, status: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="touch-manipulation">
      <div className="rounded-xl border border-[#E4E3E0] bg-white p-3 shadow-[0_1px_0_rgba(27,25,22,0.04)]">
        <div className="flex items-start gap-2">
          <button
            type="button"
            className="mt-1 cursor-grab touch-none rounded px-1 text-[#928C86] active:cursor-grabbing"
            aria-label={`Drag ${lead.full_name}`}
            {...attributes}
            {...listeners}
          >
            ⠿
          </button>
          <Link href={`/admin/leads/${lead.id}`} className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <Avatar name={lead.full_name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#1B1916]">
                  {lead.full_name}
                </p>
                <p className="truncate text-[11px] text-[#928C86]">
                  {lead.stakeholder_type}
                </p>
              </div>
            </div>
            {lead.organisation && (
              <p className="mt-2 truncate text-xs text-[#1B1916]/80">
                {lead.organisation}
              </p>
            )}
          </Link>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <PriorityPill priority={lead.priority} />
          <span className="text-[10px] text-[#928C86]">
            {formatRelative(lead.created_at)}
          </span>
        </div>
        <label className="mt-2 block text-[10px] font-medium uppercase tracking-wide text-[#928C86]">
          Move to
          <select
            className="mt-1 w-full rounded-lg border border-[#E4E3E0] bg-[#F3F3F2]/60 px-2 py-1.5 text-xs text-[#1B1916]"
            value={lead.status}
            onChange={(e) => onMove(lead.id, e.target.value)}
            aria-label={`Move ${lead.full_name} to stage`}
          >
            {BOARD_STAGES.map((s) => (
              <option key={s} value={s}>
                {BOARD_LABELS[s] || s}
              </option>
            ))}
            <option value="Not Relevant">Not Relevant</option>
            <option value="Archived">Archived</option>
          </select>
        </label>
      </div>
    </li>
  );
}

function Column({
  status,
  items,
  onMove,
}: {
  status: string;
  items: LeadRow[];
  onMove: (id: string, status: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stageId(status) });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-[min(280px,85vw)] shrink-0 flex-col rounded-2xl border bg-[#F3F3F2]/80 ${
        isOver ? "border-[#00A071]" : "border-[#E4E3E0]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#E4E3E0] px-3.5 py-3">
        <h2 className="text-xs font-semibold text-[#1B1916]">
          {BOARD_LABELS[status] || status}
        </h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#928C86] ring-1 ring-[#E4E3E0]">
          {items.length}
        </span>
      </div>
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex max-h-[calc(100vh-14rem)] flex-col gap-2 overflow-y-auto overscroll-contain p-2.5">
          {items.length === 0 && (
            <li className="rounded-xl border border-dashed border-[#E4E3E0] bg-white/50 px-3 py-8 text-center text-xs text-[#928C86]">
              Drop here
            </li>
          )}
          {items.map((lead) => (
            <SortableCard key={lead.id} lead={lead} onMove={onMove} />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
}

export function PipelineBoard({ initialLeads }: { initialLeads: LeadRow[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const columns = useMemo(
    () =>
      BOARD_STAGES.map((status) => ({
        status,
        items: leads
          .filter((l) => l.status === status)
          .sort(
            (a, b) =>
              ((a as { pipeline_order?: number }).pipeline_order || 0) -
              ((b as { pipeline_order?: number }).pipeline_order || 0),
          ),
      })),
    [leads],
  );

  const activeLead = leads.find((l) => l.id === activeId) || null;

  async function persistMove(
    id: string,
    status: string,
    pipeline_order: number,
    previous: LeadRow[],
  ) {
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, pipeline_order }),
      });
      if (!res.ok) {
        setLeads(previous);
        setError("Could not save move — reverted");
        return;
      }
      setToast(`Moved to ${BOARD_LABELS[status] || status}`);
      setTimeout(() => setToast(""), 2000);
    } catch {
      setLeads(previous);
      setError("Network error — reverted");
    }
  }

  function onMove(id: string, status: string) {
    const previous = leads;
    const inStage = previous.filter(
      (l) => l.status === status && l.id !== id,
    ).length;
    setLeads((curr) =>
      curr.map((l) =>
        l.id === id
          ? ({ ...l, status, pipeline_order: inStage } as LeadRow)
          : l,
      ),
    );
    void persistMove(id, status, inStage, previous);
  }

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const leadId = String(active.id);
    const overId = String(over.id);
    const previous = leads;
    const lead = previous.find((l) => l.id === leadId);
    if (!lead) return;

    let targetStatus = parseStage(overId);
    if (!targetStatus) {
      const overLead = previous.find((l) => l.id === overId);
      targetStatus = overLead?.status || lead.status;
    }

    const siblings = previous
      .filter((l) => l.status === targetStatus && l.id !== leadId)
      .sort(
        (a, b) =>
          ((a as { pipeline_order?: number }).pipeline_order || 0) -
          ((b as { pipeline_order?: number }).pipeline_order || 0),
      );

    let insertAt = siblings.length;
    if (!parseStage(overId)) {
      const idx = siblings.findIndex((l) => l.id === overId);
      if (idx >= 0) insertAt = idx;
    }

    const reordered = [...siblings];
    const moved = {
      ...lead,
      status: targetStatus,
      pipeline_order: insertAt,
    } as LeadRow;
    reordered.splice(insertAt, 0, moved);

    setLeads((curr) => {
      const others = curr.filter(
        (l) => l.id !== leadId && l.status !== targetStatus,
      );
      const staged = reordered.map((l, i) => ({
        ...l,
        status: targetStatus!,
        pipeline_order: i,
      })) as LeadRow[];
      return [...others, ...staged];
    });

    void persistMove(leadId, targetStatus, insertAt, previous);
  }

  return (
    <div>
      {(toast || error) && (
        <div
          className={`mb-3 rounded-lg px-3 py-2 text-sm ${
            error
              ? "bg-red-50 text-red-800"
              : "bg-[#00A071]/10 text-[#007354]"
          }`}
          role="status"
        >
          {error || toast}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2 text-xs text-[#928C86]">
        <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#E4E3E0]">
          Drag cards or use Move to
        </span>
        <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#E4E3E0]">
          {leads.length} in board
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto overscroll-x-contain pb-4 [-webkit-overflow-scrolling:touch]">
          {columns.map((col) => (
            <Column
              key={col.status}
              status={col.status}
              items={col.items}
              onMove={onMove}
            />
          ))}
        </div>
        <DragOverlay>
          {activeLead ? (
            <div className="w-[260px] rounded-xl border border-[#00A071] bg-white p-3 shadow-lg">
              <p className="text-sm font-medium">{activeLead.full_name}</p>
              <p className="text-xs text-[#928C86]">
                {activeLead.stakeholder_type}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
