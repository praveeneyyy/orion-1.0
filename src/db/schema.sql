-- ==============================================================================
-- ORION 1.0 - PostgreSQL Relational Database Schema (Supabase)
-- 24-Hour National Hackathon • Microsoft Club SIST
-- ==============================================================================

-- 1. Create Teams Table
create table if not exists public.teams (
  id uuid default gen_random_uuid() primary key,
  registration_id text unique not null,
  team_name text not null,
  leader_name text not null,
  leader_phone text not null,
  leader_email text not null,
  institution text not null,
  problem_statement text not null,
  payment_status text not null default 'PENDING', -- 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'
  payment_id text,
  order_id text,
  amount integer not null default 100,
  registration_status text not null default 'PENDING', -- 'REGISTERED', 'PENDING', 'REJECTED'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Team Members Table (Exactly 4 members per team)
create table if not exists public.team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  member_number integer not null check (member_number between 1 and 4),
  member_name text not null,
  member_phone text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_team_member unique (team_id, member_number)
);

-- 3. Create Performance Indexes
create index if not exists idx_teams_registration_id on public.teams(registration_id);
create index if not exists idx_teams_leader_email on public.teams(leader_email);
create index if not exists idx_teams_payment_status on public.teams(payment_status);
create index if not exists idx_teams_problem_statement on public.teams(problem_statement);
create index if not exists idx_team_members_team_id on public.team_members(team_id);

-- 4. Enable Row Level Security (RLS)
alter table public.teams enable row level security;
alter table public.team_members enable row level security;

-- 5. RLS Policies
-- Allow public registration inserts
create policy "Allow public squad team inserts"
  on public.teams for insert with check (true);

create policy "Allow public team member inserts"
  on public.team_members for insert with check (true);

-- Allow public read for status lookups and live count query
create policy "Allow public team read"
  on public.teams for select using (true);

create policy "Allow public team members read"
  on public.team_members for select using (true);

-- Allow server-side updates for payment verification
create policy "Allow public team updates"
  on public.teams for update using (true);
