'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    User,
    Phone,
    Mail,
    Calendar,
    Heart,
    IndianRupee,
    ShoppingBag,
    FileText,
    Sparkles,
    Check,
    Search,
    Gift
} from 'lucide-react';
import { PRODUCTS } from '@/lib/products';

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

export function AddCustomerModal({ open, onClose, onCustomerAdded }: AddCustomerModalProps) {
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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Filter products based on typing
    const matchingProducts = productQuery.trim().length > 0
        ? PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(productQuery.toLowerCase()) &&
            !selectedProducts.includes(p.name)
        ).slice(0, 6)
        : [];

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
                setSuccessMessage('Customer saved! 15% discount greeting email structure prepared.');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-[#12141c] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#151824]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-bold">
                            <User size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                Reception Customer Check-In
                                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
                                    In-Store
                                </span>
                            </h2>
                            <p className="text-xs text-zinc-400">
                                Add customer details, special occasions & trigger 15% discount greeting
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                            <Check size={14} />
                            {successMessage}
                        </div>
                    )}

                    {/* Basic Info: Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                Customer Name <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative">
                                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Rohini Banerjee"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                Phone Number <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative">
                                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    required
                                    type="tel"
                                    placeholder="+91 98300 12345"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email & Amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                Email Address <span className="text-zinc-500">(Optional for 15% discount mail)</span>
                            </label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="email"
                                    placeholder="customer@gmail.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                Total Spent Today <span className="text-zinc-500">(Optional)</span>
                            </label>
                            <div className="relative">
                                <IndianRupee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="number"
                                    placeholder="e.g. 1850"
                                    value={amountSpent}
                                    onChange={e => setAmountSpent(e.target.value)}
                                    className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Special Occasion & DOB (Optional) */}
                    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                        <p className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                            <Gift size={13} className="text-zinc-400" />
                            Celebrations & Special Days <span className="text-[11px] font-normal text-zinc-500">(Optional for reminders)</span>
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[11px] text-zinc-400 mb-1">Occasion Type</label>
                                <select
                                    value={specialDayType}
                                    onChange={e => setSpecialDayType(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500"
                                >
                                    {SPECIAL_OCCASIONS.map(occ => (
                                        <option key={occ} value={occ}>{occ}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] text-zinc-400 mb-1">Occasion Date</label>
                                <input
                                    type="date"
                                    value={specialDay}
                                    onChange={e => setSpecialDay(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] text-zinc-400 mb-1">Date of Birth (DOB)</label>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={e => setDob(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product / Bouquet Purchased with AUTOCOMPLETE */}
                    <div className="relative" ref={suggestionsRef}>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                            What did they order / buy? <span className="text-zinc-500">(Type &lsquo;r&rsquo; for roses, bouquets...)</span>
                        </label>
                        <div className="relative">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Type to search items (e.g. 'rose', 'crown', 'bouquet')..."
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
                                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                            />
                        </div>

                        {/* Interactive Suggestions Dropdown */}
                        {showSuggestions && matchingProducts.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-[#151824] border border-zinc-700 rounded-2xl shadow-2xl p-2 z-30 max-h-52 overflow-y-auto">
                                <p className="px-3 py-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                    Catalog Matches:
                                </p>
                                {matchingProducts.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handleAddProduct(p.name)}
                                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/80 text-left text-xs transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <ShoppingBag size={14} className="text-zinc-400 group-hover:text-white" />
                                            <span className="font-semibold text-white">{p.name}</span>
                                        </div>
                                        <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                                            {p.collection}
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
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-800 text-zinc-200 text-xs border border-zinc-700"
                                    >
                                        <span>{prod}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(prod)}
                                            className="text-zinc-400 hover:text-rose-400 ml-1 cursor-pointer"
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
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                            Receptionist / Staff Notes <span className="text-zinc-500">(Optional)</span>
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Add flower preferences, delivery notes, or special requests..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
                        />
                    </div>

                    {/* Greeting Preview Banner */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3">
                        <Sparkles size={16} className="text-zinc-300 flex-shrink-0 mt-0.5" />
                        <div className="text-[11px] text-zinc-400 leading-relaxed">
                            <span className="font-semibold text-white">VIP Greeting Email Automation:</span>{' '}
                            When saved with an email address, a luxury thank-you greeting with promo code{' '}
                            <code className="text-white font-mono bg-zinc-800 px-1.5 py-0.5 rounded font-bold">WELCOME15</code>{' '}
                            (15% discount for their next online purchase) is automatically generated.
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                    <span>Saving Customer...</span>
                                </>
                            ) : (
                                <>
                                    <Check size={14} />
                                    <span>Save &amp; Generate Greeting</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
