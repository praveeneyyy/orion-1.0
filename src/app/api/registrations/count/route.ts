import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_REGISTERED_TEAMS } from '@/data/orionData';

// Dynamic route, revalidated frequently
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (isSupabaseConfigured() && supabase) {
      // Count total verified paid teams
      const { count: paidCount, error: paidErr } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'SUCCESS');

      // Count total registered submissions
      const { count: totalCount, error: totalErr } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true });

      if (!paidErr && !totalErr && paidCount !== null && totalCount !== null) {
        return NextResponse.json({
          registeredTeams: totalCount,
          paymentConfirmed: paidCount
        });
      }
    }

    // Default fallback count when database has no records or in local mode
    const paidFallback = INITIAL_REGISTERED_TEAMS.length;
    return NextResponse.json({
      registeredTeams: paidFallback,
      paymentConfirmed: paidFallback
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch registration count';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
