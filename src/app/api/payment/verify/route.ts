import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      orderId, 
      paymentId, 
      signature, 
      registrationId, 
      isSandbox = false 
    } = body;

    if (!orderId || !registrationId) {
      return NextResponse.json({ error: 'Order ID and Registration ID are required' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    // Verify signature if real Razorpay secret is present
    if (!isSandbox && keySecret && signature && paymentId) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        console.error('Payment signature verification failed');
        // Mark as failed in DB if available
        if (isSupabaseConfigured() && supabase) {
          await supabase
            .from('teams')
            .update({ payment_status: 'FAILED' })
            .eq('registration_id', registrationId);
        }
        return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
      }
    }

    const confirmedPaymentId = paymentId || `pay_sim_${Date.now()}`;

    // Update database status to SUCCESS and REGISTERED
    if (isSupabaseConfigured() && supabase) {
      const { error: updateErr } = await supabase
        .from('teams')
        .update({
          payment_status: 'SUCCESS',
          payment_id: confirmedPaymentId,
          order_id: orderId,
          registration_status: 'REGISTERED'
        })
        .eq('registration_id', registrationId);

      if (updateErr) {
        console.error('Supabase payment confirmation update error:', updateErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and squad registration confirmed for Round 1',
      receipt: {
        registrationId,
        orderId,
        paymentId: confirmedPaymentId,
        amount: 100,
        currency: 'INR',
        paymentStatus: 'SUCCESS',
        registrationStatus: 'REGISTERED',
        verifiedAt: new Date().toISOString()
      }
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment verification error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
