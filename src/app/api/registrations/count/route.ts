import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET() {
  try {
    const { stats } = await serverStore.getAdminOverview();

    return NextResponse.json({
      success: true,
      registeredTeams: stats.totalRegistrations,
      paymentConfirmed: stats.paymentVerified,
      paymentPending: stats.paymentPending,
      round1Submissions: stats.round1Submissions,
      round1Selected: stats.round1Selected
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch registration count';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
