'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { useCart } from '@/lib/cart-context';
import { fetchWhatsappSettings } from '@/lib/supabase';

const FALLBACK_PHONE = '919936911611';
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.newecoroses.com';

export default function CartDrawer() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, clearCart, itemCount, isDrawerOpen, closeDrawer, openAddonModal } = useCart();
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
            const priceStr = item.price && item.price > 0 ? ` [₹${item.price}]` : ' [Price on Request]';
            return `${i + 1}. ${item.name} (Qty: ${item.quantity})${priceStr}\n   ${url}`;
        });
        const message = `Hi! I would like to place an order / enquire for the following items:\n\n${lines.join('\n\n')}\n\nPlease confirm availability and total. Thank you!`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    const totalPrice = items.reduce((sum, item) => sum + (item.price && item.price > 0 ? item.price * item.quantity : 0), 0);
    const hasUnpriced = items.some(item => !item.price || item.price <= 0);

    const handleProceedToCheckout = () => {
        closeDrawer();
        openAddonModal();
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
                        transition={{ duration: 0.22 }}
                        className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-xs"
                        onClick={closeDrawer}
                    />

                    {/* Drawer (Checkout Page Surface Theme) */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                        className="fixed top-0 right-0 z-[95] h-full w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-black/[0.08]"
                    >
                        {/* ── Top Header ── */}
                        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-black/[0.07] bg-white">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#777]">
                                    New Eco Roses
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <h2 className="font-sans text-[17px] sm:text-[18px] font-extrabold text-[#111] tracking-tight">
                                        Your Shopping Cart
                                    </h2>
                                    {itemCount > 0 && (
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#111] text-white">
                                            {itemCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={closeDrawer}
                                className="w-8 h-8 rounded-full bg-[#f4f4f4] hover:bg-[#eaeaea] text-[#111] flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Close cart"
                            >
                                <X size={16} className="stroke-[2.2]" />
                            </button>
                        </div>

                        {/* ── Cart Items List ── */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4 bg-[#f7f7f7] rounded-[20px] border border-black/[0.06]">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-2xs border border-black/[0.06]">
                                        <ShoppingBag size={26} className="text-[#bfa81f]" />
                                    </div>
                                    <h3 className="font-sans text-[17px] font-extrabold text-[#111] mb-1">
                                        Your cart is empty
                                    </h3>
                                    <p className="text-xs text-[#666] max-w-xs mb-5 font-normal">
                                        Explore our handcrafted bouquets, luxury hampers, and curated gifts.
                                    </p>
                                    <Link
                                        href="/shop"
                                        onClick={closeDrawer}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[12px] text-xs uppercase tracking-wider font-bold bg-[#bfa81f] hover:bg-[#a89216] text-white transition-all shadow-sm"
                                    >
                                        <span>Browse Products</span>
                                        <ArrowRight size={13} />
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {/* Kolkata Delivery Notice (Checkout style) */}
                                    <div className="flex items-center gap-2 py-2 px-3 rounded-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs font-semibold">
                                        <Check size={14} className="text-emerald-700 stroke-[3] flex-shrink-0" />
                                        <span>Free Kolkata Delivery &amp; Luxury Packaging included</span>
                                    </div>

                                    {/* Item Cards */}
                                    <div className="space-y-2.5">
                                        {items.map(item => {
                                            const itemPrice = item.price && item.price > 0 ? item.price : 0;
                                            const lineTotal = itemPrice * item.quantity;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="p-3 rounded-[16px] bg-[#f7f7f7] border border-black/[0.07] hover:border-black/[0.15] transition-all flex gap-3 items-center"
                                                >
                                                    {/* Thumbnail */}
                                                    <Link
                                                        href={`/product/${item.slug}`}
                                                        onClick={closeDrawer}
                                                        className="relative w-[66px] h-[74px] rounded-[10px] overflow-hidden bg-white border border-black/[0.08] flex-shrink-0"
                                                    >
                                                        <Image
                                                            src={item.image_url || '/images/placeholder.webp'}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                                            sizes="66px"
                                                        />
                                                    </Link>

                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                                                        <div className="flex justify-between items-start gap-1">
                                                            <Link
                                                                href={`/product/${item.slug}`}
                                                                onClick={closeDrawer}
                                                                className="text-[13.5px] font-bold text-[#111] leading-snug line-clamp-1 hover:text-[#bfa81f] transition-colors"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                className="p-1 rounded-[6px] text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0 ml-1"
                                                                title="Remove item"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>

                                                        {/* Price Tag */}
                                                        <div className="text-xs text-[#666] font-medium">
                                                            {itemPrice > 0 ? `₹${itemPrice.toLocaleString('en-IN')}` : 'Price on request'}
                                                        </div>

                                                        {/* Quantity stepper + Line total */}
                                                        <div className="flex items-center justify-between mt-1">
                                                            <div className="flex items-center border border-black/[0.1] rounded-[8px] overflow-hidden bg-white shadow-2xs">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 text-[#111] transition-colors cursor-pointer"
                                                                    aria-label="Decrease quantity"
                                                                >
                                                                    <Minus size={11} />
                                                                </button>
                                                                <span className="w-6 text-center text-xs font-bold text-[#111]">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="w-6 h-6 bg-[#bfa81f] hover:bg-[#a89216] text-white flex items-center justify-center transition-colors cursor-pointer"
                                                                    aria-label="Increase quantity"
                                                                >
                                                                    <Plus size={11} />
                                                                </button>
                                                            </div>

                                                            <div className="text-[14px] font-extrabold text-[#111]">
                                                                {itemPrice > 0 ? `₹${lineTotal.toLocaleString('en-IN')}` : 'Enquire'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── Footer / Order Summary (Checkout Page Style) ── */}
                        {items.length > 0 && (
                            <div className="border-t border-black/[0.08] px-5 py-4 bg-white space-y-3">
                                {/* Clear all link */}
                                <div className="flex items-center justify-between text-xs text-[#777]">
                                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</span>
                                    <button
                                        type="button"
                                        onClick={clearCart}
                                        className="hover:text-red-600 underline underline-offset-2 transition-colors cursor-pointer"
                                    >
                                        Clear cart
                                    </button>
                                </div>

                                {/* Order Breakdown */}
                                <div className="p-3.5 rounded-[14px] bg-[#f7f7f7] border border-black/[0.07] space-y-2">
                                    <div className="flex justify-between items-center text-xs text-[#666]">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-[#111]">₹{totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-[#666]">
                                        <span>Delivery</span>
                                        <span className="text-emerald-700 font-bold">FREE (Kolkata)</span>
                                    </div>
                                    <div className="h-px bg-black/[0.08]" />
                                    <div className="flex justify-between items-baseline pt-0.5">
                                        <span className="text-sm font-bold text-[#111]">Total Amount</span>
                                        <div className="text-right">
                                            <span className="text-[19px] font-black text-[#111] tracking-tight">
                                                ₹{totalPrice.toLocaleString('en-IN')}
                                            </span>
                                            {hasUnpriced && (
                                                <p className="text-[10px] text-[#777] font-normal">+ custom items</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Primary Proceed to Checkout Button */}
                                <button
                                    type="button"
                                    onClick={handleProceedToCheckout}
                                    className="w-full min-h-[48px] bg-[#bfa81f] hover:bg-[#a89216] text-white rounded-[12px] font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Proceed to Secure Checkout</span>
                                    <ArrowRight size={14} />
                                </button>

                                {/* WhatsApp Button */}
                                <a
                                    href={buildWhatsAppLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={closeDrawer}
                                    className="w-full min-h-[42px] bg-white hover:bg-gray-50 border border-black/[0.12] text-[#111] rounded-[12px] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <WhatsappIcon size={15} />
                                    <span>Order / Enquire on WhatsApp</span>
                                </a>

                                <p className="text-[10.5px] text-center text-[#777]">
                                    🔒 100% Secure Checkout with Razorpay UPI &amp; Cards
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
