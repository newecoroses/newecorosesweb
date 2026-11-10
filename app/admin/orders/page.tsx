'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    ShoppingBag, Search, Filter, RefreshCw, Eye, Download, CheckCircle2,
    Clock, Truck, AlertCircle, X, ChevronRight, Phone, Mail, MapPin, Gift, Tag
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { SavedOrder } from '@/lib/order-cache';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<SavedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'paid' | 'processing' | 'delivered' | 'cancelled'>('all');
    const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
            order.customer.phone.includes(search) ||
            order.shippingAddress.postalCode.includes(search) ||
            order.shippingAddress.city.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Overview numbers
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
    const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
    const processingCount = orders.filter(o => o.status === 'processing').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;

    const getStatusBadge = (status: SavedOrder['status']) => {
        switch (status) {
            case 'confirmed':
                return <Badge variant="default"><Clock size={11} /> Confirmed</Badge>;
            case 'processing':
                return <Badge variant="info"><Truck size={11} /> Out for Delivery</Badge>;
            case 'delivered':
                return <Badge variant="success"><CheckCircle2 size={11} /> Delivered</Badge>;
            case 'cancelled':
                return <Badge variant="destructive"><AlertCircle size={11} /> Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Orders Management"
                description="Live floral deliveries, order tracking, recipient addresses, and status management"
                tag="Store Sales"
            >
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </PageHeader>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#131622] to-[#0e1017] border border-white/[0.08]">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Sales Revenue</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">From {orders.length} orders placed</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#131622] to-[#0e1017] border border-white/[0.08]">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">New Confirmed</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1 tabular-nums">
                        {confirmedCount}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">Awaiting arrangement</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#131622] to-[#0e1017] border border-white/[0.08]">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Out for Delivery</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1 tabular-nums">
                        {processingCount}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">Dispatched via riders</p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#131622] to-[#0e1017] border border-white/[0.08]">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Fulfilled Deliveries</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 tabular-nums">
                        {deliveredCount}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">Successfully hand-delivered</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#11131b] border border-white/[0.08] rounded-2xl">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by Order #, Customer, Phone, or Pincode..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-900/90 border border-zinc-700/60 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {(['all', 'confirmed', 'processing', 'delivered', 'cancelled'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer border ${
                                statusFilter === tab
                                    ? 'bg-white text-black border-zinc-200'
                                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                                <th className="py-3 px-4">Order</th>
                                <th className="py-3 px-4">Customer</th>
                                <th className="py-3 px-4">Items</th>
                                <th className="py-3 px-4">Delivery Area</th>
                                <th className="py-3 px-4">Total Amount</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Time</th>
                                <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Loading store orders...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                                        No orders found matching your search or filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        {/* Order Number */}
                                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                                            {order.orderNumber}
                                        </td>

                                        {/* Customer */}
                                        <td className="py-3.5 px-4">
                                            <p className="font-semibold text-zinc-200">{order.customer.name}</p>
                                            <p className="text-[11px] text-zinc-400">{order.customer.phone}</p>
                                        </td>

                                        {/* Items */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-1.5">
                                                {order.items.slice(0, 2).map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative w-8 h-8 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 flex-shrink-0"
                                                        title={`${item.name} (x${item.quantity})`}
                                                    >
                                                        {item.image_url ? (
                                                            <Image
                                                                src={item.image_url}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="32px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-[10px]">
                                                                <Gift size={12} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {order.items.length > 2 && (
                                                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                                                        +{order.items.length - 2}
                                                    </span>
                                                )}
                                                <span className="text-[11px] text-zinc-300 ml-1">
                                                    {order.items.reduce((s, i) => s + i.quantity, 0)} items
                                                </span>
                                            </div>
                                        </td>

                                        {/* Delivery Area */}
                                        <td className="py-3.5 px-4">
                                            <p className="text-zinc-300 font-medium">{order.shippingAddress.city}</p>
                                            <p className="text-[11px] text-zinc-500">PIN: {order.shippingAddress.postalCode}</p>
                                        </td>

                                        {/* Amount */}
                                        <td className="py-3.5 px-4 font-bold text-white tabular-nums">
                                            ₹{order.total.toLocaleString('en-IN')}
                                            {order.discountAmount > 0 && (
                                                <span className="block text-[10px] text-emerald-400 font-normal">
                                                    Saved ₹{order.discountAmount}
                                                </span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3.5 px-4">
                                            {getStatusBadge(order.status)}
                                        </td>

                                        {/* Time */}
                                        <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>

                                        {/* Action */}
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-300 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                                            >
                                                <Eye size={12} />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Order Details Drawer / Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <div className="relative w-full max-w-2xl bg-[#12141c] border border-white/[0.12] rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] sticky top-0 bg-[#12141c]/95 backdrop-blur-md z-10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-white font-mono">
                                        {selectedOrder.orderNumber}
                                    </h2>
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 text-xs text-zinc-300">
                            {/* Status Change Selector */}
                            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/[0.06] flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-bold text-white text-sm">Update Delivery Status</p>
                                    <p className="text-[11px] text-zinc-400">Change status as the florist prepares and delivers the order</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {(['confirmed', 'processing', 'delivered', 'cancelled'] as const).map(st => (
                                        <button
                                            key={st}
                                            disabled={isUpdatingStatus}
                                            onClick={() => handleStatusUpdate(selectedOrder.id, st)}
                                            className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer border text-xs ${
                                                selectedOrder.status === st
                                                    ? 'bg-white text-black border-zinc-200 shadow-sm'
                                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                                            }`}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Customer & Delivery Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                                    <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <Phone size={13} className="text-zinc-400" /> Customer Info
                                    </p>
                                    <p className="text-sm font-semibold text-zinc-100">{selectedOrder.customer.name}</p>
                                    <p className="text-zinc-400">{selectedOrder.customer.phone}</p>
                                    <p className="text-zinc-400">{selectedOrder.customer.email}</p>
                                    <a
                                        href={`https://wa.me/91${selectedOrder.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedOrder.customer.name}, updates regarding your New Eco Roses order #${selectedOrder.orderNumber}:`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold hover:underline pt-1"
                                    >
                                        Chat with customer on WhatsApp →
                                    </a>
                                </div>

                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                                    <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <MapPin size={13} className="text-zinc-400" /> Delivery Address
                                    </p>
                                    <p className="text-zinc-200 font-medium leading-relaxed">
                                        {selectedOrder.shippingAddress.line1}
                                        {selectedOrder.shippingAddress.line2 && <><br />{selectedOrder.shippingAddress.line2}</>}
                                        <br />
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                                    </p>
                                    <p className="text-zinc-400 font-bold">Country: {selectedOrder.shippingAddress.country}</p>
                                </div>
                            </div>

                            {/* Special Note / Message Card */}
                            {selectedOrder.specialNote && (
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                                    <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                        <Gift size={13} /> Special Delivery Note & Message Card
                                    </p>
                                    <p className="text-zinc-200 text-xs italic leading-relaxed">
                                        {selectedOrder.specialNote}
                                    </p>
                                </div>
                            )}

                            {/* Items List */}
                            <div className="space-y-3">
                                <p className="font-bold text-white uppercase tracking-wider text-xs">
                                    Order Items ({selectedOrder.items.length})
                                </p>
                                <div className="divide-y divide-white/[0.06] border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.01]">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="p-3.5 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 flex-shrink-0">
                                                    {item.image_url ? (
                                                        <Image
                                                            src={item.image_url}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="48px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                                            <Gift size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{item.name}</p>
                                                    <p className="text-[11px] text-zinc-400">Qty: {item.quantity} × ₹{item.price}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-white tabular-nums">
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals Breakdown */}
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-2 text-xs">
                                <div className="flex justify-between text-zinc-400">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-white">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                {selectedOrder.discountAmount > 0 && (
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Coupon Discount ({selectedOrder.discountCode || 'Applied'})</span>
                                        <span className="font-medium">-₹{selectedOrder.discountAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-zinc-400">
                                    <span>Delivery Fee</span>
                                    <span className="text-emerald-400 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between items-baseline pt-2 border-t border-white/[0.08] text-sm font-bold text-white">
                                    <span>Total Paid (Online)</span>
                                    <span className="text-base text-white tabular-nums">
                                        ₹{selectedOrder.total.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
