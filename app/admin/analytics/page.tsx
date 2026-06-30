'use client';

/**
 * /admin/analytics — Analytics Dashboard
 *
 * All data is fetched client-side only when this page is opened.
 * Charts are loaded dynamically (no SSR) so recharts is never bundled
 * into pages that don't need it.
 *
 * Sections:
 * 1. Overview Cards
 * 2. Traffic Graph
 * 3. Enquiry Analytics
 * 4. Product Performance
 * 5. Peak Traffic Hours
 * 6. Real-Time Visitors
 * 7. Enquiry Logs
 * 8. Traffic Sources
 * 9. Device Analytics
 */

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
    Users, MousePointerClick, TrendingUp, Activity,
    Smartphone, Monitor, Tablet, Globe, ChevronDown,
    Download, Search, RefreshCw, ArrowUpDown, Wifi,
} from 'lucide-react';

// ── Dynamic chart imports (loaded only when this page opens) ───────────────
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(m => m.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });

// ── Types ──────────────────────────────────────────────────────────────────

interface Overview {
    visitors: { today: number; week: number; month: number; total: number };
    enquiries: { today: number; week: number; month: number; total: number };
}

interface TrafficRow { date: string; pageviews: number; enquiries: number }
interface ProductRow {
    product_id: string; product_name: string;
    total_views: number; total_enquiries: number;
    conversion_rate: number; last_enquiry_at: string | null;
}
interface HourRow { hour: number; count: number }
interface RealtimeData { online: number; activePages: { page: string; count: number }[] }
interface LogRow {
    id: number; created_at: string; product_name: string | null;
    page_url: string | null; session_id: string | null;
    device_type: string | null; browser: string | null;
}
interface LogsData { rows: LogRow[]; total: number; totalPages: number }
interface SourceRow { source: string; count: number; percentage: number }
interface DeviceRow { device: string; count: number; percentage: number }

// ── Constants ──────────────────────────────────────────────────────────────

const CHART_COLORS = ['#10b981', '#6366f1', '#f43f5e', '#eab308', '#06b6d4', '#a855f7'];
const DEVICE_COLORS: Record<string, string> = {
    Mobile: '#f43f5e', Desktop: '#6366f1', Tablet: '#eab308',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number | undefined): string {
    if (n === undefined || n === null) return '—';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

function fmtDate(iso: string): string {
    try { return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }); }
    catch { return iso; }
}

function fmtDateTime(iso: string): string {
    try { return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); }
    catch { return iso; }
}

function fmtHour(h: number): string {
    const ampm = h < 12 ? 'AM' : 'PM';
    const h12 = h % 12 || 12;
    return `${h12}${ampm}`;
}

// ── Custom tooltip wrapper for recharts ───────────────────────────────────
const ChartTooltipStyle = {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#f9fafb',
    fontSize: '12px',
};

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-5">
            <h2 className="text-white font-semibold text-base">{title}</h2>
            {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
    );
}

