/**
 * GET /api/admin/analytics/devices
 *
 * Returns device breakdown (mobile / tablet / desktop) with percentages.
 * Reads analytics_events for last 30 days, limited to 10k rows.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = Math.min(parseInt(searchParams.get('days') ?? '30', 10), 90);
        const monthFilter = searchParams.get('month');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = getSupabaseAdmin() as any;

        let allData: any[] = [];
        let hasMore = true;
        let offset = 0;
        const batchSize = 1000;

        while (hasMore) {
            let query = db
                .from('analytics_events')
                .select('device_type')
                .eq('event_type', 'pageview')
                .range(offset, offset + batchSize - 1);

            if (monthFilter) {
                const start = `${monthFilter}-01T00:00:00Z`;
                const [y, m] = monthFilter.split('-');
                const end = new Date(parseInt(y), parseInt(m), 1).toISOString();
                query = query.gte('created_at', start).lt('created_at', end);
            } else {
                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - (days - 1));
                fromDate.setHours(0, 0, 0, 0);
                query = query.gte('created_at', fromDate.toISOString());
            }

            const { data, error } = await query;
            if (error) throw error;

            allData = allData.concat(data || []);

            if ((data || []).length < batchSize) {
                hasMore = false;
            } else {
                offset += batchSize;
            }
        }

        const counts: Record<string, number> = {
            mobile: 0,
            tablet: 0,
            desktop: 0,
        };

        for (const row of allData) {
            const device = (row.device_type as string) ?? 'desktop';
            counts[device] = (counts[device] ?? 0) + 1;
        }

        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        const result = Object.entries(counts).map(([device, count]) => ({
            device: device.charAt(0).toUpperCase() + device.slice(1),
            count,
            percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0,
        }));

        return NextResponse.json(result, {
            headers: { 'Cache-Control': 's-maxage=300' },
        });
    } catch (error: unknown) {
        console.error('[analytics/devices]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
