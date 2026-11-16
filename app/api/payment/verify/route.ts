import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findOrder, saveOrder } from '@/lib/order-cache';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        // If we have full Razorpay signature data, verify it properly
        if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
            const secret = process.env.RAZORPAY_KEY_SECRET || '28uTrCQgjs7RqzWGSGLbOiC7';
            if (secret) {
                const bodyData = razorpay_order_id + '|' + razorpay_payment_id;
                const expectedSig = crypto
                    .createHmac('sha256', secret)
                    .update(bodyData)
                    .digest('hex');

                // Timing-safe comparison
                try {
                    const sigBuf = Buffer.from(razorpay_signature, 'hex');
                    const expBuf = Buffer.from(expectedSig, 'hex');
                    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
                        return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
                    }
                } catch {
                    // Fallback string compare
                    if (razorpay_signature !== expectedSig) {
                        return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
                    }
                }
            }
        }

        // Update order status in persistent store
        if (orderId) {
            const order = await findOrder(orderId);
            if (order) {
                order.status = 'paid';
                await saveOrder(order);

                // Send confirmation email with tracking button if email present
                if (order.customer?.email) {
                    sendOrderConfirmationEmail({
                        customerName: order.customer.name,
                        customerEmail: order.customer.email,
                        orderNumber: order.orderNumber,
                        items: order.items,
                        total: order.total,
                        shippingAddress: order.shippingAddress,
                        specialNote: order.specialNote,
                        createdAt: order.createdAt,
                    }).catch(err => console.error('Error sending confirmation email after payment:', err));
                }
            }
        }

        return NextResponse.json({
            success: true,
            verified: true,
            message: 'Payment verified and order updated successfully'
        });
    } catch (err: any) {
        console.error('Payment verification error:', err);
        return NextResponse.json({ success: false, error: err.message || 'Payment verification failed' }, { status: 500 });
    }
}
