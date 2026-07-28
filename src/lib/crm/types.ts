export type AdminRole = "Super Admin" | "Admin" | "Viewer";

export type Permission =
  | "leads.view"
  | "leads.edit"
  | "leads.export"
  | "leads.assign"
  | "leads.status"
  | "leads.notes"
  | "leads.merge"
  | "investors.view"
  | "founders.view"
  | "users.manage"
  | "audit.view";

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  "Super Admin": [
    "leads.view",
    "leads.edit",
    "leads.export",
    "leads.assign",
    "leads.status",
    "leads.notes",
    "leads.merge",
    "investors.view",
    "founders.view",
    "users.manage",
    "audit.view",
  ],
  Admin: [
    "leads.view",
    "leads.edit",
    "leads.export",
    "leads.assign",
    "leads.status",
    "leads.notes",
    "investors.view",
    "founders.view",
    "audit.view",
  ],
  Viewer: ["leads.view", "investors.view", "founders.view"],
};

export function hasPermission(role: AdminRole, perm: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(perm) ?? false;
}

export type NoteType =
  | "General"
  | "Call"
  | "Meeting"
  | "Email"
  | "Due diligence"
  | "Internal";

export const NOTE_TYPES: NoteType[] = [
  "General",
  "Call",
  "Meeting",
  "Email",
  "Due diligence",
  "Internal",
];

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
  created_at: string;
};

export type LeadNote = {
  id: string;
  lead_id: string;
  author_id: string | null;
  author_name: string;
  note_type: NoteType;
  content: string;
  created_at: string;
};

export type AuditLog = {
  id: string;
  lead_id: string | null;
  actor_id: string | null;
  actor_name: string;
  action: string;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  meta: Record<string, unknown>;
  created_at: string;
};

export type SavedView = {
  id: string;
  name: string;
  owner_id: string | null;
  is_shared: boolean;
  filters: LeadFilters;
  created_at: string;
};

export type LeadFilters = {
  q?: string;
  type?: string;
  status?: string;
  priority?: string;
  owner?: string;
  unassigned?: boolean;
  overdue?: boolean;
  dormant?: boolean;
  recent?: boolean;
  view?: string;
  page?: number;
  pageSize?: number;
};

/** Pipeline board stages (Meeting maps to DB "Meeting Scheduled") */
export const BOARD_STAGES = [
  "New",
  "Reviewed",
  "Qualified",
  "Contacted",
  "Meeting Scheduled",
  "Active",
  "Nurture",
] as const;

export const BOARD_LABELS: Record<string, string> = {
  New: "New",
  Reviewed: "Reviewed",
  Qualified: "Qualified",
  Contacted: "Contacted",
  "Meeting Scheduled": "Meeting",
  Active: "Active",
  Nurture: "Nurture",
};

export type TimelineItem = {
  id: string;
  kind: "note" | "status" | "priority" | "owner" | "email" | "meeting" | "system";
  title: string;
  body?: string;
  author: string;
  at: string;
  meta?: Record<string, unknown>;
};
