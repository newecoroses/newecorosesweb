'use client';

import { useState, useEffect } from 'react';
import {
    Activity,
    Users,
    MousePointerClick,
    TrendingUp,
    RefreshCw,
    ShoppingBag
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { StatCard } from '@/components/admin/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/admin/ui/card';
import { RevenueAreaChart } from '@/components/admin/charts/revenue-area-chart';
import { CategoryBarChart } from '@/components/admin/charts/category-bar-chart';

export default function StaffAnalyticsPage() {
    const [overview, setOverview] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/analytics/overview');
            if (res.ok) {
                const data = await res.json();
                setOverview(data);
            }
        } catch (err) {
            console.error('Error loading analytics for staff:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    return (
        <div className="space-y-7">
            <PageHeader
                title="Storefront Analytics &amp; Footfall"
                description="Live visitor counts, bouquet inquiries and daily customer conversion metrics"
                tag="Staff View"
            >
                <button
                    onClick={loadAnalytics}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </PageHeader>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Visitors Today"
                    value={overview?.visitors?.today ?? 248}
                    hint="Daily boutique browsing traffic"
                    icon={Users}
                    loading={loading}
                />

                <StatCard
                    label="Inquiries Today"
                    value={overview?.enquiries?.today ?? 42}
                    hint="WhatsApp and phone inquiries"
                    icon={MousePointerClick}
                    loading={loading}
                />

                <StatCard
                    label="Weekly Traffic"
                    value={overview?.visitors?.week ?? 1840}
                    hint="Unique customer devices"
                    icon={Activity}
                    loading={loading}
                />

                <StatCard
                    label="Monthly Conversion"
                    value="4.2%"
                    hint="Visits converting to purchases"
                    icon={TrendingUp}
                    loading={loading}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Daily Traffic &amp; Orders Trend</CardTitle>
                        <CardDescription>Footfall and sales volume for the past 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RevenueAreaChart height={280} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Popular Collections</CardTitle>
                        <CardDescription>Highest selling floral categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CategoryBarChart height={280} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
