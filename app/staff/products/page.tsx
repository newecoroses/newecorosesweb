'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
    Search,
    Package,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Info,
    X,
    Layers,
    Sparkles,
    Star,
    DollarSign,
    Eye,
    EyeOff,
    Plus,
    Trash2,
    Check,
    ArrowUpDown,
    Edit3
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
    const [activeTab, setActiveTab] = useState<'all' | 'best-picks'>('all');

    // Inline price editor
    const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
    const [newPrice, setNewPrice] = useState<string>('');

    // Best picks slot picker modal
    const [pickingSlotIndex, setPickingSlotIndex] = useState<number | null>(null);
    const [bestPicksSearch, setBestPicksSearch] = useState('');

    const [savingAction, setSavingAction] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const showNotice = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

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

    // Collections
    const collections = useMemo(() => {
        const set = new Set<string>();
        products.forEach(p => {
            if (p.collection_name) set.add(p.collection_name);
        });
        return Array.from(set);
    }, [products]);

    // 12 Best Picks Slots
    // We sort products where is_featured is true or tag is 'Featured' / 'Best Seller'
    const bestPicksProducts = useMemo(() => {
        return products.filter(p => p.is_featured || p.tag === 'Best Seller' || p.tag === 'Featured').slice(0, 12);
    }, [products]);

    const bestPicksSlots = useMemo(() => {
        const slots: (ProductItem | null)[] = [];
        for (let i = 0; i < 12; i++) {
            slots.push(bestPicksProducts[i] || null);
        }
        return slots;
    }, [bestPicksProducts]);

    // Update Product Price
    const handleSavePrice = async (p: ProductItem) => {
        if (!newPrice || isNaN(Number(newPrice))) return;
        setSavingAction(true);
        try {
            const res = await fetch('/api/staff/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    price: Number(newPrice),
                }),
            });
            if (res.ok) {
                setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, price: Number(newPrice) } : prod));
                setEditingPriceId(null);
                showNotice(`Price for "${p.name}" updated to ₹${Number(newPrice).toLocaleString('en-IN')}`);
            }
        } catch (err) {
            console.error('Failed to update price:', err);
        } finally {
            setSavingAction(false);
        }
    };

    // Toggle Product Visibility
    const handleToggleVisibility = async (p: ProductItem) => {
        setSavingAction(true);
        const nextState = !p.is_visible;
        try {
            const res = await fetch('/api/staff/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    is_visible: nextState,
                }),
            });
            if (res.ok) {
                setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, is_visible: nextState } : prod));
                showNotice(`"${p.name}" is now ${nextState ? 'visible online' : 'hidden from website'}`);
            }
        } catch (err) {
            console.error('Failed to toggle visibility:', err);
        } finally {
            setSavingAction(false);
        }
    };

    // Feature in Best Picks / Discard from Best Picks
    const handleToggleFeatured = async (p: ProductItem, featureState: boolean) => {
        setSavingAction(true);
        try {
            const res = await fetch('/api/staff/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    is_featured: featureState,
                    tag: featureState ? 'Featured' : 'Standard',
                }),
            });
            if (res.ok) {
                setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, is_featured: featureState, tag: featureState ? 'Featured' : 'Standard' } : prod));
                showNotice(`"${p.name}" ${featureState ? 'featured in Our Best Picks' : 'removed from Our Best Picks'}`);
                setPickingSlotIndex(null);
            }
        } catch (err) {
            console.error('Failed to update featured status:', err);
        } finally {
            setSavingAction(false);
        }
    };

    // Filtered Products for All Tab
    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.collection_name && p.collection_name.toLowerCase().includes(search.toLowerCase())) ||
                (p.tag && p.tag.toLowerCase().includes(search.toLowerCase()));

            const matchesCollection = filterCollection === 'All' || p.collection_name === filterCollection;
            return matchesSearch && matchesCollection;
        });
    }, [products, search, filterCollection]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Catalog Products &amp; Best Picks"
                description="Manage bouquet pricing, toggle online visibility &amp; curate Our Best Picks featured arrangement slots"
                tag="Catalog Operations"
            >
                <button
                    onClick={loadProducts}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>
            </PageHeader>

            {notification && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
                    <CheckCircle2 size={15} />
                    <span>{notification}</span>
                </div>
            )}

            {/* Navigation Tabs between All Products and Our Best Picks (12 Slots) */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'all'
                            ? 'bg-white text-zinc-950 shadow-xs'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                >
                    <Package size={14} />
                    <span>All Products ({products.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('best-picks')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'best-picks'
                            ? 'bg-white text-zinc-950 shadow-xs'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                >
                    <Sparkles size={14} className="text-amber-400" />
                    <span>Our Best Picks (12 Slots Available)</span>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md">
                        {bestPicksProducts.length}/12
                    </span>
                </button>
            </div>

            {/* ── TAB 1: ALL PRODUCTS (With Sequential Numbering & Spacy Rows) ── */}
            {activeTab === 'all' && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4 pb-4">
                        <div>
                            <CardTitle>Catalog Inventory &amp; Live Controls</CardTitle>
                            <CardDescription>
                                Click any price to edit, toggle online visibility, or feature in Best Picks
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative">
                                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search products, collections..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-64"
                                />
                            </div>

                            <select
                                value={filterCollection}
                                onChange={e => setFilterCollection(e.target.value)}
                                className="px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
                            >
                                <option value="All">All Collections</option>
                                {collections.map(col => (
                                    <option key={col} value={col}>{col}</option>
                                ))}
                            </select>
                        </div>
                    </CardHeader>

                    <CardContent className="px-0 py-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-white/[0.06] bg-white/[0.01] text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                                        <th className="py-4 px-5 text-center">#</th>
                                        <th className="py-4 px-6">Product Bouquet</th>
                                        <th className="py-4 px-5">Collection</th>
                                        <th className="py-4 px-5 text-right">Price (Click to Edit)</th>
                                        <th className="py-4 px-5 text-center">Stock</th>
                                        <th className="py-4 px-5 text-center">Visibility on Site</th>
                                        <th className="py-4 px-5 text-center">Best Picks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="py-16 text-center text-zinc-500">
                                                Loading arrangements...
                                            </td>
                                        </tr>
                                    ) : filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-16 text-center text-zinc-500">
                                                No products found matching &ldquo;{search}&rdquo;.
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((p, idx) => (
                                            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                                {/* Sequential Number 1, 2, 3... */}
                                                <td className="py-4 px-5 text-center font-mono font-bold text-zinc-400 text-xs">
                                                    #{idx + 1}
                                                </td>

                                                {/* Product Info */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/60 flex-shrink-0">
                                                            {p.image_url ? (
                                                                <Image
                                                                    src={p.image_url}
                                                                    alt={p.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                                    <Package size={18} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 max-w-sm">
                                                            <p className="font-semibold text-zinc-100 text-xs leading-snug">{p.name}</p>
                                                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate">{p.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Collection */}
                                                <td className="py-4 px-5 text-zinc-400">
                                                    {p.collection_name || 'General'}
                                                </td>

                                                {/* Editable Price */}
                                                <td className="py-4 px-5 text-right">
                                                    {editingPriceId === p.id ? (
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <div className="relative w-24">
                                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">₹</span>
                                                                <input
                                                                    autoFocus
                                                                    type="number"
                                                                    value={newPrice}
                                                                    onChange={e => setNewPrice(e.target.value)}
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Enter') handleSavePrice(p);
                                                                        if (e.key === 'Escape') setEditingPriceId(null);
                                                                    }}
                                                                    className="w-full pl-5 pr-2 py-1 bg-zinc-900 border border-zinc-600 rounded-lg text-xs text-white tabular-nums focus:outline-none"
                                                                />
                                                            </div>
                                                            <button
                                                                disabled={savingAction}
                                                                onClick={() => handleSavePrice(p)}
                                                                className="p-1 rounded bg-white text-zinc-950 font-bold hover:bg-zinc-200 cursor-pointer"
                                                                title="Save Price"
                                                            >
                                                                <Check size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingPriceId(null)}
                                                                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setEditingPriceId(p.id);
                                                                setNewPrice(String(p.price || ''));
                                                            }}
                                                            className="font-bold text-white tabular-nums hover:underline hover:text-zinc-200 cursor-pointer inline-flex items-center gap-1 group"
                                                            title="Click to change price"
                                                        >
                                                            <span>₹{(p.price || 0).toLocaleString('en-IN')}</span>
                                                            <Edit3 size={11} className="opacity-0 group-hover:opacity-100 text-zinc-400" />
                                                        </button>
                                                    )}
                                                </td>

                                                {/* Stock */}
                                                <td className="py-4 px-5 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                                                        p.stock > 5
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                            : p.stock > 0
                                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                    }`}>
                                                        {p.stock} units
                                                    </span>
                                                </td>

                                                {/* Visibility Toggle Button */}
                                                <td className="py-4 px-5 text-center">
                                                    <button
                                                        onClick={() => handleToggleVisibility(p)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                                            p.is_visible
                                                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/30'
                                                                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-emerald-500/15 hover:text-emerald-300 hover:border-emerald-500/30'
                                                        }`}
                                                        title="Click to show or hide from website"
                                                    >
                                                        {p.is_visible ? (
                                                            <>
                                                                <Eye size={13} />
                                                                <span>Live on Site</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff size={13} />
                                                                <span>Hidden</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>

                                                {/* Best Picks Toggle Button */}
                                                <td className="py-4 px-5 text-center">
                                                    <button
                                                        onClick={() => handleToggleFeatured(p, !p.is_featured)}
                                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                                            p.is_featured
                                                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/30'
                                                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-white hover:text-zinc-950 hover:border-white'
                                                        }`}
                                                    >
                                                        <Star size={12} className={p.is_featured ? 'fill-amber-400 text-amber-400' : ''} />
                                                        <span>{p.is_featured ? 'Featured' : '+ Best Pick'}</span>
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
            )}

            {/* ── TAB 2: OUR BEST PICKS (12 Dedicated Slots Available) ── */}
            {activeTab === 'best-picks' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Sparkles size={16} className="text-amber-400" />
                                Our Best Picks Showcase (12 Slots)
                            </h2>
                            <p className="text-xs text-zinc-400 mt-0.5">
                                Feature any arrangement in the curated slots below or discard items to make room for new blooms
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {bestPicksSlots.map((item, index) => {
                            const slotNumber = index + 1;
                            if (item) {
                                return (
                                    <div
                                        key={item.id}
                                        className="relative p-5 rounded-3xl bg-[#12141c]/90 border border-white/[0.08] hover:border-zinc-700 transition-all group flex flex-col justify-between space-y-3.5 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                                Slot #{slotNumber}
                                            </span>
                                            <button
                                                onClick={() => handleToggleFeatured(item, false)}
                                                className="text-zinc-400 hover:text-rose-400 text-xs flex items-center gap-1 p-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                title="Discard / Remove from Best Picks"
                                            >
                                                <Trash2 size={13} />
                                                <span>Discard</span>
                                            </button>
                                        </div>

                                        <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/60">
                                            {item.image_url ? (
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                    <Package size={24} />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <p className="font-bold text-white text-sm line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-zinc-400 mt-0.5">{item.collection_name || 'Bouquet'}</p>
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
                                                <span className="text-base font-extrabold text-white tabular-nums">
                                                    ₹{(item.price || 0).toLocaleString('en-IN')}
                                                </span>
                                                <Badge variant={item.stock > 0 ? 'success' : 'destructive'}>
                                                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={`empty-${slotNumber}`}
                                    onClick={() => setPickingSlotIndex(slotNumber)}
                                    className="p-6 rounded-3xl border border-dashed border-zinc-700/80 hover:border-white bg-[#0f1118]/60 hover:bg-[#151824] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 min-h-[280px] group"
                                >
                                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                                        Slot #{slotNumber}
                                    </span>
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:scale-110 group-hover:bg-zinc-800 transition-all">
                                        <Plus size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
                                            Empty Slot
                                        </p>
                                        <p className="text-[11px] text-zinc-500 mt-0.5">
                                            Click to feature an arrangement
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Picker Modal to Feature Any Bouquet in a Selected Slot */}
            {pickingSlotIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
                    onClick={() => setPickingSlotIndex(null)}
                >
                    <div
                        className="relative w-full max-w-lg bg-[#12141c] border border-white/[0.12] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    Feature in Slot #{pickingSlotIndex}
                                </h3>
                                <p className="text-xs text-zinc-400">Select any bouquet to showcase in Our Best Picks</p>
                            </div>
                            <button
                                onClick={() => setPickingSlotIndex(null)}
                                className="text-zinc-400 hover:text-white p-1 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="relative">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search catalog bouquets..."
                                value={bestPicksSearch}
                                onChange={e => setBestPicksSearch(e.target.value)}
                                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                            {products
                                .filter(p => !p.is_featured && p.name.toLowerCase().includes(bestPicksSearch.toLowerCase()))
                                .map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => handleToggleFeatured(p, true)}
                                        className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 flex-shrink-0">
                                                {p.image_url ? (
                                                    <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                        <Package size={14} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-xs group-hover:underline">{p.name}</p>
                                                <p className="text-[10px] text-zinc-400">{p.collection_name || 'Bouquet'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-white text-xs tabular-nums">
                                                ₹{(p.price || 0).toLocaleString('en-IN')}
                                            </p>
                                            <span className="text-[10px] text-emerald-400 font-semibold group-hover:underline">
                                                + Select Slot
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
