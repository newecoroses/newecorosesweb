import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/order-cache';
import { verifyStaffToken } from '@/lib/staff-auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/staff/notify
 * Returns unacknowledged orders assigned to the requesting store (via cookie).
 */
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('staff_token')?.value;
        if (!token) return NextResponse.json({ unacknowledged: [] });

        const session = verifyStaffToken(token);
        if (!session || session.storeId === 'director') {
            return NextResponse.json({ unacknowledged: [] });
        }

        const storeId = session.storeId as 'tollygunge' | 'alipore';
        const all = await getAllOrders();
        const cutoff = Date.now() - 24 * 60 * 60 * 1000; // last 24h

        const unacknowledged = all.filter(o =>
            o.assignedStore === storeId &&
            o.storeAcknowledged === false &&
            o.assignedAt &&
            new Date(o.assignedAt).getTime() > cutoff
        );

        return NextResponse.json({ unacknowledged });
    } catch (err: any) {
        return NextResponse.json({ unacknowledged: [], error: err.message });
    }
}
