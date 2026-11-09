'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
    Package, Search, Filter, Edit2, Eye, EyeOff, Check, X,
    AlertCircle, CheckCircle2, UploadCloud, Loader2, Sparkles,
    Lock, Star, DollarSign, Layers, Tag, RefreshCw
} from 'lucide-react';
import { StaffPermissions } from '@/lib/staff-auth';

interface ProductItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    collection_name: string;
    collection_slug: string;
    tag: string;
    image_url: string;
    images: string[];
    price?: number | null;
    original_price?: number | null;
    stock: number;
    is_visible: boolean;
    is_featured: boolean;
    sort_order: number;
    updated_at: string;
}

interface CollectionItem {
    id: string;
    name: string;
    slug: string;
}

const TAG_COLORS: Record<string, string> = {
    'Best Seller': 'bg-purple-950 text-purple-300 border-purple-800',
    'New Arrival': 'bg-blue-950 text-blue-300 border-blue-800',
    'Trending': 'bg-amber-950 text-amber-300 border-amber-800',
    'Featured': 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-800',
    'Sale': 'bg-rose-950 text-rose-300 border-rose-800',
    'Limited Edition': 'bg-emerald-950 text-emerald-300 border-emerald-800',
    'Standard': 'bg-gray-800 text-gray-400 border-gray-700',
};

const ALL_TAGS = ['Standard', 'New Arrival', 'Best Seller', 'Trending', 'Featured', 'Sale', 'Limited Edition'];

