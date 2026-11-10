import { NextRequest, NextResponse } from 'next/server';
import { ordersStore, SavedOrder, getAllOrders, updateOrderStatus } from '@/lib/order-cache';
import { AVAILABLE_COUPONS, calculateDiscount } from '@/lib/coupons';
import { logStaffActivity } from '@/lib/staff-activity';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, customer, shippingAddress, specialNote, paymentMethod, discountCode, status, staffName } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, error: 'No items in order' }, { status: 400 });
        }
        if (!customer?.name || !customer?.phone) {
            return NextResponse.json({ success: false, error: 'Customer name and phone number are required' }, { status: 400 });
        }

        const resolvedEmail = customer.email?.trim() || '';
        const resolvedAddress = {
            line1: shippingAddress?.line1 || 'In-Store Pickup / Walk-in Counter',
            line2: shippingAddress?.line2 || '',
            city: shippingAddress?.city || 'Kolkata',
            state: shippingAddress?.state || 'West Bengal',
            postalCode: shippingAddress?.postalCode || '700001',
            country: shippingAddress?.country || 'India',
        };

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
            const coupon = AVAILABLE_COUPONS.find(c => c.code === code);
            if (coupon) {
                const result = calculateDiscount(coupon, subtotal);
                if (result.valid) {
                    discountAmount = result.discountAmount;
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
                email: resolvedEmail,
                phone: customer.phone.trim(),
            },
            shippingAddress: resolvedAddress,
            specialNote: specialNote || '',
            paymentMethod: paymentMethod || 'In-Store Cash',
            subtotal,
            discountAmount,
            discountCode: discountCode ? discountCode.toUpperCase() : undefined,
            shippingCost,
            total,
            status: (status as any) || 'confirmed',
            createdAt: new Date().toISOString(),
        };

        // Cache order for instant lookup
        ordersStore.set(orderNumber, newOrder);
        ordersStore.set(orderId, newOrder);

        // Log staff activity if staff member created the order
        if (staffName) {
            await logStaffActivity({
                staffId: 'staff_' + Date.now(),
                staffName: staffName,
                action: 'Created Manual Order',
                productId: orderNumber,
                productName: `${items.length} item(s) for ${customer.name}`,
                details: `Order #${orderNumber} created manually (Total ₹${total}, Method: ${paymentMethod || 'Cash'})`,
            });
        }

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

        // If no orderNumber specified, return all orders for the admin panel
        if (!orderNumber) {
            const orders = getAllOrders();
            return NextResponse.json({
                success: true,
                orders,
                total: orders.length,
            });
        }

        const order = ordersStore.get(orderNumber);
        if (!order) {
            return NextResponse.json({
                success: true,
                order: {
                    orderNumber,
                    createdAt: new Date().toISOString(),
                    total: 0,
                    status: 'confirmed',
                    paymentMethod: 'online',
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

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ success: false, error: 'Order ID and status are required' }, { status: 400 });
        }

        const updated = updateOrderStatus(orderId, status);
        if (!updated) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        try {
            await logStaffActivity({
                staffId: body.staffId || 'staff',
                staffName: body.staffName || 'Staff Member',
                action: 'Updated Order Status',
                productId: updated.orderNumber,
                productName: updated.customer.name,
                details: `Order #${updated.orderNumber} status changed to "${status}"`,
            });
        } catch (actErr) {
            console.error('Error logging order status activity:', actErr);
        }

        return NextResponse.json({
            success: true,
            order: updated,
        });
    } catch (err: any) {
        console.error('Update order error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
