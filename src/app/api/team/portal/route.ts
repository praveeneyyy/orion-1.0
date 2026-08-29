import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rate = checkRateLimit(`team-portal-${clientIp}`, 60, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = (searchParams.get('teamId') || '').trim();
    const token = (request.headers.get('x-team-token') || searchParams.get('token') || '').trim();

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID parameter is required' }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: 'Authentication required. Missing team access token.' }, { status: 401 });
    }

    const team = await serverStore.getTeam(teamId);
    if (!team) {
      return NextResponse.json({ error: 'Team dossier not found' }, { status: 404 });
    }

    // Verify token against access token or leader email
    const cleanToken = token.toLowerCase();
    const cleanAccessToken = (team.access_token || '').toLowerCase();
    const cleanLeaderEmail = (team.leader_email || '').toLowerCase();

    if (cleanToken !== cleanAccessToken && cleanToken !== cleanLeaderEmail) {
      return NextResponse.json({ error: 'Unauthorized access. Invalid team security credentials.' }, { status: 401 });
    }

    const config = await serverStore.getConfig();

    return NextResponse.json({
      success: true,
      team,
      config
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to load team portal data';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
