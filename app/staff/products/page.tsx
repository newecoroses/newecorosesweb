'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import {
    Search,
    Package,
    RefreshCw,
    CheckCircle2,
    X,
    Eye,
    EyeOff,
    Plus,
    Check,
    Edit3,
    RefreshCcw,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Truck,
    Clock,
    ShoppingBag,
    Tag,
    Layers,
    Trash2,
    Save,
    AlertCircle,
    Info,
    Flower2,
    Heart,
    Star,
    Gift,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { resolveProductPricing } from '@/lib/pricing-utils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductVariant {
    label: string;   // e.g. "6 Roses", "8 Roses", "12 Roses"
    price: number;
}

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
    item_count?: number | null;
    pre_order?: boolean;
    same_day_delivery?: boolean;
    variants?: ProductVariant[];
    relationships?: string[];
    celebrations?: string[];
}

const AVAILABLE_TAGS = [
    'Standard',
    'New Arrival',
    'Best Seller',
    'Trending',
    'Featured',
    'Sale',
    'Limited Edition',
];

const RELATIONSHIP_OPTIONS = ['Her', 'Him', 'Friends', 'Family', 'Corporate', 'Kids', 'Couple'];
const CELEBRATION_OPTIONS = [
    'Birthday', 'Anniversary', 'Wedding', 'Valentine\'s Day', 'Mother\'s Day',
    'Father\'s Day', 'Congratulations', 'Get Well Soon', 'Thank You',
    'Graduation', 'Festival', 'Housewarming', 'Baby Shower',
];

// ─── Smart Item Count Label ───────────────────────────────────────────────────

