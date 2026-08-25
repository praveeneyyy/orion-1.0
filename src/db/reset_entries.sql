-- ==============================================================================
-- ORION 1.0 - Refresh & Reset Database Entries Script
-- Use this script in Supabase SQL Editor to wipe test registrations
-- and start fresh with 0 registrations for true live registrations only.
-- ==============================================================================

-- 1. Truncate both team_members and teams tables cleanly
TRUNCATE TABLE public.team_members, public.teams CASCADE;

-- 2. Verify all records have been cleared
SELECT count(*) AS total_teams_count FROM public.teams;
SELECT count(*) AS total_members_count FROM public.team_members;
