'use client';

import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Check, ChevronDown, Tag, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { AVAILABLE_COUPONS, calculateDiscount, Coupon } from '@/lib/coupons';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface FormData {
    email: string;
    emailNews: boolean;
    firstName: string;
    lastName: string;
    phone: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    billingSame: boolean;
    cardMessage: string;
    deliveryTime: string;
}

const INDIAN_STATES = [
    'West Bengal',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'Chandigarh',
    'Puducherry',
];

const inputCls =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1c1917] placeholder:text-gray-400 focus:outline-none focus:border-[#bfa81f] focus:ring-1 focus:ring-[#bfa81f]/40 bg-white transition-all shadow-2xs';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items: cartItems, clearCart } = useCart();
    const razorpayLoadedRef = useRef(false);

    // Buy Now mode: item passed via URL params
    const isBuyNow = searchParams.get('buyNow') === 'true';
    const buyNowItem = useMemo(() => {
        if (!isBuyNow) return null;
        const price = Number(searchParams.get('price') || 0);
        return {
            id: searchParams.get('productId') || 'buynow-' + Date.now(),
            name: searchParams.get('name') || 'Fresh Flower Arrangement',
            slug: searchParams.get('slug') || '',
            price: price > 0 ? price : 0,
            quantity: Number(searchParams.get('quantity') || 1),
            image_url: searchParams.get('image') || '',
        };
    }, [isBuyNow, searchParams]);

    // Active items to checkout
    const items = isBuyNow && buyNowItem ? [buyNowItem] : cartItems;
    const subtotal = items.reduce((sum, i) => sum + (Number(i.price) || 0) * i.quantity, 0);

    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Coupon state (instant client-side evaluation)
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [showCouponPanel, setShowCouponPanel] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        email: '',
        emailNews: true,
        firstName: '',
        lastName: '',
        phone: '',
        line1: '',
        line2: '',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '',
        country: 'India',
        billingSame: true,
        cardMessage: '',
        deliveryTime: 'Standard Delivery (9 AM - 9 PM)',
    });

    useEffect(() => {
        setMounted(true);

        // Preload Razorpay script once in background
        if (!razorpayLoadedRef.current && typeof window !== 'undefined' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => { razorpayLoadedRef.current = true; };
            document.body.appendChild(script);
        }
    }, []);

    // Instant re-validation when subtotal changes
    useEffect(() => {
        if (!appliedCoupon) return;
        const result = calculateDiscount(appliedCoupon, subtotal);
        if (result.valid) {
            setDiscountAmount(result.discountAmount);
            setCouponSuccess(result.message);
        } else {
            setAppliedCoupon(null);
            setDiscountAmount(0);
            setCouponError(result.message);
            setCouponSuccess('');
        }
    }, [subtotal, appliedCoupon]);

    const shippingCost = 0; // Free delivery in Kolkata & West Bengal
    const total = Math.max(0, subtotal - discountAmount + shippingCost);

    const handleApplyCoupon = (codeOverride?: string) => {
        const code = (codeOverride || couponInput).trim().toUpperCase();
        if (!code) return;
        setCouponError('');
        setCouponSuccess('');

        const found = AVAILABLE_COUPONS.find(c => c.code === code);
        if (!found) {
            setCouponError('Invalid coupon code. Please check and try again.');
            return;
        }

        const result = calculateDiscount(found, subtotal);
        if (result.valid) {
            setAppliedCoupon(found);
            setDiscountAmount(result.discountAmount);
            setCouponSuccess(result.message);
            setCouponInput('');
            setShowCouponPanel(false);
        } else {
            setCouponError(result.message);
            setAppliedCoupon(null);
            setDiscountAmount(0);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponSuccess('');
        setCouponError('');
        setCouponInput('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? target.checked : value,
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.email.trim() || !formData.firstName.trim() || !formData.phone.trim()) {
            setError('Please complete all contact details (Name, Email, and Mobile Number).');
            return false;
        }
        if (!formData.line1.trim() || !formData.city.trim() || !formData.state.trim() || !formData.postalCode.trim()) {
            setError('Please complete the delivery address fields.');
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            setError('Please enter a valid 10-digit mobile number for flower delivery coordination.');
            return false;
        }
        return true;
    };

    const handlePayment = async () => {
        if (!validateForm()) return;
        setError('');
        setIsLoading(true);

        try {
            // 1. Create order on backend
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        price: item.price,
                        quantity: item.quantity,
                        image_url: item.image_url,
                    })),
                    customer: {
                        name: `${formData.firstName} ${formData.lastName}`.trim(),
                        email: formData.email,
                        phone: formData.phone,
                    },
                    shippingAddress: {
                        line1: formData.line1,
                        line2: formData.line2,
                        city: formData.city,
                        state: formData.state,
                        postalCode: formData.postalCode,
                        country: formData.country,
                    },
                    specialNote: [
                        formData.cardMessage ? `Card Message: ${formData.cardMessage}` : '',
                        formData.deliveryTime ? `Preferred Slot: ${formData.deliveryTime}` : '',
                    ].filter(Boolean).join(' | '),
                    paymentMethod: 'online',
                    discountCode: appliedCoupon?.code,
                }),
            });

            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to place order. Please try again.');
            }

            const order = data.order;
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

            // 2. Online Payment with Razorpay (if Razorpay key is configured)
            if (razorpayKey && typeof window !== 'undefined' && window.Razorpay) {
                const options = {
                    key: razorpayKey,
                    amount: total * 100,
                    currency: 'INR',
                    name: 'New Eco Roses',
                    description: `Order #${order.orderNumber} - Luxury Flowers`,
                    image: '/favicon_io/android-chrome-192x192.png',
                    handler: async (response: any) => {
                        try {
                            await fetch('/api/payment/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    orderId: order.id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                }),
                            });
                        } catch {}
                        if (!isBuyNow) clearCart();
                        router.push(`/order-confirmation?order=${order.orderNumber}`);
                    },
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`.trim(),
                        email: formData.email,
                        contact: formData.phone,
                    },
                    theme: {
                        color: '#bfa81f',
                    },
                    modal: {
                        ondismiss: () => {
                            setIsLoading(false);
                        },
                    },
                };
                const rp = new window.Razorpay(options);
                rp.open();
            } else {
                // Smooth confirmed redirect
                if (!isBuyNow) clearCart();
                router.push(`/order-confirmation?order=${order.orderNumber}`);
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#bfa81f] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isBuyNow && cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-[#bfa81f] mb-4 border border-amber-200">
                    <ShoppingBag size={28} />
                </div>
                <h1 className="text-2xl font-bold font-serif text-[#1c1917] mb-2">Your Cart is Empty</h1>
                <p className="text-gray-500 text-sm max-w-sm mb-6 font-light">
                    Explore our hand-curated roses and luxury floral bouquets to proceed.
                </p>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[#bfa81f] hover:bg-[#a89216] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md"
                >
                    <ArrowLeft size={14} /> Browse Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-[#1c1917]">
            {/* ── Premium Checkout Header ─────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center justify-between">
                <Link
                    href="/shop"
                    className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#bfa81f] transition-colors"
                >
                    <ArrowLeft size={15} />
                    <span className="hidden sm:inline">Continue Shopping</span>
                </Link>

                <Link href="/" className="flex flex-col items-center select-none group">
                    <span className="text-base sm:text-lg tracking-[0.18em] font-serif font-bold text-[#1c1917] group-hover:text-[#bfa81f] transition-colors">
                        👑 NEW ECO ROSES
                    </span>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-gray-400 font-sans">
                        Luxury Floral Boutique • Kolkata
                    </span>
                </Link>

                {/* 256-Bit SSL Encrypted Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                    <svg className="w-3.5 h-3.5 text-emerald-600 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">256-Bit</span> Secure
                </div>
            </header>

            {/* ── Main Two-Column Checkout Layout ──────────────────────── */}
            <main className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-14 items-start">
                    
                    {/* ════ LEFT COLUMN: Customer & Delivery Details ════ */}
                    <div className="space-y-7">
                        
                        {/* 1. Contact Information */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-[#1c1917] flex items-center gap-2.5">
                                    <span className="w-6 h-6 rounded-full bg-amber-50 text-[#bfa81f] text-xs font-bold flex items-center justify-center border border-amber-200">1</span>
                                    <span>Contact Information</span>
                                    <span>✉️</span>
                                </h2>
                                <span className="text-xs text-gray-400">Order updates will be sent here</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="yourname@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={inputCls}
                                        required
                                    />
                                </div>
                                <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                                    <input
                                        type="checkbox"
                                        name="emailNews"
                                        checked={formData.emailNews}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded accent-[#bfa81f]"
                                    />
                                    <span className="text-xs text-gray-600">
                                        Email me with floral care guides, festive releases, and delivery confirmations
                                    </span>
                                </label>
                            </div>
                        </section>

                        {/* 2. Delivery Address */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-[#1c1917] flex items-center gap-2.5">
                                    <span className="w-6 h-6 rounded-full bg-amber-50 text-[#bfa81f] text-xs font-bold flex items-center justify-center border border-amber-200">2</span>
                                    <span>Delivery Destination</span>
                                    <span>📍</span>
                                </h2>
                                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                    <span>🚚</span> Free Express Delivery
                                </span>
                            </div>

                            <div className="space-y-3.5">
                                {/* Country */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Country / Region</label>
                                    <div className="relative">
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className={`${inputCls} appearance-none pr-10`}
                                        >
                                            <option value="India">🇮🇳 India</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* First & Last Name */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="Recipient or Sender"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={inputCls}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                {/* Address Line 1 */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address *</label>
                                    <input
                                        type="text"
                                        name="line1"
                                        placeholder="Flat / House No., Building Name, Street / Road"
                                        value={formData.line1}
                                        onChange={handleChange}
                                        className={inputCls}
                                        required
                                    />
                                </div>

                                {/* Address Line 2 */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Apartment, Floor, Landmark (optional)</label>
                                    <input
                                        type="text"
                                        name="line2"
                                        placeholder="Near Metro, Opposite Landmark, etc."
                                        value={formData.line2}
                                        onChange={handleChange}
                                        className={inputCls}
                                    />
                                </div>

                                {/* City, State, PIN */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Kolkata"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={inputCls}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                                        <div className="relative">
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className={`${inputCls} appearance-none pr-8`}
                                            >
                                                {INDIAN_STATES.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">PIN Code *</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            placeholder="700001"
                                            maxLength={6}
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className={inputCls}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Mobile Phone (Clean placeholder & autofill prevented) */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number (for delivery rider call) *</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3.5 text-xs font-bold text-gray-500 pointer-events-none">🇮🇳 +91</span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Enter 10-digit mobile number"
                                            maxLength={10}
                                            value={formData.phone}
                                            onChange={handleChange}
                                            autoComplete="off"
                                            data-lpignore="true"
                                            data-form-type="other"
                                            className={`${inputCls} pl-16`}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Complimentary Greeting Card Message Note */}
                                <div className="pt-2 border-t border-gray-100">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                                        <span>💌</span>
                                        <span>Complimentary Greeting Card Message (optional)</span>
                                    </label>
                                    <textarea
                                        name="cardMessage"
                                        rows={2}
                                        placeholder="Add your personalized message for the recipient (e.g. 'Happy Birthday! Wishing you warmth, joy and blooming smiles.')"
                                        value={formData.cardMessage}
                                        onChange={handleChange}
                                        className={`${inputCls} resize-none`}
                                    />
                                </div>

                                {/* Delivery Time Slot */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                                        <span>⏰</span>
                                        <span>Preferred Delivery Window</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="deliveryTime"
                                            value={formData.deliveryTime}
                                            onChange={handleChange}
                                            className={`${inputCls} appearance-none pr-8`}
                                        >
                                            <option value="Standard Delivery (9 AM - 9 PM)">Standard Delivery (9 AM - 9 PM) — Free</option>
                                            <option value="Morning Delivery (8 AM - 12 PM)">Morning Fresh Delivery (8 AM - 12 PM)</option>
                                            <option value="Evening Delivery (4 PM - 9 PM)">Evening Celebrations (4 PM - 9 PM)</option>
                                            <option value="Midnight Surprise (11 PM - 12 AM)">Midnight Surprise (11:00 PM - 12:00 AM)</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Payment Method — 100% SECURE PRE-PAID ONLINE (No COD) */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-[#1c1917] flex items-center gap-2.5">
                                    <span className="w-6 h-6 rounded-full bg-amber-50 text-[#bfa81f] text-xs font-bold flex items-center justify-center border border-amber-200">3</span>
                                    <span>Secure Payment</span>
                                    <span>💳</span>
                                </h2>
                                <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                                    <Sparkles size={11} className="text-[#bfa81f]" /> Instant Confirmation
                                </span>
                            </div>

                            {/* Luxury Highlighted Online Payment Box */}
                            <div className="border-2 border-[#bfa81f]/40 bg-gradient-to-b from-amber-50/20 to-white rounded-2xl p-5 shadow-xs">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-[#bfa81f] text-white flex items-center justify-center text-[10px]">✓</span>
                                            <h3 className="text-sm font-bold text-[#1c1917]">
                                                Online Payment (UPI, Cards, NetBanking, Wallets)
                                            </h3>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 pl-6">
                                            Fast, contactless & 100% verified order confirmation
                                        </p>
                                    </div>

                                    {/* Verified Badges */}
                                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                        {/* UPI Official Badge */}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-gray-200 bg-white shadow-2xs">
                                            <span className="text-[10px] font-black tracking-wide text-[#6c3aab]">UPI</span>
                                        </span>
                                        {/* Visa */}
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md border border-gray-200 bg-white shadow-2xs">
                                            <span className="text-[10px] font-black italic tracking-wide text-[#1a1f71]">VISA</span>
                                        </span>
                                        {/* Mastercard */}
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md border border-gray-200 bg-white shadow-2xs">
                                            <svg viewBox="0 0 34 22" className="h-3.5 w-auto" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="11" r="10" fill="#EB001B"/>
                                                <circle cx="22" cy="11" r="10" fill="#F79E1B"/>
                                                <path d="M17 3.8a10 10 0 0 1 0 14.4A10 10 0 0 1 17 3.8z" fill="#FF5F00"/>
                                            </svg>
                                        </span>
                                        {/* RuPay */}
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md border border-gray-200 bg-white shadow-2xs">
                                            <span className="text-[10px] font-bold text-sky-700">RuPay</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-amber-100 flex items-center gap-2 text-xs text-gray-600 bg-white/70 p-2.5 rounded-xl border border-gray-100">
                                    <svg className="w-4 h-4 text-[#bfa81f] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>
                                        Supports Google Pay, PhonePe, Paytm, all Indian debit/credit cards, and NetBanking.
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* 4. Billing Address */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
                            <h2 className="text-base font-bold text-[#1c1917] mb-3">Billing Address</h2>
                            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                                <label className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${formData.billingSame ? 'bg-amber-50/30' : 'bg-white'}`}>
                                    <input
                                        type="radio"
                                        name="billingSame"
                                        checked={formData.billingSame}
                                        onChange={() => setFormData(p => ({ ...p, billingSame: true }))}
                                        className="accent-[#bfa81f]"
                                    />
                                    <span className="text-xs sm:text-sm font-medium text-gray-800">Same as delivery destination</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${!formData.billingSame ? 'bg-amber-50/30' : 'bg-white'}`}>
                                    <input
                                        type="radio"
                                        name="billingSame"
                                        checked={!formData.billingSame}
                                        onChange={() => setFormData(p => ({ ...p, billingSame: false }))}
                                        className="accent-[#bfa81f]"
                                    />
                                    <span className="text-xs sm:text-sm font-medium text-gray-800">Use a different billing address</span>
                                </label>
                            </div>
                        </section>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Pay Now Button (Brand Gold Theme: #bfa81f) */}
                        <button
                            type="button"
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="w-full bg-[#bfa81f] hover:bg-[#a89216] active:scale-[0.99] text-white py-4 px-6 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Securing Your Flowers…</span>
                                </>
                            ) : (
                                <span>Pay ₹{total.toLocaleString('en-IN')} & Confirm Order 🌸</span>
                            )}
                        </button>

                        {/* Footer Links */}
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400 pt-3 border-t border-gray-100">
                            <Link href="/terms" className="hover:text-gray-600 transition-colors">Refund Policy</Link>
                            <Link href="/terms" className="hover:text-gray-600 transition-colors">Shipping Policy</Link>
                            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
                        </div>
                    </div>

                    {/* ════ RIGHT COLUMN: Order Summary & Coupons ════ */}
                    <div className="lg:sticky lg:top-20 lg:self-start">
                        <div className="bg-[#faf7f2] border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
                            
                            <h2 className="text-base font-bold text-[#1c1917] mb-4 pb-3 border-b border-gray-200/60 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <span>Bouquet Summary</span>
                                    <span>💐</span>
                                </span>
                                <span className="text-xs text-gray-500 font-normal">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                            </h2>

                            {/* Item List */}
                            <div className="space-y-4 mb-5 max-h-[360px] overflow-y-auto pr-1">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3.5">
                                        {/* Image with Qty Badge */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden relative border border-gray-200">
                                                {item.image_url ? (
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <ShoppingBag size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#bfa81f] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-2xs">
                                                {item.quantity}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-[#1c1917] line-clamp-1">
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                {item.price && item.price > 0 ? `₹${item.price} each` : 'Hand-curated luxury flower arrangement'}
                                            </p>
                                        </div>

                                        {/* Total */}
                                        <span className="text-xs sm:text-sm font-bold text-[#1c1917] whitespace-nowrap">
                                            {item.price && item.price > 0 ? `₹${(item.price * item.quantity).toLocaleString('en-IN')}` : 'Included'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* ── Coupon / Discount Code (Instant Client Calculation) ── */}
                            <div className="pt-4 border-t border-gray-200/60 mb-5 space-y-3">
                                
                                {/* Applied Coupon Pill */}
                                {appliedCoupon && (
                                    <div className="flex items-center justify-between bg-[#1c1917] text-white rounded-xl px-3.5 py-2.5 shadow-2xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-[#bfa81f] text-white flex items-center justify-center flex-shrink-0">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold tracking-wider">{appliedCoupon.code}</p>
                                                <p className="text-[10px] text-amber-200/90">{couponSuccess}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-[10px] font-semibold text-gray-300 hover:text-white uppercase tracking-wider ml-2 cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                {/* Coupon Input */}
                                {!appliedCoupon && (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Promo Code (e.g. WELCOME10)"
                                            value={couponInput}
                                            onChange={e => {
                                                setCouponInput(e.target.value.toUpperCase());
                                                setCouponError('');
                                            }}
                                            onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                            className="flex-1 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-[#1c1917] bg-white focus:outline-none focus:border-[#bfa81f]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleApplyCoupon()}
                                            disabled={!couponInput.trim()}
                                            className="px-4 py-2.5 bg-[#1c1917] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}

                                {couponError && !appliedCoupon && (
                                    <p className="text-xs text-red-600 px-1 font-medium">{couponError}</p>
                                )}

                                {/* Available Coupons Toggle */}
                                {!appliedCoupon && (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setShowCouponPanel(v => !v)}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-[#bfa81f] hover:text-[#a89216] transition-colors cursor-pointer"
                                        >
                                            <Tag size={13} />
                                            <span>{showCouponPanel ? 'Hide available offers' : `View available offers (${AVAILABLE_COUPONS.length})`}</span>
                                            <ChevronDown size={12} className={`transition-transform duration-200 ${showCouponPanel ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showCouponPanel && (
                                            <div className="mt-2.5 border border-amber-200/80 bg-amber-50/50 rounded-xl divide-y divide-amber-100 overflow-hidden">
                                                {AVAILABLE_COUPONS.map((c) => {
                                                    const meetsMin = !c.minOrder || subtotal >= c.minOrder;
                                                    const needed = c.minOrder ? Math.max(0, c.minOrder - subtotal) : 0;
                                                    return (
                                                        <div key={c.code} className="p-3 flex items-center justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-mono text-xs font-bold bg-[#1c1917] text-white px-2 py-0.5 rounded">
                                                                        {c.code}
                                                                    </span>
                                                                    <span className="text-xs font-bold text-gray-800">
                                                                        {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[11px] text-gray-600 mt-1">{c.description}</p>
                                                                {!meetsMin && needed > 0 && (
                                                                    <p className="text-[10px] text-amber-700 font-medium mt-0.5">
                                                                        Add ₹{needed.toLocaleString('en-IN')} more to unlock
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleApplyCoupon(c.code)}
                                                                disabled={!meetsMin}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                                    meetsMin
                                                                        ? 'bg-[#bfa81f] hover:bg-[#a89216] text-white cursor-pointer'
                                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                                }`}
                                                            >
                                                                {meetsMin ? 'Apply' : 'Locked'}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ── Financial Breakdown ── */}
                            <div className="space-y-2.5 pt-4 border-t border-gray-200/60 text-xs sm:text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-[#1c1917]">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>

                                {discountAmount > 0 && appliedCoupon && (
                                    <div className="flex justify-between text-emerald-700 font-medium">
                                        <span>Coupon Savings ({appliedCoupon.code})</span>
                                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600">
                                    <span>Flower Delivery</span>
                                    <span className="font-bold text-emerald-700">FREE</span>
                                </div>

                                <div className="pt-3 border-t border-gray-200/80 flex items-baseline justify-between">
                                    <div>
                                        <span className="text-sm sm:text-base font-bold text-[#1c1917]">Total Payable</span>
                                        <span className="text-[10px] text-gray-400 block">Inclusive of all taxes</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl sm:text-2xl font-extrabold text-[#1c1917]">
                                            ₹{total.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {discountAmount > 0 && (
                                    <p className="text-[11px] text-emerald-700 text-right font-bold pt-1">
                                        🎉 Total Savings: ₹{discountAmount.toLocaleString('en-IN')}
                                    </p>
                                )}
                            </div>

                            {/* Luxury Flower Guarantee Box */}
                            <div className="mt-5 p-3.5 rounded-xl bg-white border border-gray-200/80 text-[11px] text-gray-600 flex items-center gap-2.5 shadow-2xs">
                                <span className="text-lg">🌹</span>
                                <div>
                                    <p className="font-bold text-[#1c1917]">Farm-Fresh Guarantee</p>
                                    <p className="text-gray-500 text-[10.5px]">Directly sourced luxury blooms crafted specifically for your delivery date.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-[#bfa81f] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}
