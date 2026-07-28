-- FundForFounders leads — run in Supabase SQL Editor
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Main leads table
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),

  -- Common fields
  full_name text not null,
  email text not null,
  mobile text,
  country text,
  city text,
  organisation text,
  designation text,
  linkedin text,

  -- Classification
  stakeholder_type text not null,
  subtype text,

  -- Attribution
  source text default 'website',
  campaign text,
  referral text,
  how_heard text,

  -- Status & workflow
  status text not null default 'New'
    check (status in (
      'New', 'Reviewed', 'Qualified', 'Contacted',
      'Meeting Scheduled', 'Active', 'Nurture',
      'Not Relevant', 'Archived'
    )),
  priority text default 'Normal'
    check (priority in ('Low', 'Normal', 'High', 'Urgent')),
  internal_owner text,
  notes text,

  -- Consent
  consent boolean not null default false,
  consent_version text default '1.0',
  consent_at timestamptz,

  -- Type-specific payload (flexible)
  details jsonb default '{}'::jsonb,

  -- Pitch deck (URL after upload)
  pitch_deck_url text,
  pitch_deck_filename text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for admin filtering
create index if not exists leads_stakeholder_type_idx on public.leads (stakeholder_type);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_priority_idx on public.leads (priority);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at
  before update on public.leads
  for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.leads enable row level security;

-- Service role (API) can do everything
drop policy if exists "Service role full access" on public.leads;
create policy "Service role full access"
  on public.leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Authenticated admins can read/update (for future dashboard)
drop policy if exists "Authenticated admins can read" on public.leads;
create policy "Authenticated admins can read"
  on public.leads
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can update" on public.leads;
create policy "Authenticated admins can update"
  on public.leads
  for update
  using (auth.role() = 'authenticated');
