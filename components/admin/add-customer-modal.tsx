'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    User,
    Phone,
    Mail,
    Calendar,
    IndianRupee,
    ShoppingBag,
    Sparkles,
    Check,
    Search,
    Gift,
    Heart,
    Tag,
    Clock,
    ShieldCheck
} from 'lucide-react';

interface AddCustomerModalProps {
    open: boolean;
    onClose: () => void;
    onCustomerAdded: () => void;
}

const SPECIAL_OCCASIONS = [
    'Marriage Anniversary',
    'Birthday',
    'Engagement',
    'Valentine’s Day',
    'Mother’s Day',
    'Festival / Celebration',
    'Other Special Day'
];

const COMMON_BOUQUET_ITEMS = [
    'Rose Bouquet',
    'Red Roses Bouquet',
    'Pink Roses Bouquet',
    'Blush Roses Bouquet',
    'White Roses Bouquet',
    'Yellow Roses Bouquet',
    '20 Roses Bouquet',
    '50 Roses Luxury Bouquet',
    '100 Roses Grand Bouquet',
    'Heart Shape Rose Box',
    'Flower Crown',
    'Baby’s Breath Bouquet',
    'Orchid Arrangement',
    'Carnations Bouquet',
    'Lily Bouquet',
    'Mixed Floral Bouquet',
    'Luxury Gift Hamper',
    'Chocolate Box Addon',
    'Truffle Cake Addon',
    'Teddy Bear Addon',
    'Customized Floral Box',
];

