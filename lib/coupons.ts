export interface Coupon {
    code: string;
    description: string;
    type: 'percent' | 'fixed';
    value: number;
    maxDiscount?: number;
    minOrder?: number;
}

export const AVAILABLE_COUPONS: Coupon[] = [
    {
        code: 'WELCOME10',
        description: '10% off on your flower order',
        type: 'percent',
        value: 10,
        maxDiscount: 300,
        minOrder: 499,
    },
    {
        code: 'ROSELOVE',
        description: '15% off on bouquets & luxury hampers above ₹1,499',
        type: 'percent',
        value: 15,
        maxDiscount: 500,
        minOrder: 1499,
    },
    {
        code: 'ECOFLOWER',
        description: 'Flat ₹100 off on fresh flowers & arrangements',
        type: 'fixed',
        value: 100,
        minOrder: 999,
    },
    {
        code: 'FESTIVE20',
        description: '20% off on celebratory bouquets & gifts above ₹2,499',
        type: 'percent',
        value: 20,
        maxDiscount: 800,
        minOrder: 2499,
    },
];

export function calculateDiscount(coupon: Coupon, subtotal: number): { valid: boolean; discountAmount: number; message: string } {
    if (coupon.minOrder && subtotal < coupon.minOrder) {
        const needed = coupon.minOrder - subtotal;
        return {
            valid: false,
            discountAmount: 0,
            message: `Add ₹${needed.toLocaleString('en-IN')} more to unlock this code`,
        };
    }

    let discountAmount = 0;
    if (coupon.type === 'percent') {
        discountAmount = Math.round(subtotal * (coupon.value / 100));
        if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else {
        discountAmount = Math.min(coupon.value, subtotal);
    }

    return {
        valid: true,
        discountAmount,
        message: coupon.type === 'percent'
            ? `${coupon.value}% OFF applied! You save ₹${discountAmount.toLocaleString('en-IN')}`
            : `₹${discountAmount.toLocaleString('en-IN')} OFF applied!`,
    };
}
