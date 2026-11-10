'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
    ShoppingBag, Search, Filter, RefreshCw, Eye, Download, CheckCircle2,
    Clock, Truck, AlertCircle, X, ChevronRight, Phone, Mail, MapPin, Gift, Tag, Plus
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { SavedOrder } from '@/lib/order-cache';
import { AddOrderModal } from '@/components/admin/add-order-modal';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<SavedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'paid' | 'processing' | 'delivered' | 'cancelled'>('all');
    const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [addOrderOpen, setAddOrderOpen] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (data.success && data.orders) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: SavedOrder['status']) => {
        setIsUpdatingStatus(true);
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
            console.error('Error updating status:', err);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // Filtered orders
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                order.customer.phone.includes(search) ||
                order.shippingAddress.postalCode.includes(search) ||
                order.shippingAddress.city.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    // Overview numbers
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
    const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
    const processingCount = orders.filter(o => o.status === 'processing').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;

    const getStatusBadge = (status: SavedOrder['status']) => {
        switch (status) {
            case 'confirmed':
                return <Badge variant="default"><Clock size={10} /> Confirmed</Badge>;
            case 'paid':
                return <Badge variant="success"><CheckCircle2 size={10} /> Paid</Badge>;
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
                title="Orders Management"
                description="Live transaction feed, dispatch tracking and order status updates"
                tag="E-Commerce"
            >
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>

                <button
                    onClick={() => setAddOrderOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                    <Plus size={14} className="stroke-[2.5]" />
                    <span>Create Order</span>
                </button>
            </PageHeader>

            {/* CLICKABLE Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { key: 'all' as const, label: 'Total Orders', count: orders.length, icon: ShoppingBag, desc: `₹${totalRevenue.toLocaleString('en-IN')} revenue` },
                    { key: 'confirmed' as const, label: 'Awaiting Delivery', count: confirmedCount, icon: Clock, desc: 'Ready for fulfillment' },
                    { key: 'processing' as const, label: 'In Transit', count: processingCount, icon: Truck, desc: 'Out on delivery' },
                    { key: 'delivered' as const, label: 'Completed Deliveries', count: deliveredCount, icon: CheckCircle2, desc: 'Delivered successfully' },
                ].map(card => {
                    const isSelected = statusFilter === card.key;
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.key}
                            onClick={() => setStatusFilter(card.key)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                                isSelected
                                    ? 'bg-white text-zinc-950 border-white shadow-md'
                                    : 'bg-[#12141c]/90 border-white/[0.08] hover:border-zinc-700/80 text-zinc-100'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className={`text-xs font-medium uppercase tracking-wider ${isSelected ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                    {card.label}
                                </span>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 transition-transform group-hover:scale-105 ${
                                    isSelected
                                        ? 'bg-zinc-950 text-white border-zinc-900'
                                        : 'bg-zinc-800 text-zinc-200 border-zinc-700/60'
                                }`}>
                                    <Icon size={16} />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between gap-2">
                                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${isSelected ? 'text-zinc-950' : 'text-white'}`}>
                                    {loading ? '—' : card.count}
                                </span>
                                <span className={`text-[11px] font-medium ${isSelected ? 'text-zinc-700' : 'text-zinc-400'}`}>
                                    {card.desc}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Orders Data Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle>
                            {statusFilter === 'all' ? 'All Customer Bookings' : `Orders: ${statusFilter.toUpperCase()}`}
                        </CardTitle>
                        <CardDescription>
                            Showing {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'} (click a card above to filter)
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search by order #, phone, customer..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-64"
                            />
                        </div>

                        {statusFilter !== 'all' && (
                            <button
                                onClick={() => setStatusFilter('all')}
                                className="text-xs text-zinc-400 hover:text-white underline px-2 cursor-pointer"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="px-0 py-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.01] text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                                    <th className="py-4 px-4 text-center">#</th>
                                    <th className="py-4 px-5">Order #</th>
                                    <th className="py-4 px-5">Customer &amp; Phone</th>
                                    <th className="py-4 px-5">Delivery Location</th>
                                    <th className="py-4 px-5">Items</th>
                                    <th className="py-4 px-4 text-right">Amount</th>
                                    <th className="py-4 px-5">Change Status</th>
                                    <th className="py-4 px-5 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-zinc-500">
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-zinc-500">
                                            No orders found for this status. Click &ldquo;Create Order&rdquo; above.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order, idx) => (
                                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                            {/* Sequential # */}
                                            <td className="py-4 px-4 text-center font-mono font-bold text-zinc-400 text-xs">
                                                #{idx + 1}
                                            </td>

                                            {/* Order Number */}
                                            <td className="py-4 px-5 font-mono font-bold text-white">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="hover:underline cursor-pointer"
                                                >
                                                    {order.orderNumber}
                                                </button>
                                            </td>

                                            {/* Customer */}
                                            <td className="py-4 px-5">
                                                <p className="font-semibold text-zinc-200">{order.customer.name}</p>
                                                <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                                                    <Phone size={10} />
                                                    {order.customer.phone}
                                                </span>
                                            </td>

                                            {/* Address */}
                                            <td className="py-4 px-5 text-zinc-300">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin size={12} className="text-zinc-500 flex-shrink-0" />
                                                    <span className="truncate max-w-[180px]">{order.shippingAddress.line1}, {order.shippingAddress.city}</span>
                                                </span>
                                            </td>

                                            {/* Items */}
                                            <td className="py-4 px-5 text-zinc-300">
                                                <div className="flex flex-col gap-0.5">
                                                    {order.items.slice(0, 2).map((item, i) => (
                                                        <span key={i} className="truncate max-w-[210px]">
                                                            {item.quantity}x {item.name}
                                                        </span>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <span className="text-[10px] text-zinc-500">+{order.items.length - 2} more</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Total */}
                                            <td className="py-4 px-4 text-right font-bold text-white tabular-nums">
                                                ₹{order.total.toLocaleString('en-IN')}
                                            </td>

                                            {/* Quick Status Selector */}
                                            <td className="py-4 px-5">
                                                <select
                                                    value={order.status}
                                                    onChange={e => handleStatusUpdate(order.id, e.target.value as any)}
                                                    className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500 font-medium cursor-pointer"
                                                >
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="processing">In Transit</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>

                                            {/* Action */}
                                            <td className="py-4 px-5 text-center">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                                                >
                                                    Details
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

            {/* Order Details Drawer / Modal */}
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

                        {/* Items List */}
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-zinc-300">Items in Order:</p>
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
                            <div className="grid grid-cols-4 gap-2">
                                {(['confirmed', 'processing', 'delivered', 'cancelled'] as const).map(st => (
                                    <button
                                        key={st}
                                        disabled={isUpdatingStatus}
                                        onClick={() => handleStatusUpdate(selectedOrder.id, st)}
                                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer capitalize ${
                                            selectedOrder.status === st
                                                ? 'bg-white text-zinc-950 font-bold border-white'
                                                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                                        }`}
                                    >
                                        {st === 'processing' ? 'Transit' : st}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Order Modal */}
            <AddOrderModal
                open={addOrderOpen}
                onClose={() => setAddOrderOpen(false)}
                onOrderCreated={() => fetchOrders()}
            />
        </div>
    );
}