export function AddCustomerModal({ open, onClose, onCustomerAdded }: AddCustomerModalProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [specialDay, setSpecialDay] = useState('');
    const [specialDayType, setSpecialDayType] = useState('Marriage Anniversary');
    const [amountSpent, setAmountSpent] = useState('');
    const [notes, setNotes] = useState('');

    // Product search autocomplete (matching clean customer-friendly bouquet names)
    const [productQuery, setProductQuery] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Filter clean simplified bouquet names based on typing
    const matchingProducts = productQuery.trim().length > 0
        ? COMMON_BOUQUET_ITEMS.filter(item =>
            item.toLowerCase().includes(productQuery.toLowerCase()) &&
            !selectedProducts.includes(item)
        ).slice(0, 7)
        : COMMON_BOUQUET_ITEMS.filter(item => !selectedProducts.includes(item)).slice(0, 5);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!open) return null;

    const handleAddProduct = (prodName: string) => {
        if (!selectedProducts.includes(prodName)) {
            setSelectedProducts(prev => [...prev, prodName]);
        }
        setProductQuery('');
        setShowSuggestions(false);
    };

    const handleRemoveProduct = (prodName: string) => {
        setSelectedProducts(prev => prev.filter(p => p !== prodName));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim() || !phone.trim()) {
            setError('Please provide customer name and phone number.');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim(),
                    email: email.trim() || undefined,
                    dob: dob || undefined,
                    specialDay: specialDay || undefined,
                    specialDayType: specialDay ? specialDayType : undefined,
                    amountSpent: amountSpent ? Number(amountSpent) : undefined,
                    purchasedItems: selectedProducts,
                    notes: notes.trim() || undefined,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setSuccessMessage('Customer registered! 15% discount VIP greeting email scheduled.');
                setTimeout(() => {
                    onCustomerAdded();
                    onClose();
                }, 1200);
            } else {
                setError(data.message || 'Failed to save customer');
            }
        } catch (err: any) {
            setError(err.message || 'Error communicating with server');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#12141c] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                {/* ── Modern Premium Header ───────────────────────────── */}
                <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-white/[0.08] flex items-center justify-between bg-zinc-50/80 dark:bg-[#151824]/90 backdrop-blur-xs">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold shadow-sm flex-shrink-0">
                            <Sparkles size={20} className="stroke-[2.2]" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950 dark:text-white truncate">
                                    Reception Guest Check-In
                                </h2>
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    In-Store Desk
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                Boutique walk-in guest registration &amp; exclusive 15% VIP welcome voucher
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-2 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer ml-2 flex-shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Form Content ────────────────────────────────────── */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
                    {error && (
                        <div className="p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <span>{error}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-medium">
                            <Check size={16} className="text-emerald-500" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Section 1: Guest Contact */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                01 · Guest Identity &amp; Contact
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Customer Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Rohini Banerjee"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900/90 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Phone Number <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+91 98300 12345"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900/90 transition-all font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
                                <span>Email Address <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Optional)</span></span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Unlocks 15% VIP Welcome Voucher</span>
                            </label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                                <input
                                    type="email"
                                    placeholder="customer@gmail.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900/90 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Celebrations & Memorable Dates */}
                    <div className="p-4 sm:p-4.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                                <Gift size={14} className="text-zinc-500 dark:text-zinc-400" />
                                02 · Celebrations &amp; Special Days
                            </p>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">For anniversary reminders</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                    Occasion Type
                                </label>
                                <select
                                    value={specialDayType}
                                    onChange={e => setSpecialDayType(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                                >
                                    {SPECIAL_OCCASIONS.map(occ => (
                                        <option key={occ} value={occ}>{occ}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                    Occasion Date
                                </label>
                                <input
                                    type="date"
                                    value={specialDay}
                                    onChange={e => setSpecialDay(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                    Birthday (DOB)
                                </label>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={e => setDob(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Boutique Purchase & Items Ordered */}
                    <div className="space-y-3">
                        <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                            03 · In-Store Purchase Record
                        </span>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Total Amount Paid Today <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                                <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                                <input
                                    type="number"
                                    placeholder="e.g. 2499"
                                    value={amountSpent}
                                    onChange={e => setAmountSpent(e.target.value)}
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900/90 transition-all font-mono"
                                />
                            </div>
                        </div>

                        {/* Product / Bouquet Purchased with LIVE AUTOCOMPLETE */}
                        <div className="relative" ref={suggestionsRef}>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Bouquets &amp; Items Selected <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Type to see catalogue suggestions)</span>
                            </label>
                            <div className="relative">
                                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Type 'rose', 'bouquet', 'orchid', 'crown'..."
                                    value={productQuery}
                                    onFocus={() => setShowSuggestions(true)}
                                    onChange={e => {
                                        setProductQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && productQuery.trim()) {
                                            e.preventDefault();
                                            handleAddProduct(productQuery.trim());
                                        }
                                    }}
                                    className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900/90 transition-all"
                                />
                            </div>

                            {/* Autocomplete Dropdown */}
                            {showSuggestions && matchingProducts.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#151824] border border-zinc-200 dark:border-zinc-700/80 rounded-2xl shadow-xl p-2 z-30 max-h-56 overflow-y-auto">
                                    <p className="px-3 py-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                                        Catalogue Suggestions:
                                    </p>
                                    {matchingProducts.map(item => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => handleAddProduct(item)}
                                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left text-xs transition-colors cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <ShoppingBag size={14} className="text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-white" />
                                                <span className="font-semibold text-zinc-800 dark:text-white">{item}</span>
                                            </div>
                                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 font-medium">
                                                Add Item
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Selected Product Tags */}
                            {selectedProducts.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2.5">
                                    {selectedProducts.map(prod => (
                                        <span
                                            key={prod}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs border border-zinc-200 dark:border-zinc-700 shadow-2xs font-medium"
                                        >
                                            <Tag size={12} className="text-zinc-500 dark:text-zinc-400" />
                                            <span>{prod}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProduct(prod)}
                                                className="text-zinc-400 hover:text-rose-500 ml-1 cursor-pointer p-0.5"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 4: Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Receptionist / Florist Notes <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Add specific rose colors, wrapping paper requests, or delivery instructions..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900/90 resize-none transition-all"
                        />
                    </div>

                    {/* Luxury VIP Greeting Voucher Preview */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-100/90 to-zinc-50 dark:from-white/[0.04] dark:to-white/[0.01] border border-zinc-200 dark:border-white/[0.08] flex items-start gap-3.5 shadow-2xs">
                        <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs font-bold text-xs">
                            15%
                        </div>
                        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed min-w-0">
                            <span className="font-bold text-zinc-900 dark:text-white">VIP Greeting Email Automation</span>
                            <p className="mt-0.5">
                                Registered guests receive a personalized &ldquo;Thank you for shopping with New Eco Roses&rdquo; boutique note with voucher code{' '}
                                <code className="text-zinc-900 dark:text-white font-mono bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 font-bold">WELCOME15</code>{' '}
                                granting 15% off their next online floral order.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-all shadow-md cursor-pointer flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                    <span>Registering Guest...</span>
                                </>
                            ) : (
                                <>
                                    <Check size={14} className="stroke-[2.5]" />
                                    <span>Register Guest &amp; Issue Voucher</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
