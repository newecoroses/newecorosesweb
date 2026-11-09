import { NextRequest, NextResponse } from 'next/server';
import { ordersStore } from '@/lib/order-cache';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, razorpay_order_id, razorpay_payment_id } = body;

        if (orderId && ordersStore.has(orderId)) {
            const order = ordersStore.get(orderId)!;
            order.status = 'paid';
            ordersStore.set(orderId, order);
            if (order.orderNumber) {
                ordersStore.set(order.orderNumber, order);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            paymentId: razorpay_payment_id,
        });
    } catch (err: any) {
        console.error('Payment verify error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
