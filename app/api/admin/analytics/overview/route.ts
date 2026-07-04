/**
 * GET /api/admin/analytics/overview
 *
 * Returns visitor and enquiry counts for today, this week, this month, and all-time.
 * Reads primarily from analytics_daily (pre-aggregated) — fast, no expensive scans.
 * Cached for 60 seconds via Cache-Control.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const monthFilter = searchParams.get('month');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = getSupabaseAdmin() as any;
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        if (monthFilter) {
            const { data: dailyRows, error } = await db
                .from('analytics_daily')
                .select('day, pageviews, enquiries')
                .like('day', `${monthFilter}-%`);

            if (error) throw error;

            let visitorsMonth = 0, enquiriesMonth = 0;
            for (const row of (dailyRows ?? []) as any[]) {
                visitorsMonth += row.pageviews;
                enquiriesMonth += row.enquiries;
            }

            return NextResponse.json({
                visitors: {
                    today: 0,
                    week: 0,
                    month: visitorsMonth,
                    total: visitorsMonth,
                },
                enquiries: {
                    today: 0,
                    week: 0,
                    month: enquiriesMonth,
                    total: enquiriesMonth,
                },
            });
        }

        // Start of this week (Monday)
        const dayOfWeek = now.getDay(); // 0 = Sun
        const daysFromMonday = (dayOfWeek + 6) % 7;
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - daysFromMonday);
        const weekStartStr = weekStart.toISOString().split('T')[0];

        // Start of this month
        const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

        // Fetch all daily rows from the start of this month (covers today, week, month)
        const { data: dailyRows } = await db
            .from('analytics_daily')
            .select('day, pageviews, enquiries')
            .gte('day', monthStartStr)
            .order('day', { ascending: true });

        // Fetch all-time totals (single aggregation on the pre-aggregated table — fast)
        const { data: totalsData } = await db
            .from('analytics_daily')
            .select('pageviews, enquiries');

        const rows = (dailyRows ?? []) as any[];
        const allRows = (totalsData ?? []) as any[];

        let visitorsToday = 0, visitorsWeek = 0, visitorsMonth = 0;
        let enquiriesToday = 0, enquiriesWeek = 0, enquiriesMonth = 0;
        let totalVisitors = 0, totalEnquiries = 0;

        for (const row of rows) {
            const d = row.day as string;
            visitorsMonth += row.pageviews;
            enquiriesMonth += row.enquiries;
            if (d >= weekStartStr) {
                visitorsWeek += row.pageviews;
                enquiriesWeek += row.enquiries;
            }
            if (d === todayStr) {
                visitorsToday = row.pageviews;
                enquiriesToday = row.enquiries;
            }
        }

        for (const row of allRows) {
            totalVisitors += row.pageviews;
            totalEnquiries += row.enquiries;
        }

        return NextResponse.json({
            visitors: {
                today: visitorsToday,
                week: visitorsWeek,
                month: visitorsMonth,
                total: totalVisitors,
            },
            enquiries: {
                today: enquiriesToday,
                week: enquiriesWeek,
                month: enquiriesMonth,
                total: totalEnquiries,
            },
        }, {
            headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' },
        });
    } catch (error: unknown) {
        console.error('[analytics/overview]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
