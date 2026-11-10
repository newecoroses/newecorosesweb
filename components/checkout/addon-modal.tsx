'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus } from 'lucide-react';
import { ADDON_CATEGORIES, ADDON_ITEMS, AddonItem } from '@/lib/addons';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

interface AddonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue?: () => void;
}

export default function AddonModal({ isOpen, onClose, onContinue }: AddonModalProps) {
    const router = useRouter();
    const { addItem } = useCart();
    const [activeTab, setActiveTab] = useState<string>('all');
    // Map of addon id -> selected quantity in modal
    const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});

    if (!isOpen) return null;

    const filteredItems = activeTab === 'all'
        ? ADDON_ITEMS
        : ADDON_ITEMS.filter(item => item.category === activeTab);

    const handleAdd = (item: AddonItem) => {
        setSelectedAddons(prev => ({
            ...prev,
            [item.id]: (prev[item.id] || 0) + 1,
        }));
    };

    const handleUpdateQty = (itemId: string, delta: number) => {
        setSelectedAddons(prev => {
            const current = prev[itemId] || 0;
            const updated = current + delta;
            if (updated <= 0) {
                const next = { ...prev };
                delete next[itemId];
                return next;
            }
            return { ...prev, [itemId]: updated };
        });
    };

    const totalSelectedCount = Object.values(selectedAddons).reduce((sum, q) => sum + q, 0);

    const handleProceed = () => {
        // Add all selected items into global cart
        Object.entries(selectedAddons).forEach(([itemId, qty]) => {
            const item = ADDON_ITEMS.find(a => a.id === itemId);
            if (item && qty > 0) {
                for (let i = 0; i < qty; i++) {
                    addItem({
                        id: item.id,
                        name: item.name,
                        slug: item.id,
                        image_url: item.image_url,
                        price: item.price,
                    });
                }
            }
        });

        onClose();
        if (onContinue) {
            onContinue();
        } else {
            router.push('/checkout');
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* ── Modal Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1c1917] tracking-tight">
                        Make It Extra Special!
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#bfa81f] text-gray-500 hover:text-[#bfa81f] flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Category Tabs Horizontal Scrollbar ── */}
                <div className="border-b border-gray-100 bg-white px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-6 sm:gap-8 flex-nowrap">
                    {ADDON_CATEGORIES.map(cat => {
                        const isActive = activeTab === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`flex flex-col items-center gap-1.5 flex-shrink-0 pb-1 cursor-pointer transition-all ${
                                    isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                                }`}
                            >
                                <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center text-lg bg-gray-50 border transition-all ${
                                        isActive
                                            ? 'border-[#bfa81f] ring-2 ring-[#bfa81f]/20 bg-amber-50/50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <span>{cat.icon}</span>
                                </div>
                                <span className={`text-[11px] font-semibold tracking-tight whitespace-nowrap ${
                                    isActive ? 'text-[#bfa81f] font-bold border-b-2 border-[#bfa81f] pb-0.5' : 'text-gray-700'
                                }`}>
                                    {cat.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Products Grid ── */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
                        {filteredItems.map(item => {
                            const qty = selectedAddons[item.id] || 0;
                            return (
                                <div
                                    key={item.id}
                                    className="border border-gray-200 rounded-xl p-2.5 flex flex-col justify-between hover:shadow-xs transition-shadow bg-white"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-50 mb-2">
                                        <Image
                                            src={item.image_url || '/images/placeholder.webp'}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="160px"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <h3 className="text-xs font-medium text-[#1c1917] line-clamp-2 leading-snug min-h-[32px] mb-2">
                                            {item.name}
                                        </h3>

                                        <div className="flex items-center justify-between gap-1 mt-auto">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs font-bold text-[#1c1917]">
                                                    ₹{item.price}
                                                </span>
                                                {item.originalPrice && (
                                                    <span className="text-[10px] text-gray-400 line-through">
                                                        ₹{item.originalPrice}
                                                    </span>
                                                )}
                                            </div>

                                            {/* ADD button or Quantity Stepper */}
                                            {qty === 0 ? (
                                                <button
                                                    onClick={() => handleAdd(item)}
                                                    className="px-3 py-1 rounded-md border border-[#bfa81f] text-[#bfa81f] hover:bg-[#bfa81f] hover:text-white text-[11px] font-bold uppercase transition-colors cursor-pointer"
                                                >
                                                    ADD
                                                </button>
                                            ) : (
                                                <div className="flex items-center border border-[#bfa81f] rounded-md overflow-hidden bg-white">
                                                    <button
                                                        onClick={() => handleUpdateQty(item.id, -1)}
                                                        className="px-1.5 py-1 text-[#bfa81f] hover:bg-amber-50 transition-colors cursor-pointer"
                                                    >
                                                        <Minus size={11} />
                                                    </button>
                                                    <span className="px-1.5 text-xs font-bold text-[#bfa81f]">
                                                        {qty}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQty(item.id, 1)}
                                                        className="px-1.5 py-1 text-[#bfa81f] hover:bg-amber-50 transition-colors cursor-pointer"
                                                    >
                                                        <Plus size={11} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Sticky Bottom Action Bar ── */}
                <div className="p-3.5 sm:p-4 border-t border-gray-100 bg-white flex justify-end items-center gap-3">
                    {totalSelectedCount === 0 ? (
                        <button
                            onClick={handleProceed}
                            className="px-6 py-2.5 rounded-lg border border-[#bfa81f] text-[#bfa81f] hover:bg-[#bfa81f] hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
                        >
                            Skip & Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleProceed}
                            className="px-7 py-2.5 rounded-lg bg-[#bfa81f] hover:bg-[#a89216] text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                            Continue • {totalSelectedCount} {totalSelectedCount === 1 ? 'Add-on' : 'Add-ons'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
