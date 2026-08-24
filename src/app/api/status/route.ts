import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_REGISTERED_TEAMS } from '@/data/orionData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();

    if (!query) {
      return NextResponse.json({ error: 'Search query parameter "q" is required' }, { status: 400 });
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          members:team_members(*)
        `)
        .or(`registration_id.ilike.%${query}%,leader_email.ilike.%${query}%,team_name.ilike.%${query}%`)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Supabase lookup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({ found: false, data: null });
      }

      return NextResponse.json({
        found: true,
        data: {
          teamId: data.registration_id,
          teamName: data.team_name,
          leaderName: data.leader_name,
          leaderEmail: data.leader_email,
          institution: data.institution,
          track: data.problem_statement,
          membersCount: 5,
          status: data.registration_status === 'REGISTERED' ? 'Round 1 Confirmed & Verified' : 'Round 1 Pending Payment',
          registrationDate: data.created_at ? data.created_at.split('T')[0] : '2026-08-24',
          members: data.members || [],
          paymentStatus: data.payment_status
        }
      });
    }

    // Fallback search against demo teams
    const cleanQuery = query.toLowerCase();
    const match = INITIAL_REGISTERED_TEAMS.find(
      (t) =>
        t.teamId.toLowerCase() === cleanQuery ||
        t.leaderEmail.toLowerCase() === cleanQuery ||
        t.teamName.toLowerCase().includes(cleanQuery)
    );

    return NextResponse.json({
      found: Boolean(match),
      data: match || null
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