function StatCard({
    label, value, sub, icon: Icon, gradient, loading,
}: {
    label: string; value: number | undefined; sub?: string;
    icon: React.ElementType; gradient: string; loading: boolean;
}) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
                <Icon size={18} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">
                {loading ? (
                    <span className="w-14 h-7 bg-gray-800 rounded animate-pulse inline-block" />
                ) : fmt(value)}
            </p>
            <p className="text-gray-400 text-xs">{label}</p>
            {sub && <p className="text-gray-600 text-[10px] mt-0.5">{sub}</p>}
        </div>
    );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 ${className}`}>
            {children}
        </div>
    );
}

function LoadingBar() {
    return <div className="h-48 bg-gray-800/60 rounded-xl animate-pulse" />;
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
    // Data state
    const [overview, setOverview] = useState<Overview | null>(null);
    const [traffic, setTraffic] = useState<TrafficRow[]>([]);
    const [trafficRange, setTrafficRange] = useState<'7d' | '30d' | '12m'>('7d');
    const [products, setProducts] = useState<ProductRow[]>([]);
    const [productSort, setProductSort] = useState<'enquiries' | 'views' | 'conversion'>('enquiries');
    const [hourlyPageviews, setHourlyPageviews] = useState<HourRow[]>([]);
    const [hourlyEnquiries, setHourlyEnquiries] = useState<HourRow[]>([]);
    const [realtime, setRealtime] = useState<RealtimeData>({ online: 0, activePages: [] });
    const [logs, setLogs] = useState<LogsData>({ rows: [], total: 0, totalPages: 1 });
    const [logsPage, setLogsPage] = useState(1);
    const [logsSearch, setLogsSearch] = useState('');
    const [logsDevice, setLogsDevice] = useState('');
    const [sources, setSources] = useState<SourceRow[]>([]);
    const [devices, setDevices] = useState<DeviceRow[]>([]);

    // Loading state
    const [loadingOverview, setLoadingOverview] = useState(true);
    const [loadingTraffic, setLoadingTraffic] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingHourly, setLoadingHourly] = useState(true);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [loadingMisc, setLoadingMisc] = useState(true);

    // ── Fetch functions ──────────────────────────────────────────────────

    const fetchOverview = useCallback(async () => {
        setLoadingOverview(true);
        try {
            const res = await fetch('/api/admin/analytics/overview');
            if (res.ok) setOverview(await res.json());
        } finally { setLoadingOverview(false); }
    }, []);

    const fetchTraffic = useCallback(async (range: string) => {
        setLoadingTraffic(true);
        try {
            const res = await fetch(`/api/admin/analytics/traffic?range=${range}`);
            if (res.ok) setTraffic(await res.json());
        } finally { setLoadingTraffic(false); }
    }, []);

    const fetchProducts = useCallback(async (sort: string) => {
        setLoadingProducts(true);
        try {
            const res = await fetch(`/api/admin/analytics/products?sort=${sort}`);
            if (res.ok) setProducts(await res.json());
        } finally { setLoadingProducts(false); }
    }, []);

    const fetchHourly = useCallback(async () => {
        setLoadingHourly(true);
        try {
            const [pvRes, enqRes] = await Promise.all([
                fetch('/api/admin/analytics/hourly?type=pageview'),
                fetch('/api/admin/analytics/hourly?type=enquiry'),
            ]);
            if (pvRes.ok) setHourlyPageviews(await pvRes.json());
            if (enqRes.ok) setHourlyEnquiries(await enqRes.json());
        } finally { setLoadingHourly(false); }
    }, []);

    const fetchRealtime = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/analytics/realtime');
            if (res.ok) setRealtime(await res.json());
        } catch { /* ignore */ }
    }, []);

    const fetchLogs = useCallback(async (page: number, search: string, device: string) => {
        setLoadingLogs(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '25' });
            if (search) params.set('search', search);
            if (device) params.set('device', device);
            const res = await fetch(`/api/admin/analytics/logs?${params}`);
            if (res.ok) setLogs(await res.json());
        } finally { setLoadingLogs(false); }
    }, []);

    const fetchMisc = useCallback(async () => {
        setLoadingMisc(true);
        try {
            const [srcRes, devRes] = await Promise.all([
                fetch('/api/admin/analytics/sources'),
                fetch('/api/admin/analytics/devices'),
            ]);
            if (srcRes.ok) setSources(await srcRes.json());
            if (devRes.ok) setDevices(await devRes.json());
        } finally { setLoadingMisc(false); }
    }, []);

    // ── Initial load ───────────────────────────────────────────────────────
    useEffect(() => {
        fetchOverview();
        fetchTraffic('7d');
        fetchProducts('enquiries');
        fetchHourly();
        fetchMisc();
        fetchLogs(1, '', '');

        // Realtime polling: immediately + every 30s
        fetchRealtime();
        const interval = setInterval(fetchRealtime, 30_000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Re-fetch on filter changes ─────────────────────────────────────────
    useEffect(() => { fetchTraffic(trafficRange); }, [trafficRange, fetchTraffic]);
    useEffect(() => { fetchProducts(productSort); }, [productSort, fetchProducts]);
    useEffect(() => { fetchLogs(logsPage, logsSearch, logsDevice); }, [logsPage, logsSearch, logsDevice, fetchLogs]);

    // ── CSV Export ─────────────────────────────────────────────────────────
    const exportCSV = () => {
        const params = new URLSearchParams({ format: 'csv' });
        if (logsSearch) params.set('search', logsSearch);
        if (logsDevice) params.set('device', logsDevice);
        window.open(`/api/admin/analytics/logs?${params}`, '_blank');
    };

    // ── Chart label formatters ─────────────────────────────────────────────
    const trafficXLabel = (d: string) => {
        if (trafficRange === '12m') {
            const [year, month] = d.split('-');
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-IN', { month: 'short' });
        }
        if (trafficRange === '30d') {
            return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        }
        return new Date(d).toLocaleDateString('en-IN', { weekday: 'short' });
    };

    // ── Custom Tooltips ───────────────────────────────────────────────────
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-950/95 backdrop-blur-md border border-gray-800 rounded-xl p-3.5 shadow-2xl">
                    <p className="text-gray-400 text-xs font-semibold mb-2">{trafficXLabel(label)}</p>
                    <div className="space-y-1.5">
                        {payload.map((p: any) => (
                            <div key={p.name} className="flex items-center gap-4 justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.fill }} />
                                    <span className="text-gray-300 text-xs">{p.name}</span>
                                </div>
                                <span className="text-white text-xs font-bold">{fmt(p.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    const BarTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const formattedDate = new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            return (
                <div className="bg-gray-950/95 backdrop-blur-md border border-gray-800 rounded-xl p-3.5 shadow-2xl">
                    <p className="text-gray-400 text-xs font-semibold mb-2">{formattedDate}</p>
                    <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#f43f5e]" />
                            <span className="text-gray-300 text-xs">Enquiries</span>
                        </div>
                        <span className="text-white text-xs font-bold">{fmt(payload[0].value)}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    const HourTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const isVisitor = payload[0].name === 'Visitors';
            return (
                <div className="bg-gray-950/95 backdrop-blur-md border border-gray-800 rounded-xl p-3 shadow-2xl">
                    <p className="text-gray-400 text-xs font-semibold mb-1.5">{fmtHour(Number(label))}</p>
                    <div className="flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isVisitor ? '#10b981' : '#f43f5e' }} />
                            <span className="text-gray-300 text-xs">{payload[0].name}</span>
                        </div>
                        <span className="text-white text-xs font-bold">{fmt(payload[0].value)}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-12">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics</h1>
                    <p className="text-gray-400 text-sm mt-1">Real-time insights for New Eco Roses</p>
                </div>
                <button
                    onClick={() => { fetchOverview(); fetchRealtime(); }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-800 transition-all"
                >
                    <RefreshCw size={13} />
                    Refresh
                </button>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 1: OVERVIEW CARDS
            ───────────────────────────────────────────────────────────── */}
            <section>
                <SectionHeader title="Overview" subtitle="Visitors and enquiry counts across all time periods" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <StatCard label="Visitors Today" value={overview?.visitors.today} icon={Users} gradient="from-blue-500 to-blue-600" loading={loadingOverview} />
                    <StatCard label="Visitors This Week" value={overview?.visitors.week} icon={Users} gradient="from-indigo-500 to-indigo-600" loading={loadingOverview} />
                    <StatCard label="Visitors This Month" value={overview?.visitors.month} icon={Users} gradient="from-violet-500 to-violet-600" loading={loadingOverview} />
                    <StatCard label="Total Visitors" value={overview?.visitors.total} icon={TrendingUp} gradient="from-purple-500 to-purple-600" loading={loadingOverview} />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Enquiries Today" value={overview?.enquiries.today} icon={MousePointerClick} gradient="from-emerald-500 to-emerald-600" loading={loadingOverview} />
                    <StatCard label="Enquiries This Week" value={overview?.enquiries.week} icon={MousePointerClick} gradient="from-green-500 to-green-600" loading={loadingOverview} />
                    <StatCard label="Enquiries This Month" value={overview?.enquiries.month} icon={MousePointerClick} gradient="from-teal-500 to-teal-600" loading={loadingOverview} />
                    <StatCard label="Total Enquiries" value={overview?.enquiries.total} icon={Activity} gradient="from-cyan-500 to-cyan-600" loading={loadingOverview} />
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 2: TRAFFIC GRAPH
            ───────────────────────────────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-white font-semibold text-base">Traffic Graph</h2>
                        <p className="text-gray-500 text-xs mt-0.5">Daily visitors and enquiries over time</p>
                    </div>
                    <div className="flex gap-2">
                        {(['7d', '30d', '12m'] as const).map(r => (
                            <button
                                key={r}
                                onClick={() => setTrafficRange(r)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    trafficRange === r
                                        ? 'bg-zinc-100 text-zinc-900'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last 12 Months'}
                            </button>
                        ))}
                    </div>
                </div>
                <Card>
                    {loadingTraffic ? <LoadingBar /> : (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={traffic} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.15} />
                                <XAxis dataKey="date" tickFormatter={trafficXLabel} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="pageviews" name="Visitors" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPageviews)" dot={false} activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2 }} />
                                <Area type="monotone" dataKey="enquiries" name="Enquiries" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorEnquiries)" dot={false} activeDot={{ r: 4, stroke: '#f43f5e', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                    <div className="flex gap-6 mt-4 justify-center">
                        <div className="flex items-center gap-2"><span className="w-3 h-1 bg-[#10b981] inline-block rounded-full" /><span className="text-gray-400 text-xs font-medium">Visitors</span></div>
                        <div className="flex items-center gap-2"><span className="w-3 h-1 bg-[#f43f5e] inline-block rounded-full" /><span className="text-gray-400 text-xs font-medium">Enquiries</span></div>
                    </div>
                </Card>
            </section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 3: ENQUIRY ANALYTICS
            ───────────────────────────────────────────────────────────── */}
            <section>
                <SectionHeader title="Enquiry Analytics" subtitle="Click performance for 'Enquire Now' buttons across the site" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                        <p className="text-white text-sm font-medium mb-4">Enquiries Per Day (Last 30 Days)</p>
                        {loadingTraffic ? <LoadingBar /> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={traffic.slice(-30)} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="barEnquiries" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.2}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.15} />
                                    <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                    <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<BarTooltip />} />
                                    <Bar dataKey="enquiries" name="Enquiries" fill="url(#barEnquiries)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                    <Card>
                        <p className="text-white text-sm font-medium mb-4">Summary Stats</p>
                        <div className="space-y-3">
                            {[
                                { label: 'Total Enquiry Clicks (All Time)', value: overview?.enquiries.total },
                                { label: 'Enquiries This Month', value: overview?.enquiries.month },
                                { label: 'Enquiries This Week', value: overview?.enquiries.week },
                                { label: 'Enquiries Today', value: overview?.enquiries.today },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
                                    <span className="text-gray-400 text-sm">{label}</span>
                                    <span className="text-white font-semibold text-sm">
                                        {loadingOverview
                                            ? <span className="w-10 h-4 bg-gray-800 rounded animate-pulse inline-block" />
                                            : fmt(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 4: PRODUCT PERFORMANCE
            ───────────────────────────────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-white font-semibold text-base">Product Performance</h2>
                        <p className="text-gray-500 text-xs mt-0.5">Views, enquiries, and conversion by product</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ArrowUpDown size={13} className="text-gray-500" />
                        <select
                            value={productSort}
                            onChange={e => setProductSort(e.target.value as 'enquiries' | 'views' | 'conversion')}
                            className="bg-gray-800 border border-gray-700 text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-gray-500"
                        >
                            <option value="enquiries">Most Enquired</option>
                            <option value="views">Most Viewed</option>
                            <option value="conversion">Highest Conversion</option>
                        </select>
                    </div>
                </div>
                <Card className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Product</th>
                                    <th className="text-right text-gray-500 text-xs font-medium px-5 py-3">Views</th>
                                    <th className="text-right text-gray-500 text-xs font-medium px-5 py-3">Enquiries</th>
                                    <th className="text-right text-gray-500 text-xs font-medium px-5 py-3">Conversion</th>
                                    <th className="text-right text-gray-500 text-xs font-medium px-5 py-3">Last Click</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingProducts ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-b border-gray-800/50">
                                            <td className="px-5 py-3"><div className="h-4 bg-gray-800 rounded animate-pulse w-40" /></td>
                                            <td className="px-5 py-3 text-right"><div className="h-4 bg-gray-800 rounded animate-pulse w-10 ml-auto" /></td>
                                            <td className="px-5 py-3 text-right"><div className="h-4 bg-gray-800 rounded animate-pulse w-10 ml-auto" /></td>
                                            <td className="px-5 py-3 text-right"><div className="h-4 bg-gray-800 rounded animate-pulse w-12 ml-auto" /></td>
                                            <td className="px-5 py-3 text-right"><div className="h-4 bg-gray-800 rounded animate-pulse w-20 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-gray-600 py-8 text-sm">No product data yet. Data appears after users visit product pages.</td>
                                    </tr>
                                ) : (
                                    products.map(p => (
                                        <tr key={p.product_id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                            <td className="px-5 py-3 text-white text-sm font-medium max-w-xs truncate">{p.product_name ?? '—'}</td>
                                            <td className="px-5 py-3 text-right text-gray-300 text-sm">{fmt(p.total_views)}</td>
                                            <td className="px-5 py-3 text-right text-gray-300 text-sm">{fmt(p.total_enquiries)}</td>
                                            <td className="px-5 py-3 text-right">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                    p.conversion_rate >= 10 ? 'bg-green-500/20 text-green-400' :
                                                    p.conversion_rate >= 3 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-gray-700 text-gray-400'
                                                }`}>
                                                    {p.conversion_rate}%
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right text-gray-500 text-xs">
                                                {p.last_enquiry_at ? fmtDateTime(p.last_enquiry_at) : '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 5: PEAK TRAFFIC HOURS
            ───────────────────────────────────────────────────────────── */}
            <section>
                <SectionHeader title="Peak Traffic Hours" subtitle="Visitor and enquiry activity by hour (last 7 days)" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                        <p className="text-white text-sm font-medium mb-4">Visitors by Hour</p>
                        {loadingHourly ? <LoadingBar /> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={hourlyPageviews} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="barPageviews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.2}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.15} />
                                    <XAxis dataKey="hour" tickFormatter={fmtHour} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                                    <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<HourTooltip />} />
                                    <Bar dataKey="count" name="Visitors" fill="url(#barPageviews)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                    <Card>
                        <p className="text-white text-sm font-medium mb-4">Enquiries by Hour</p>
                        {loadingHourly ? <LoadingBar /> : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={hourlyEnquiries} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="barHourlyEnquiries" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.2}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.15} />
                                    <XAxis dataKey="hour" tickFormatter={fmtHour} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                                    <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<HourTooltip />} />
                                    <Bar dataKey="count" name="Enquiries" fill="url(#barHourlyEnquiries)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 6: REAL-TIME VISITORS
            ───────────────────────────────────────────────────────────── */}
            <section>
                <SectionHeader title="Real-Time Visitors" subtitle="Active sessions in the last 5 minutes — updates every 30s" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="flex flex-col items-center justify-center py-8">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-3 relative">
                            <Wifi size={24} className="text-green-400" />
                            {realtime.online > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                            )}
                        </div>
                        <p className="text-5xl font-bold text-white">{realtime.online}</p>
                        <p className="text-gray-400 text-sm mt-2">Online Now</p>
                        <p className="text-gray-600 text-xs mt-1">Active sessions (last 5 min)</p>
                    </Card>
                    <Card className="lg:col-span-2">
                        <p className="text-white text-sm font-medium mb-4">Active Pages</p>
                        {realtime.activePages.length === 0 ? (
                            <p className="text-gray-600 text-sm text-center py-6">No active pages right now</p>
                        ) : (
                            <div className="space-y-2">
                                {realtime.activePages.map(({ page, count }) => (
                                    <div key={page} className="flex items-center gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-300 text-xs truncate font-mono">{page}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-gray-800 rounded-full h-1.5">
                                                <div
                                                    className="bg-green-400 h-1.5 rounded-full"
                                                    style={{ width: `${Math.min(100, (count / Math.max(realtime.online, 1)) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-gray-400 text-xs w-4 text-right">{count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 7: ENQUIRY LOGS
            ───────────────────────────────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-white font-semibold text-base">Enquiry Logs</h2>
                        <p className="text-gray-500 text-xs mt-0.5">Every enquiry button click — {fmt(logs.total)} total</p>
                    </div>
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 text-gray-400 hover:text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-800 border border-gray-700 transition-all"
                    >
                        <Download size={13} />
                        Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-4">
                    <div className="relative flex-1 max-w-xs">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search product..."
                            value={logsSearch}
                            onChange={e => { setLogsSearch(e.target.value); setLogsPage(1); }}
                            className="w-full bg-gray-800 border border-gray-700 text-white text-xs pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={logsDevice}
                            onChange={e => { setLogsDevice(e.target.value); setLogsPage(1); }}
                            className="bg-gray-800 border border-gray-700 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-gray-500 appearance-none pr-8"
                        >
                            <option value="">All Devices</option>
                            <option value="mobile">Mobile</option>
                            <option value="tablet">Tablet</option>
                            <option value="desktop">Desktop</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                <Card className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Time</th>
                                    <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Product</th>
                                    <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Page</th>
                                    <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Device</th>
                                    <th className="text-left text-gray-500 text-xs font-medium px-5 py-3">Browser</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingLogs ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <tr key={i} className="border-b border-gray-800/50">
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <td key={j} className="px-5 py-3"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>
                                            ))}
                                        </tr>
                                    ))
                                ) : logs.rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-gray-600 py-8 text-sm">
                                            No enquiry logs yet. Logs appear after visitors click &quot;Enquire Now&quot; buttons.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.rows.map(row => (
                                        <tr key={row.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                            <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">{fmtDateTime(row.created_at)}</td>
                                            <td className="px-5 py-3 text-white text-xs max-w-[160px] truncate font-medium">{row.product_name ?? '—'}</td>
                                            <td className="px-5 py-3 text-gray-500 text-xs max-w-[200px] truncate font-mono">{row.page_url ? (() => { try { return new URL(row.page_url!).pathname; } catch { return row.page_url; } })() : '—'}</td>
                                            <td className="px-5 py-3">
                                                <span className="text-xs capitalize text-gray-400">{row.device_type ?? '—'}</span>
                                            </td>
                                            <td className="px-5 py-3 text-gray-500 text-xs">{row.browser ?? '—'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
                            <p className="text-gray-500 text-xs">
                                Page {logsPage} of {logs.totalPages} ({fmt(logs.total)} total)
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setLogsPage(p => Math.max(1, p - 1))}
                                    disabled={logsPage === 1}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-40 hover:bg-gray-700 transition-all"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setLogsPage(p => Math.min(logs.totalPages, p + 1))}
                                    disabled={logsPage >= logs.totalPages}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-40 hover:bg-gray-700 transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </section>

            {/* ─────────────────────────────────────────────────────────────
                SECTION 8 + 9: TRAFFIC SOURCES + DEVICE ANALYTICS
            ───────────────────────────────────────────────────────────── */}
            <section>
                <SectionHeader title="Audience Breakdown" subtitle="Traffic sources and device usage (last 30 days)" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Traffic Sources */}
                    <Card>
                        <p className="text-white text-sm font-medium mb-5">Traffic Sources</p>
                        {loadingMisc ? <LoadingBar /> : sources.length === 0 ? (
                            <p className="text-gray-600 text-sm text-center py-8">No source data yet.</p>
                        ) : (
                            <div className="flex flex-col lg:flex-row items-center gap-6">
                                <ResponsiveContainer width={160} height={160}>
                                    <PieChart>
                                        <Pie data={sources} dataKey="count" cx="50%" cy="50%" outerRadius={70} innerRadius={48} paddingAngle={4} stroke="#111827" strokeWidth={2}>
                                            {sources.map((_, i) => (
                                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={ChartTooltipStyle} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex-1 space-y-2 w-full">
                                    {sources.map((s, i) => (
                                        <div key={s.source} className="flex items-center gap-3">
                                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                            <span className="text-gray-300 text-xs flex-1">{s.source}</span>
                                            <span className="text-gray-400 text-xs">{fmt(s.count)}</span>
                                            <span className="text-gray-600 text-xs w-10 text-right">{s.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Device Analytics */}
                    <Card>
                        <p className="text-white text-sm font-medium mb-5">Device Analytics</p>
                        {loadingMisc ? <LoadingBar /> : devices.length === 0 ? (
                            <p className="text-gray-600 text-sm text-center py-8">No device data yet.</p>
                        ) : (
                            <div className="flex flex-col lg:flex-row items-center gap-6">
                                <ResponsiveContainer width={160} height={160}>
                                    <PieChart>
                                        <Pie data={devices} dataKey="count" cx="50%" cy="50%" outerRadius={70} innerRadius={48} paddingAngle={4} stroke="#111827" strokeWidth={2}>
                                            {devices.map((d) => (
                                                <Cell key={d.device} fill={DEVICE_COLORS[d.device] ?? '#6b7280'} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={ChartTooltipStyle} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex-1 space-y-3 w-full">
                                    {devices.map((d) => {
                                        const IconComp = d.device === 'Mobile' ? Smartphone : d.device === 'Tablet' ? Tablet : Monitor;
                                        return (
                                            <div key={d.device} className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <IconComp size={13} style={{ color: DEVICE_COLORS[d.device] ?? '#6b7280' }} />
                                                    <span className="text-gray-300 text-xs flex-1">{d.device}</span>
                                                    <span className="text-gray-400 text-xs">{fmt(d.count)}</span>
                                                    <span className="text-gray-600 text-xs w-10 text-right">{d.percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-800 rounded-full h-1.5">
                                                    <div
                                                        className="h-1.5 rounded-full transition-all duration-500"
                                                        style={{ width: `${d.percentage}%`, backgroundColor: DEVICE_COLORS[d.device] ?? '#6b7280' }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </section>

            {/* Footer note */}
            <div className="text-center">
                <p className="text-gray-700 text-xs">
                    Analytics powered by Supabase · Events stored securely · No third-party tracking
                </p>
            </div>
        </div>
    );
}
