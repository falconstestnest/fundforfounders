import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type LeadStatus =
  | "New"
  | "Reviewed"
  | "Qualified"
  | "Contacted"
  | "Meeting Scheduled"
  | "Active"
  | "Nurture"
  | "Not Relevant"
  | "Archived";

export type LeadPriority = "Low" | "Normal" | "High" | "Urgent";

export type LeadRow = {
  id: string;
  full_name: string;
  email: string;
  mobile: string | null;
  country: string | null;
  city: string | null;
  organisation: string | null;
  designation: string | null;
  linkedin: string | null;
  stakeholder_type: string;
  subtype: string | null;
  source: string | null;
  campaign: string | null;
  referral: string | null;
  how_heard: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  internal_owner: string | null;
  notes: string | null;
  consent: boolean;
  consent_version: string | null;
  consent_at: string | null;
  details: Record<string, unknown>;
  pitch_deck_url: string | null;
  pitch_deck_filename: string | null;
  created_at: string;
  updated_at: string;
  pipeline_order?: number;
  follow_up_at?: string | null;
  last_activity_at?: string | null;
  website?: string | null;
  startup_name?: string | null;
};

let adminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * Server-only Supabase client with the service role key.
 * Never import this module into client components.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return adminClient;
}
