'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Check, Truck, ShoppingBag, MapPin, MessageCircle, Package, Star } from 'lucide-react';
import { fetchWhatsappSettings } from '@/lib/supabase';

const FALLBACK_PHONE = '919936911611';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order') || 'NER-PREVIEW';
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [phone, setPhone] = useState(FALLBACK_PHONE);

    useEffect(() => {
        fetchWhatsappSettings()
            .then(s => { if (s?.phone_number) setPhone(s.phone_number); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        // Celebratory confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 28, spread: 360, ticks: 70, zIndex: 200 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) { clearInterval(interval); return; }
            const particleCount = 45 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 }, colors: ['#bfa81f', '#e6c845', '#ffffff', '#22c55e', '#f43f5e'] });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }, colors: ['#bfa81f', '#e6c845', '#ffffff', '#22c55e', '#f43f5e'] });
        }, 300);

        // Fetch order
        if (orderNumber) {
            fetch(`/api/orders?orderNumber=${orderNumber}`)
                .then(r => r.json())
                .then(data => { if (data.success && data.order) setOrder(data.order); setLoading(false); })
                .catch(() => setLoading(false));
        } else { setLoading(false); }

        return () => clearInterval(interval);
    }, [orderNumber]);

    const statusSteps = [
        { label: 'Order Received', icon: Package },
        { label: 'Being Crafted', icon: Star },
        { label: 'Out for Delivery', icon: Truck },
        { label: 'Delivered', icon: Check },
    ];

    const whatsappHelpMessage = `Hi New Eco Roses! I placed order #${orderNumber}. Can you share delivery progress? Thank you!`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappHelpMessage)}`;
    const dateStr = order?.createdAt
        ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        /* ── Outer page — accounts for fixed navbar (~150px) ── */
        <div className="min-h-screen bg-[#faf7f2] pt-[150px] pb-16 px-4 sm:px-6 lg:px-8">

            {/* ── Max-width container: wider on desktop ── */}
            <div className="max-w-5xl mx-auto">

                {/* ── Top brand label ── */}
                <div className="text-center mb-8">
                    <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-bold text-[#bfa81f]">
                        <span className="w-8 h-px bg-[#bfa81f] inline-block" />
                        New Eco Roses
                        <span className="w-8 h-px bg-[#bfa81f] inline-block" />
                    </span>
                </div>

                {/* ── Main card grid: hero left + details right on lg ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* ───── LEFT HERO PANEL ───── */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Success hero */}
                        <div className="bg-[#1c1917] rounded-3xl overflow-hidden shadow-2xl">
                            {/* Top gold shimmer bar */}
                            <div className="h-1.5 bg-gradient-to-r from-[#bfa81f] via-[#f0d060] to-[#bfa81f]" />
                            <div className="p-8 text-center">
                                {/* Animated check ring */}
                                <div className="relative inline-flex items-center justify-center mb-5">
                                    <div className="absolute w-20 h-20 rounded-full bg-[#bfa81f]/10 animate-ping" />
                                    <div className="absolute w-16 h-16 rounded-full bg-[#bfa81f]/20" />
                                    <div className="relative w-16 h-16 bg-[#bfa81f] rounded-full flex items-center justify-center shadow-lg shadow-amber-900/40">
                                        <Check size={30} strokeWidth={3} className="text-white" />
                                    </div>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">
                                    Order Confirmed!
                                </h1>
                                <p className="text-sm text-gray-400 font-light leading-relaxed max-w-[220px] mx-auto">
                                    Your floral arrangement is being prepared with love & care.
                                </p>
                                <div className="mt-6 inline-block bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Order Number</p>
                                    <p className="text-xl font-extrabold text-[#bfa81f] tracking-wide">#{orderNumber}</p>
                                </div>
                                <p className="mt-4 text-xs text-gray-600 font-medium">{dateStr}</p>
                            </div>
                            {/* Bottom gold bar */}
                            <div className="h-1 bg-gradient-to-r from-[#bfa81f] via-[#f0d060] to-[#bfa81f]" />
                        </div>

                        {/* Delivery Progress card */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg shadow-gray-100">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-5">Delivery Progress</p>
                            <div className="space-y-0">
                                {statusSteps.map((step, idx) => {
                                    const Icon = step.icon;
                                    const isActive = idx === 0;
                                    const isLast = idx === statusSteps.length - 1;
                                    return (
                                        <div key={step.label} className="relative flex items-start gap-4">
                                            {/* Vertical connector line */}
                                            {!isLast && (
                                                <div className="absolute left-[17px] top-9 w-[2px] h-[calc(100%-4px)] bg-gradient-to-b from-gray-200 to-gray-100" />
                                            )}
                                            {/* Step dot */}
                                            <div className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                                isActive
                                                    ? 'bg-[#bfa81f] shadow-md shadow-amber-200'
                                                    : 'bg-gray-100 border-2 border-gray-200'
                                            }`}>
                                                <Icon size={15} className={isActive ? 'text-white' : 'text-gray-400'} strokeWidth={2.5} />
                                            </div>
                                            {/* Label */}
                                            <div className={`pb-6 pt-1.5 ${isLast ? 'pb-0' : ''}`}>
                                                <p className={`text-xs font-bold ${isActive ? 'text-[#bfa81f]' : 'text-gray-400'}`}>
                                                    {step.label}
                                                    {isActive && <span className="ml-2 text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">Now</span>}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Contact card */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Need Help?</p>
                            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Call or WhatsApp us for delivery updates</p>
                            <a href={`tel:+${phone}`} className="text-base font-extrabold text-[#1c1917]">+{phone}</a>
                        </div>
                    </div>

                    {/* ───── RIGHT DETAILS PANEL ───── */}
                    <div className="lg:col-span-3 flex flex-col gap-6">

                        {/* Order items */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-lg shadow-gray-100">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-5">Items in Your Order</p>

                            {loading ? (
                                <div className="space-y-3">
                                    {[1,2].map(i => (
                                        <div key={i} className="flex gap-3 animate-pulse">
                                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0" />
                                            <div className="flex-1 space-y-2 pt-1">
                                                <div className="h-3 bg-gray-100 rounded w-3/4" />
                                                <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : order?.items && order.items.length > 0 ? (
                                <div className="space-y-3">
                                    {order.items.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-[#faf7f2] hover:bg-amber-50/50 transition-colors">
                                            {/* Item image / placeholder */}
                                            <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl border border-amber-100 overflow-hidden">
                                                {item.image_url
                                                    ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                    : '🌸'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-[#1c1917] leading-tight truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-extrabold text-[#1c1917] flex-shrink-0">
                                                {item.price > 0 ? `₹${(item.price * item.quantity).toLocaleString('en-IN')}` : 'Included'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-4">Order details loading…</p>
                            )}

                            {/* Total */}
                            {order?.total !== undefined && (
                                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Paid</p>
                                        <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                                            <Check size={11} strokeWidth={3} /> 100% Verified Payment
                                        </p>
                                    </div>
                                    <span className="text-3xl font-black text-[#1c1917]">
                                        ₹{order.total.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Shipping address */}
                        {order?.shippingAddress && (
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-3">Delivery Address</p>
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 bg-[#faf7f2] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin size={15} className="text-[#bfa81f]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1c1917]">{order.customer?.name}</p>
                                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                                            {[order.shippingAddress.line1, order.shippingAddress.line2, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postalCode].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email notice */}
                        {order?.customer?.email && (
                            <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-100 rounded-2xl px-5 py-4 flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#bfa81f]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bfa81f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Confirmation & updates sent to <span className="font-bold text-[#1c1917]">{order.customer.email}</span>
                                </p>
                            </div>
                        )}

                        {/* CTA buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Link
                                href={`/track-order?order=${orderNumber}`}
                                className="sm:col-span-3 flex items-center justify-center gap-2.5 bg-[#1c1917] hover:bg-black text-white py-4 px-5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all group border border-white/10"
                            >
                                <Truck size={17} className="text-[#bfa81f] group-hover:translate-x-0.5 transition-transform" />
                                <span>Track Your Order</span>
                            </Link>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sm:col-span-2 flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                            >
                                <MessageCircle size={16} />
                                Live Updates on WhatsApp
                            </a>

                            <Link
                                href="/shop"
                                className="flex items-center justify-center gap-2 bg-[#bfa81f] hover:bg-[#a89216] text-white py-3.5 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                            >
                                <ShoppingBag size={15} />
                                Shop More
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom tagline */}
                <p className="text-center text-[11px] text-gray-400 mt-10 tracking-wide">
                    Crafted with love · Delivered fresh · Premium packaging at no extra cost 🌸
                </p>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#bfa81f] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <OrderConfirmationContent />
        </Suspense>
    );
}
