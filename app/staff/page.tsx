'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
    ShoppingBag,
    DollarSign,
    Package,
    Users,
    RefreshCw,
    Plus,
    Clock,
    Truck,
    CheckCircle2,
    ArrowUpRight,
    Search,
    MapPin,
    Phone,
    Store,
    Crown,
    FileText,
    Tag,
    Gift,
    Printer,
    AlertTriangle,
    Bell,
    Check,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { StatCard } from '@/components/admin/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { SavedOrder } from '@/lib/order-cache';
import { AddCustomerModal } from '@/components/admin/add-customer-modal';
import { generateShippingLabel, generateCourierManifest, generateGiftCard } from '@/lib/print-utils';

interface StaffInfo {
    id: string;
    username: string;
    name: string;
    role: 'staff' | 'supervisor' | 'director';
    storeId?: 'director' | 'tollygunge' | 'alipore';
}

const STORE_LABELS: Record<string, string> = {
    director: 'Boutique Director (All Stores)',
    tollygunge: 'Tollygunge Store',
    alipore: 'Alipore Store',
};

export default function StaffDashboardPage() {
    const [orders, setOrders] = useState<SavedOrder[]>([]);
    const [staff, setStaff] = useState<StaffInfo | null>(null);
    const [productCount, setProductCount] = useState<number>(0);
    const [inStockCount, setInStockCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [manifestStoreFilter, setManifestStoreFilter] = useState<'all' | 'tollygunge' | 'alipore'>('all');

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [ordersRes, prodsRes, staffRes] = await Promise.all([
                fetch('/api/orders'),
                fetch('/api/staff/products'),
                fetch('/api/staff/auth'),
            ]);

            if (staffRes.ok) {
                const sData = await staffRes.json();
                if (sData.authenticated && sData.staff) setStaff(sData.staff);
            }

            if (ordersRes.ok) {
                const oData = await ordersRes.json();
                if (oData.success && oData.orders) setOrders(oData.orders);
            }

            if (prodsRes.ok) {
                const pData = await prodsRes.json();
                if (pData.products) {
                    setProductCount(pData.products.length);
                    setInStockCount(pData.products.filter((p: any) => p.stock > 0).length);
                }
            }
        } catch (err) {
            console.error('Error loading staff dashboard:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const isDirector = staff?.role === 'director' || staff?.role === 'supervisor' || staff?.storeId === 'director' || staff?.username === 'atanu';
    const activeStoreId = staff?.storeId || 'director';
    const storeDisplayName = isDirector ? 'Boutique Director' : STORE_LABELS[activeStoreId] || 'Store Counter';

    // ── Metrics Calculation ──────────────────────────────────────
    const allValidOrders = useMemo(() => orders.filter(o => o.status !== 'cancelled'), [orders]);

    // Outlet-specific order partitions
    const tollygungeOrders = useMemo(() => allValidOrders.filter(o => o.assignedStore === 'tollygunge'), [allValidOrders]);
    const aliporeOrders = useMemo(() => allValidOrders.filter(o => o.assignedStore === 'alipore'), [allValidOrders]);
    const unassignedOrders = useMemo(() => orders.filter(o => !o.assignedStore && o.status !== 'cancelled'), [orders]);

    // Outlet revenue
    const tollygungeRevenue = useMemo(() => tollygungeOrders.reduce((sum, o) => sum + o.total, 0), [tollygungeOrders]);
    const aliporeRevenue = useMemo(() => aliporeOrders.reduce((sum, o) => sum + o.total, 0), [aliporeOrders]);
    const combinedRevenue = useMemo(() => allValidOrders.reduce((sum, o) => sum + o.total, 0), [allValidOrders]);

    // Filtered orders for table display:
    // Director sees all; store staff only sees their assigned orders
    const visibleOrders = useMemo(() => {
        if (isDirector) return orders;
        return orders.filter(o => o.assignedStore === activeStoreId);
    }, [orders, isDirector, activeStoreId]);

    const storeSpecificRevenue = useMemo(() => {
        if (isDirector) return combinedRevenue;
        return visibleOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
    }, [visibleOrders, isDirector, combinedRevenue]);

    const storeActiveOrders = useMemo(() => {
        return visibleOrders.filter(o => o.status === 'confirmed' || o.status === 'processing');
    }, [visibleOrders]);

    const storeDeliveredOrders = useMemo(() => {
        return visibleOrders.filter(o => o.status === 'delivered');
    }, [visibleOrders]);

    // Quick Store Assignment handler
    const handleQuickAssign = async (orderId: string, store: 'tollygunge' | 'alipore' | null) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedStore: store ?? undefined } : o));
        try {
            await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, assignedStore: store }),
            });
        } catch {}
    };

    const getStatusBadge = (status: SavedOrder['status']) => {
        switch (status) {
            case 'confirmed':
                return <Badge variant="default"><Clock size={10} /> Confirmed</Badge>;
            case 'processing':
                return <Badge variant="info"><Truck size={10} /> In Transit</Badge>;
            case 'delivered':
                return <Badge variant="success"><CheckCircle2 size={10} /> Delivered</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getStoreBadge = (assignedStore?: string | null) => {
        if (!assignedStore) {
            return (
                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Unassigned
                </span>
            );
        }
        if (assignedStore === 'tollygunge') {
            return (
                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Tollygunge
                </span>
            );
        }
        return (
            <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Alipore
            </span>
        );
    };

    return (
        <div className="space-y-7">
            {/* Page Header */}
            <PageHeader
                title={isDirector ? "Boutique Director Hub" : `${storeDisplayName} Dashboard`}
                description={
                    isDirector
                        ? "Combined multi-outlet analytics, cross-store revenues & courier manifest downloads"
                        : "Daily order preparations, delivery dispatch routing & boutique reception desk"
                }
                tag={isDirector ? "Director View (Both Outlets)" : `${storeDisplayName}`}
            >
                <button
                    onClick={loadData}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh Data</span>
                </button>

                <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                    <Plus size={14} className="stroke-[2.5]" />
                    <span>Add Reception Customer</span>
                </button>
            </PageHeader>

            {/* Unassigned Orders Alert Banner (for Director) */}
            {isDirector && unassignedOrders.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 flex-wrap animate-in fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-400">
                                {unassignedOrders.length} Order{unassignedOrders.length === 1 ? '' : 's'} Awaiting Store Assignment
                            </p>
                            <p className="text-[11px] text-zinc-400">
                                Assign orders to Tollygunge or Alipore store so branch staff receive the live alert and start preparation.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/staff/orders"
                        className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 hover:bg-amber-300 font-bold text-xs transition-colors shadow-xs"
                    >
                        Assign Orders Now &rarr;
                    </Link>
                </div>
            )}

            {/* ── Key Stat Cards ─────────────────────────────────── */}
            {isDirector ? (
                /* Director View: Combined 2-Store Financials & Split */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Combined Total Revenue"
                        value={`₹${combinedRevenue.toLocaleString('en-IN')}`}
                        hint={`Both stores combined (${allValidOrders.length} orders)`}
                        icon={DollarSign}
                        loading={loading}
                        href="/staff/orders"
                    />

                    <StatCard
                        label="Tollygunge Store Revenue"
                        value={`₹${tollygungeRevenue.toLocaleString('en-IN')}`}
                        hint={`${tollygungeOrders.length} assigned orders`}
                        icon={Store}
                        loading={loading}
                        href="/staff/orders"
                    />

                    <StatCard
                        label="Alipore Store Revenue"
                        value={`₹${aliporeRevenue.toLocaleString('en-IN')}`}
                        hint={`${aliporeOrders.length} assigned orders`}
                        icon={Store}
                        loading={loading}
                        href="/staff/orders"
                    />

                    <StatCard
                        label="Unassigned Bookings"
                        value={unassignedOrders.length}
                        hint={unassignedOrders.length > 0 ? "Requires allocation" : "All orders assigned ✓"}
                        icon={Clock}
                        loading={loading}
                        href="/staff/orders"
                    />
                </div>
            ) : (
                /* Store Staff View: Store-Specific Stats */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label={`${storeDisplayName} Sales`}
                        value={`₹${storeSpecificRevenue.toLocaleString('en-IN')}`}
                        hint={`${visibleOrders.length} total orders assigned`}
                        icon={DollarSign}
                        loading={loading}
                        href="/staff/orders"
                    />

                    <StatCard
                        label="Orders to Prepare"
                        value={storeActiveOrders.length}
                        hint="Awaiting floral packing & dispatch"
                        icon={ShoppingBag}
                        loading={loading}
                        href="/staff/orders"
                    />

                    <StatCard
                        label="Delivered Successfully"
                        value={storeDeliveredOrders.length}
                        hint="Completed store deliveries"
                        icon={CheckCircle2}
                        loading={loading}
                        href="/staff/orders"
                    />

                    <StatCard
                        label="Reception Desk"
                        value="Ready"
                        hint="Check-in guests & issue 15% discount"
                        icon={Users}
                        loading={loading}
                        href="/staff/customers"
                    />
                </div>
            )}

            {/* ── Quick Print & Manifest Download Hub ───────────── */}
            <Card className="bg-gradient-to-r from-zinc-900/50 via-zinc-900/80 to-zinc-900/50 border-white/[0.08]">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Printer size={16} className="text-[#bfa81f]" />
                                <span>Courier Manifest &amp; Parcel Label Center</span>
                            </CardTitle>
                            <CardDescription>
                                Instant 1-click printable manifests for courier pickups and 4×6″ shipping labels
                            </CardDescription>
                        </div>

                        {/* Store filter for Director */}
                        {isDirector && (
                            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-800 border border-zinc-700 text-xs">
                                <span className="text-[10px] text-zinc-400 font-bold px-2 uppercase">Manifest Store:</span>
                                <button
                                    onClick={() => setManifestStoreFilter('all')}
                                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                                        manifestStoreFilter === 'all' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-300 hover:text-white'
                                    }`}
                                >
                                    All Outlets
                                </button>
                                <button
                                    onClick={() => setManifestStoreFilter('tollygunge')}
                                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                                        manifestStoreFilter === 'tollygunge' ? 'bg-emerald-500 text-white shadow-xs' : 'text-zinc-300 hover:text-white'
                                    }`}
                                >
                                    Tollygunge
                                </button>
                                <button
                                    onClick={() => setManifestStoreFilter('alipore')}
                                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                                        manifestStoreFilter === 'alipore' ? 'bg-sky-500 text-white shadow-xs' : 'text-zinc-300 hover:text-white'
                                    }`}
                                >
                                    Alipore
                                </button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Download Manifest */}
                        <button
                            onClick={() => {
                                const targetOrders = manifestStoreFilter === 'all'
                                    ? visibleOrders
                                    : visibleOrders.filter(o => o.assignedStore === manifestStoreFilter);
                                const targetName = manifestStoreFilter === 'all'
                                    ? 'All Outlets Combined'
                                    : STORE_LABELS[manifestStoreFilter];
                                generateCourierManifest(targetOrders, targetName);
                            }}
                            className="p-3.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-all text-left flex items-center gap-3 group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                <FileText size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">Download Daily Manifest</p>
                                <p className="text-[10.5px] text-zinc-400 truncate">Rider signature &amp; parcel list</p>
                            </div>
                        </button>

                        {/* Print Parcel Label */}
                        <Link
                            href="/staff/orders"
                            className="p-3.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-all text-left flex items-center gap-3 group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#bfa81f]/10 text-[#bfa81f] border border-[#bfa81f]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                <Tag size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">Print Parcel Labels (4×6″)</p>
                                <p className="text-[10.5px] text-zinc-400 truncate">Consignee, prepaid &amp; fragile tags</p>
                            </div>
                        </Link>

                        {/* Print Luxury Gift Card */}
                        <Link
                            href="/staff/orders"
                            className="p-3.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-all text-left flex items-center gap-3 group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                <Gift size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">Luxury Gift Message Cards</p>
                                <p className="text-[10.5px] text-zinc-400 truncate">Print 5×7″ cards with calligraphy</p>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* ── Main View: Orders Table & Side Widget ──────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders Table (2 Cols) */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>
                                {isDirector ? "All Customer Bookings" : `${storeDisplayName} Assigned Bookings`}
                            </CardTitle>
                            <CardDescription>
                                {isDirector ? "Cross-store live orders with outlet routing controls" : "Orders currently assigned to your outlet"}
                            </CardDescription>
                        </div>
                        <CardAction>
                            <Link
                                href="/staff/orders"
                                className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline"
                            >
                                <span>Manage All ({visibleOrders.length})</span>
                                <ArrowUpRight size={13} />
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="px-0 py-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-white/[0.06] bg-white/[0.01] text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                                        <th className="py-3 px-5">Order #</th>
                                        <th className="py-3 px-4">Recipient</th>
                                        {isDirector && <th className="py-3 px-4">Outlet Store</th>}
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Amount</th>
                                        <th className="py-3 px-4 text-center">Print</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {visibleOrders.slice(0, 7).map(o => (
                                        <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-5 font-mono font-bold text-white">
                                                <Link href="/staff/orders" className="hover:text-zinc-300">
                                                    {o.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-semibold text-zinc-200">{o.customer.name}</p>
                                                <p className="text-[11px] text-zinc-500 font-mono">{o.customer.phone}</p>
                                            </td>
                                            {isDirector && (
                                                <td className="py-3 px-4">
                                                    <select
                                                        value={o.assignedStore || ''}
                                                        onChange={e => handleQuickAssign(o.id, (e.target.value || null) as any)}
                                                        className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-[11px] text-white focus:outline-none cursor-pointer"
                                                    >
                                                        <option value="">Unassigned</option>
                                                        <option value="tollygunge">Tollygunge</option>
                                                        <option value="alipore">Alipore</option>
                                                    </select>
                                                </td>
                                            )}
                                            <td className="py-3 px-4">
                                                {getStatusBadge(o.status)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-white tabular-nums">
                                                ₹{o.total.toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => generateShippingLabel(o, isDirector ? (o.assignedStore ? STORE_LABELS[o.assignedStore] : 'New Eco Roses') : storeDisplayName)}
                                                        title="Print Label"
                                                        className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
                                                    >
                                                        <Tag size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const note = o.specialNote || '';
                                                            generateGiftCard({
                                                                recipientName: o.customer.name,
                                                                senderName: '',
                                                                message: note,
                                                                occasion: '',
                                                                orderNumber: o.orderNumber,
                                                            });
                                                        }}
                                                        title="Print Gift Card"
                                                        className="p-1 rounded-lg bg-[#bfa81f]/10 hover:bg-[#bfa81f]/20 text-[#bfa81f] border border-[#bfa81f]/30 cursor-pointer"
                                                    >
                                                        <Gift size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {visibleOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={isDirector ? 6 : 5} className="py-8 text-center text-zinc-500">
                                                No orders recorded for this view.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Side Widget (1 Col) */}
                <div className="space-y-4">
                    {/* Reception Check-In */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Reception Desk Check-In</CardTitle>
                            <CardDescription>Capture guest birthdays &amp; wedding anniversaries</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Register walk-in guests at the counter to automatically dispatch an exclusive <strong>15% VIP greeting voucher</strong>.
                            </p>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                            >
                                <Plus size={14} />
                                <span>Check-In Guest Customer</span>
                            </button>
                        </CardContent>
                    </Card>

                    {/* Permissions Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions &amp; Outlet Access</CardTitle>
                            <CardDescription>
                                Active identity: <strong className="text-white">{staff?.name}</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs">
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>Store Scope:</span>
                                <span className="text-emerald-400 font-semibold">{storeDisplayName}</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>Order Assignment:</span>
                                <span className={isDirector ? "text-emerald-400 font-semibold" : "text-zinc-500 font-semibold"}>
                                    {isDirector ? "Director Access ✓" : "Restricted"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>Manifest &amp; Label Print:</span>
                                <span className="text-emerald-400 font-semibold">Enabled ✓</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>Live Order Sound Alert:</span>
                                <span className="text-emerald-400 font-semibold">Active ✓</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Check-In Modal */}
            <AddCustomerModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCustomerAdded={() => loadData()}
            />
        </div>
    );
}
