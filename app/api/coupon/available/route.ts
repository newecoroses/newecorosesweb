import { NextResponse } from 'next/server';
import { AVAILABLE_COUPONS } from '@/lib/coupons';

export async function GET() {
    try {
        return NextResponse.json({ coupons: AVAILABLE_COUPONS });
    } catch (err) {
        console.error('Available coupons error:', err);
        return NextResponse.json({ coupons: [] }, { status: 500 });
    }
}
