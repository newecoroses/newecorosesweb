'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, ArrowLeft, ShieldCheck, Check, ChevronDown, Tag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

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
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1c1917] placeholder:text-gray-400 focus:outline-none focus:border-[#bfa81f] focus:ring-1 focus:ring-[#bfa81f]/30 bg-white transition-all';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items: cartItems, clearCart } = useCart();

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

    // Coupon state
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: string; value: number; description?: string } | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
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

    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch available coupons
    useEffect(() => {
        fetch('/api/coupon/available')
            .then(r => r.json())
            .then(d => setAvailableCoupons(d.coupons || []))
            .catch(() => {});
    }, []);

    // Load Razorpay checkout script dynamically
    useEffect(() => {
        if (paymentMethod === 'razorpay') {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        }
    }, [paymentMethod]);

    // Re-validate coupon when subtotal changes
    useEffect(() => {
        if (!appliedCoupon) return;
        fetch('/api/coupon/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: appliedCoupon.code, subtotal }),
        })
            .then(r => r.json())
            .then(d => {
                if (d.valid) {
                    setDiscountAmount(d.discountAmount);
                } else {
                    setAppliedCoupon(null);
                    setDiscountAmount(0);
                    setCouponError(d.message || 'Coupon no longer applicable.');
                    setCouponSuccess('');
                }
            })
            .catch(() => {});
    }, [subtotal, appliedCoupon]);

    const shippingCost = 0; // Free delivery in Kolkata & West Bengal
    const total = Math.max(0, subtotal - discountAmount + shippingCost);

    const handleApplyCoupon = async (codeOverride?: string) => {
        const code = (codeOverride || couponInput).trim();
        if (!code) return;
        setCouponLoading(true);
        setCouponError('');
        setCouponSuccess('');
        try {
            const res = await fetch('/api/coupon/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, subtotal }),
            });
            const data = await res.json();
            if (data.valid) {
                setAppliedCoupon(data.coupon);
                setDiscountAmount(data.discountAmount);
                setCouponSuccess(data.message);
                setCouponInput('');
                setShowCouponPanel(false);
            } else {
                setCouponError(data.message);
                setAppliedCoupon(null);
                setDiscountAmount(0);
            }
        } catch {
            setCouponError('Could not validate coupon. Please try again.');
        } finally {
            setCouponLoading(false);
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
            setError('Please fill in your contact information (name, email, and phone).');
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
            setError('Please enter a valid 10-digit mobile number for delivery coordination.');
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
                    paymentMethod,
                    discountCode: appliedCoupon?.code,
                }),
            });

            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to place order. Please try again.');
            }

            const order = data.order;

            // 2. COD / Free Order: Direct confirmation
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (paymentMethod === 'cod' || !razorpayKey) {
                if (!isBuyNow) clearCart();
                router.push(`/order-confirmation?order=${order.orderNumber}`);
                return;
            }

            // 3. Online Payment with Razorpay (if Razorpay key is present)
            if (typeof window !== 'undefined' && window.Razorpay) {
                const options = {
                    key: razorpayKey,
                    amount: total * 100,
                    currency: 'INR',
                    name: 'New Eco Roses',
                    description: `Order #${order.orderNumber}`,
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
                // Fallback direct confirmation
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
                <div className="w-9 h-9 border-3 border-[#bfa81f] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isBuyNow && cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-[#bfa81f] mb-4">
                    <ShoppingBag size={28} />
                </div>
                <h1 className="text-2xl font-bold font-serif text-[#1c1917] mb-2">Your Cart is Empty</h1>
                <p className="text-gray-500 text-sm max-w-sm mb-6">
                    Add handcrafted bouquets and luxury arrangements to proceed to checkout.
                </p>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[#bfa81f] hover:bg-[#a89216] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                    <ArrowLeft size={14} /> Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-[#1c1917]">
            {/* ── Minimal Checkout Header ─────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center justify-between">
                <Link
                    href="/shop"
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black transition-colors"
                >
                    <ArrowLeft size={15} />
                    <span className="hidden sm:inline">Continue Shopping</span>
                </Link>

                <Link href="/" className="flex flex-col items-center select-none group">
                    <span className="text-base sm:text-lg tracking-[0.18em] font-serif font-bold text-[#1c1917] group-hover:text-[#bfa81f] transition-colors">
                        NEW ECO ROSES
                    </span>
                    <span className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-sans">
                        Luxury Floral Boutique
                    </span>
                </Link>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span className="hidden sm:inline">256-Bit</span> Secure
                    </div>
                </div>
            </header>

            {/* ── Main Two-Column Checkout Layout ──────────────────────── */}
            <main className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
                    
                    {/* ════ LEFT COLUMN: Customer & Delivery Details ════ */}
                    <div className="space-y-8">
                        
                        {/* 1. Contact Information */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-[#1c1917] flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-amber-50 text-[#bfa81f] text-xs font-bold flex items-center justify-center border border-amber-200">1</span>
                                    Contact Information
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
                                        Email me with flower care tips, festive offers, and delivery notifications
                                    </span>
                                </label>
                            </div>
                        </section>

                        {/* 2. Delivery Address */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-[#1c1917] flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-amber-50 text-[#bfa81f] text-xs font-bold flex items-center justify-center border border-amber-200">2</span>
                                    Delivery Address
                                </h2>
                                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    Free Delivery in Kolkata
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
                                            placeholder="Recipient or sender"
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
                                        placeholder="House / Flat No., Building Name, Street"
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
                                        placeholder="Near Park Street, Behind Metro, etc."
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

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Phone (for delivery coordination) *</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3.5 text-xs font-semibold text-gray-500 pointer-events-none">+91</span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="98765 43210"
                                            maxLength={10}
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`${inputCls} pl-12`}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Florist Luxury Card Message Note */}
                                <div className="pt-2 border-t border-gray-100">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Complimentary Greeting Card Message (optional)
                                    </label>
                                    <textarea
                                        name="cardMessage"
                                        rows={2}
                                        placeholder="Add a heartfelt note to accompany the flowers (e.g. 'Happy Birthday! Wishing you joy and blooming smiles.')"
                                        value={formData.cardMessage}
                                        onChange={handleChange}
                                        className={`${inputCls} resize-none`}
                                    />
                                </div>

                                {/* Delivery Time Slot */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Delivery Slot</label>
                                    <div className="relative">
                                        <select
                                            name="deliveryTime"
                                            value={formData.deliveryTime}
                                            onChange={handleChange}
                                            className={`${inputCls} appearance-none pr-8`}
                                        >
                                            <option value="Standard Delivery (9 AM - 9 PM)">Standard Delivery (9 AM - 9 PM) — Free</option>
                                            <option value="Morning Delivery (8 AM - 12 PM)">Morning Delivery (8 AM - 12 PM)</option>
                                            <option value="Evening Delivery (4 PM - 9 PM)">Evening Delivery (4 PM - 9 PM)</option>
                                            <option value="Midnight Delivery (11 PM - 12 AM)">Midnight Surprise (11:00 PM - 12:00 AM)</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Payment Method */}
                        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-[#1c1917] flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-amber-50 text-[#bfa81f] text-xs font-bold flex items-center justify-center border border-amber-200">3</span>
                                    Payment Method
                                </h2>
                                <span className="text-xs text-gray-400">Encrypted & 100% Safe</span>
                            </div>

                            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                                
                                {/* Option 1: Online Payment (Razorpay / UPI / Cards) */}
                                <label
                                    className={`flex items-start gap-3.5 p-4 cursor-pointer transition-colors ${
                                        paymentMethod === 'razorpay' ? 'bg-amber-50/40' : 'bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === 'razorpay'}
                                        onChange={() => setPaymentMethod('razorpay')}
                                        className="mt-1 accent-[#bfa81f]"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <span className="text-sm font-bold text-[#1c1917]">
                                                Online Payment (UPI, Cards, NetBanking, Wallets)
                                            </span>
                                            {/* Payment Brand Badges */}
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                {/* UPI Badge */}
                                                <span className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-extrabold text-[#6c3aab]">
                                                    UPI
                                                </span>
                                                {/* Visa */}
                                                <span className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-black italic text-[#1a1f71]">
                                                    VISA
                                                </span>
                                                {/* Mastercard */}
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-white">
                                                    <svg viewBox="0 0 34 22" className="h-3 w-auto" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="12" cy="11" r="10" fill="#EB001B"/>
                                                        <circle cx="22" cy="11" r="10" fill="#F79E1B"/>
                                                        <path d="M17 3.8a10 10 0 0 1 0 14.4A10 10 0 0 1 17 3.8z" fill="#FF5F00"/>
                                                    </svg>
                                                </span>
                                                {/* RuPay */}
                                                <span className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-bold text-sky-700">
                                                    RuPay
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Instant confirmation via Google Pay, PhonePe, Paytm, Credit/Debit cards & Net Banking
                                        </p>
                                    </div>
                                </label>

                                {/* Option 2: Cash on Delivery / Pay on Delivery */}
                                <label
                                    className={`flex items-start gap-3.5 p-4 cursor-pointer transition-colors ${
                                        paymentMethod === 'cod' ? 'bg-amber-50/40' : 'bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="mt-1 accent-[#bfa81f]"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-[#1c1917]">
                                                Cash / Pay on Delivery
                                            </span>
                                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                                COD
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Pay easily with Cash or UPI QR scan when your fresh flowers arrive at your doorstep
                                        </p>
                                    </div>
                                </label>
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
                                    <span className="text-xs sm:text-sm font-medium text-gray-800">Same as delivery address</span>
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
                                    <span>Processing Order…</span>
                                </>
                            ) : (
                                <span>{paymentMethod === 'cod' ? 'Complete Order' : `Pay ₹${total.toLocaleString('en-IN')}`}</span>
                            )}
                        </button>

                        {/* Footer Links */}
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400 pt-4 border-t border-gray-100">
                            <Link href="/terms" className="hover:text-gray-600 transition-colors">Refund Policy</Link>
                            <Link href="/terms" className="hover:text-gray-600 transition-colors">Shipping Policy</Link>
                            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
                        </div>
                    </div>

                    {/* ════ RIGHT COLUMN: Order Summary & Coupons ════ */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <div className="bg-[#faf7f2] border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
                            
                            <h2 className="text-base font-bold text-[#1c1917] mb-4 pb-3 border-b border-gray-200/60 flex items-center justify-between">
                                <span>Order Summary</span>
                                <span className="text-xs text-gray-500 font-normal">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                            </h2>

                            {/* Item List */}
                            <div className="space-y-4 mb-6 max-h-[360px] overflow-y-auto pr-1">
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
                                                {item.price && item.price > 0 ? `₹${item.price} each` : 'Handcrafted flower arrangement'}
                                            </p>
                                        </div>

                                        {/* Total */}
                                        <span className="text-xs sm:text-sm font-bold text-[#1c1917] whitespace-nowrap">
                                            {item.price && item.price > 0 ? `₹${(item.price * item.quantity).toLocaleString('en-IN')}` : 'Included'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* ── Coupon / Discount Code ── */}
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
                                                <p className="text-[10px] text-amber-200/80">{couponSuccess}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-[10px] font-semibold text-gray-300 hover:text-white uppercase tracking-wider ml-2"
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
                                            placeholder="Promo / Discount Code"
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
                                            disabled={couponLoading || !couponInput.trim()}
                                            className="px-4 py-2.5 bg-[#1c1917] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {couponLoading ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                )}

                                {couponError && !appliedCoupon && (
                                    <p className="text-xs text-red-600 px-1">{couponError}</p>
                                )}

                                {/* Available Coupons Dropdown */}
                                {!appliedCoupon && availableCoupons.length > 0 && (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setShowCouponPanel(v => !v)}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-[#bfa81f] hover:text-[#a89216] transition-colors"
                                        >
                                            <Tag size={13} />
                                            <span>{showCouponPanel ? 'Hide available offers' : `View available offers (${availableCoupons.length})`}</span>
                                            <ChevronDown size={12} className={`transition-transform duration-200 ${showCouponPanel ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showCouponPanel && (
                                            <div className="mt-2.5 border border-amber-200/80 bg-amber-50/50 rounded-xl divide-y divide-amber-100 overflow-hidden">
                                                {availableCoupons.map((c: any) => {
                                                    const meetsMin = !c.minOrder || subtotal >= c.minOrder;
                                                    const needed = c.minOrder ? Math.max(0, c.minOrder - subtotal) : 0;
                                                    return (
                                                        <div key={c.code} className="p-3 flex items-center justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-mono text-xs font-bold bg-[#1c1917] text-white px-2 py-0.5 rounded">
                                                                        {c.code}
                                                                    </span>
                                                                    <span className="text-xs font-semibold text-gray-800">
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
                                                                disabled={!meetsMin || couponLoading}
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
                                        <span>Coupon Discount ({appliedCoupon.code})</span>
                                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600">
                                    <span>Flower Delivery</span>
                                    <span className="font-semibold text-emerald-700">FREE</span>
                                </div>

                                <div className="pt-3 border-t border-gray-200/80 flex items-baseline justify-between">
                                    <div>
                                        <span className="text-sm sm:text-base font-bold text-[#1c1917]">Total</span>
                                        <span className="text-[10px] text-gray-400 block">Inclusive of all taxes</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl sm:text-2xl font-extrabold text-[#1c1917]">
                                            ₹{total.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {discountAmount > 0 && (
                                    <p className="text-[11px] text-emerald-700 text-right font-semibold pt-1">
                                        🎉 Total Savings: ₹{discountAmount.toLocaleString('en-IN')}
                                    </p>
                                )}
                            </div>

                            {/* Guarantee Badge */}
                            <div className="mt-5 p-3 rounded-xl bg-white border border-gray-200 text-[11px] text-gray-600 flex items-center gap-2.5">
                                <span className="text-base">🌸</span>
                                <span>Freshness Guaranteed — Handcrafted with premium hand-selected roses.</span>
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
                    <div className="w-9 h-9 border-3 border-[#bfa81f] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}
