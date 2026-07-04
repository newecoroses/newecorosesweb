/**
 * GET /api/admin/analytics/traffic?range=7d|30d|12m
 *
 * Returns daily or monthly visitor/enquiry counts for charting.
 * Reads from analytics_daily — never raw events.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') ?? '7d';
        const monthFilter = searchParams.get('month');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const supabase = getSupabaseAdmin() as any;
        const now = new Date();

        if (monthFilter) {
            const { data, error } = await supabase
                .from('analytics_daily')
                .select('day, pageviews, enquiries')
                .like('day', `${monthFilter}-%`)
                .order('day', { ascending: true });

            if (error) throw error;

            const [year, month] = monthFilter.split('-');
            const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
            
            const filled: { date: string; pageviews: number; enquiries: number }[] = [];
            const dataMap = new Map(((data ?? []) as any[]).map((r: any) => [r.day as string, r]));

            for (let day = 1; day <= daysInMonth; day++) {
                const dayStr = `${monthFilter}-${String(day).padStart(2, '0')}`;
                const row = dataMap.get(dayStr);
                filled.push({
                    date: dayStr,
                    pageviews: row?.pageviews ?? 0,
                    enquiries: row?.enquiries ?? 0,
                });
            }

            return NextResponse.json(filled, {
                headers: { 'Cache-Control': 's-maxage=60' },
            });
        }

        let fromDate: string;
        let groupByMonth = false;

        if (range === '12m') {
            groupByMonth = true;
            const d = new Date(now);
            d.setMonth(d.getMonth() - 11);
            d.setDate(1);
            fromDate = d.toISOString().split('T')[0];
        } else if (range === '30d') {
            const d = new Date(now);
            d.setDate(d.getDate() - 29);
            fromDate = d.toISOString().split('T')[0];
        } else {
            // 7d default
            const d = new Date(now);
            d.setDate(d.getDate() - 6);
            fromDate = d.toISOString().split('T')[0];
        }

        const { data, error } = await supabase
            .from('analytics_daily')
            .select('day, pageviews, enquiries')
            .gte('day', fromDate)
            .order('day', { ascending: true });

        if (error) throw error;

        const rows = (data ?? []) as any[];

        if (groupByMonth) {
            // Aggregate by YYYY-MM for 12-month view
            const monthMap = new Map<string, { pageviews: number; enquiries: number }>();
            for (const row of rows) {
                const month = (row.day as string).slice(0, 7); // YYYY-MM
                const existing = monthMap.get(month) ?? { pageviews: 0, enquiries: 0 };
                monthMap.set(month, {
                    pageviews: existing.pageviews + row.pageviews,
                    enquiries: existing.enquiries + row.enquiries,
                });
            }
            const result = Array.from(monthMap.entries()).map(([month, v]) => ({
                date: month,
                pageviews: v.pageviews,
                enquiries: v.enquiries,
            }));
            return NextResponse.json(result, {
                headers: { 'Cache-Control': 's-maxage=300' },
            });
        }

        // Fill gaps — ensure every day in range has an entry (even if 0)
        const filled: { date: string; pageviews: number; enquiries: number }[] = [];
        const dataMap = new Map(((data ?? []) as any[]).map((r: any) => [r.day as string, r]));

        const cursor = new Date(fromDate);
        const todayStr = now.toISOString().split('T')[0];
        while (cursor.toISOString().split('T')[0] <= todayStr) {
            const d = cursor.toISOString().split('T')[0];
            const row = dataMap.get(d);
            filled.push({ date: d, pageviews: row?.pageviews ?? 0, enquiries: row?.enquiries ?? 0 });
            cursor.setDate(cursor.getDate() + 1);
        }

        return NextResponse.json(filled, {
            headers: { 'Cache-Control': 's-maxage=60' },
        });
    } catch (error: unknown) {
        console.error('[analytics/traffic]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
