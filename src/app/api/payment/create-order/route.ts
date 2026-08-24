import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { TeamRegistrationPayload } from '@/types/orion';

export async function POST(request: Request) {
  try {
    const body: TeamRegistrationPayload = await request.json();
    const { 
      teamName, 
      leaderName, 
      leaderPhone, 
      leaderEmail, 
      institution, 
      problemStatement, 
      members, 
      declarations 
    } = body;

    // 1. Validate Section 1: Team & Leader Information
    if (!teamName?.trim()) {
      return NextResponse.json({ error: 'Team Name is required' }, { status: 400 });
    }
    if (!leaderName?.trim()) {
      return NextResponse.json({ error: 'Team Leader Name is required' }, { status: 400 });
    }

    // Validate Indian Mobile Number (10 digits, optional +91 or 0 prefix)
    const cleanPhone = (leaderPhone || '').replace(/[\s\-()]/g, '');
    const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ error: 'Invalid Team Leader Indian phone number (10 digits starting with 6-9)' }, { status: 400 });
    }

    // Validate Email
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

    // 2. Validate Section 2: Exactly 4 Team Members
    if (!Array.isArray(members) || members.length !== 4) {
      return NextResponse.json({ error: 'Exactly 4 team members are required (Total 5 participants including leader)' }, { status: 400 });
    }

    for (let i = 0; i < 4; i++) {
      const m = members[i];
      if (!m.name?.trim()) {
        return NextResponse.json({ error: `Member ${i + 1} Name is required` }, { status: 400 });
      }
      const memberCleanPhone = (m.phone || '').replace(/[\s\-()]/g, '');
      if (!phoneRegex.test(memberCleanPhone)) {
        return NextResponse.json({ error: `Invalid Member ${i + 1} phone number (10 digits starting with 6-9)` }, { status: 400 });
      }
    }

    // 3. Validate Section 3: Declarations
    if (
      !declarations?.accurateInfo ||
      !declarations?.membersBelong ||
      !declarations?.rulesAgreed ||
      !declarations?.feeUnderstood ||
      !declarations?.qualifierUnderstood
    ) {
      return NextResponse.json({ error: 'You must accept all required declaration checkboxes to proceed' }, { status: 400 });
    }

    // 4. Generate Unique Registration ID: ORN-R1-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const registrationId = `ORN-R1-${randomSuffix}`;

    // 5. Razorpay Order Creation (₹100 Flat = 10000 paise)
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const hasRazorpay = Boolean(keyId && keySecret && keyId.startsWith('rzp_'));

    let orderId = `order_sim_${Date.now()}_${randomSuffix}`;

    if (hasRazorpay) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret
        });

        const order = await razorpay.orders.create({
          amount: 10000, // ₹100 in paise
          currency: 'INR',
          receipt: registrationId,
          notes: {
            teamName,
            leaderName,
            leaderEmail,
            problemStatement,
            event: 'ORION 1.0 Round 1'
          }
        });

        orderId = order.id;
      } catch (rzpErr: unknown) {
        console.error('Razorpay order creation error:', rzpErr);
        // If razorpay fails, fall back to sandbox order
        orderId = `order_sim_${Date.now()}_${randomSuffix}`;
      }
    }

    // 6. Persist to Supabase Database (if configured)
    if (isSupabaseConfigured() && supabase) {
      // Insert Team Record
      const { data: teamData, error: teamErr } = await supabase
        .from('teams')
        .insert([
          {
            registration_id: registrationId,
            team_name: teamName.trim(),
            leader_name: leaderName.trim(),
            leader_phone: cleanPhone,
            leader_email: leaderEmail.trim().toLowerCase(),
            institution: institution.trim(),
            problem_statement: problemStatement.trim(),
            payment_status: 'PENDING',
            order_id: orderId,
            amount: 100,
            registration_status: 'PENDING'
          }
        ])
        .select('id')
        .single();

      if (teamErr) {
        console.error('Supabase team insertion error:', teamErr);
      } else if (teamData?.id) {
        // Insert 4 Team Members linked by foreign key
        const memberRows = members.map((m, idx) => ({
          team_id: teamData.id,
          member_number: idx + 1,
          member_name: m.name.trim(),
          member_phone: m.phone.replace(/[\s\-()]/g, '')
        }));

        const { error: memErr } = await supabase
          .from('team_members')
          .insert(memberRows);

        if (memErr) {
          console.error('Supabase members insertion error:', memErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      registrationId,
      orderId,
      amount: 100, // ₹100
      currency: 'INR',
      keyId: hasRazorpay ? keyId : 'rzp_test_simulation',
      isSandbox: !hasRazorpay,
      teamDetails: {
        teamName,
        leaderName,
        leaderEmail,
        problemStatement
      }
    }, { status: 201 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
