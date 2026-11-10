'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Users,
    Search,
    Phone,
    MapPin,
    ShoppingBag,
    TrendingUp,
    Mail,
    Plus,
    Calendar,
    Gift,
    Sparkles,
    CheckCircle2,
    RefreshCw,
    Clock
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { AddCustomerModal } from '@/components/admin/add-customer-modal';
import { CustomerRecord } from '@/lib/customer-store';

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<CustomerRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterSource, setFilterSource] = useState<'all' | 'in-store' | 'reception' | 'online'>('all');
    const [modalOpen, setModalOpen] = useState(false);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/customers');
            const data = await res.json();
            if (data.success && data.customers) {
                setCustomers(data.customers);
            }
        } catch (err) {
            console.error('Error fetching customers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filtered = useMemo(() => {
        return customers.filter(c => {
            const matchesSearch =
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.phone.includes(search) ||
                (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
                (c.specialDayType && c.specialDayType.toLowerCase().includes(search.toLowerCase())) ||
                c.purchasedItems.some(i => i.toLowerCase().includes(search.toLowerCase()));

            const matchesSource = filterSource === 'all' || c.source === filterSource;
            return matchesSearch && matchesSource;
        });
    }, [customers, search, filterSource]);

    const totalRevenue = customers.reduce((sum, c) => sum + (c.amountSpent || 0), 0);
    const inStoreCount = customers.filter(c => c.source === 'in-store' || c.source === 'reception').length;
    const onlineCount = customers.filter(c => c.source === 'online').length;

    const sourceBadge = (source: CustomerRecord['source']) => {
        switch (source) {
            case 'in-store':
            case 'reception':
                return <Badge variant="default"><Users size={10} /> Reception / In-Store</Badge>;
            case 'online':
                return <Badge variant="secondary"><ShoppingBag size={10} /> Online Shopper</Badge>;
            default:
                return <Badge variant="secondary">{source}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Customer Directory"
                description="Manage in-store reception guests, special day reminders & online boutique shoppers"
                tag="E-Commerce"
            >
                <button
                    onClick={fetchCustomers}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>

                <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                    <Plus size={14} className="stroke-[2.5]" />
                    <span>Add Reception Customer</span>
                </button>
            </PageHeader>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Customers', value: loading ? '—' : customers.length, icon: Users, tone: 'bg-zinc-800 text-zinc-100 border-zinc-700' },
                    { label: 'In-Store / Reception', value: loading ? '—' : inStoreCount, icon: Gift, tone: 'bg-zinc-800 text-zinc-200 border-zinc-700' },
                    { label: 'Online Storefront', value: loading ? '—' : onlineCount, icon: ShoppingBag, tone: 'bg-zinc-800 text-zinc-200 border-zinc-700' },
                    { label: 'Lifetime Spent', value: loading ? '—' : `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, tone: 'bg-zinc-800 text-white border-zinc-700' },
                ].map(item => (
                    <Card key={item.label}>
                        <CardContent className="flex items-center gap-4 py-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${item.tone}`}>
                                <item.icon size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium">{item.label}</p>
                                <p className="text-2xl font-bold text-white tabular-nums">{item.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Customers Data Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle>Customer Records &amp; Occasions</CardTitle>
                        <CardDescription>
                            All registered clients with order history and special celebration dates
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Search Input */}
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search by name, phone, item, occasion..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-64"
                            />
                        </div>

                        {/* Source filter tabs */}
                        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
                            {(['all', 'in-store', 'online'] as const).map(src => (
                                <button
                                    key={src}
                                    onClick={() => setFilterSource(src as any)}
                                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer capitalize ${
                                        filterSource === src
                                            ? 'bg-white text-zinc-950'
                                            : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    {src === 'all' ? 'All Sources' : src === 'in-store' ? 'In-Store' : 'Online'}
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
                                    <th className="py-3 px-5">Customer &amp; Source</th>
                                    <th className="py-3 px-4">Contact</th>
                                    <th className="py-3 px-4">Special Occasion / DOB</th>
                                    <th className="py-3 px-4">Purchased Blooms</th>
                                    <th className="py-3 px-4 text-right">Amount Spent</th>
                                    <th className="py-3 px-4 text-center">15% Greeting</th>
                                    <th className="py-3 px-5 text-right">Date Added</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-zinc-500">
                                            Loading customer directory...
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-zinc-500">
                                            No customers found matching &ldquo;{search}&rdquo;. Click &ldquo;Add Reception Customer&rdquo; above.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(c => (
                                        <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                                            {/* Customer Name & Source */}
                                            <td className="py-3 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                                        {c.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-zinc-100">{c.name}</p>
                                                        <div className="mt-0.5">{sourceBadge(c.source)}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="py-3 px-4">
                                                <div className="space-y-0.5">
                                                    <span className="flex items-center gap-1.5 text-zinc-200 font-mono">
                                                        <Phone size={11} className="text-zinc-500" />
                                                        {c.phone}
                                                    </span>
                                                    {c.email ? (
                                                        <span className="flex items-center gap-1.5 text-zinc-400">
                                                            <Mail size={11} className="text-zinc-500" />
                                                            {c.email}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-zinc-600">No email given</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Special Occasion / DOB */}
                                            <td className="py-3 px-4">
                                                {c.specialDay || c.dob ? (
                                                    <div className="space-y-1">
                                                        {c.specialDay && (
                                                            <div className="flex items-center gap-1.5 text-zinc-200">
                                                                <Gift size={11} className="text-zinc-400" />
                                                                <span className="font-medium text-[11px]">
                                                                    {c.specialDayType || 'Special Day'}:{' '}
                                                                    <span className="text-white font-semibold">
                                                                        {new Date(c.specialDay).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        )}
                                                        {c.dob && (
                                                            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                                                                <Calendar size={11} className="text-zinc-500" />
                                                                <span>DOB: {new Date(c.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-600">—</span>
                                                )}
                                            </td>

                                            {/* Purchased Blooms */}
                                            <td className="py-3 px-4 max-w-[220px]">
                                                {c.purchasedItems.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {c.purchasedItems.map(item => (
                                                            <span
                                                                key={item}
                                                                className="inline-block px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700/60 truncate max-w-[180px]"
                                                                title={item}
                                                            >
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-500">—</span>
                                                )}
                                            </td>

                                            {/* Amount Spent */}
                                            <td className="py-3 px-4 text-right font-bold text-white tabular-nums">
                                                ₹{(c.amountSpent || 0).toLocaleString('en-IN')}
                                            </td>

                                            {/* Greeting Email */}
                                            <td className="py-3 px-4 text-center">
                                                {c.greetingEmailStatus ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle2 size={10} />
                                                        {c.greetingEmailStatus.couponCode} (15% Off)
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-zinc-600">Pending</span>
                                                )}
                                            </td>

                                            {/* Date Added */}
                                            <td className="py-3 px-5 text-right text-zinc-400 text-[11px] tabular-nums">
                                                {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Receptionist Check-In Modal */}
            <AddCustomerModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCustomerAdded={() => fetchCustomers()}
            />
        </div>
    );
}
