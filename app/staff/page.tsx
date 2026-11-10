'use client';

import { useState, useEffect } from 'react';
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
    Phone
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { StatCard } from '@/components/admin/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { SavedOrder } from '@/lib/order-cache';
import { AddCustomerModal } from '@/components/admin/add-customer-modal';

export default function StaffDashboardPage() {
    const [orders, setOrders] = useState<SavedOrder[]>([]);
    const [productCount, setProductCount] = useState<number>(0);
    const [inStockCount, setInStockCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [ordersRes, prodsRes] = await Promise.all([
                fetch('/api/orders'),
                fetch('/api/staff/products'),
            ]);

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
    };

    useEffect(() => {
        loadData();
    }, []);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
    const activeOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'processing');

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

    return (
        <div className="space-y-7">
            {/* Page Header */}
            <PageHeader
                title="Staff & Reception Operations"
                description="Live store order fulfilment, revenue overview & reception desk guest registration"
                tag="Staff Hub"
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

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Today's Revenue"
                    value={`₹${totalRevenue.toLocaleString('en-IN')}`}
                    hint="Gross sales recorded"
                    icon={DollarSign}
                    loading={loading}
                    href="/staff/orders"
                />

                <StatCard
                    label="Active Orders"
                    value={activeOrders.length}
                    hint={`${orders.length} total orders recorded`}
                    icon={ShoppingBag}
                    loading={loading}
                    href="/staff/orders"
                />

                <StatCard
                    label="Catalog Products"
                    value={productCount}
                    hint={`${inStockCount} items in stock`}
                    icon={Package}
                    loading={loading}
                    href="/staff/products"
                />

                <StatCard
                    label="Reception Portal"
                    value="Ready"
                    hint="Check-in guests & issue 15% discount"
                    icon={Users}
                    loading={loading}
                    href="/staff/customers"
                />
            </div>

            {/* Quick Actions & Recent Deliveries */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders List (2 Cols) */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Customer Orders</CardTitle>
                            <CardDescription>Latest storefront and phone orders awaiting delivery</CardDescription>
                        </div>
                        <CardAction>
                            <Link
                                href="/staff/orders"
                                className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline"
                            >
                                <span>All Orders ({orders.length})</span>
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
                                        <th className="py-3 px-4">Items</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-5 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {orders.slice(0, 6).map(o => (
                                        <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-5 font-mono font-bold text-white">
                                                <Link href="/staff/orders" className="hover:text-zinc-300">
                                                    {o.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-semibold text-zinc-200">{o.customer.name}</p>
                                                <p className="text-[11px] text-zinc-500">{o.shippingAddress.city}</p>
                                            </td>
                                            <td className="py-3 px-4 text-zinc-400">
                                                {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                                            </td>
                                            <td className="py-3 px-4">
                                                {getStatusBadge(o.status)}
                                            </td>
                                            <td className="py-3 px-5 text-right font-bold text-white tabular-nums">
                                                ₹{o.total.toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-zinc-500">
                                                No orders placed yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Staff Quick Hub (1 Col) */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reception Check-In</CardTitle>
                            <CardDescription>Register walk-in customers and capture anniversaries</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Enter customer contact, DOB, marriage anniversary & items purchased. The system automatically prepares an exclusive <strong>15% VIP discount email</strong>!
                            </p>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                            >
                                <Plus size={14} />
                                <span>Add In-Store Customer</span>
                            </button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Staff Portal Permissions</CardTitle>
                            <CardDescription>Role and access level constraints</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2.5 text-xs">
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>View Orders &amp; Addresses:</span>
                                <span className="text-emerald-400 font-semibold">Enabled</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>Browse Catalog Stock:</span>
                                <span className="text-emerald-400 font-semibold">Enabled</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>Add Product / Change Images:</span>
                                <span className="text-zinc-500 font-semibold">Disabled (Admin Only)</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>Reception Guest Check-In:</span>
                                <span className="text-emerald-400 font-semibold">Enabled</span>
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
