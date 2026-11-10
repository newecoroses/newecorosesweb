'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
    ShoppingBag,
    Search,
    RefreshCw,
    CheckCircle2,
    Clock,
    Truck,
    X,
    Phone,
    MapPin,
    Calendar,
    ChevronRight,
    Eye
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { SavedOrder } from '@/lib/order-cache';

export default function StaffOrdersPage() {
    const [orders, setOrders] = useState<SavedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'processing' | 'delivered' | 'cancelled'>('all');
    const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (data.success && data.orders) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error('Error fetching orders for staff:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId: string, newStatus: SavedOrder['status']) => {
        setIsUpdating(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus }),
            });
            const data = await res.json();
            if (data.success && data.order) {
                setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder(data.order);
                }
            }
        } catch (err) {
            console.error('Error updating order status:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const filtered = useMemo(() => {
        return orders.filter(o => {
            const matchesSearch =
                o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                o.customer.phone.includes(search) ||
                o.shippingAddress.city.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    const getStatusBadge = (status: SavedOrder['status']) => {
        switch (status) {
            case 'confirmed':
                return <Badge variant="default"><Clock size={10} /> Confirmed</Badge>;
            case 'processing':
                return <Badge variant="info"><Truck size={10} /> Out for Delivery</Badge>;
            case 'delivered':
                return <Badge variant="success"><CheckCircle2 size={10} /> Delivered</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Orders & Fulfilment"
                description="Live customer bookings, delivery address routing & dispatch status updates"
                tag="Staff Operations"
            >
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </PageHeader>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: loading ? '—' : orders.length, icon: ShoppingBag },
                    { label: 'Awaiting Delivery', value: loading ? '—' : orders.filter(o => o.status === 'confirmed').length, icon: Clock },
                    { label: 'In Transit', value: loading ? '—' : orders.filter(o => o.status === 'processing').length, icon: Truck },
                    { label: 'Successfully Delivered', value: loading ? '—' : orders.filter(o => o.status === 'delivered').length, icon: CheckCircle2 },
                ].map(item => (
                    <Card key={item.label}>
                        <CardContent className="flex items-center gap-4 py-5">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 flex-shrink-0">
                                <item.icon size={18} className="text-zinc-200" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium">{item.label}</p>
                                <p className="text-2xl font-bold text-white tabular-nums">{item.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle>All Store Bookings</CardTitle>
                        <CardDescription>Live orders with customer routing info</CardDescription>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search by order #, phone, name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-60"
                            />
                        </div>

                        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
                            {(['all', 'confirmed', 'processing', 'delivered', 'cancelled'] as const).map(st => (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer capitalize ${
                                        statusFilter === st
                                            ? 'bg-white text-zinc-950'
                                            : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    {st === 'all' ? 'All' : st}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-0 py-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.01] text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                                    <th className="py-3 px-5">Order #</th>
                                    <th className="py-3 px-4">Recipient &amp; Phone</th>
                                    <th className="py-3 px-4">Delivery Region</th>
                                    <th className="py-3 px-4">Bouquets Ordered</th>
                                    <th className="py-3 px-4 text-right">Amount</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-5 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-zinc-500">
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-zinc-500">
                                            No orders found matching &ldquo;{search}&rdquo;.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(o => (
                                        <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-5 font-mono font-bold text-white">
                                                {o.orderNumber}
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-semibold text-zinc-200">{o.customer.name}</p>
                                                <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                                                    <Phone size={10} />
                                                    {o.customer.phone}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-zinc-300">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={11} className="text-zinc-500 flex-shrink-0" />
                                                    <span className="truncate max-w-[160px]">{o.shippingAddress.line1}, {o.shippingAddress.city}</span>
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-zinc-300">
                                                <div className="flex flex-col gap-0.5">
                                                    {o.items.slice(0, 2).map((item, idx) => (
                                                        <span key={idx} className="truncate max-w-[200px]">
                                                            {item.quantity}x {item.name}
                                                        </span>
                                                    ))}
                                                    {o.items.length > 2 && (
                                                        <span className="text-[10px] text-zinc-500">+{o.items.length - 2} more items</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-white tabular-nums">
                                                ₹{o.total.toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-3 px-4">
                                                {getStatusBadge(o.status)}
                                            </td>
                                            <td className="py-3 px-5 text-center">
                                                <button
                                                    onClick={() => setSelectedOrder(o)}
                                                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                                                >
                                                    View / Dispatch
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Order Dispatch Drawer / Modal */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="relative w-full max-w-lg bg-[#12141c] border border-white/[0.12] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    Order #{selectedOrder.orderNumber}
                                    {getStatusBadge(selectedOrder.status)}
                                </h3>
                                <p className="text-xs text-zinc-400">
                                    Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-zinc-400 hover:text-white p-1 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Customer & Address */}
                        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                            <p className="font-bold text-zinc-200 flex items-center gap-1.5">
                                <Phone size={13} className="text-zinc-400" />
                                {selectedOrder.customer.name} &middot;{' '}
                                <span className="font-mono text-zinc-100">{selectedOrder.customer.phone}</span>
                            </p>
                            <p className="text-zinc-400 flex items-start gap-1.5 leading-relaxed">
                                <MapPin size={13} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                                <span>
                                    {selectedOrder.shippingAddress.line1}
                                    {selectedOrder.shippingAddress.line2 ? `, ${selectedOrder.shippingAddress.line2}` : ''},{' '}
                                    {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.postalCode}
                                </span>
                            </p>
                            {selectedOrder.specialNote && (
                                <p className="text-amber-300 text-[11px] bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                                    Note: {selectedOrder.specialNote}
                                </p>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-zinc-300">Items to Deliver:</p>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-[11px]">
                                                {item.quantity}x
                                            </div>
                                            <span className="font-semibold text-zinc-200">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-white tabular-nums">
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
                            <span className="text-zinc-400">Total Order Value:</span>
                            <span className="text-base font-extrabold text-white tabular-nums">
                                ₹{selectedOrder.total.toLocaleString('en-IN')}
                            </span>
                        </div>

                        {/* Update Dispatch Status */}
                        <div className="pt-3 border-t border-white/[0.08] space-y-2">
                            <p className="text-xs font-semibold text-zinc-300">Update Status:</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    disabled={isUpdating}
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}
                                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                        selectedOrder.status === 'confirmed'
                                            ? 'bg-white text-zinc-950 font-bold border-white'
                                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                                    }`}
                                >
                                    Confirmed
                                </button>
                                <button
                                    disabled={isUpdating}
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                        selectedOrder.status === 'processing'
                                            ? 'bg-white text-zinc-950 font-bold border-white'
                                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                                    }`}
                                >
                                    In Transit
                                </button>
                                <button
                                    disabled={isUpdating}
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                        selectedOrder.status === 'delivered'
                                            ? 'bg-white text-zinc-950 font-bold border-white'
                                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                                    }`}
                                >
                                    Delivered
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
