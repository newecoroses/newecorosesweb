/**
 * GET /api/admin/analytics/logs
 *
 * Paginated enquiry event log with search, filters, and CSV export.
 *
 * Query params:
 *   page    - 1-indexed (default: 1)
 *   limit   - rows per page (default: 50, max: 200)
 *   search  - partial match on product_name
 *   device  - 'mobile' | 'tablet' | 'desktop'
 *   from    - ISO date string (start)
 *   to      - ISO date string (end)
 *   format  - 'csv' to export
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
        const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);
        const search = searchParams.get('search') ?? '';
        const device = searchParams.get('device') ?? '';
        const from = searchParams.get('from') ?? '';
        const to = searchParams.get('to') ?? '';
        const format = searchParams.get('format') ?? '';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = getSupabaseAdmin() as any;

        // For CSV export, fetch all (up to 5000 rows)
        const exportLimit = format === 'csv' ? 5000 : limit;
        const offset = (page - 1) * limit;

        let query = db
            .from('analytics_events')
            .select('id, created_at, product_name, page_url, session_id, device_type, browser', { count: 'exact' })
            .eq('event_type', 'enquiry')
            .order('created_at', { ascending: false });

        if (search) query = query.ilike('product_name', `%${search}%`);
        if (device) query = query.eq('device_type', device);
        if (from) query = query.gte('created_at', from);
        if (to) {
            // Include full day
            const toDate = new Date(to);
            toDate.setDate(toDate.getDate() + 1);
            query = query.lt('created_at', toDate.toISOString());
        }

        if (format === 'csv') {
            query = query.limit(exportLimit);
        } else {
            query = query.range(offset, offset + limit - 1);
        }

        const { data, count, error } = await query;
        if (error) throw error;

        // ── CSV Export ────────────────────────────────────────────────────
        if (format === 'csv') {
            const rows = (data ?? []) as any[];
            const headers = ['ID', 'Timestamp', 'Product', 'Page URL', 'Session', 'Device', 'Browser'];
            const csvRows = rows.map(r => [
                r.id,
                r.created_at,
                r.product_name ?? '',
                r.page_url ?? '',
                r.session_id ?? '',
                r.device_type ?? '',
                r.browser ?? '',
            ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

            const csv = [headers.join(','), ...csvRows].join('\n');
            return new NextResponse(csv, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="enquiry-logs-${new Date().toISOString().split('T')[0]}.csv"`,
                },
            });
        }

        return NextResponse.json({
            rows: data ?? [],
            total: count ?? 0,
            page,
            limit,
            totalPages: Math.ceil((count ?? 0) / limit),
        });
    } catch (error: unknown) {
        console.error('[analytics/logs]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
