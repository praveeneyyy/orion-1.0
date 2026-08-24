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
        // Add baseline national demo squad offset for display if freshly initialized
        const baseOffset = 180;
        return NextResponse.json({
          registeredTeams: totalCount + baseOffset,
          paymentConfirmed: paidCount + baseOffset
        });
      }
    }

    // Default fallback baseline count when database is in local mode
    const baseline = INITIAL_REGISTERED_TEAMS.length + 180;
    return NextResponse.json({
      registeredTeams: baseline + 14,
      paymentConfirmed: baseline
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch registration count';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
