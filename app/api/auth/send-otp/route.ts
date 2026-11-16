import { NextRequest, NextResponse } from 'next/server';
import { sendOtpEmail } from '@/lib/email';

// In-memory OTP store (survives HMR in dev, good enough for serverless warm containers)
const globalForOtp = global as unknown as { nerOtpStore?: Map<string, { otp: string; name: string; expiresAt: number; attempts: number }> };
export const otpStore = globalForOtp.nerOtpStore || new Map<string, { otp: string; name: string; expiresAt: number; attempts: number }>();
if (process.env.NODE_ENV !== 'production') globalForOtp.nerOtpStore = otpStore;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }

    // Rate limit: max 3 OTPs per email per 10 min
    const existing = otpStore.get(email);
    if (existing && existing.expiresAt > Date.now() && existing.attempts >= 3) {
      return NextResponse.json({ success: false, error: 'Too many attempts. Please wait 10 minutes.' }, { status: 429 });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email, {
      otp,
      name: name || 'Customer',
      expiresAt,
      attempts: (existing?.attempts || 0) + 1,
    });

    await sendOtpEmail({ customerName: name || 'Customer', customerEmail: email, otp });

    return NextResponse.json({ success: true, message: 'OTP sent to your email' });
  } catch (err: any) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to send OTP' }, { status: 500 });
  }
}
