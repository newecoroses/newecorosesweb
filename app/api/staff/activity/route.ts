import { NextResponse } from 'next/server';
import { getStaffSession } from '@/lib/staff-session';
import { getStaffActivityLogs } from '@/lib/staff-activity';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const session = await getStaffSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = Number(searchParams.get('limit') || 100);

        const logs = await getStaffActivityLogs(limit);
        return NextResponse.json({ logs });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
