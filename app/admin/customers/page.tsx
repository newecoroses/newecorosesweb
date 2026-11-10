'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Phone, MapPin, ShoppingBag, TrendingUp, Mail } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { SavedOrder } from '@/lib/order-cache';

interface CustomerSummary {
    phone: string;
    name: string;
    email?: string;
    city: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    lastOrderStatus: SavedOrder['status'];
    orderNumbers: string[];
}

export default function AdminCustomersPage() {
    const [orders, setOrders] = useState<SavedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/orders')
            .then(r => r.json())
            .then(data => {
                if (data.success && data.orders) setOrders(data.orders);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const customers = useMemo<CustomerSummary[]>(() => {
        const map = new Map<string, CustomerSummary>();
        [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).forEach(o => {
            const key = o.customer.phone || o.customer.name;
            if (!map.has(key)) {
                map.set(key, {
                    phone: o.customer.phone,
                    name: o.customer.name,
                    email: o.customer.email,
                    city: o.shippingAddress.city,
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrderDate: o.createdAt,
                    lastOrderStatus: o.status,
                    orderNumbers: [],
                });
            }
            const c = map.get(key)!;
            c.totalOrders += 1;
            if (o.status !== 'cancelled') c.totalSpent += o.total;
            c.orderNumbers.push(o.orderNumber);
            if (new Date(o.createdAt) > new Date(c.lastOrderDate)) {
                c.lastOrderDate = o.createdAt;
                c.lastOrderStatus = o.status;
            }
        });
        return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
    }, [orders]);

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.city.toLowerCase().includes(search.toLowerCase())
    );

    const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
    const now = new Date();
    const thisMonth = customers.filter(c => {
        const d = new Date(c.lastOrderDate);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const statusBadge = (s: SavedOrder['status']) => {
        const map: Record<string, string> = {
            confirmed: 'default', processing: 'info', delivered: 'success', cancelled: 'destructive', paid: 'default',
        };
        const labels: Record<string, string> = {
            confirmed: 'Confirmed', processing: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled', paid: 'Paid',
        };
        return <Badge variant={map[s] as any}>{labels[s] || s}</Badge>;
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Customers"
                description="All unique customers derived from store orders"
                tag="E-Commerce"
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Customers', value: loading ? '—' : customers.length, icon: Users },
                    { label: 'New This Month', value: loading ? '—' : thisMonth, icon: TrendingUp },
                    { label: 'Total Orders', value: loading ? '—' : orders.length, icon: ShoppingBag },
                    { label: 'Total Revenue', value: loading ? '—' : `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp },
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

            {/* Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <CardTitle>Customer List</CardTitle>
                        <CardDescription>Unique customers from all orders</CardDescription>
                    </div>
                    <div className="relative w-72">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, city..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                        />
                    </div>
                </CardHeader>
                <CardContent className="px-0 py-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.01] text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                                    <th className="py-3 px-5">Customer</th>
                                    <th className="py-3 px-4">Contact</th>
                                    <th className="py-3 px-4">Location</th>
                                    <th className="py-3 px-4 text-center">Orders</th>
                                    <th className="py-3 px-4 text-right">Total Spent</th>
                                    <th className="py-3 px-4">Last Status</th>
                                    <th className="py-3 px-5">Last Order</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    <tr><td colSpan={7} className="py-10 text-center text-zinc-500">Loading customers...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="py-10 text-center text-zinc-500">No customers found.</td></tr>
                                ) : filtered.map(c => (
                                    <tr key={c.phone} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                                    {c.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-zinc-200">{c.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1 text-zinc-300"><Phone size={10} />{c.phone}</span>
                                                {c.email && <span className="flex items-center gap-1 text-zinc-500"><Mail size={10} />{c.email}</span>}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="flex items-center gap-1 text-zinc-400"><MapPin size={10} />{c.city}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center font-bold text-white tabular-nums">{c.totalOrders}</td>
                                        <td className="py-3 px-4 text-right font-bold text-white tabular-nums">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                                        <td className="py-3 px-4">{statusBadge(c.lastOrderStatus)}</td>
                                        <td className="py-3 px-5 text-zinc-400">
                                            {new Date(c.lastOrderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
