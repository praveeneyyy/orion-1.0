import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rate = checkRateLimit(`team-pay-${clientIp}`, 15, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
    }

    const body = await request.json();
    const { teamId, accessToken, utrNumber, payerName, amount } = body;

    if (!teamId?.trim()) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }
    if (!utrNumber?.trim()) {
      return NextResponse.json({ error: 'UTR / Transaction Reference Number is required' }, { status: 400 });
    }
    if (!payerName?.trim()) {
      return NextResponse.json({ error: 'Payer Name is required' }, { status: 400 });
    }

    const cleanUTR = utrNumber.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleanUTR.length < 6 || cleanUTR.length > 30) {
      return NextResponse.json({ error: 'Invalid UTR / Transaction Reference format (6-30 alphanumeric characters)' }, { status: 400 });
    }

    const team = await serverStore.getTeam(teamId.trim());
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // If access token is passed, verify it
    if (accessToken) {
      const cleanToken = String(accessToken).trim().toLowerCase();
      if (cleanToken !== team.access_token.toLowerCase() && cleanToken !== team.leader_email.toLowerCase()) {
        return NextResponse.json({ error: 'Unauthorized. Invalid Team Passcode.' }, { status: 401 });
      }
    }

    const result = await serverStore.submitPayment(team.id, {
      utrNumber: cleanUTR,
      payerName: payerName.trim(),
      amount: amount || 100
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to submit payment' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment reference submitted successfully. Organizers will verify and unlock Round 1.',
      payment: result.payment
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment submission error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