function getItemCountLabel(name: string, collectionSlug: string): string | null {
    const n = name.toLowerCase();
    const c = (collectionSlug || '').toLowerCase();

    // Only bouquets get a count
    const isBouquet =
        n.includes('bouquet') ||
        c.includes('bouquet') ||
        c === 'fresh-flower' ||
        c === 'chocolate-bouquet' ||
        c === 'teddy-and-bouquet';

    if (!isBouquet) return null;

    if (n.includes('kinder') || n.includes('kinderjoy')) return 'No. of Kinder Joys';
    if (n.includes('teddy') || c === 'teddy-and-bouquet') return 'Teddy Count';
    if (n.includes('chocolate') || c === 'chocolate-bouquet') return 'No. of Chocolates';
    if (n.includes('rose')) return 'Rose Count';
    // multi-flower or general bouquet
    return 'No. of Flowers';
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function BestPicksIcon({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2L14.09 8.26L20.5 8.72L15.9 12.65L17.45 19L12 15.75L6.55 19L8.1 12.65L3.5 8.72L9.91 8.26L12 2Z"
                fill="currentColor"
                opacity="0.9"
            />
        </svg>
    );
}

// ─── Product Edit Modal ───────────────────────────────────────────────────────

interface EditModalProps {
    product: ProductItem;
    collections: { name: string; slug: string }[];
    onSave: (updated: Partial<ProductItem>) => void;
    onClose: () => void;
    saving: boolean;
}

function ProductEditModal({ product, collections, onSave, onClose, saving }: EditModalProps) {
    // Local form state — all fields
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description || '');
    const [price, setPrice] = useState(String(product.price || ''));
    const [originalPrice, setOriginalPrice] = useState(String(product.original_price || ''));
    const [stock, setStock] = useState(String(product.stock ?? 0));
    const [tag, setTag] = useState(product.tag || 'Standard');
    const [collectionName, setCollectionName] = useState(product.collection_name || '');
    const [collectionSlug, setCollectionSlug] = useState(product.collection_slug || '');
    const [isVisible, setIsVisible] = useState(product.is_visible);
    const [isFeatured, setIsFeatured] = useState(product.is_featured);
    const [sortOrder, setSortOrder] = useState(String(product.sort_order ?? 0));
    const [itemCount, setItemCount] = useState(String(product.item_count ?? ''));
    const [preOrder, setPreOrder] = useState(product.pre_order ?? false);
    const [sameDayDelivery, setSameDayDelivery] = useState(product.same_day_delivery ?? true);
    const [variants, setVariants] = useState<ProductVariant[]>(product.variants || []);
    const [selectedRelationships, setSelectedRelationships] = useState<string[]>(product.relationships || []);
    const [selectedCelebrations, setSelectedCelebrations] = useState<string[]>(product.celebrations || []);

    // Variant helpers
    const addVariant = () => setVariants(v => [...v, { label: '', price: 0 }]);
    const removeVariant = (i: number) => setVariants(v => v.filter((_, idx) => idx !== i));
    const updateVariant = (i: number, field: keyof ProductVariant, val: string) => {
        setVariants(v => v.map((item, idx) =>
            idx === i ? { ...item, [field]: field === 'price' ? Number(val) : val } : item
        ));
    };

    // Auto-populate collection slug when name is chosen from dropdown
    const handleCollectionChange = (name: string) => {
        setCollectionName(name);
        const col = collections.find(c => c.name === name);
        if (col) setCollectionSlug(col.slug);
    };

    const toggleRelationship = (r: string) => {
        setSelectedRelationships(prev =>
            prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
        );
    };

    const toggleCelebration = (c: string) => {
        setSelectedCelebrations(prev =>
            prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
        );
    };

    const countLabel = getItemCountLabel(name, collectionSlug);

    const handleSubmit = () => {
        const updates: Partial<ProductItem> = {
            name: name.trim(),
            description: description.trim(),
            price: price ? Number(price) : null,
            original_price: originalPrice ? Number(originalPrice) : null,
            stock: Number(stock),
            tag,
            collection_name: collectionName,
            collection_slug: collectionSlug,
            is_visible: isVisible,
            is_featured: isFeatured,
            sort_order: Number(sortOrder),
            pre_order: preOrder,
            same_day_delivery: sameDayDelivery,
            variants: variants.filter(v => v.label.trim()),
            relationships: selectedRelationships,
            celebrations: selectedCelebrations,
        };
        if (countLabel && itemCount) {
            updates.item_count = Number(itemCount);
        }
        onSave(updates);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-3xl bg-white dark:bg-[#12141c] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/[0.12] rounded-3xl shadow-2xl my-8"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50 rounded-t-3xl">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white border border-zinc-700 dark:border-zinc-200 flex items-center justify-center flex-shrink-0">
                            <Edit3 size={16} className="text-white dark:text-zinc-900" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-bold text-zinc-950 dark:text-white truncate">Edit Product</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{product.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">

                    {/* ── SECTION: Basic Info ── */}
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                            <Package size={12} />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {/* Product Name */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Product Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                                />
                            </div>
                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Description
                                    <span className="ml-2 font-normal text-zinc-400">({description.length} chars)</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Write a beautiful product description..."
                                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* ── SECTION: Pricing ── */}
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                            <Tag size={12} />
                            Pricing
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Sale Price (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-7 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white tabular-nums focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">MRP / Original (₹) <span className="font-normal text-zinc-400">optional</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={originalPrice}
                                        onChange={e => setOriginalPrice(e.target.value)}
                                        placeholder="Auto-computed"
                                        className="w-full pl-7 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white tabular-nums focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Variants — quantity-based pricing */}
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                    Quantity Variants
                                    <span className="ml-2 font-normal text-zinc-400 dark:text-zinc-500">e.g. 6 Roses = ₹999, 12 Roses = ₹1,499</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:opacity-80 transition-opacity cursor-pointer"
                                >
                                    <Plus size={11} />
                                    Add Variant
                                </button>
                            </div>
                            {variants.length === 0 ? (
                                <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">No variants — single price applies</p>
                            ) : (
                                <div className="space-y-2">
                                    {variants.map((v, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={v.label}
                                                onChange={e => updateVariant(i, 'label', e.target.value)}
                                                placeholder="e.g. 6 Roses"
                                                className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400"
                                            />
                                            <div className="relative w-32">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">₹</span>
                                                <input
                                                    type="number"
                                                    value={v.price || ''}
                                                    onChange={e => updateVariant(i, 'price', e.target.value)}
                                                    placeholder="Price"
                                                    className="w-full pl-6 pr-2 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white tabular-nums focus:outline-none focus:border-zinc-400"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(i)}
                                                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ── SECTION: Stock & Item Count ── */}
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                            <Layers size={12} />
                            Inventory
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Stock (Units)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={e => setStock(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white tabular-nums focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                                />
                            </div>
                            {countLabel && (
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">{countLabel}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={itemCount}
                                        onChange={e => setItemCount(e.target.value)}
                                        placeholder="e.g. 12"
                                        className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white tabular-nums focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ── SECTION: Delivery Options ── */}
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                            <Truck size={12} />
                            Delivery Options
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Same-Day Delivery */}
                            <label className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                                sameDayDelivery
                                    ? 'border-zinc-900 dark:border-white bg-zinc-900/5 dark:bg-white/5'
                                    : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40'
                            }`}>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    sameDayDelivery ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-700'
                                }`}>
                                    <Clock size={16} className={sameDayDelivery ? 'text-white dark:text-zinc-900' : 'text-zinc-500'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-zinc-900 dark:text-white">Same-Day Delivery</p>
                                    <p className="text-[10px] text-zinc-500">Available for today</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={sameDayDelivery}
                                    onChange={e => setSameDayDelivery(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-9 h-5 rounded-full flex items-center transition-colors flex-shrink-0 ${
                                    sameDayDelivery ? 'bg-zinc-900 dark:bg-white justify-end' : 'bg-zinc-300 dark:bg-zinc-600 justify-start'
                                } px-0.5`}>
                                    <div className="w-4 h-4 rounded-full bg-white dark:bg-zinc-900" />
                                </div>
                            </label>

                            {/* Pre-Order */}
                            <label className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                                preOrder
                                    ? 'border-zinc-900 dark:border-white bg-zinc-900/5 dark:bg-white/5'
                                    : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40'
                            }`}>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                    preOrder ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-700'
                                }`}>
                                    <ShoppingBag size={16} className={preOrder ? 'text-white dark:text-zinc-900' : 'text-zinc-500'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-zinc-900 dark:text-white">Pre-Order Available</p>
                                    <p className="text-[10px] text-zinc-500">Accept advance orders</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preOrder}
                                    onChange={e => setPreOrder(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-9 h-5 rounded-full flex items-center transition-colors flex-shrink-0 ${
                                    preOrder ? 'bg-zinc-900 dark:bg-white justify-end' : 'bg-zinc-300 dark:bg-zinc-600 justify-start'
                                } px-0.5`}>
                                    <div className="w-4 h-4 rounded-full bg-white dark:bg-zinc-900" />
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* ── SECTION: Catalog Settings ── */}
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                            <Star size={12} />
                            Catalog Settings
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Collection */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Collection</label>
                                <select
                                    value={collectionName}
                                    onChange={e => handleCollectionChange(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                                >
                                    {collections.map(col => (
                                        <option key={col.slug} value={col.name}>{col.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Tag */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Tag / Badge</label>
                                <select
                                    value={tag}
                                    onChange={e => setTag(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                                >
                                    {AVAILABLE_TAGS.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Sort Order */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Sort Order <span className="font-normal text-zinc-400">(lower = first)</span></label>
                                <input
                                    type="number"
                                    value={sortOrder}
                                    onChange={e => setSortOrder(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white tabular-nums focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
                                />
                            </div>
                        </div>

                        {/* Visibility & Featured toggles */}
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <label className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                                isVisible ? 'border-zinc-900 dark:border-white bg-zinc-900/5 dark:bg-white/5' : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40'
                            }`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isVisible ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                    {isVisible ? <Eye size={14} className="text-white dark:text-zinc-900" /> : <EyeOff size={14} className="text-zinc-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-zinc-900 dark:text-white">Live on Website</p>
                                    <p className="text-[10px] text-zinc-500">{isVisible ? 'Visible to customers' : 'Hidden from site'}</p>
                                </div>
                                <input type="checkbox" checked={isVisible} onChange={e => setIsVisible(e.target.checked)} className="sr-only" />
                                <div className={`w-9 h-5 rounded-full flex items-center transition-colors flex-shrink-0 ${isVisible ? 'bg-zinc-900 dark:bg-white justify-end' : 'bg-zinc-300 dark:bg-zinc-600 justify-start'} px-0.5`}>
                                    <div className="w-4 h-4 rounded-full bg-white dark:bg-zinc-900" />
                                </div>
                            </label>
                            <label className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                                isFeatured ? 'border-zinc-900 dark:border-white bg-zinc-900/5 dark:bg-white/5' : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40'
                            }`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isFeatured ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                    <BestPicksIcon size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-zinc-900 dark:text-white">Best Pick</p>
                                    <p className="text-[10px] text-zinc-500">{isFeatured ? 'In Best Picks' : 'Not featured'}</p>
                                </div>
                                <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only" />
                                <div className={`w-9 h-5 rounded-full flex items-center transition-colors flex-shrink-0 ${isFeatured ? 'bg-zinc-900 dark:bg-white justify-end' : 'bg-zinc-300 dark:bg-zinc-600 justify-start'} px-0.5`}>
                                    <div className="w-4 h-4 rounded-full bg-white dark:bg-zinc-900" />
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* ── SECTION: Relationships & Occasions ── */}
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-2">
                            <Heart size={12} />
                            Gifting Context
                        </h3>
                        {/* Relationships */}
                        <div className="mb-3">
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Who is it for?</label>
                            <div className="flex flex-wrap gap-2">
                                {RELATIONSHIP_OPTIONS.map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => toggleRelationship(r)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                            selectedRelationships.includes(r)
                                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                                                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                                        }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Celebrations */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Occasions / Celebrations</label>
                            <div className="flex flex-wrap gap-2">
                                {CELEBRATION_OPTIONS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => toggleCelebration(c)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                            selectedCelebrations.includes(c)
                                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                                                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                                        }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-6 pt-4 border-t border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50 rounded-b-3xl">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !name.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                        {saving ? (
                            <RefreshCw size={13} className="animate-spin" />
                        ) : (
                            <Save size={13} />
                        )}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function StaffProductsPage() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [collections, setCollections] = useState<{ name: string; slug: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCollection, setFilterCollection] = useState('All');
    const [activeTab, setActiveTab] = useState<'all' | 'best-picks'>('all');

    // Inline price editor
    const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
    const [newPrice, setNewPrice] = useState<string>('');

    // Inline stock editor
    const [editingStockId, setEditingStockId] = useState<string | null>(null);
    const [newStock, setNewStock] = useState<string>('');

    // Best picks slot picker modal
    const [pickingSlotIndex, setPickingSlotIndex] = useState<number | null>(null);
    const [replacingItem, setReplacingItem] = useState<ProductItem | null>(null);
    const [bestPicksSearch, setBestPicksSearch] = useState('');

    // Product Edit Modal
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [editSaving, setEditSaving] = useState(false);

    const [notification, setNotification] = useState<string | null>(null);

    const showNotice = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3500);
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/staff/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
                if (data.collections?.length) {
                    setCollections(data.collections.map((c: any) => ({ name: c.name, slug: c.slug })));
                }
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

    // Derive unique collections for filter
    const collectionNames = useMemo(() => {
        const set = new Set<string>();
        products.forEach(p => { if (p.collection_name) set.add(p.collection_name); });
        return Array.from(set);
    }, [products]);

    // Best picks
    const bestPicksProducts = useMemo(() => {
        return products.filter(p => p.is_featured || p.tag === 'Best Seller' || p.tag === 'Featured').slice(0, 12);
    }, [products]);

    const bestPicksSlots = useMemo(() => {
        const slots: (ProductItem | null)[] = [];
        for (let i = 0; i < 12; i++) slots.push(bestPicksProducts[i] || null);
        return slots;
    }, [bestPicksProducts]);

    // ── Handlers (all optimistic) ──

    const handleSavePrice = (p: ProductItem) => {
        const parsed = Number(newPrice);
        if (!newPrice || isNaN(parsed) || parsed <= 0) return;
        const prevPrice = p.price;
        setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, price: parsed } : prod));
        setEditingPriceId(null);
        showNotice(`Price for "${p.name}" updated to ₹${parsed.toLocaleString('en-IN')}`);
        fetch('/api/staff/products', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: p.id, slug: p.slug, name: p.name, price: parsed }),
        }).catch(() => {
            setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, price: prevPrice } : prod));
            showNotice(`Failed to save price for "${p.name}" — reverted.`);
        });
    };

    const handleSaveStock = (p: ProductItem) => {
        const parsed = Number(newStock);
        if (newStock === '' || isNaN(parsed) || parsed < 0) return;
        const prevStock = p.stock;
        setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock: parsed } : prod));
        setEditingStockId(null);
        showNotice(`Stock for "${p.name}" updated to ${parsed} units`);
        fetch('/api/staff/products', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: p.id, slug: p.slug, name: p.name, stock: parsed }),
        }).catch(() => {
            setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock: prevStock } : prod));
            showNotice(`Failed to save stock for "${p.name}" — reverted.`);
        });
    };

    const handleToggleVisibility = (p: ProductItem) => {
        const nextState = !p.is_visible;
        const prevState = p.is_visible;
        setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, is_visible: nextState } : prod));
        showNotice(`"${p.name}" is now ${nextState ? 'visible online' : 'hidden from website'}`);
        fetch('/api/staff/products', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: p.id, slug: p.slug, name: p.name, is_visible: nextState }),
        }).then(async res => {
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Server error');
            }
        }).catch((err) => {
            setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, is_visible: prevState } : prod));
            showNotice(`Failed to update visibility for "${p.name}" — reverted. ${err?.message || ''}`);
        });
    };

    const handleFeature = (p: ProductItem, featureState: boolean) => {
        const prevProducts = [...products];
        setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, is_featured: featureState, tag: featureState ? 'Featured' : 'Standard' } : prod));
        showNotice(`"${p.name}" ${featureState ? 'featured in Our Best Picks' : 'removed from Our Best Picks'}`);
        setPickingSlotIndex(null);
        setReplacingItem(null);
        setBestPicksSearch('');
        fetch('/api/staff/products', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: p.id, slug: p.slug, name: p.name, is_featured: featureState, tag: featureState ? 'Featured' : 'Standard' }),
        }).catch(() => {
            setProducts(prevProducts);
            showNotice(`Failed to update Best Picks for "${p.name}" — reverted.`);
        });
    };

    const handleChangeSlot = (newProduct: ProductItem) => {
        const prevProducts = [...products];
        const currentReplacing = replacingItem;
        setProducts(prev => prev.map(prod => {
            if (currentReplacing && prod.id === currentReplacing.id) return { ...prod, is_featured: false, tag: 'Standard' };
            if (prod.id === newProduct.id) return { ...prod, is_featured: true, tag: 'Featured' };
            return prod;
        }));
        showNotice(currentReplacing ? `Slot changed: "${newProduct.name}" now replaces "${currentReplacing.name}"` : `"${newProduct.name}" featured in Our Best Picks`);
        setPickingSlotIndex(null);
        setReplacingItem(null);
        setBestPicksSearch('');
        (async () => {
            try {
                if (currentReplacing) {
                    await fetch('/api/staff/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: currentReplacing.id, slug: currentReplacing.slug, name: currentReplacing.name, is_featured: false, tag: 'Standard' }) });
                }
                await fetch('/api/staff/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: newProduct.id, slug: newProduct.slug, name: newProduct.name, is_featured: true, tag: 'Featured' }) });
            } catch {
                setProducts(prevProducts);
                showNotice('Failed to update slot on server — reverted.');
            }
        })();
    };

    // ── Full Edit Modal Save ──
    const handleSaveEdit = async (updates: Partial<ProductItem>) => {
        if (!editingProduct) return;
        setEditSaving(true);
        const prevProduct = { ...editingProduct };
        // Optimistic update
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...updates } : p));
        try {
            const res = await fetch('/api/staff/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: editingProduct.id,
                    slug: editingProduct.slug,
                    ...updates,
                }),
            });
            if (!res.ok) throw new Error('Server error');
            showNotice(`"${updates.name || editingProduct.name}" saved successfully`);
            setEditingProduct(null);
        } catch {
            // Revert
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? prevProduct : p));
            showNotice(`Failed to save changes for "${editingProduct.name}" — reverted.`);
        } finally {
            setEditSaving(false);
        }
    };

    // Filtered Products
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

    // Available for slot picker
    const availableForSlot = useMemo(() => {
        return products.filter(p => {
            if (replacingItem && p.id === replacingItem.id) return false;
            if (!replacingItem && p.is_featured) return false;
            return p.name.toLowerCase().includes(bestPicksSearch.toLowerCase());
        });
    }, [products, bestPicksSearch, replacingItem]);

    return (
        <div className="space-y-6">
            <PageHeader
                title={activeTab === 'all' ? 'Catalog Products' : 'Our Best Picks'}
                description={activeTab === 'all'
                    ? 'Manage bouquet pricing, toggle online visibility and curate the storefront'
                    : 'Feature your top 12 bouquet arrangements in the curated Best Picks showcase'
                }
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

            {/* Navigation Tabs */}
            <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-white/[0.08] pb-4">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'all'
                            ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                            : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                >
                    <Package size={14} />
                    <span>All Products</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        activeTab === 'all' ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}>{products.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('best-picks')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'best-picks'
                            ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                            : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                >
                    <BestPicksIcon size={14} />
                    <span>Our Best Picks</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        activeTab === 'best-picks' ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}>{bestPicksProducts.length}/12</span>
                </button>
            </div>

            {/* ── TAB 1: ALL PRODUCTS ── */}
            {activeTab === 'all' && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4 pb-4">
                        <div>
                            <CardTitle>Catalog Inventory &amp; Live Controls</CardTitle>
                            <CardDescription>
                                Click <strong>Edit</strong> for the full detail editor, or click price/stock to edit inline
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
                                {collectionNames.map(col => (
                                    <option key={col} value={col}>{col}</option>
                                ))}
                            </select>
                        </div>
                    </CardHeader>

                    <CardContent className="px-0 py-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.01] text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                                        <th className="py-4 px-5 text-center w-14">#</th>
                                        <th className="py-4 px-6">Product</th>
                                        <th className="py-4 px-5">Collection</th>
                                        <th className="py-4 px-5 text-right">Price</th>
                                        <th className="py-4 px-5 text-center">Stock</th>
                                        <th className="py-4 px-5 text-center">Visible</th>
                                        <th className="py-4 px-5 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-white/[0.04]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="py-16 text-center text-zinc-500">Loading arrangements...</td>
                                        </tr>
                                    ) : filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-16 text-center text-zinc-500">No products found matching &ldquo;{search}&rdquo;.</td>
                                        </tr>
                                    ) : (
                                        filtered.map((p, idx) => {
                                            const countLabel = getItemCountLabel(p.name, p.collection_slug);
                                            return (
                                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                                    {/* # */}
                                                    <td className="py-4 px-5 text-center font-mono font-bold text-zinc-400 text-xs">#{idx + 1}</td>

                                                    {/* Product Info */}
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3.5">
                                                            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/60 flex-shrink-0">
                                                                {p.image_url ? (
                                                                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover"
                                                                        onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp'; }} />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-zinc-600"><Package size={18} /></div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 max-w-xs">
                                                                <p className="font-semibold text-zinc-100 text-xs leading-snug">{p.name}</p>
                                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                    <span className="text-[10px] text-zinc-500 font-mono truncate">{p.slug}</span>
                                                                    <a href={`/product/${p.slug}`} target="_blank" rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded border border-white/10 flex-shrink-0">
                                                                        <ExternalLink size={10} /><span>View</span>
                                                                    </a>
                                                                </div>
                                                                {/* Smart item count badge */}
                                                                {countLabel && p.item_count && (
                                                                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                                                                        <Flower2 size={9} />
                                                                        {countLabel}: {p.item_count}
                                                                    </span>
                                                                )}
                                                                {/* Delivery badges */}
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    {p.same_day_delivery && (
                                                                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                                            <Clock size={8} />Same-Day
                                                                        </span>
                                                                    )}
                                                                    {p.pre_order && (
                                                                        <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                                            <ShoppingBag size={8} />Pre-Order
                                                                        </span>
                                                                    )}
                                                                    {p.variants && p.variants.length > 0 && (
                                                                        <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded-full">
                                                                            {p.variants.length} Variants
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Collection */}
                                                    <td className="py-4 px-5 text-zinc-400">{p.collection_name || 'General'}</td>

                                                    {/* Editable Price */}
                                                    <td className="py-4 px-5 text-right">
                                                        {editingPriceId === p.id ? (
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <div className="relative w-24">
                                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">₹</span>
                                                                    <input
                                                                        autoFocus type="number" value={newPrice}
                                                                        onChange={e => setNewPrice(e.target.value)}
                                                                        onKeyDown={e => { if (e.key === 'Enter') handleSavePrice(p); if (e.key === 'Escape') setEditingPriceId(null); }}
                                                                        className="w-full pl-5 pr-2 py-1 bg-zinc-900 border border-zinc-600 rounded-lg text-xs text-white tabular-nums focus:outline-none"
                                                                    />
                                                                </div>
                                                                <button onClick={() => handleSavePrice(p)} className="p-1 rounded bg-white text-zinc-950 font-bold hover:bg-zinc-200 cursor-pointer"><Check size={12} /></button>
                                                                <button onClick={() => setEditingPriceId(null)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X size={12} /></button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-end">
                                                                <button
                                                                    onClick={() => { setEditingPriceId(p.id); setNewPrice(String(p.price || '')); }}
                                                                    className="font-bold text-white tabular-nums hover:underline hover:text-zinc-200 cursor-pointer inline-flex items-center gap-1 group"
                                                                >
                                                                    <span>₹{(p.price || 0).toLocaleString('en-IN')}</span>
                                                                    <Edit3 size={11} className="opacity-0 group-hover:opacity-100 text-zinc-400" />
                                                                </button>
                                                                {p.price && p.price > 0 ? (() => {
                                                                    const pr = resolveProductPricing(p.price, p.original_price, p.slug || p.id || p.name);
                                                                    return <span className="text-[10px] text-zinc-400 tabular-nums">MRP ₹{pr.originalPrice} ({pr.discountPercent}% OFF)</span>;
                                                                })() : null}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Editable Stock */}
                                                    <td className="py-4 px-5 text-center">
                                                        {editingStockId === p.id ? (
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <input
                                                                    autoFocus type="number" min="0" value={newStock}
                                                                    onChange={e => setNewStock(e.target.value)}
                                                                    onKeyDown={e => { if (e.key === 'Enter') handleSaveStock(p); if (e.key === 'Escape') setEditingStockId(null); }}
                                                                    className="w-16 px-2 py-1 bg-zinc-900 border border-zinc-600 rounded-lg text-xs text-white text-center tabular-nums focus:outline-none"
                                                                />
                                                                <button onClick={() => handleSaveStock(p)} className="p-1 rounded bg-white text-zinc-950 font-bold hover:bg-zinc-200 cursor-pointer"><Check size={12} /></button>
                                                                <button onClick={() => setEditingStockId(null)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X size={12} /></button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => { setEditingStockId(p.id); setNewStock(String(p.stock ?? 0)); }}
                                                                className="inline-flex items-center gap-1.5 cursor-pointer group"
                                                            >
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums transition-all group-hover:ring-1 group-hover:ring-white/40 ${
                                                                    p.stock > 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                    : p.stock > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                                }`}>{p.stock} units</span>
                                                                <Edit3 size={11} className="opacity-0 group-hover:opacity-100 text-zinc-400 transition-opacity" />
                                                            </button>
                                                        )}
                                                    </td>

                                                    {/* Visibility Toggle */}
                                                    <td className="py-4 px-5 text-center">
                                                        <button
                                                            onClick={() => handleToggleVisibility(p)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                                                p.is_visible
                                                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300 hover:border-rose-500/30'
                                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-300 hover:border-emerald-500/30'
                                                            }`}
                                                        >
                                                            {p.is_visible ? <><Eye size={13} /><span>Live</span></> : <><EyeOff size={13} /><span>Hidden</span></>}
                                                        </button>
                                                    </td>

                                                    {/* Edit Button */}
                                                    <td className="py-4 px-5 text-center">
                                                        <button
                                                            onClick={() => setEditingProduct(p)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-80 transition-opacity cursor-pointer border border-zinc-700 dark:border-zinc-200"
                                                        >
                                                            <Edit3 size={12} />
                                                            <span>Edit</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── TAB 2: OUR BEST PICKS ── */}
            {activeTab === 'best-picks' && (
                <div className="space-y-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                <BestPicksIcon size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-zinc-950 dark:text-white">Our Best Picks Showcase</h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                    {bestPicksProducts.length} of 12 slots filled — Click <strong className="text-zinc-800 dark:text-zinc-200">Change</strong> to swap any arrangement, or click an empty slot to fill it
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs font-bold flex-shrink-0">
                            <BestPicksIcon size={12} />
                            {bestPicksProducts.length}/12 Slots
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {bestPicksSlots.map((item, index) => {
                            const slotNumber = index + 1;
                            if (item) {
                                return (
                                    <div key={item.id} className="relative rounded-3xl bg-white dark:bg-[#12141c]/90 border border-zinc-200 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-zinc-700 transition-all group flex flex-col overflow-hidden shadow-xs">
                                        <div className="flex items-center justify-between px-4 pt-4 pb-2 gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-0.5 rounded-full flex-shrink-0">Slot #{slotNumber}</span>
                                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                                <a href={`/product/${item.slug}`} target="_blank" rel="noopener noreferrer"
                                                    className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
                                                    <ExternalLink size={11} /><span>View</span>
                                                </a>
                                                <button
                                                    onClick={() => { setPickingSlotIndex(slotNumber); setReplacingItem(item); setBestPicksSearch(''); }}
                                                    className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                                                    <RefreshCcw size={11} /><span>Change</span>
                                                </button>
                                                <button
                                                    onClick={() => setEditingProduct(item)}
                                                    className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                                                    <Edit3 size={11} /><span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleFeature(item, false)}
                                                    className="text-zinc-500 hover:text-rose-500 text-xs flex items-center gap-1 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-white/5 hover:bg-rose-500/10 transition-colors cursor-pointer">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="relative mx-4 h-44 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp'; }} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600"><Package size={24} /></div>
                                            )}
                                        </div>
                                        <div className="px-4 pb-4 pt-3 flex flex-col gap-2 flex-1">
                                            <div>
                                                <p className="font-bold text-zinc-950 dark:text-white text-sm line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.collection_name || 'Bouquet'}</p>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-white/[0.06]">
                                                <span className="text-base font-extrabold text-zinc-950 dark:text-white tabular-nums">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                                                <Badge variant={item.stock > 0 ? 'success' : 'destructive'}>
                                                    {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            // Empty slot
                            return (
                                <div
                                    key={`empty-${slotNumber}`}
                                    onClick={() => { setPickingSlotIndex(slotNumber); setReplacingItem(null); setBestPicksSearch(''); }}
                                    className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700/80 hover:border-zinc-950 dark:hover:border-white bg-zinc-50/50 dark:bg-[#0f1118]/60 hover:bg-zinc-100 dark:hover:bg-[#151824] transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 min-h-[260px] p-6 group"
                                >
                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Slot #{slotNumber}</span>
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white group-hover:scale-110 group-hover:border-zinc-950 dark:group-hover:border-white transition-all">
                                        <Plus size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">Empty Slot</p>
                                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">Click to feature an arrangement</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Slot Picker Modal ── */}
            {pickingSlotIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => { setPickingSlotIndex(null); setReplacingItem(null); setBestPicksSearch(''); }}
                >
                    <div
                        className="relative w-full max-w-lg bg-white dark:bg-[#12141c] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/[0.12] rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-950 dark:text-white">
                                    <BestPicksIcon size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                                        {replacingItem ? `Change Slot #${pickingSlotIndex}` : `Fill Slot #${pickingSlotIndex}`}
                                    </h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        {replacingItem ? `Replacing "${replacingItem.name}"` : 'Choose a bouquet to feature'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setPickingSlotIndex(null); setReplacingItem(null); setBestPicksSearch(''); }}
                                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="px-6 py-4">
                            <div className="relative">
                                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                                <input
                                    autoFocus type="text" placeholder="Type to search bouquets..."
                                    value={bestPicksSearch} onChange={e => setBestPicksSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
                            {availableForSlot.length === 0 ? (
                                <div className="py-10 text-center text-zinc-400 dark:text-zinc-500 text-xs">
                                    {bestPicksSearch ? `No bouquets matching "${bestPicksSearch}"` : 'No bouquets available'}
                                </div>
                            ) : availableForSlot.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => replacingItem ? handleChangeSlot(p) : handleFeature(p, true)}
                                    className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-950 dark:hover:border-white transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                                            {p.image_url ? (
                                                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover"
                                                    onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp'; }} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600"><Package size={14} /></div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-zinc-950 dark:text-white text-xs truncate">{p.name}</p>
                                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{p.collection_name || 'Bouquet'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-3">
                                        <p className="font-bold text-zinc-950 dark:text-white text-xs tabular-nums">₹{(p.price || 0).toLocaleString('en-IN')}</p>
                                        <span className="text-[10px] text-zinc-950 dark:text-white font-bold group-hover:underline">
                                            {replacingItem ? '→ Place Here' : '+ Feature'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Product Edit Modal ── */}
            {editingProduct && (
                <ProductEditModal
                    product={editingProduct}
                    collections={collections.length ? collections : collectionNames.map(n => ({ name: n, slug: n.toLowerCase().replace(/\s+/g, '-') }))}
                    onSave={handleSaveEdit}
                    onClose={() => !editSaving && setEditingProduct(null)}
                    saving={editSaving}
                />
            )}
        </div>
    );
}
