'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
    Search,
    Edit2,
    X,
    AlertCircle,
    Check,
    RefreshCw
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
    price?: number | null;
    original_price?: number | null;
    stock: number;
    is_visible: boolean;
    is_featured: boolean;
    sort_order: number;
    updated_at: string;
}

const ALL_TAGS = ['Standard', 'New Arrival', 'Best Seller', 'Trending', 'Featured', 'Sale', 'Limited Edition'];

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">{children}</div>
            </div>
            <div className="fixed inset-0 -z-10" onClick={onClose} />
        </div>
    );
}

export default function StaffProductsPage() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [permissions, setPermissions] = useState<StaffPermissions | null>(null);
    const [loading, setLoading] = useState(true);

    // Filters matching Admin
    const [search, setSearch] = useState('');
    const [filterTag, setFilterTag] = useState('All');
    const [filterVisible, setFilterVisible] = useState('All');

    // Inline price editing
    const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
    const [inlinePriceVal, setInlinePriceVal] = useState<string>('');
    const [inlineOriginalPriceVal, setInlineOriginalPriceVal] = useState<string>('');

    // Modal edit state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formPrice, setFormPrice] = useState<string>('');
    const [formOriginalPrice, setFormOriginalPrice] = useState<string>('');
    const [formStock, setFormStock] = useState<number>(10);
    const [formIsVisible, setFormIsVisible] = useState(true);
    const [formIsFeatured, setFormIsFeatured] = useState(false);
    const [formTag, setFormTag] = useState('Standard');

    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3500);
    };

    // Load products
    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const authRes = await fetch('/api/staff/auth');
            if (authRes.ok) {
                const authData = await authRes.json();
                setPermissions(authData.staff?.permissions || null);
            }

            const res = await fetch('/api/staff/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
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

    // Quick toggle visibility
    const toggleVisibility = async (p: ProductItem) => {
        const newVisible = !p.is_visible;
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
                showSuccess(`"${p.name}" is now ${newVisible ? 'Visible' : 'Hidden'}.`);
            } else {
                const data = await res.json();
                setErrorMessage(data.error || 'Failed to update visibility');
                loadProducts();
            }
        } catch {
            loadProducts();
        }
    };

    // Quick toggle stock
    const toggleStock = async (p: ProductItem) => {
        const newStock = p.stock > 0 ? 0 : 10;
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
                showSuccess(`"${p.name}" marked ${newStock > 0 ? 'In Stock' : 'Out of Stock'}.`);
            } else {
                loadProducts();
            }
        } catch {
            loadProducts();
        }
    };

    // Inline price save
    const handleSaveInlinePrice = async (p: ProductItem) => {
        const numPrice = inlinePriceVal ? Number(inlinePriceVal) : null;
        const numOrig = inlineOriginalPriceVal ? Number(inlineOriginalPriceVal) : (numPrice ? Math.round(numPrice * 1.15) : null);

        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, price: numPrice, original_price: numOrig } : item));
        setInlineEditingId(null);

        try {
            const res = await fetch('/api/staff/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    price: numPrice,
                    original_price: numOrig,
                }),
            });
            if (res.ok) {
                showSuccess(numPrice ? `Price for "${p.name}" set to ₹${numPrice} — live on site!` : `Price removed for "${p.name}"`);
            } else {
                const data = await res.json();
                setErrorMessage(data.error || 'Failed to update price');
                loadProducts();
            }
        } catch {
            loadProducts();
        }
    };

    // Open edit modal
    const openEdit = (p: ProductItem) => {
        setEditingProduct(p);
        setFormName(p.name);
        setFormDescription(p.description || '');
        setFormPrice(p.price ? String(p.price) : '');
        setFormOriginalPrice(p.original_price ? String(p.original_price) : '');
        setFormStock(p.stock ?? 10);
        setFormIsVisible(Boolean(p.is_visible));
        setFormIsFeatured(Boolean(p.is_featured));
        setFormTag(p.tag || 'Standard');
        setErrorMessage(null);
        setModalOpen(true);
    };

    // Save full edits
    const handleSaveModal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        setSaving(true);
        setErrorMessage(null);

        try {
            const payload: any = {
                productId: editingProduct.id,
                slug: editingProduct.slug,
                name: formName,
                description: formDescription,
                price: formPrice ? Number(formPrice) : null,
                original_price: formOriginalPrice ? Number(formOriginalPrice) : null,
                stock: Number(formStock),
                is_visible: formIsVisible,
                is_featured: formIsFeatured,
                tag: formTag,
            };

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

            showSuccess(`Product "${formName}" updated successfully!`);
            setModalOpen(false);
            setEditingProduct(null);
            loadProducts();
        } catch (err: any) {
            setErrorMessage(err.message || 'Network error');
        } finally {
            setSaving(false);
        }
    };

    // Filtered products
    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchSearch =
                !search ||
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.slug.toLowerCase().includes(search.toLowerCase()) ||
                (p.collection_name && p.collection_name.toLowerCase().includes(search.toLowerCase()));

            const matchTag = filterTag === 'All' || p.tag === filterTag;
            const matchVisible = filterVisible === 'All' || (filterVisible === 'Visible' ? p.is_visible : !p.is_visible);

            return matchSearch && matchTag && matchVisible;
        });
    }, [products, search, filterTag, filterVisible]);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Products</h1>
                    <p className="text-gray-400 text-sm mt-0.5">{products.length} total products</p>
                </div>
                <button
                    onClick={loadProducts}
                    className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Alerts */}
            {successMessage && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                    <Check size={16} /> {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                    <AlertCircle size={16} /> {errorMessage}
                </div>
            )}

            {/* Filters matching Admin */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="relative flex-1 min-w-48">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-gray-600"
                    />
                </div>
                <select
                    value={filterTag}
                    onChange={e => setFilterTag(e.target.value)}
                    className="bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors cursor-pointer"
                >
                    <option value="All">All Tags</option>
                    {ALL_TAGS.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <select
                    value={filterVisible}
                    onChange={e => setFilterVisible(e.target.value)}
                    className="bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors cursor-pointer"
                >
                    <option value="All">All Visibility</option>
                    <option value="Visible">Visible</option>
                    <option value="Hidden">Hidden</option>
                </select>
            </div>

            {/* Table matching Admin structure */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider font-medium">
                                <th className="text-left px-5 py-4">Product</th>
                                <th className="text-left px-5 py-4">Collection</th>
                                <th className="text-left px-5 py-4">Tag</th>
                                <th className="text-left px-5 py-4">Price</th>
                                <th className="text-left px-5 py-4">Stock</th>
                                <th className="text-left px-5 py-4">Visible</th>
                                <th className="text-right px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-b border-gray-800/50">
                                        <td colSpan={7} className="px-5 py-4">
                                            <div className="h-5 bg-gray-800/60 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-gray-500 py-12">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(product => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                                    >
                                        {/* Product */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.image_url ? (
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                                        <Image
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="40px"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-600 text-[10px] flex-shrink-0">
                                                        No img
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-medium">{product.name}</p>
                                                    <p className="text-gray-500 text-xs truncate max-w-48">/{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Collection */}
                                        <td className="px-5 py-4 text-gray-400">
                                            {product.collection_name || 'General'}
                                        </td>

                                        {/* Tag */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                                                    product.tag === 'Best Seller'
                                                        ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                                        : product.tag === 'New Arrival'
                                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                        : product.tag === 'Trending'
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        : product.tag === 'Featured'
                                                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                        : product.tag === 'Sale'
                                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                        : product.tag === 'Limited Edition'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-gray-800 text-gray-400'
                                                }`}
                                            >
                                                {product.tag || 'Standard'}
                                            </span>
                                        </td>

                                        {/* Price — click to edit inline */}
                                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                                            {inlineEditingId === product.id ? (
                                                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                                    <input
                                                        type="number"
                                                        autoFocus
                                                        placeholder="Price ₹"
                                                        value={inlinePriceVal}
                                                        onChange={e => setInlinePriceVal(e.target.value)}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter') handleSaveInlinePrice(product);
                                                            if (e.key === 'Escape') setInlineEditingId(null);
                                                        }}
                                                        className="w-24 bg-gray-800 border border-zinc-400 text-white rounded-lg px-2 py-1 text-xs focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={() => handleSaveInlinePrice(product)}
                                                        className="px-2 py-1 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                        title="Save price"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={() => setInlineEditingId(null)}
                                                        className="px-1.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors cursor-pointer"
                                                        title="Cancel"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setInlineEditingId(product.id);
                                                        setInlinePriceVal(product.price ? String(product.price) : '');
                                                        setInlineOriginalPriceVal(product.original_price ? String(product.original_price) : '');
                                                    }}
                                                    className="text-left group/price hover:bg-gray-800/60 rounded-lg px-2 py-1 transition-colors cursor-pointer"
                                                    title="Click to edit price"
                                                >
                                                    {product.price ? (
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="font-bold text-white text-sm">₹{product.price}</span>
                                                            {product.original_price && product.original_price > product.price && (
                                                                <span className="text-xs text-gray-500 line-through">₹{product.original_price}</span>
                                                            )}
                                                            <span className="text-[10px] text-zinc-400 opacity-0 group-hover/price:opacity-100 transition-opacity ml-1">Edit</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-emerald-400 hover:underline font-medium">
                                                            + Set price
                                                        </span>
                                                    )}
                                                </button>
                                            )}
                                        </td>

                                        {/* Stock */}
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => toggleStock(product)}
                                                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                                                    product.stock > 0
                                                        ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                                                        : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                                                }`}
                                                title="Click to toggle In / Out of stock"
                                            >
                                                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                                            </button>
                                        </td>

                                        {/* Visible — clean toggle switch matching Admin */}
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => toggleVisibility(product)}
                                                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                                                    product.is_visible ? 'bg-green-500' : 'bg-gray-700'
                                                }`}
                                                title={product.is_visible ? 'Visible — click to hide' : 'Hidden — click to publish'}
                                            >
                                                <span
                                                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                                                        product.is_visible ? 'left-[22px]' : 'left-0.5'
                                                    }`}
                                                />
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => openEdit(product)}
                                                className="text-gray-500 hover:text-zinc-100 transition-colors p-1.5 hover:bg-zinc-200/10 rounded-lg cursor-pointer"
                                                title="Edit product"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Product Modal matching Admin Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-white text-lg font-bold">Edit Product</h2>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">/{editingProduct?.slug}</p>
                    </div>
                    <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white p-1 cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                        <AlertCircle size={14} /> {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSaveModal} className="space-y-4">
                    {/* Price Section */}
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-800 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-white block">
                            Product Pricing (₹) — Live Sync
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-gray-400 text-xs block mb-1">Selling Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1499"
                                    value={formPrice}
                                    onChange={e => setFormPrice(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-xs block mb-1">Original Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 1799"
                                    value={formOriginalPrice}
                                    onChange={e => setFormOriginalPrice(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">
                            Product Title
                        </label>
                        <input
                            type="text"
                            required
                            value={formName}
                            onChange={e => setFormName(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            value={formDescription}
                            onChange={e => setFormDescription(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors resize-none"
                        />
                    </div>

                    {/* Tag & Stock Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">
                                Tag / Badge
                            </label>
                            <select
                                value={formTag}
                                onChange={e => setFormTag(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-zinc-400 cursor-pointer"
                            >
                                {ALL_TAGS.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-gray-400 text-xs uppercase tracking-wider font-medium block mb-1.5">
                                Stock Count
                            </label>
                            <input
                                type="number"
                                value={formStock}
                                onChange={e => setFormStock(Number(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-zinc-400"
                            />
                        </div>
                    </div>

                    {/* Visibility & Homepage Featured Toggles */}
                    <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-800 flex items-center justify-between">
                        <div>
                            <p className="text-white text-xs font-semibold">Live on Website</p>
                            <p className="text-gray-500 text-[11px]">Make this product visible to visitors</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormIsVisible(!formIsVisible)}
                            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                                formIsVisible ? 'bg-green-500' : 'bg-gray-700'
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                                    formIsVisible ? 'left-[22px]' : 'left-0.5'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-800 flex items-center justify-between">
                        <div>
                            <p className="text-white text-xs font-semibold">Feature on Homepage</p>
                            <p className="text-gray-500 text-[11px]">Display in Homepage Featured Collection</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormIsFeatured(!formIsFeatured)}
                            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                                formIsFeatured ? 'bg-purple-600' : 'bg-gray-700'
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                                    formIsFeatured ? 'left-[22px]' : 'left-0.5'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-zinc-100 hover:bg-white text-zinc-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-60"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
