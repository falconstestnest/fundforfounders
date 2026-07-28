import type { LeadFilters } from "./types";

export type PresetView = {
  id: string;
  name: string;
  filters: LeadFilters;
};

export const PRESET_VIEWS: PresetView[] = [
  {
    id: "new-founders",
    name: "New founders",
    filters: { type: "Founder", status: "New" },
  },
  {
    id: "high-priority-lps",
    name: "High-priority LPs",
    filters: { type: "Limited Partner", priority: "High" },
  },
  {
    id: "global-vcs",
    name: "Global VCs",
    filters: { type: "Venture Capital Fund" },
  },
  {
    id: "government",
    name: "Government institutions",
    filters: { type: "Government Agency" },
  },
  {
    id: "unassigned",
    name: "Unassigned leads",
    filters: { unassigned: true },
  },
  {
    id: "overdue",
    name: "Overdue follow-ups",
    filters: { overdue: true },
  },
  {
    id: "recent",
    name: "Recently active",
    filters: { recent: true },
  },
  {
    id: "dormant",
    name: "Dormant leads",
    filters: { dormant: true },
  },
];
