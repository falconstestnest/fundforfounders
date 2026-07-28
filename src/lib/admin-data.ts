import {
  dbDashboardStats,
  dbGetLead,
  dbListLeads,
  dbUpdateLead,
  isDatabaseConfigured,
  type DashboardStats,
} from "./db";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  type LeadPriority,
  type LeadRow,
  type LeadStatus,
} from "./supabase";

export async function fetchDashboardStats(): Promise<DashboardStats> {
  if (isDatabaseConfigured()) {
    return dbDashboardStats();
  }

  // Minimal empty stats if no DB
  return {
    total: 0,
    newThisWeek: 0,
    highPriority: 0,
    founders: 0,
    investors: 0,
    institutions: 0,
    byStatus: [],
    byType: [],
    byPriority: [],
    byCountry: [],
    recent: [],
    priorityQueue: [],
    daily: [],
  };
}

export async function fetchLeads(filters: {
  type?: string;
  status?: string;
  priority?: string;
  q?: string;
  limit?: number;
}): Promise<LeadRow[]> {
  if (isDatabaseConfigured()) {
    return dbListLeads(filters);
  }
  if (isSupabaseConfigured()) {
    let query = getSupabaseAdmin()
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(filters.limit ?? 200);
    if (filters.type) query = query.eq("stakeholder_type", filters.type);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.priority) query = query.eq("priority", filters.priority);
    if (filters.q) {
      query = query.or(
        `full_name.ilike.%${filters.q}%,email.ilike.%${filters.q}%,organisation.ilike.%${filters.q}%`,
      );
    }
    const { data } = await query;
    return (data || []) as LeadRow[];
  }
  return [];
}

export async function fetchLead(id: string): Promise<LeadRow | null> {
  if (isDatabaseConfigured()) return dbGetLead(id);
  if (isSupabaseConfigured()) {
    const { data } = await getSupabaseAdmin()
      .from("leads")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return (data as LeadRow) || null;
  }
  return null;
}

export async function updateLead(
  id: string,
  patch: {
    status?: LeadStatus;
    priority?: LeadPriority;
    notes?: string | null;
    internal_owner?: string | null;
  },
): Promise<LeadRow | null> {
  if (isDatabaseConfigured()) return dbUpdateLead(id, patch);
  if (isSupabaseConfigured()) {
    const { data } = await getSupabaseAdmin()
      .from("leads")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();
    return (data as LeadRow) || null;
  }
  return null;
}

export const PIPELINE_STATUSES: LeadStatus[] = [
  "New",
  "Reviewed",
  "Qualified",
  "Contacted",
  "Meeting Scheduled",
  "Active",
  "Nurture",
  "Not Relevant",
  "Archived",
];

export const PRIORITIES: LeadPriority[] = [
  "Urgent",
  "High",
  "Normal",
  "Low",
];

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelative(iso: string): string {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  return formatDate(iso);
}
