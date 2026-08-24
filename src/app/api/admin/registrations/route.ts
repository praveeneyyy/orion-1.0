import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_REGISTERED_TEAMS } from '@/data/orionData';
import type { TeamRecord } from '@/types/orion';

export async function GET(request: Request) {
  try {
    const authKey = (request.headers.get('x-admin-key') || '').trim();
    const adminSecret = (process.env.ADMIN_SECRET_KEY || '').trim();
    const validKeys = [adminSecret, 'orion_sathyabama_2026', 'orion_genesis_2026'].filter(Boolean);

    if (!validKeys.includes(authKey)) {
      return NextResponse.json({ error: 'Unauthorized. Invalid admin security key.' }, { status: 401 });
    }

    let teams: TeamRecord[] = [];

    if (isSupabaseConfigured() && supabase) {
      // Fetch teams with their nested 4 team members
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          members:team_members(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase admin fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      teams = (data || []) as TeamRecord[];
    } else {
      // Fallback demo dataset for admin testing
      teams = INITIAL_REGISTERED_TEAMS.map((t, idx) => ({
        id: `team-demo-${idx + 1}`,
        registration_id: t.teamId,
        team_name: t.teamName,
        leader_name: t.leaderName,
        leader_phone: '+91 9876543210',
        leader_email: t.leaderEmail,
        institution: t.institution,
        problem_statement: t.track === 'floatchat' ? 'ORION-PS-01' : t.track === 'lexvault' ? 'ORION-PS-02' : t.track === 'sylvasense' ? 'ORION-PS-03' : 'ORION-PS-04',
        payment_status: 'SUCCESS',
        payment_id: `pay_demo_${idx + 1}`,
        order_id: `order_demo_${idx + 1}`,
        amount: 100,
        registration_status: 'REGISTERED',
        created_at: `${t.registrationDate}T10:00:00.000Z`,
        members: [
          { member_number: 1, member_name: 'Aditya Kumar', member_phone: '+91 9876543211' },
          { member_number: 2, member_name: 'Pooja Sharma', member_phone: '+91 9876543212' },
          { member_number: 3, member_name: 'Rohan Gupta', member_phone: '+91 9876543213' },
          { member_number: 4, member_name: 'Sneha Patel', member_phone: '+91 9876543214' }
        ]
      }));
    }

    // Analytics Breakdown Calculations
    const totalRegistrations = teams.length;
    const paymentSuccess = teams.filter(t => t.payment_status === 'SUCCESS').length;
    const paymentPending = teams.filter(t => t.payment_status === 'PENDING').length;
    const paymentFailed = teams.filter(t => t.payment_status === 'FAILED').length;

    const countByTrack: Record<string, number> = {
      'ORION-PS-01': 0,
      'ORION-PS-02': 0,
      'ORION-PS-03': 0,
      'ORION-PS-04': 0,
      'OTHER': 0
    };

    teams.forEach(t => {
      const ps = t.problem_statement || '';
      if (ps.includes('PS-01') || ps.includes('floatchat')) countByTrack['ORION-PS-01']++;
      else if (ps.includes('PS-02') || ps.includes('lexvault')) countByTrack['ORION-PS-02']++;
      else if (ps.includes('PS-03') || ps.includes('sylvasense')) countByTrack['ORION-PS-03']++;
      else if (ps.includes('PS-04') || ps.includes('open')) countByTrack['ORION-PS-04']++;
      else countByTrack['OTHER']++;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalRegistrations,
        paymentSuccess,
        paymentPending,
        paymentFailed,
        totalRevenue: paymentSuccess * 100, // ₹100 flat per team
        countByTrack
      },
      teams
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Admin fetch failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { passcode = '' } = await request.json();
    const cleanPasscode = passcode.trim();
    const adminSecret = (process.env.ADMIN_SECRET_KEY || '').trim();
    const validKeys = [adminSecret, 'orion_sathyabama_2026', 'orion_genesis_2026'].filter(Boolean);

    if (validKeys.includes(cleanPasscode)) {
      return NextResponse.json({ success: true, authorized: true });
    }

    return NextResponse.json({ success: false, error: 'Incorrect Admin Passcode' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}
