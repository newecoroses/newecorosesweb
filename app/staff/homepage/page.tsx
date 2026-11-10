'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Sparkles, ArrowUp, ArrowDown, Plus, Trash2, CheckCircle2,
    AlertCircle, Search, RefreshCw, Lock, ExternalLink, Flame, Star, Package, X
} from 'lucide-react';
import { StaffPermissions } from '@/lib/staff-auth';

interface ProductSummary {
    id: string;
    name: string;
    slug: string;
    tag?: string;
    image_url: string;
    stock: number;
    is_visible: boolean;
    is_featured: boolean;
    sort_order: number;
}

export default function StaffHomepagePage() {
    const [permissions, setPermissions] = useState<StaffPermissions | null>(null);
    const [featured, setFeatured] = useState<ProductSummary[]>([]);
    const [newArrivals, setNewArrivals] = useState<ProductSummary[]>([]);
    const [bestSellers, setBestSellers] = useState<ProductSummary[]>([]);
    const [trending, setTrending] = useState<ProductSummary[]>([]);
    const [allProducts, setAllProducts] = useState<ProductSummary[]>([]);

    const [activeTab, setActiveTab] = useState<'featured' | 'new_arrivals' | 'best_sellers' | 'trending'>('featured');
    const [loading, setLoading] = useState(true);
    const [searchAdd, setSearchAdd] = useState('');
    const [isAddPickerOpen, setIsAddPickerOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Check auth
            const authRes = await fetch('/api/staff/auth');
            if (authRes.ok) {
                const authData = await authRes.json();
                setPermissions(authData.staff?.permissions || null);
            }

            // Get homepage data
            const res = await fetch('/api/staff/homepage');
            if (res.ok) {
                const data = await res.json();
                setFeatured(data.featured || []);
                setNewArrivals(data.newArrivals || []);
                setBestSellers(data.bestSellers || []);
                setTrending(data.trending || []);
                setAllProducts(data.allProducts || []);
            }
        } catch (err) {
            console.error('Failed to load homepage data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Reorder featured products
    const handleMoveFeatured = async (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= featured.length) return;

        const updated = [...featured];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        // Assign new sort_orders
        const reordered = updated.map((item, idx) => ({
            ...item,
            sort_order: idx + 1,
        }));

        setFeatured(reordered);

        try {
            await fetch('/api/staff/homepage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reorder',
                    items: reordered.map(item => ({ id: item.id, sort_order: item.sort_order })),
                }),
            });
            showToast('Homepage display order updated!');
        } catch (err) {
            console.error('Reorder error:', err);
            loadData();
        }
    };

    // Toggle featured on/off
    const handleRemoveFromFeatured = async (product: ProductSummary) => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/staff/homepage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'toggle_featured',
                    productId: product.id,
                    productName: product.name,
                    is_featured: false,
                }),
            });
            if (res.ok) {
                showToast(`"${product.name}" removed from homepage featured.`);
                loadData();
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddToFeatured = async (product: ProductSummary) => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/staff/homepage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'toggle_featured',
                    productId: product.id,
                    productName: product.name,
                    is_featured: true,
                }),
            });
            if (res.ok) {
                showToast(`"${product.name}" added to homepage featured!`);
                setIsAddPickerOpen(false);
                setSearchAdd('');
                loadData();
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Set Section Tag
    const handleSetSectionTag = async (product: ProductSummary, newTag: string) => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/staff/homepage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'set_tag',
                    productId: product.id,
                    productName: product.name,
                    tag: newTag,
                }),
            });
            if (res.ok) {
                showToast(
                    newTag === 'Standard'
                        ? `"${product.name}" removed from section.`
                        : `"${product.name}" added to ${newTag}!`
                );
                setIsAddPickerOpen(false);
                setSearchAdd('');
                loadData();
            }
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center text-gray-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                <p className="text-sm">Loading homepage sections...</p>
            </div>
        );
    }

    if (permissions && !permissions.canManageHomepage) {
        return (
            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-700/60 flex items-center justify-center mx-auto text-amber-400">
                    <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-white">Homepage Management Locked</h2>
                <p className="text-sm text-gray-400">
                    Your staff account does not currently have permission to edit homepage sections or featured products. Please contact your administrator.
                </p>
                <Link
                    href="/staff/products"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-xl text-xs transition-colors"
                >
                    <Package className="w-4 h-4" /> Go to Product Catalog
                </Link>
            </div>
        );
    }

    // Filter candidate products to add
    const candidateProducts = allProducts.filter(p => {
        if (!searchAdd) return true;
        const q = searchAdd.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        Homepage Product Management
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Curate the products displayed on the live homepage across Featured, New Arrivals, Best Sellers, and Trending sections.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-colors border border-gray-700"
                    >
                        <span>Preview Homepage</span>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    </Link>
                </div>
            </div>

            {/* Toast feedback */}
            {toastMessage && (
                <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-3">
                <button
                    onClick={() => { setActiveTab('featured'); setIsAddPickerOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === 'featured'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/60'
                            : 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                >
                    <Star className="w-4 h-4" />
                    Featured Best Picks ({featured.length})
                </button>

                <button
                    onClick={() => { setActiveTab('new_arrivals'); setIsAddPickerOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === 'new_arrivals'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/60'
                            : 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                >
                    <Sparkles className="w-4 h-4" />
                    New Arrivals ({newArrivals.length})
                </button>

                <button
                    onClick={() => { setActiveTab('best_sellers'); setIsAddPickerOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === 'best_sellers'
                            ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-950/60'
                            : 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                >
                    <Star className="w-4 h-4" />
                    Best Sellers ({bestSellers.length})
                </button>

                <button
                    onClick={() => { setActiveTab('trending'); setIsAddPickerOpen(false); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === 'trending'
                            ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/60'
                            : 'bg-[#111827] text-gray-400 hover:text-white border border-gray-800'
                    }`}
                >
                    <Flame className="w-4 h-4" />
                    Trending Now ({trending.length})
                </button>
            </div>

            {/* TAB 1: FEATURED BEST PICKS */}
            {activeTab === 'featured' && (
                <div className="space-y-4">
                    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Star className="w-4 h-4 text-purple-400" />
                                Homepage Curated Best Picks ({featured.length} items)
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                These products appear in the main &ldquo;Our Best Picks&rdquo; showcase on the homepage. Use the arrows to reorder.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAddPickerOpen(true)}
                            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-purple-950/40"
                        >
                            <Plus className="w-4 h-4" /> Add Product to Featured
                        </button>
                    </div>

                    {featured.length === 0 ? (
                        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-12 text-center text-gray-400 space-y-2">
                            <Star className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                            <p className="text-base font-bold text-white">No featured products selected</p>
                            <p className="text-xs text-gray-500">Click &ldquo;Add Product to Featured&rdquo; to choose products for the homepage.</p>
                        </div>
                    ) : (
                        <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
                            <div className="divide-y divide-gray-800/60">
                                {featured.map((p, idx) => (
                                    <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-800/30 transition-colors">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {/* Numeric position */}
                                            <div className="w-7 h-7 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-xs font-bold text-purple-300 flex-shrink-0">
                                                #{idx + 1}
                                            </div>

                                            {/* Thumbnail */}
                                            <div className="relative w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden flex-shrink-0">
                                                {p.image_url ? (
                                                    <img
                                                        src={p.image_url}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">No img</div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="font-semibold text-white truncate max-w-xs sm:max-w-md">
                                                    {p.name}
                                                </div>
                                                <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                                                    <span className={p.stock > 0 ? 'text-teal-400' : 'text-red-400'}>
                                                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                                                    </span>
                                                    <span>&bull;</span>
                                                    <span className={p.is_visible ? 'text-emerald-400' : 'text-amber-400'}>
                                                        {p.is_visible ? 'Live' : 'Hidden'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions: Move Up / Down & Remove */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={idx === 0}
                                                onClick={() => handleMoveFeatured(idx, 'up')}
                                                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                                title="Move Up"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                disabled={idx === featured.length - 1}
                                                onClick={() => handleMoveFeatured(idx, 'down')}
                                                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                                title="Move Down"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveFromFeatured(p)}
                                                className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white transition-colors"
                                                title="Remove from Homepage"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: NEW ARRIVALS */}
            {activeTab === 'new_arrivals' && (
                <div className="space-y-4">
                    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                New Arrivals Section ({newArrivals.length} items)
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Products displayed in the &ldquo;Just In: New Arrivals&rdquo; section on the homepage.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAddPickerOpen(true)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-950/40"
                        >
                            <Plus className="w-4 h-4" /> Add Product to New Arrivals
                        </button>
                    </div>

                    {newArrivals.length === 0 ? (
                        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-12 text-center text-gray-400">
                            <p className="text-sm font-semibold text-white">No products currently tagged New Arrival.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {newArrivals.map(p => (
                                <div key={p.id} className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden flex-shrink-0">
                                            {p.image_url && (
                                                <img
                                                    src={p.image_url}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp';
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-white truncate max-w-[180px]">{p.name}</div>
                                            <div className="text-xs text-gray-500">/{p.slug}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSetSectionTag(p, 'Standard')}
                                        className="text-xs text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-950/60"
                                        title="Remove from New Arrivals"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: BEST SELLERS */}
            {activeTab === 'best_sellers' && (
                <div className="space-y-4">
                    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Star className="w-4 h-4 text-fuchsia-400" />
                                Best Sellers Section ({bestSellers.length} items)
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Products displayed in the &ldquo;Most Loved: Best Sellers&rdquo; section on the homepage.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAddPickerOpen(true)}
                            className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-fuchsia-950/40"
                        >
                            <Plus className="w-4 h-4" /> Add Product to Best Sellers
                        </button>
                    </div>

                    {bestSellers.length === 0 ? (
                        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-12 text-center text-gray-400">
                            <p className="text-sm font-semibold text-white">No products currently tagged Best Seller.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {bestSellers.map(p => (
                                <div key={p.id} className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden flex-shrink-0">
                                            {p.image_url && (
                                                <img
                                                    src={p.image_url}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp';
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-white truncate max-w-[180px]">{p.name}</div>
                                            <div className="text-xs text-gray-500">/{p.slug}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSetSectionTag(p, 'Standard')}
                                        className="text-xs text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-950/60"
                                        title="Remove from Best Sellers"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 4: TRENDING NOW */}
            {activeTab === 'trending' && (
                <div className="space-y-4">
                    <div className="bg-[#111827] border border-gray-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Flame className="w-4 h-4 text-amber-400" />
                                Trending Now Section ({trending.length} items)
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Products displayed in the &ldquo;What&apos;s Hot: Trending Now&rdquo; section on the homepage.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAddPickerOpen(true)}
                            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-950/40"
                        >
                            <Plus className="w-4 h-4" /> Add Product to Trending
                        </button>
                    </div>

                    {trending.length === 0 ? (
                        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-12 text-center text-gray-400">
                            <p className="text-sm font-semibold text-white">No products currently tagged Trending.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {trending.map(p => (
                                <div key={p.id} className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden flex-shrink-0">
                                            {p.image_url && (
                                                <img
                                                    src={p.image_url}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp';
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-white truncate max-w-[180px]">{p.name}</div>
                                            <div className="text-xs text-gray-500">/{p.slug}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSetSectionTag(p, 'Standard')}
                                        className="text-xs text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-950/60"
                                        title="Remove from Trending"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* MODAL: ADD PRODUCT PICKER */}
            {isAddPickerOpen && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-[#111827] border border-gray-800 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    Select Product to Add
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Target section: <span className="font-semibold text-emerald-400 uppercase">{activeTab.replace('_', ' ')}</span>
                                </p>
                            </div>
                            <button onClick={() => setIsAddPickerOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search in modal */}
                        <div className="p-4 border-b border-gray-800 bg-[#030712]">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search by product name..."
                                    value={searchAdd}
                                    onChange={e => setSearchAdd(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60 p-2">
                            {candidateProducts.slice(0, 30).map(p => (
                                <div key={p.id} className="p-3 flex items-center justify-between gap-3 hover:bg-gray-800/40 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 overflow-hidden flex-shrink-0">
                                            {p.image_url && (
                                                <img
                                                    src={p.image_url}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp';
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-white truncate max-w-xs">{p.name}</div>
                                            <div className="text-xs text-gray-500 font-mono">/{p.slug}</div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={actionLoading}
                                        onClick={() => {
                                            if (activeTab === 'featured') {
                                                handleAddToFeatured(p);
                                            } else if (activeTab === 'new_arrivals') {
                                                handleSetSectionTag(p, 'New Arrival');
                                            } else if (activeTab === 'best_sellers') {
                                                handleSetSectionTag(p, 'Best Seller');
                                            } else if (activeTab === 'trending') {
                                                handleSetSectionTag(p, 'Trending');
                                            }
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                                    >
                                        Select & Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
