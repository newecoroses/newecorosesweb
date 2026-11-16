import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '../send-otp/route';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 });
    }

    const record = otpStore.get(email);

    if (!record) {
      return NextResponse.json({ success: false, error: 'No OTP found. Please request a new one.' }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return NextResponse.json({ success: false, error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    if (record.otp !== otp.toString().trim()) {
      return NextResponse.json({ success: false, error: 'Invalid OTP. Please check and try again.' }, { status: 400 });
    }

    // Clear OTP after successful verification
    otpStore.delete(email);

    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
