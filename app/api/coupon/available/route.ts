import { NextResponse } from 'next/server';

// Available public coupons for New Eco Roses
export const PUBLIC_COUPONS = [
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

export async function GET() {
    try {
        return NextResponse.json({ coupons: PUBLIC_COUPONS });
    } catch (err) {
        console.error('Available coupons error:', err);
        return NextResponse.json({ coupons: [] }, { status: 500 });
    }
}