function StaffProductsContent() {
    const searchParams = useSearchParams();
    const editParamId = searchParams.get('edit');

    const [products, setProducts] = useState<ProductItem[]>([]);
    const [collections, setCollections] = useState<CollectionItem[]>([]);
    const [permissions, setPermissions] = useState<StaffPermissions | null>(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCollection, setSelectedCollection] = useState('all');
    const [selectedTag, setSelectedTag] = useState('all');
    const [selectedStock, setSelectedStock] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
    const [selectedVisibility, setSelectedVisibility] = useState<'all' | 'visible' | 'hidden'>('all');

    // Edit modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

    // Form inputs
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formPrice, setFormPrice] = useState<string>('');
    const [formOriginalPrice, setFormOriginalPrice] = useState<string>('');
    const [formStock, setFormStock] = useState<number>(10);
    const [formIsVisible, setFormIsVisible] = useState(true);
    const [formIsFeatured, setFormIsFeatured] = useState(false);
    const [formTag, setFormTag] = useState('Standard');
    const [formImageUrl, setFormImageUrl] = useState('');
    const [formCollectionSlug, setFormCollectionSlug] = useState('general');

    // Inline price quick-edit state
    const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
    const [inlinePriceVal, setInlinePriceVal] = useState<string>('');
    const [inlineOriginalPriceVal, setInlineOriginalPriceVal] = useState<string>('');

    const [uploadingImage, setUploadingImage] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Load data
    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            // Get session permissions
            const authRes = await fetch('/api/staff/auth');
            if (authRes.ok) {
                const authData = await authRes.json();
                setPermissions(authData.staff?.permissions || null);
            }

            // Get products
            const res = await fetch('/api/staff/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
                setCollections(data.collections || []);
            }
        } catch (err) {
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Handle deep link edit parameter (e.g. from dashboard)
    useEffect(() => {
        if (editParamId && products.length > 0) {
            const found = products.find(p => p.id === editParamId || p.slug === editParamId);
            if (found) {
                openEditModal(found);
            }
        }
    }, [editParamId, products]);

    const openEditModal = (p: ProductItem) => {
        setEditingProduct(p);
        setFormName(p.name);
        setFormDescription(p.description || '');
        setFormPrice(p.price ? String(p.price) : '');
        setFormOriginalPrice(p.original_price ? String(p.original_price) : '');
        setFormStock(p.stock ?? 10);
        setFormIsVisible(Boolean(p.is_visible));
        setFormIsFeatured(Boolean(p.is_featured));
        setFormTag(p.tag || 'Standard');
        setFormImageUrl(p.image_url || '');
        setFormCollectionSlug(p.collection_slug || 'general');
        setErrorMessage(null);
        setModalOpen(true);
    };

    // Quick inline visibility toggle
    const handleQuickToggleVisibility = async (p: ProductItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!permissions?.canEditVisibility) {
            showToast('Permission denied: You cannot edit visibility.');
            return;
        }

        const newVisible = !p.is_visible;
        // Optimistic update
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_visible: newVisible } : item));

        try {
            const res = await fetch('/api/staff/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    is_visible: newVisible,
                }),
            });
            if (res.ok) {
                showToast(`"${p.name}" is now ${newVisible ? 'Live' : 'Hidden'}.`);
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to update visibility');
                loadProducts();
            }
        } catch {
            loadProducts();
        }
    };

    // Quick inline stock toggle
    const handleQuickToggleStock = async (p: ProductItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!permissions?.canEditStock) {
            showToast('Permission denied: You cannot edit stock.');
            return;
        }

        const newStock = p.stock > 0 ? 0 : 10;
        // Optimistic update
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, stock: newStock } : item));

        try {
            const res = await fetch('/api/staff/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    stock: newStock,
                }),
            });
            if (res.ok) {
                showToast(`"${p.name}" marked ${newStock > 0 ? 'In Stock (10)' : 'Out of Stock'}.`);
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to update stock');
                loadProducts();
            }
        } catch {
            loadProducts();
        }
    };

    // Quick inline featured toggle
    const handleQuickToggleFeatured = async (p: ProductItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!permissions?.canManageHomepage) {
            showToast('Permission denied: You cannot manage homepage sections.');
            return;
        }

        const newFeatured = !p.is_featured;
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_featured: newFeatured } : item));

        try {
            const res = await fetch('/api/staff/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    is_featured: newFeatured,
                }),
            });
            if (res.ok) {
                showToast(`"${p.name}" ${newFeatured ? 'featured on' : 'removed from'} homepage.`);
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to update featured status');
                loadProducts();
            }
        } catch {
            loadProducts();
        }
    };

    // Inline price quick-save (no permission check)
    const handleSaveInlinePrice = async (p: ProductItem) => {
        if (!inlinePriceVal) { setInlineEditingId(null); return; }
        const numPrice = Number(inlinePriceVal);
        const numOrig = inlineOriginalPriceVal ? Number(inlineOriginalPriceVal) : Math.round(numPrice * 1.15);
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, price: numPrice, original_price: numOrig } : item));
        setInlineEditingId(null);
        try {
            const res = await fetch('/api/staff/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: p.id, slug: p.slug, name: p.name, price: numPrice, original_price: numOrig }),
            });
            if (res.ok) showToast(`Price for "${p.name}" updated to ₹${numPrice} — live on website!`);
            else { const data = await res.json(); showToast(data.error || 'Failed to update price'); loadProducts(); }
        } catch { loadProducts(); }
    };

    // Handle Image Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!permissions?.canEditImages) {
            setErrorMessage('Permission denied: You cannot upload images.');
            return;
        }

        setUploadingImage(true);
        setErrorMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (editingProduct?.slug) {
                formData.append('productSlug', editingProduct.slug);
            }

            const res = await fetch('/api/staff/upload-image', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (res.ok && data.url) {
                setFormImageUrl(data.url);
                showToast('Image uploaded successfully!');
            } else {
                setErrorMessage(data.error || 'Image upload failed');
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Image upload network error');
        } finally {
            setUploadingImage(false);
        }
    };

    // Save full product edits
    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        setSaving(true);
        setErrorMessage(null);

        try {
            const selectedCol = collections.find(c => c.slug === formCollectionSlug);
            const payload: any = {
                productId: editingProduct.id,
                slug: editingProduct.slug,
            };

            if (permissions?.canEditDetails) {
                payload.name = formName;
                payload.description = formDescription;
            }

            // Price is always editable for authenticated staff
            payload.price = formPrice ? Number(formPrice) : null;
            payload.original_price = formOriginalPrice ? Number(formOriginalPrice) : null;


            if (permissions?.canEditStock) {
                payload.stock = Number(formStock);
            }

            if (permissions?.canEditVisibility) {
                payload.is_visible = formIsVisible;
            }

            if (permissions?.canManageHomepage) {
                payload.is_featured = formIsFeatured;
                payload.tag = formTag;
            }

            if (permissions?.canManageCategories) {
                payload.collection_slug = formCollectionSlug;
                payload.collection_name = selectedCol?.name || formCollectionSlug;
            }

            if (permissions?.canEditImages && formImageUrl) {
                payload.image_url = formImageUrl;
                payload.images = [formImageUrl];
            }

            const res = await fetch('/api/staff/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                setErrorMessage(data.error || 'Failed to save product');
                setSaving(false);
                return;
            }

            showToast(`Product "${formName}" saved successfully!`);
            setModalOpen(false);
            setEditingProduct(null);
            loadProducts();
        } catch (err: any) {
            setErrorMessage(err.message || 'Network error');
        } finally {
            setSaving(false);
        }
    };

    // Filtered list
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            // Text search
            const q = searchTerm.toLowerCase();
            const matchesSearch =
                !q ||
                p.name.toLowerCase().includes(q) ||
                p.slug.toLowerCase().includes(q) ||
                (p.collection_name && p.collection_name.toLowerCase().includes(q)) ||
                (p.tag && p.tag.toLowerCase().includes(q));

            if (!matchesSearch) return false;

            // Category filter
            if (selectedCollection !== 'all') {
                if (p.collection_slug !== selectedCollection) return false;
            }

            // Tag filter
            if (selectedTag !== 'all') {
                if (p.tag !== selectedTag) return false;
            }

            // Stock filter
            if (selectedStock === 'in_stock' && p.stock <= 0) return false;
            if (selectedStock === 'out_of_stock' && p.stock > 0) return false;

            // Visibility filter
            if (selectedVisibility === 'visible' && !p.is_visible) return false;
            if (selectedVisibility === 'hidden' && p.is_visible) return false;

            return true;
        });
    }, [products, searchTerm, selectedCollection, selectedTag, selectedStock, selectedVisibility]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <Package className="w-6 h-6 text-emerald-400" />
                        Staff Product Management
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        View all {products.length} products, update pricing, assign badges, manage stock, and toggle visibility.
                    </p>
                </div>

                <button
                    onClick={loadProducts}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold self-start sm:self-auto transition-colors border border-gray-700"
                >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    Refresh Catalog
                </button>
            </div>

            {/* Toast feedback */}
            {toastMessage && (
                <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Filter Toolbar */}
            <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Search */}
                    <div className="md:col-span-4 relative">
                        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by product name or slug..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0d1117] border border-gray-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="md:col-span-3">
                        <select
                            value={selectedCollection}
                            onChange={e => setSelectedCollection(e.target.value)}
                            className="w-full bg-[#0d1117] border border-gray-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                        >
                            <option value="all">All Categories</option>
                            {collections.map(c => (
                                <option key={c.id} value={c.slug}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tag Filter */}
                    <div className="md:col-span-2">
                        <select
                            value={selectedTag}
                            onChange={e => setSelectedTag(e.target.value)}
                            className="w-full bg-[#0d1117] border border-gray-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                        >
                            <option value="all">All Labels / Tags</option>
                            {ALL_TAGS.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Stock Status */}
                    <div className="md:col-span-3 flex gap-2">
                        <select
                            value={selectedStock}
                            onChange={e => setSelectedStock(e.target.value as any)}
                            className="flex-1 bg-[#0d1117] border border-gray-700 focus:border-emerald-500 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                        >
                            <option value="all">All Stock</option>
                            <option value="in_stock">In Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>

                        <select
                            value={selectedVisibility}
                            onChange={e => setSelectedVisibility(e.target.value as any)}
                            className="flex-1 bg-[#0d1117] border border-gray-700 focus:border-emerald-500 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="visible">Published (Live)</option>
                            <option value="hidden">Hidden</option>
                        </select>
                    </div>
                </div>

                {/* Filter pills summary */}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                    <div>
                        Showing <span className="font-bold text-white">{filteredProducts.length}</span> of {products.length} products
                    </div>
                    {(searchTerm || selectedCollection !== 'all' || selectedTag !== 'all' || selectedStock !== 'all' || selectedVisibility !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCollection('all');
                                setSelectedTag('all');
                                setSelectedStock('all');
                                setSelectedVisibility('all');
                            }}
                            className="text-emerald-400 hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="py-20 text-center text-gray-400 space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                    <p className="text-sm">Loading product catalog...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-12 text-center text-gray-400 space-y-2">
                    <Package className="w-12 h-12 mx-auto text-gray-600 mb-2" />
                    <p className="text-base font-bold text-white">No products found</p>
                    <p className="text-xs text-gray-500">Try adjusting your search keywords or filter selections.</p>
                </div>
            ) : (
                <div className="bg-[#161b22] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-[#0d1117] text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                                <tr>
                                    <th className="px-5 py-4">Product</th>
                                    <th className="px-4 py-4">Category</th>
                                    <th className="px-4 py-4">Badge / Tag</th>
                                    <th className="px-4 py-4">Price</th>
                                    <th className="px-4 py-4">Stock</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Featured</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60 font-normal">
                                {filteredProducts.map(p => {
                                    const tagColor = TAG_COLORS[p.tag] || TAG_COLORS['Standard'];
                                    return (
                                        <tr
                                            key={p.id}
                                            onClick={() => openEditModal(p)}
                                            className="hover:bg-gray-800/40 transition-colors cursor-pointer group"
                                        >
                                            {/* Product info with thumbnail */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden flex-shrink-0">
                                                        {p.image_url ? (
                                                            <Image
                                                                src={p.image_url}
                                                                alt={p.name}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform"
                                                                sizes="48px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">No img</div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-white truncate max-w-xs sm:max-w-sm group-hover:text-emerald-400 transition-colors">
                                                            {p.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-mono truncate max-w-xs">
                                                            /{p.slug}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-3.5 text-xs text-gray-400">
                                                <span className="px-2 py-1 rounded-lg bg-gray-900 border border-gray-800">
                                                    {p.collection_name || 'General'}
                                                </span>
                                            </td>

                                            {/* Label Tag */}
                                            <td className="px-4 py-3.5">
                                                {p.tag && p.tag !== 'Standard' ? (
                                                    <span className={`inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tagColor}`}>
                                                        {p.tag}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-600 font-mono">—</span>
                                                )}
                                            </td>

                                            {/* Price — click to edit inline */}
                                            <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                                                {inlineEditingId === p.id ? (
                                                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                                        <input
                                                            type="number"
                                                            autoFocus
                                                            placeholder="Price ₹"
                                                            value={inlinePriceVal}
                                                            onChange={e => setInlinePriceVal(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter') handleSaveInlinePrice(p); if (e.key === 'Escape') setInlineEditingId(null); }}
                                                            className="w-24 bg-gray-900 border border-emerald-500 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                                                        />
                                                        <button onClick={() => handleSaveInlinePrice(p)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-colors">✓</button>
                                                        <button onClick={() => setInlineEditingId(null)} className="px-1.5 py-1 bg-gray-700 text-gray-300 rounded-lg text-[11px] transition-colors">✕</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setInlineEditingId(p.id); setInlinePriceVal(p.price ? String(p.price) : ''); setInlineOriginalPriceVal(p.original_price ? String(p.original_price) : ''); }}
                                                        className="text-left group/price hover:bg-gray-800 rounded-lg px-1.5 py-1 transition-colors w-full"
                                                        title="Click to set price instantly"
                                                    >
                                                        {p.price ? (
                                                            <div>
                                                                <span className="font-bold text-white text-sm">₹{p.price}</span>
                                                                {p.original_price && p.original_price > p.price && (
                                                                    <span className="text-xs text-gray-500 line-through ml-1.5">₹{p.original_price}</span>
                                                                )}
                                                                <span className="ml-1.5 text-[10px] text-emerald-400 opacity-0 group-hover/price:opacity-100 transition-opacity">Edit</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic group-hover/price:text-emerald-400 transition-colors">+ Set price</span>
                                                        )}
                                                    </button>
                                                )}
                                            </td>

                                            {/* Stock with quick toggle */}
                                            <td className="px-4 py-3.5">
                                                <button
                                                    onClick={(e) => handleQuickToggleStock(p, e)}
                                                    title={permissions?.canEditStock ? 'Click to toggle in/out of stock' : 'Stock locked'}
                                                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                                                        p.stock > 0
                                                            ? 'bg-teal-950/60 text-teal-300 border-teal-800 hover:bg-teal-900/60'
                                                            : 'bg-red-950/60 text-red-300 border-red-800 hover:bg-red-900/60'
                                                    }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-teal-400' : 'bg-red-400'}`} />
                                                    {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                                                </button>
                                            </td>

                                            {/* Visibility with quick toggle */}
                                            <td className="px-4 py-3.5">
                                                <button
                                                    onClick={(e) => handleQuickToggleVisibility(p, e)}
                                                    title={permissions?.canEditVisibility ? 'Click to toggle Published/Hidden' : 'Visibility locked'}
                                                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                                                        p.is_visible
                                                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                                                            : 'bg-amber-950/60 text-amber-300 border-amber-800 hover:bg-amber-900/60'
                                                    }`}
                                                >
                                                    {p.is_visible ? (
                                                        <>
                                                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                                            <span>Live</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                                                            <span>Hidden</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>

                                            {/* Homepage Featured Quick Toggle */}
                                            <td className="px-4 py-3.5">
                                                <button
                                                    onClick={(e) => handleQuickToggleFeatured(p, e)}
                                                    title={permissions?.canManageHomepage ? 'Click to feature on homepage' : 'Homepage management locked'}
                                                    className={`p-1.5 rounded-lg border transition-colors ${
                                                        p.is_featured
                                                            ? 'bg-purple-950/80 text-purple-300 border-purple-700'
                                                            : 'bg-gray-800/60 text-gray-500 border-gray-700 hover:text-white'
                                                    }`}
                                                >
                                                    <Star className={`w-4 h-4 ${p.is_featured ? 'fill-purple-400 text-purple-400' : ''}`} />
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-3.5 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditModal(p);
                                                    }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-emerald-600 hover:text-white text-gray-300 rounded-xl text-xs font-semibold transition-all"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* FULL EDIT PRODUCT MODAL */}
            {modalOpen && editingProduct && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-[#161b22] border border-gray-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-5">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Package className="w-5 h-5 text-emerald-400" />
                                    Edit Product
                                </h2>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">
                                    /{editingProduct.slug}
                                </p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-white p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSaveProduct} className="space-y-4">
                            {/* Product Name */}
                            <div>
                                <label className="text-xs text-gray-400 font-medium flex items-center justify-between mb-1">
                                    <span>Product Title</span>
                                    {!permissions?.canEditDetails && (
                                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> Details locked
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="text"
                                    required
                                    disabled={!permissions?.canEditDetails}
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    className="w-full bg-[#0d1117] border border-gray-700 disabled:bg-gray-800/40 disabled:text-gray-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs text-gray-400 font-medium flex items-center justify-between mb-1">
                                    <span>Description</span>
                                    {!permissions?.canEditDetails && (
                                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> Details locked
                                        </span>
                                    )}
                                </label>
                                <textarea
                                    rows={2}
                                    disabled={!permissions?.canEditDetails}
                                    value={formDescription}
                                    onChange={e => setFormDescription(e.target.value)}
                                    placeholder="Add product description..."
                                    className="w-full bg-[#0d1117] border border-gray-700 disabled:bg-gray-800/40 disabled:text-gray-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* Pricing Section (Permission Gated) */}
                            <div className="p-4 bg-[#0d1117] rounded-2xl border border-gray-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        Product Pricing (₹)
                                    </span>

                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Active Selling Price (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 1499"
                                            value={formPrice}
                                            onChange={e => setFormPrice(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Original / Strikethrough Price (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 1799"
                                            value={formOriginalPrice}
                                            onChange={e => setFormOriginalPrice(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Product Tags & Labels (Requirement 3) */}
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 font-medium flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-purple-400" />
                                        Product Label / Badge
                                    </span>
                                    {!permissions?.canManageHomepage && (
                                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> Tag editing locked
                                        </span>
                                    )}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_TAGS.map(tagOption => {
                                        const isSelected = formTag === tagOption;
                                        return (
                                            <button
                                                key={tagOption}
                                                type="button"
                                                disabled={!permissions?.canManageHomepage}
                                                onClick={() => setFormTag(tagOption)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                                    isSelected
                                                        ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                                                        : 'bg-[#0d1117] text-gray-400 border-gray-700 hover:border-gray-500'
                                                }`}
                                            >
                                                {isSelected && <span className="mr-1">&#10003;</span>}
                                                {tagOption}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Stock, Visibility, Category Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Stock Count */}
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">
                                        Stock Units {permissions?.canEditStock ? '' : '(Locked)'}
                                    </label>
                                    <input
                                        type="number"
                                        disabled={!permissions?.canEditStock}
                                        value={formStock}
                                        onChange={e => setFormStock(Number(e.target.value))}
                                        className="w-full bg-[#0d1117] border border-gray-700 disabled:bg-gray-800/40 disabled:text-gray-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">
                                        Category {permissions?.canManageCategories ? '' : '(Locked)'}
                                    </label>
                                    <select
                                        disabled={!permissions?.canManageCategories}
                                        value={formCollectionSlug}
                                        onChange={e => setFormCollectionSlug(e.target.value)}
                                        className="w-full bg-[#0d1117] border border-gray-700 disabled:bg-gray-800/40 disabled:text-gray-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        {collections.map(c => (
                                            <option key={c.id} value={c.slug}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Visibility Toggle */}
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">
                                        Visibility {permissions?.canEditVisibility ? '' : '(Locked)'}
                                    </label>
                                    <button
                                        type="button"
                                        disabled={!permissions?.canEditVisibility}
                                        onClick={() => setFormIsVisible(!formIsVisible)}
                                        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                                            formIsVisible
                                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                                : 'bg-amber-950/80 text-amber-300 border-amber-700'
                                        }`}
                                    >
                                        {formIsVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        {formIsVisible ? 'Published (Live)' : 'Hidden (Draft)'}
                                    </button>
                                </div>
                            </div>

                            {/* Product Image Section */}
                            <div className="p-4 bg-[#0d1117] rounded-2xl border border-gray-800 space-y-3">
                                <label className="text-xs text-gray-400 font-medium flex items-center justify-between">
                                    <span>Product Image</span>
                                    {!permissions?.canEditImages && (
                                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> Image editing locked
                                        </span>
                                    )}
                                </label>

                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-xl bg-gray-900 border border-gray-700 overflow-hidden flex-shrink-0">
                                        {formImageUrl ? (
                                            <Image
                                                src={formImageUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">No img</div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            disabled={!permissions?.canEditImages}
                                            placeholder="Image URL"
                                            value={formImageUrl}
                                            onChange={e => setFormImageUrl(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 disabled:bg-gray-800/40 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                                        />

                                        {permissions?.canEditImages && (
                                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl cursor-pointer border border-gray-700 transition-colors">
                                                {uploadingImage ? (
                                                    <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                                                        Upload New Image
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={uploadingImage}
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving || uploadingImage}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {saving ? 'Saving...' : 'Save Product Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function StaffProductsPage() {
    return (
        <Suspense fallback={
            <div className="py-20 text-center text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
                Loading products...
            </div>
        }>
            <StaffProductsContent />
        </Suspense>
    );
}
