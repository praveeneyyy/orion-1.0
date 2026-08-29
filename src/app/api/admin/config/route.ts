import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { serverStore } from '@/lib/serverStore';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

function safeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function validateAdminKey(request: Request): boolean {
  const authKey = (request.headers.get('x-admin-key') || '').trim();
  const adminSecret = (process.env.ADMIN_SECRET_KEY || '').trim();
  if (!adminSecret || adminSecret.length < 8) return false;
  return safeCompare(authKey, adminSecret);
}

export async function GET() {
  try {
    const config = await serverStore.getConfig();
    return NextResponse.json({ success: true, config });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch config';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rate = checkRateLimit(`admin-config-${clientIp}`, 15, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many configuration requests' }, { status: 429 });
    }

    if (!validateAdminKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { config, actor = 'Admin' } = body;

    if (!config) {
      return NextResponse.json({ error: 'Config payload is required' }, { status: 400 });
    }

    const updated = await serverStore.updateConfig(config, actor);
    return NextResponse.json({ success: true, config: updated });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Config update failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
