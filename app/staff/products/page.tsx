'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
    Search,
    Package,
    Eye,
    RefreshCw,
    Shield,
    CheckCircle2,
    XCircle,
    Info,
    X,
    Layers
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';

interface ProductItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    collection_name: string;
    collection_slug: string;
    tag: string;
    image_url: string;
    price?: number | null;
    original_price?: number | null;
    stock: number;
    is_visible: boolean;
    is_featured: boolean;
    sort_order: number;
    updated_at: string;
}

export default function StaffProductsPage() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCollection, setFilterCollection] = useState('All');
    const [filterStock, setFilterStock] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
    const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/staff/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            }
        } catch (err) {
            console.error('Error loading products for staff:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Unique collection list
    const collections = useMemo(() => {
        const set = new Set<string>();
        products.forEach(p => {
            if (p.collection_name) set.add(p.collection_name);
        });
        return Array.from(set);
    }, [products]);

    // Filter products
    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.collection_name && p.collection_name.toLowerCase().includes(search.toLowerCase())) ||
                (p.tag && p.tag.toLowerCase().includes(search.toLowerCase()));

            const matchesCollection = filterCollection === 'All' || p.collection_name === filterCollection;
            const matchesStock =
                filterStock === 'all' ||
                (filterStock === 'in-stock' && p.stock > 0) ||
                (filterStock === 'out-of-stock' && p.stock <= 0);

            return matchesSearch && matchesCollection && matchesStock;
        });
    }, [products, search, filterCollection, filterStock]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Product Catalog & Stock"
                description="Browse active blooms, check stock levels and view arrangement pricing (View-Only)"
                tag="Staff View"
            >
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                    <Shield size={13} className="text-zinc-500" />
                    <span>Catalog Modification Locked for Staff</span>
                </div>

                <button
                    onClick={loadProducts}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </PageHeader>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Catalog Products', value: loading ? '—' : products.length, icon: Package },
                    { label: 'In Stock Items', value: loading ? '—' : products.filter(p => p.stock > 0).length, icon: CheckCircle2 },
                    { label: 'Out of Stock Items', value: loading ? '—' : products.filter(p => p.stock <= 0).length, icon: XCircle },
                    { label: 'Collections', value: loading ? '—' : collections.length, icon: Layers },
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

            {/* Catalog Browser Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle>Catalog Products List</CardTitle>
                        <CardDescription>
                            Showing {filtered.length} of {products.length} arrangements
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Search */}
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search products, collections..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-56"
                            />
                        </div>

                        {/* Collection Filter */}
                        <select
                            value={filterCollection}
                            onChange={e => setFilterCollection(e.target.value)}
                            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
                        >
                            <option value="All">All Collections</option>
                            {collections.map(col => (
                                <option key={col} value={col}>{col}</option>
                            ))}
                        </select>

                        {/* Stock filter tabs */}
                        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
                            {(['all', 'in-stock', 'out-of-stock'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStock(s)}
                                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                                        filterStock === s
                                            ? 'bg-white text-zinc-950'
                                            : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    {s === 'all' ? 'All' : s === 'in-stock' ? 'In Stock' : 'Out'}
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
                                    <th className="py-3 px-5">Arrangement</th>
                                    <th className="py-3 px-4">Collection</th>
                                    <th className="py-3 px-4">Tag</th>
                                    <th className="py-3 px-4 text-center">Stock</th>
                                    <th className="py-3 px-4 text-right">Price</th>
                                    <th className="py-3 px-4 text-center">Store Status</th>
                                    <th className="py-3 px-5 text-center">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-zinc-500">
                                            Loading catalog...
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-zinc-500">
                                            No products found matching &ldquo;{search}&rdquo;.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(p => (
                                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                            {/* Thumbnail & Name */}
                                            <td className="py-3 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/60 flex-shrink-0">
                                                        {p.image_url ? (
                                                            <Image
                                                                src={p.image_url}
                                                                alt={p.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                                <Package size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 max-w-xs">
                                                        <p className="font-semibold text-zinc-200 truncate">{p.name}</p>
                                                        <p className="text-[10px] text-zinc-500 font-mono truncate">{p.slug}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Collection */}
                                            <td className="py-3 px-4 text-zinc-400">
                                                {p.collection_name || '—'}
                                            </td>

                                            {/* Tag */}
                                            <td className="py-3 px-4">
                                                {p.tag ? (
                                                    <Badge variant="secondary">{p.tag}</Badge>
                                                ) : (
                                                    <span className="text-zinc-600">—</span>
                                                )}
                                            </td>

                                            {/* Stock */}
                                            <td className="py-3 px-4 text-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                                                    p.stock > 5
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : p.stock > 0
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                }`}>
                                                    {p.stock} units
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="py-3 px-4 text-right">
                                                <div className="font-bold text-white tabular-nums">
                                                    {p.price ? `₹${p.price.toLocaleString('en-IN')}` : '₹0'}
                                                </div>
                                                {p.original_price && p.original_price > (p.price || 0) && (
                                                    <span className="text-[10px] text-zinc-500 line-through tabular-nums">
                                                        ₹{p.original_price.toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Visibility */}
                                            <td className="py-3 px-4 text-center">
                                                <Badge variant={p.is_visible ? 'success' : 'secondary'}>
                                                    {p.is_visible ? 'Active Online' : 'Hidden'}
                                                </Badge>
                                            </td>

                                            {/* View Info */}
                                            <td className="py-3 px-5 text-center">
                                                <button
                                                    onClick={() => setSelectedProduct(p)}
                                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                                                    title="View Arrangement Details"
                                                >
                                                    <Info size={15} />
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

            {/* Product Details Drawer / Modal (Read-Only) */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="relative w-full max-w-lg bg-[#12141c] border border-white/[0.12] rounded-3xl p-6 shadow-2xl space-y-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                            <div>
                                <h3 className="text-base font-bold text-white">{selectedProduct.name}</h3>
                                <p className="text-xs text-zinc-400">{selectedProduct.collection_name}</p>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="text-zinc-400 hover:text-white p-1 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Image & Price */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700 flex-shrink-0">
                                {selectedProduct.image_url ? (
                                    <Image
                                        src={selectedProduct.image_url}
                                        alt={selectedProduct.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                        <Package size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-extrabold text-white tabular-nums">
                                    ₹{(selectedProduct.price || 0).toLocaleString('en-IN')}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Badge variant={selectedProduct.stock > 0 ? 'success' : 'destructive'}>
                                        {selectedProduct.stock > 0 ? `${selectedProduct.stock} In Stock` : 'Out of Stock'}
                                    </Badge>
                                    {selectedProduct.tag && (
                                        <Badge variant="secondary">{selectedProduct.tag}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-xs font-semibold text-zinc-300 mb-1">Arrangement Description</p>
                            <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                                {selectedProduct.description || 'No description added for this product.'}
                            </p>
                        </div>

                        {/* Permissions notice */}
                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
                            <Shield size={14} className="text-zinc-500 flex-shrink-0" />
                            <span>Staff View Only: Product creation, price adjustments, and image uploads require Administrator privileges.</span>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="px-4 py-2 bg-white text-zinc-950 font-bold text-xs rounded-xl hover:bg-zinc-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
