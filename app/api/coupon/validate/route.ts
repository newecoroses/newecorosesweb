import { NextRequest, NextResponse } from 'next/server';
import { AVAILABLE_COUPONS, calculateDiscount } from '@/lib/coupons';

export async function POST(request: NextRequest) {
    try {
        const { code, subtotal } = await request.json();

        if (!code?.trim()) {
            return NextResponse.json({ valid: false, message: 'Please enter a coupon code.' });
        }

        const normalizedCode = code.toUpperCase().trim();
        const coupon = AVAILABLE_COUPONS.find(c => c.code === normalizedCode);

        if (!coupon) {
            return NextResponse.json({ valid: false, message: 'Invalid coupon code.' });
        }

        const result = calculateDiscount(coupon, subtotal);

        return NextResponse.json({
            valid: result.valid,
            discountAmount: result.discountAmount,
            coupon,
            message: result.message,
        });
    } catch (err) {
        console.error('Coupon validate error:', err);
        return NextResponse.json({ valid: false, message: 'Could not validate coupon.' }, { status: 500 });
    }
}
