import { NextRequest, NextResponse } from 'next/server';
import { PUBLIC_COUPONS } from '../available/route';

export async function POST(request: NextRequest) {
    try {
        const { code, subtotal } = await request.json();

        if (!code?.trim()) {
            return NextResponse.json({ valid: false, message: 'Please enter a coupon code.' });
        }

        const normalizedCode = code.toUpperCase().trim();
        const coupon = PUBLIC_COUPONS.find(c => c.code === normalizedCode);

        if (!coupon) {
            return NextResponse.json({ valid: false, message: 'Invalid coupon code.' });
        }

        // Check minimum order
        if (coupon.minOrder && subtotal < coupon.minOrder) {
            const needed = coupon.minOrder - subtotal;
            return NextResponse.json({
                valid: false,
                message: `Add ₹${needed.toLocaleString('en-IN')} more to use this coupon.`,
                needsMore: needed,
                minOrder: coupon.minOrder,
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.type === 'percent') {
            discountAmount = Math.round(subtotal * (coupon.value / 100));
            if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        } else {
            discountAmount = Math.min(coupon.value, subtotal);
        }

        return NextResponse.json({
            valid: true,
            discountAmount,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                description: coupon.description,
                maxDiscount: coupon.maxDiscount,
            },
            message: coupon.type === 'percent'
                ? `${coupon.value}% off applied! You save ₹${discountAmount.toLocaleString('en-IN')}.`
                : `₹${discountAmount.toLocaleString('en-IN')} off applied!`,
        });
    } catch (err) {
        console.error('Coupon validate error:', err);
        return NextResponse.json({ valid: false, message: 'Could not validate coupon.' }, { status: 500 });
    }
}
