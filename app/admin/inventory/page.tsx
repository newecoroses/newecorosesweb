'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Package, Search, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { supabase, DBProduct } from '@/lib/supabase';

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

function getStatus(stock: number): StockStatus {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
}

const statusVariant: Record<StockStatus, string> = {
    'In Stock': 'success',
    'Low Stock': 'warning',
    'Out of Stock': 'destructive',
};

export default function AdminInventoryPage() {
    const [products, setProducts] = useState<DBProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | StockStatus>('all');

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('id, name, collection_name, tag, stock, is_visible, image_url')
            .order('stock', { ascending: true });
        if (!error && data) setProducts(data as DBProduct[]);
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const filtered = useMemo(() => products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.collection_name?.toLowerCase().includes(search.toLowerCase());
        const status = getStatus(p.stock ?? 0);
        const matchFilter = filter === 'all' || status === filter;
        return matchSearch && matchFilter;
    }), [products, search, filter]);

    const inStock = products.filter(p => getStatus(p.stock ?? 0) === 'In Stock').length;
    const lowStock = products.filter(p => getStatus(p.stock ?? 0) === 'Low Stock').length;
    const outOfStock = products.filter(p => getStatus(p.stock ?? 0) === 'Out of Stock').length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Inventory"
                description="Stock levels across all products"
                tag="E-Commerce"
            >
                <button
                    onClick={fetchProducts}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: loading ? '—' : products.length, icon: Package, tone: 'bg-zinc-800 text-zinc-200 border-zinc-700' },
                    { label: 'In Stock', value: loading ? '—' : inStock, icon: CheckCircle, tone: 'bg-zinc-800 text-emerald-400 border-zinc-700' },
                    { label: 'Low Stock', value: loading ? '—' : lowStock, icon: AlertTriangle, tone: 'bg-zinc-800 text-amber-400 border-zinc-700' },
                    { label: 'Out of Stock', value: loading ? '—' : outOfStock, icon: XCircle, tone: 'bg-zinc-800 text-rose-400 border-zinc-700' },
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

            {/* Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle>Stock Levels</CardTitle>
                        <CardDescription>All products sorted by lowest stock first</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-56"
                            />
                        </div>
                        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
                            {(['all', 'In Stock', 'Low Stock', 'Out of Stock'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                                        filter === f ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    {f === 'all' ? 'All' : f}
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
                                    <th className="py-3 px-5">Product</th>
                                    <th className="py-3 px-4">Collection</th>
                                    <th className="py-3 px-4">Tag</th>
                                    <th className="py-3 px-4 text-center">Stock</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-5">Visibility</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    <tr><td colSpan={6} className="py-10 text-center text-zinc-500">Loading inventory...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={6} className="py-10 text-center text-zinc-500">No products found.</td></tr>
                                ) : filtered.map(p => {
                                    const status = getStatus(p.stock ?? 0);
                                    return (
                                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-5">
                                                <div className="flex items-center gap-3">
                                                    {p.image_url ? (
                                                        <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-zinc-700 flex-shrink-0" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                                                            <Package size={14} className="text-zinc-500" />
                                                        </div>
                                                    )}
                                                    <span className="font-semibold text-zinc-200 max-w-[200px] truncate">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-zinc-400">{p.collection_name || '—'}</td>
                                            <td className="py-3 px-4 text-zinc-400">{p.tag || '—'}</td>
                                            <td className="py-3 px-4 text-center font-bold text-white tabular-nums">{p.stock ?? 0}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant={statusVariant[status] as any}>{status}</Badge>
                                            </td>
                                            <td className="py-3 px-5">
                                                <Badge variant={p.is_visible ? 'success' : 'secondary'}>
                                                    {p.is_visible ? 'Visible' : 'Hidden'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
