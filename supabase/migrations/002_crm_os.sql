-- Network OS CRM upgrade
alter table public.leads add column if not exists pipeline_order integer not null default 0;
alter table public.leads add column if not exists follow_up_at timestamptz;
alter table public.leads add column if not exists last_activity_at timestamptz default now();
alter table public.leads add column if not exists website text;
alter table public.leads add column if not exists startup_name text;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  role text not null default 'Super Admin'
    check (role in ('Super Admin', 'Admin', 'Viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  author_id uuid references public.admin_users(id) on delete set null,
  author_name text not null,
  note_type text not null default 'General'
    check (note_type in ('General','Call','Meeting','Email','Due diligence','Internal')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_notes_lead_id_idx on public.lead_notes(lead_id, created_at desc);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  actor_id uuid references public.admin_users(id) on delete set null,
  actor_name text not null,
  action text not null,
  field text,
  old_value text,
  new_value text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_lead_id_idx on public.audit_logs(lead_id, created_at desc);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);

create table if not exists public.saved_views (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references public.admin_users(id) on delete cascade,
  is_shared boolean not null default true,
  filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_pipeline_order_idx on public.leads(status, pipeline_order);
