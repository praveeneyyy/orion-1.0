import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import type { TeamRegistrationPayload } from '@/types/orion';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rate = checkRateLimit(`reg-${clientIp}`, 15, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ 
        error: `Too many registration attempts. Please wait ${rate.resetInSec}s before submitting again.` 
      }, { status: 429 });
    }

    const config = await serverStore.getConfig();
    if (!config.registrationOpen) {
      return NextResponse.json({ error: 'Registrations are currently closed by the organizers.' }, { status: 403 });
    }

    const body: TeamRegistrationPayload = await request.json();
    const {
      teamName,
      leaderName,
      leaderPhone,
      leaderEmail,
      institution,
      department,
      year,
      problemStatement,
      members,
      declarations
    } = body;

    // 1. Validation: Team & Leader Information
    if (!teamName?.trim()) {
      return NextResponse.json({ error: 'Team Name is required' }, { status: 400 });
    }
    if (!leaderName?.trim()) {
      return NextResponse.json({ error: 'Team Leader Name is required' }, { status: 400 });
    }

    const cleanPhone = (leaderPhone || '').replace(/[\s\-()]/g, '');
    const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ error: 'Invalid Team Leader Indian phone number (10 digits starting with 6-9)' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leaderEmail?.trim())) {
      return NextResponse.json({ error: 'Invalid Team Leader email address' }, { status: 400 });
    }

    if (!institution?.trim()) {
      return NextResponse.json({ error: 'Institution / College name is required' }, { status: 400 });
    }
    if (!problemStatement?.trim()) {
      return NextResponse.json({ error: 'Please select a Problem Statement' }, { status: 400 });
    }

    // 2. Validation: Members (1 to 5 members supported, e.g. squad of 2 to 6 total)
    if (!Array.isArray(members) || members.length < 1 || members.length > 5) {
      return NextResponse.json({ error: 'Team must have between 1 and 5 members in addition to the Leader (2 to 6 total squad members)' }, { status: 400 });
    }

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name?.trim()) {
        return NextResponse.json({ error: `Member ${i + 1} Name is required` }, { status: 400 });
      }
      const memberCleanPhone = (m.phone || '').replace(/[\s\-()]/g, '');
      if (!phoneRegex.test(memberCleanPhone)) {
        return NextResponse.json({ error: `Invalid Member ${i + 1} phone number (10 digits starting with 6-9)` }, { status: 400 });
      }
    }

    // 3. Declarations
    if (declarations) {
      const { accurateInfo, membersBelong, rulesAgreed, feeUnderstood, qualifierUnderstood } = declarations;
      if (!accurateInfo || !membersBelong || !rulesAgreed || !feeUnderstood || !qualifierUnderstood) {
        return NextResponse.json({ error: 'You must accept all required declaration checkboxes to proceed' }, { status: 400 });
      }
    }

    // 4. Register Team via Store Layer (With Duplicate & Suspicion Analysis)
    const { team, suspicionFlags } = await serverStore.registerTeam({
      teamName,
      leaderName,
      leaderPhone,
      leaderEmail,
      institution,
      department,
      year,
      problemStatement,
      members
    });

    return NextResponse.json({
      success: true,
      message: 'Team successfully registered for ORION 1.0',
      team: {
        id: team.id,
        teamId: team.registration_id,
        teamName: team.team_name,
        leaderName: team.leader_name,
        leaderEmail: team.leader_email,
        leaderPhone: team.leader_phone,
        institution: team.institution,
        track: team.problem_statement,
        accessToken: team.access_token,
        paymentStatus: team.payment_status,
        round1Status: team.round_1_status,
        round2Status: team.round_2_status,
        membersCount: team.members.length + 1
      },
      paymentInstructions: {
        amount: config.round1FeeInr,
        upiId: config.upiId,
        payeeName: config.upiPayeeName,
        qrCodeUrl: config.upiQrCodeUrl
      },
      hasSuspicionFlags: suspicionFlags.length > 0
    }, { status: 201 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
