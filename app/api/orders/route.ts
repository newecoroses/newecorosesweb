import { NextRequest, NextResponse } from 'next/server';
import { ordersStore, SavedOrder } from '@/lib/order-cache';
import { PUBLIC_COUPONS } from '../coupon/available/route';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, customer, shippingAddress, specialNote, paymentMethod, discountCode } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, error: 'No items in order' }, { status: 400 });
        }
        if (!customer?.email || !customer?.name || !customer?.phone) {
            return NextResponse.json({ success: false, error: 'Customer details are required' }, { status: 400 });
        }
        if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.postalCode) {
            return NextResponse.json({ success: false, error: 'Shipping address is required' }, { status: 400 });
        }

        // Calculate subtotal
        const subtotal = items.reduce((sum: number, item: any) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 1;
            return sum + (price * qty);
        }, 0);

        // Calculate discount
        let discountAmount = 0;
        if (discountCode) {
            const code = discountCode.toUpperCase().trim();
            const coupon = PUBLIC_COUPONS.find(c => c.code === code);
            if (coupon && (!coupon.minOrder || subtotal >= coupon.minOrder)) {
                if (coupon.type === 'percent') {
                    discountAmount = Math.round(subtotal * (coupon.value / 100));
                    if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
                } else {
                    discountAmount = Math.min(coupon.value, subtotal);
                }
            }
        }

        const shippingCost = 0; // Free delivery in Kolkata & West Bengal
        const total = Math.max(0, subtotal - discountAmount + shippingCost);

        const orderNumber = `NER-${Math.floor(100000 + Math.random() * 900000)}`;
        const orderId = 'ord_' + Date.now();

        const newOrder: SavedOrder = {
            id: orderId,
            orderNumber,
            items: items.map((i: any) => ({
                id: i.id || i.productId || 'item',
                name: i.name,
                slug: i.slug || '',
                price: Number(i.price) || 0,
                quantity: Number(i.quantity) || 1,
                image_url: i.image_url || i.image || '',
            })),
            customer: {
                name: customer.name.trim(),
                email: customer.email.trim(),
                phone: customer.phone.trim(),
            },
            shippingAddress: {
                line1: shippingAddress.line1,
                line2: shippingAddress.line2 || '',
                city: shippingAddress.city,
                state: shippingAddress.state,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country || 'India',
            },
            specialNote: specialNote || '',
            paymentMethod: paymentMethod || 'cod',
            subtotal,
            discountAmount,
            discountCode: discountCode ? discountCode.toUpperCase() : undefined,
            shippingCost,
            total,
            status: paymentMethod === 'cod' ? 'confirmed' : 'pending_payment',
            createdAt: new Date().toISOString(),
        };

        // Cache order for instant lookup on confirmation page
        ordersStore.set(orderNumber, newOrder);
        ordersStore.set(orderId, newOrder);

        return NextResponse.json({
            success: true,
            order: newOrder,
        });
    } catch (err: any) {
        console.error('Order creation error:', err);
        return NextResponse.json({ success: false, error: err.message || 'Failed to create order' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderNumber = searchParams.get('orderNumber');

        if (!orderNumber) {
            return NextResponse.json({ success: false, error: 'Order number is required' }, { status: 400 });
        }

        const order = ordersStore.get(orderNumber);
        if (!order) {
            // Return placeholder order structure if server container restarted
            return NextResponse.json({
                success: true,
                order: {
                    orderNumber,
                    createdAt: new Date().toISOString(),
                    total: 0,
                    status: 'confirmed',
                    customer: { name: 'Customer', email: '', phone: '' },
                    shippingAddress: { city: 'Kolkata', state: 'West Bengal' },
                },
            });
        }

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (err: any) {
        console.error('Fetch order error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
