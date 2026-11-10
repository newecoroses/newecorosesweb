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
    Plus,
    Trash2,
    Check,
    MessageSquare,
    Store,
    Gift,
    Search,
    Sparkles,
    Tag
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
    const [customerChannel, setCustomerChannel] = useState<'in-store' | 'whatsapp'>('in-store');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [specialDay, setSpecialDay] = useState('');
    const [specialDayType, setSpecialDayType] = useState('Marriage Anniversary');
    const [amountSpent, setAmountSpent] = useState('');
    const [notes, setNotes] = useState('');

    // Product search autocomplete
    const [productQuery, setProductQuery] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                    notes: notes.trim()
                        ? `[Channel: ${customerChannel === 'in-store' ? 'In-Store Walk-In' : 'WhatsApp Enquiry'}] ${notes.trim()}`
                        : `[Channel: ${customerChannel === 'in-store' ? 'In-Store Walk-In' : 'WhatsApp Enquiry'}]`,
                }),
            });

            const data = await res.json();
            if (data.success) {
                onCustomerAdded();
                onClose();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#12141c] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                {/* Header — exactly matching AddOrderModal */}
                <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-white/[0.08] flex items-center justify-between bg-zinc-50 dark:bg-[#151824]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold shadow-xs">
                            <User size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                                Reception Customer Check-In
                                <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 font-semibold">
                                    In-Store
                                </span>
                            </h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Register walk-in guests, log special occasions &amp; issue 15% discount greeting
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                    {error && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                            {error}
                        </div>
                    )}

                    {/* Customer Channel Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Customer Channel
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setCustomerChannel('in-store')}
                                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                    customerChannel === 'in-store'
                                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold border-zinc-950 dark:border-white shadow-xs'
                                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                                }`}
                            >
                                <Store size={14} />
                                <span>In-Store Walk-In</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCustomerChannel('whatsapp')}
                                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                    customerChannel === 'whatsapp'
                                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                                }`}
                            >
                                <MessageSquare size={14} className="text-[#25D366]" />
                                <span>WhatsApp Enquiry</span>
                            </button>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Customer Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Rohini Banerjee"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Phone Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                type="tel"
                                placeholder="+91 98300 12345"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                            />
                        </div>
                    </div>

                    {/* Email & Amount Spent */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Email Address <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Optional · 15% discount mail)</span>
                            </label>
                            <input
                                type="email"
                                placeholder="customer@gmail.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Total Spent Today <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                                <IndianRupee size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                                <input
                                    type="number"
                                    placeholder="e.g. 1850"
                                    value={amountSpent}
                                    onChange={e => setAmountSpent(e.target.value)}
                                    className="w-full pl-8 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Celebrations & Special Days Card Box */}
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                                <Gift size={13} className="text-zinc-500 dark:text-zinc-400" />
                                Celebrations &amp; Special Days
                            </span>
                            <span className="text-[10px] text-zinc-500 font-medium">Optional anniversary reminders</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <div>
                                <label className="block text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">Occasion Type</label>
                                <select
                                    value={specialDayType}
                                    onChange={e => setSpecialDayType(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500"
                                >
                                    {SPECIAL_OCCASIONS.map(occ => (
                                        <option key={occ} value={occ}>{occ}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">Occasion Date</label>
                                <input
                                    type="date"
                                    value={specialDay}
                                    onChange={e => setSpecialDay(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">Birthday (DOB)</label>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={e => setDob(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bouquets / Items Purchased with Autocomplete */}
                    <div className="relative" ref={suggestionsRef}>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Bouquets &amp; Products Bought
                            </label>
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Type &lsquo;r&rsquo; for roses, bouquet options...</span>
                        </div>

                        <div className="relative">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Type to search bouquets (e.g. 'rose', 'crown', 'hamper')..."
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
                                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                            />
                        </div>

                        {/* Interactive Suggestions Dropdown */}
                        {showSuggestions && matchingProducts.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#151824] border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-2 z-30 max-h-52 overflow-y-auto">
                                <p className="px-3 py-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                                    Catalog Matches:
                                </p>
                                {matchingProducts.map(item => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => handleAddProduct(item)}
                                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left text-xs transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <ShoppingBag size={14} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                                            <span className="font-semibold text-zinc-800 dark:text-white">{item}</span>
                                        </div>
                                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800">
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
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs border border-zinc-200 dark:border-zinc-700 font-medium"
                                    >
                                        <Tag size={11} className="text-zinc-500 dark:text-zinc-400" />
                                        <span>{prod}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(prod)}
                                            className="text-zinc-400 hover:text-rose-500 ml-1 cursor-pointer"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Receptionist / Customer Notes <span className="text-zinc-400 dark:text-zinc-500 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Add flower preferences, delivery notes, or special requests..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-none transition-colors"
                        />
                    </div>

                    {/* Footer Actions — matching AddOrderModal */}
                    <div className="pt-3 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between">
                        <div>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                <Sparkles size={13} className="text-zinc-500" />
                                VIP 15% Welcome Voucher:
                            </span>
                            <p className="text-xs font-mono font-bold text-zinc-900 dark:text-white mt-0.5">
                                Promo Code: WELCOME15
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
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
                                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <span className="w-3.5 h-3.5 border-2 border-white dark:border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={14} className="stroke-[2.5]" />
                                        <span>Confirm Customer</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
