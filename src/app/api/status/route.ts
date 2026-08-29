import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();

    if (!query) {
      return NextResponse.json({ error: 'Search query parameter "q" is required' }, { status: 400 });
    }

    const team = await serverStore.getTeam(query);

    if (!team) {
      return NextResponse.json({ found: false, data: null });
    }

    let statusText = 'Round 1 Registration Completed';
    if (team.round_1_status === 'SELECTED') {
      statusText = 'Top 70 Finalist — Selected for Round 2';
    } else if (team.round_1_status === 'SUBMITTED') {
      statusText = 'Round 1 Presentation Submitted (Under Review)';
    } else if (team.payment_status === 'VERIFIED') {
      statusText = 'Payment Verified • Round 1 Submission Open';
    } else if (team.payment_status === 'PENDING') {
      statusText = 'Payment Pending Verification';
    } else if (team.payment_status === 'RESUBMISSION_REQUIRED') {
      statusText = 'Payment Resubmission Required';
    }

    return NextResponse.json({
      found: true,
      data: {
        teamId: team.registration_id,
        teamName: team.team_name,
        leaderName: team.leader_name,
        leaderEmail: team.leader_email,
        institution: team.institution,
        track: team.problem_statement,
        membersCount: team.members.length + 1,
        status: statusText,
        registrationDate: team.created_at ? team.created_at.split('T')[0] : '2026-08-25',
        paymentStatus: team.payment_status,
        round1Status: team.round_1_status,
        round2Status: team.round_2_status
      }
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
