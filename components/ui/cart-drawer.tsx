'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { useCart } from '@/lib/cart-context';
import { fetchWhatsappSettings } from '@/lib/supabase';
import { useState } from 'react';

const FALLBACK_PHONE = '919936911611';
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.newecoroses.com';

export default function CartDrawer() {
    const { items, removeItem, updateQuantity, clearCart, itemCount, isDrawerOpen, closeDrawer } = useCart();
    const [phone, setPhone] = useState(FALLBACK_PHONE);
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchWhatsappSettings()
            .then(s => { if (s?.phone_number) setPhone(s.phone_number); })
            .catch(() => {});
    }, []);

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isDrawerOpen]);

    // Close on ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [closeDrawer]);

    const buildWhatsAppLink = () => {
        const lines = items.map((item, i) => {
            const url = `${SITE_URL}/product/${item.slug}`;
            return `${i + 1}. ${item.name} (Qty: ${item.quantity})\n   ${url}`;
        });
        const message = `Hi! I would like to place an order for the following items:\n\n${lines.join('\n\n')}\n\nPlease confirm availability and total. Thank you!`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        ref={backdropRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
                        onClick={closeDrawer}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 z-[95] h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={20} className="text-foreground" />
                                <h2 className="font-serif text-lg font-semibold text-foreground">Your Selection</h2>
                                {itemCount > 0 && (
                                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-full">
                                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={closeDrawer}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-muted hover:text-foreground"
                                aria-label="Close cart"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                                        <ShoppingBag size={32} className="text-gray-300" />
                                    </div>
                                    <p className="font-serif text-lg text-foreground mb-1.5">Your cart is empty</p>
                                    <p className="text-sm text-muted font-light mb-6">
                                        Browse our collection and add your favourites.
                                    </p>
                                    <Link
                                        href="/shop"
                                        onClick={closeDrawer}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold bg-primary text-white hover:opacity-90 transition-all"
                                    >
                                        Browse Shop <ArrowRight size={14} />
                                    </Link>
                                </div>
                            ) : (
                                <div className="px-4 py-4 space-y-3">
                                    {items.map(item => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3.5 p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-all group"
                                        >
                                            {/* Thumbnail */}
                                            <Link
                                                href={`/product/${item.slug}`}
                                                onClick={closeDrawer}
                                                className="relative w-[72px] h-[72px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                                            >
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="72px"
                                                />
                                            </Link>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <Link
                                                        href={`/product/${item.slug}`}
                                                        onClick={closeDrawer}
                                                        className="text-sm font-medium text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </div>
                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="px-2.5 py-1 hover:bg-gray-100 text-muted hover:text-foreground transition-colors"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus size={13} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium text-foreground">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="px-2.5 py-1 hover:bg-gray-100 text-muted hover:text-foreground transition-colors"
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus size={13} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer — Place Order */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-100 px-5 py-5 space-y-3 bg-white">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted font-light">
                                        {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
                                    </span>
                                    <button
                                        onClick={clearCart}
                                        className="text-xs text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors"
                                    >
                                        Clear all
                                    </button>
                                </div>
                                <a
                                    href={buildWhatsAppLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={closeDrawer}
                                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1fb855] text-white py-3.5 rounded-xl text-sm uppercase tracking-[0.15em] font-semibold transition-all shadow-lg shadow-green-500/15 hover:shadow-xl hover:shadow-green-500/25"
                                >
                                    <WhatsappIcon size={20} />
                                    Place Order on WhatsApp
                                </a>
                                <p className="text-[11px] text-center text-muted font-light">
                                    Your item list will be sent via WhatsApp for confirmation.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
