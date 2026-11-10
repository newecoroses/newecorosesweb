'use client';

import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShoppingBag, ArrowLeft, Tag, ChevronDown, Check } from 'lucide-react';
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
    deliveryTime: string;
    messageCard: string;
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
    'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#bfa81f] focus:ring-1 focus:ring-[#bfa81f] bg-white transition-colors';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items: cartItems, clearCart, removeItem } = useCart();
    const razorpayLoadedRef = useRef(false);

    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Buy Now mode support
    const isBuyNow = searchParams.get('buyNow') === 'true';
    const [buyNowSessionItems, setBuyNowSessionItems] = useState<any[] | null>(null);

    useEffect(() => {
        if (isBuyNow) {
            try {
                const stored = sessionStorage.getItem('ner_buy_now');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setBuyNowSessionItems(parsed);
                    }
                }
            } catch {}
        }
    }, [isBuyNow]);

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

    const items = useMemo(() => {
        if (!isBuyNow) return cartItems;
        if (buyNowSessionItems && buyNowSessionItems.length > 0) return buyNowSessionItems;
        if (buyNowItem) return [buyNowItem];
        return [];
    }, [isBuyNow, cartItems, buyNowSessionItems, buyNowItem]);

    // Coupon state
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [showCouponPanel, setShowCouponPanel] = useState(false);

    // Form data
    const [formData, setFormData] = useState<FormData>({
        email: '',
        emailNews: false,
        firstName: '',
        lastName: '',
        phone: '',
        line1: '',
        line2: '',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700040',
        country: 'India',
        billingSame: true,
        deliveryTime: 'Standard Delivery (9 AM - 9 PM)',
        messageCard: '',
    });

    useEffect(() => {
        setMounted(true);
        if (!razorpayLoadedRef.current && typeof window !== 'undefined' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => { razorpayLoadedRef.current = true; };
            document.body.appendChild(script);
        }
    }, []);

    // Subtotal and Totals
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
    const shippingCost = 0; // Free delivery
    const total = Math.max(0, subtotal - discountAmount + shippingCost);

    // Re-validate coupon when subtotal changes
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

    const handleApplyCoupon = (codeOverride?: string) => {
        const code = (codeOverride || couponInput).trim().toUpperCase();
        if (!code) return;
        setCouponError('');
        setCouponSuccess('');

        const found = AVAILABLE_COUPONS.find(c => c.code === code);
        if (!found) {
            setCouponError('Invalid coupon code. Please try again.');
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
            setError('Please enter contact information (Name, email, and mobile phone).');
            return false;
        }
        if (!formData.line1.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
            setError('Please complete the delivery address fields.');
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            setError('Please enter a valid email address for your order confirmation.');
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
            const orderResponse = await fetch('/api/orders', {
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
                        country: formData.country || 'India',
                    },
                    specialNote: [
                        formData.deliveryTime ? `Slot: ${formData.deliveryTime}` : '',
                        formData.messageCard ? `Message Card: "${formData.messageCard}"` : '',
                    ].filter(Boolean).join(' | '),
                    paymentMethod: 'online',
                    discountCode: appliedCoupon?.code,
                }),
            });

            const orderData = await orderResponse.json();
            if (!orderData.success) {
                throw new Error(orderData.error || 'Failed to place order');
            }

            const order = orderData.order;
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

            if (razorpayKey && typeof window !== 'undefined' && window.Razorpay) {
                const options = {
                    key: razorpayKey,
                    amount: total * 100,
                    currency: 'INR',
                    name: 'New Eco Roses',
                    description: `Order #${order.orderNumber}`,
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
                        try { sessionStorage.removeItem('ner_buy_now'); } catch {}
                        router.push(`/order-confirmation?order=${order.orderNumber}`);
                    },
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`.trim(),
                        email: formData.email,
                        contact: formData.phone,
                    },
                    theme: { color: '#bfa81f' },
                    modal: {
                        ondismiss: () => { setIsLoading(false); },
                    },
                };
                const rp = new window.Razorpay(options);
                rp.open();
            } else {
                if (!isBuyNow) clearCart();
                try { sessionStorage.removeItem('ner_buy_now'); } catch {}
                router.push(`/order-confirmation?order=${order.orderNumber}`);
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    if (!isBuyNow && items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-[#bfa81f] mb-4 border border-amber-200 shadow-xs">
                    <ShoppingBag size={28} />
                </div>
                <h1 className="text-2xl font-bold font-serif text-[#1c1917] mb-2">Your Cart is Empty</h1>
                <p className="text-gray-500 text-sm max-w-sm mb-6 font-light">
                    Explore fresh flower bouquets and celebratory hampers to continue.
                </p>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[#bfa81f] hover:bg-[#a89216] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                    <ArrowLeft size={14} /> Browse Shop
                </Link>
            </div>
        );
    }

    const formatPrice = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

    return (
        <>
            {/* ── Minimal checkout header (exact DripNGrid style) ─────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between">
                <div className="w-8" /> {/* spacer */}
                <Link href="/" className="flex items-center gap-2 select-none group">
                    <img
                        src="/favicon_io/android-chrome-512x512.png"
                        alt="New Eco Roses"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-lg object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/favicon_io/android-chrome-192x192.png'; }}
                    />
                    <span className="text-sm tracking-[0.14em] uppercase font-serif font-black text-[#1c1917]">New Eco Roses</span>
                </Link>
                <Link href="/shop" className="text-gray-500 hover:text-[#bfa81f] transition-colors" title="Cart / Shop">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                    </svg>
                </Link>
            </header>

            {/* ── Main content (exact DripNGrid 2-column layout) ────────────────────────── */}
            <div className="min-h-screen bg-white pb-16">
                <div className="max-w-[1080px] mx-auto px-4 md:px-8 pt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">

                        {/* ── LEFT: Form ─────────────────────────────────────── */}
                        <div className="space-y-10">

                            {/* Contact Section */}
                            <section>
                                <h2 className="text-base font-semibold text-black mb-4">Contact</h2>
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email address (for confirmation receipt)"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={inputCls}
                                        required
                                    />
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="emailNews"
                                            checked={formData.emailNews}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-[#bfa81f]"
                                        />
                                        <span className="text-sm text-gray-600">Email me with seasonal floral collections and exclusive offers</span>
                                    </label>
                                </div>
                            </section>

                            {/* Delivery Section */}
                            <section>
                                <h2 className="text-base font-semibold text-black mb-4">Delivery</h2>
                                <div className="space-y-3">
                                    {/* Country */}
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={inputCls}
                                    >
                                        <option value="India">India</option>
                                    </select>

                                    {/* First + Last name */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={inputCls}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={inputCls}
                                        />
                                    </div>

                                    {/* Address line 1 */}
                                    <input
                                        type="text"
                                        name="line1"
                                        placeholder="Address (House/Flat No., Street, Area)"
                                        value={formData.line1}
                                        onChange={handleChange}
                                        className={inputCls}
                                        required
                                    />

                                    {/* Address line 2 */}
                                    <input
                                        type="text"
                                        name="line2"
                                        placeholder="Apartment, suite, landmark (optional)"
                                        value={formData.line2}
                                        onChange={handleChange}
                                        className={inputCls}
                                    />

                                    {/* City + State + PIN code */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={inputCls}
                                            required
                                        />
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className={inputCls}
                                        >
                                            {INDIAN_STATES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            placeholder="PIN code"
                                            maxLength={6}
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className={`${inputCls} [appearance:textfield]`}
                                            required
                                        />
                                    </div>

                                    {/* Phone (clean, no suggestions / autofill) */}
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3.5 text-xs font-bold text-gray-500 pointer-events-none">+91</span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Enter 10-digit mobile number"
                                            maxLength={10}
                                            value={formData.phone}
                                            onChange={handleChange}
                                            autoComplete="off"
                                            data-lpignore="true"
                                            className={`${inputCls} pl-12`}
                                            required
                                        />
                                    </div>

                                    {/* Floral Gift Message Card */}
                                    <div className="pt-1">
                                        <input
                                            type="text"
                                            name="messageCard"
                                            placeholder="Gift message card note (e.g. Happy Birthday! Love from Rahul)"
                                            value={formData.messageCard}
                                            onChange={handleChange}
                                            className={inputCls}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Shipping method Section */}
                            <section>
                                <h2 className="text-base font-semibold text-black mb-4">Shipping method</h2>
                                <div className="border border-gray-200 rounded-lg p-3.5 text-sm bg-gray-50 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-black">Handcrafted Fresh Delivery</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Delivered fresh in our signature luxury packaging</p>
                                    </div>
                                    <span className="font-bold text-[#bfa81f] uppercase tracking-wider text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                        Free
                                    </span>
                                </div>

                                {/* Delivery Time Slot Selector */}
                                <div className="mt-3">
                                    <select
                                        name="deliveryTime"
                                        value={formData.deliveryTime}
                                        onChange={handleChange}
                                        className={inputCls}
                                    >
                                        <option value="Standard Delivery (9 AM - 9 PM)">Standard Delivery (9 AM - 9 PM) — Free</option>
                                        <option value="Morning Fresh Delivery (8 AM - 12 PM)">Morning Fresh Delivery (8 AM - 12 PM)</option>
                                        <option value="Evening Celebrations (4 PM - 9 PM)">Evening Celebrations (4 PM - 9 PM)</option>
                                        <option value="Midnight Surprise (11 PM - 12 AM)">Midnight Surprise (11:00 PM - 12:00 AM)</option>
                                    </select>
                                </div>
                            </section>

                            {/* Payment Section (Online Only - No COD) */}
                            <section>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-base font-semibold text-black">Payment</h2>
                                    <Lock size={14} className="text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-400 mb-4">All transactions are secure and encrypted.</p>

                                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                                    {/* Razorpay / Online Payment Option */}
                                    <label className="flex items-start gap-3 px-4 py-4 bg-amber-50/40 border border-[#bfa81f]/30 rounded-xl cursor-pointer">
                                        <input
                                            type="radio"
                                            name="pm"
                                            checked={true}
                                            readOnly
                                            className="mt-1 accent-[#bfa81f]"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-sm font-bold text-black">Online Payment</span>
                                                {/* Payment brand badges */}
                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                    {/* Visa */}
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-white">
                                                        <svg viewBox="0 0 38 12" className="h-3.5 w-auto" xmlns="http://www.w3.org/2000/svg">
                                                            <text x="1" y="10" fontFamily="Arial Black,sans-serif" fontSize="10" fontWeight="900" fontStyle="italic" fill="#1a1f71" letterSpacing="0.5">VISA</text>
                                                        </svg>
                                                    </span>
                                                    {/* Mastercard */}
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-white">
                                                        <svg viewBox="0 0 34 22" className="h-3.5 w-auto" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="12" cy="11" r="10" fill="#EB001B"/>
                                                            <circle cx="22" cy="11" r="10" fill="#F79E1B"/>
                                                            <path d="M17 3.8a10 10 0 0 1 0 14.4A10 10 0 0 1 17 3.8z" fill="#FF5F00"/>
                                                        </svg>
                                                    </span>
                                                    {/* UPI */}
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-white">
                                                        <svg viewBox="0 0 32 12" className="h-3.5 w-auto" xmlns="http://www.w3.org/2000/svg">
                                                            <text x="1" y="10" fontFamily="Arial,sans-serif" fontSize="9.5" fontWeight="800" fill="#6c3aab" letterSpacing="0.5">UPI</text>
                                                        </svg>
                                                    </span>
                                                    {/* RuPay */}
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-white">
                                                        <svg viewBox="0 0 45 12" className="h-3.5 w-auto" xmlns="http://www.w3.org/2000/svg">
                                                            <text x="1" y="10" fontFamily="Arial,sans-serif" fontSize="9.5" fontWeight="900" fontStyle="italic" fill="#097939" letterSpacing="0.5">RuPay</text>
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                UPI (GPay, PhonePe, Paytm) · Credit/Debit Cards · Net Banking · Wallets
                                            </p>
                                            <div className="mt-3 flex items-center gap-1.5 bg-white border border-gray-100 rounded-lg px-3 py-2.5">
                                                <Lock size={13} className="text-[#bfa81f] flex-shrink-0" />
                                                <p className="text-xs text-gray-600">
                                                    You will be securely connected via Razorpay 256-bit SSL encryption to complete payment.
                                                </p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Billing Address Section */}
                            <section>
                                <h2 className="text-base font-semibold text-black mb-4">Billing address</h2>
                                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                                    <label className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors ${formData.billingSame ? 'bg-amber-50/40' : 'bg-white hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="billing"
                                            checked={formData.billingSame}
                                            onChange={() => setFormData(p => ({ ...p, billingSame: true }))}
                                            className="accent-[#bfa81f]"
                                        />
                                        <span className="text-sm font-medium text-black">Same as shipping address</span>
                                    </label>
                                    <label className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors ${!formData.billingSame ? 'bg-amber-50/40' : 'bg-white hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="billing"
                                            checked={!formData.billingSame}
                                            onChange={() => setFormData(p => ({ ...p, billingSame: false }))}
                                            className="accent-[#bfa81f]"
                                        />
                                        <span className="text-sm font-medium text-black">Use a different billing address</span>
                                    </label>
                                </div>
                            </section>

                            {/* Error Banner */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* ── THE PRIMARY PAY NOW BUTTON (Gold #bfa81f) ── */}
                            <button
                                type="button"
                                onClick={handlePayment}
                                disabled={isLoading}
                                className="w-full bg-[#bfa81f] hover:bg-[#a89216] active:scale-[0.99] text-white py-4 px-6 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Securing Order…</span>
                                    </div>
                                ) : (
                                    <span>Pay {formatPrice(total)} & Confirm Order</span>
                                )}
                            </button>

                            {/* Footer links */}
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-gray-400 pb-4">
                                {[
                                    ['Refund policy', '/terms'],
                                    ['Shipping policy', '/terms'],
                                    ['Privacy policy', '/privacy'],
                                    ['Terms of service', '/terms'],
                                ].map(([label, href]) => (
                                    <Link key={label} href={href} className="hover:text-gray-700 transition-colors">
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* ── RIGHT: Order Summary (exact DripNGrid layout) ─────────────────────────────── */}
                        <div className="lg:sticky lg:top-[72px] lg:self-start">
                            <div className="border-l border-gray-100 lg:pl-8">

                                {/* Items list */}
                                <div className="space-y-4 mb-6">
                                    {items.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 group/item">
                                            {/* Image with quantity bubble + remove button on hover */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-16 h-20 bg-[#f5f5f3] rounded-lg overflow-hidden border border-gray-100">
                                                    <img
                                                        src={item.image_url || '/images/placeholder.webp'}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp';
                                                        }}
                                                    />
                                                </div>
                                                {/* Quantity bubble */}
                                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#bfa81f] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-xs">
                                                    {item.quantity}
                                                </span>
                                                {/* Remove button — only for cart-based checkout */}
                                                {!isBuyNow && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-xs opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
                                                        title="Remove item"
                                                        aria-label={`Remove ${item.name}`}
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-black leading-tight line-clamp-2">
                                                    {item.name}
                                                </p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">
                                                    Fresh Handpicked Bloom
                                                </p>
                                            </div>

                                            <span className="text-sm font-bold text-black flex-shrink-0">
                                                {item.price && item.price > 0
                                                    ? formatPrice(item.price * item.quantity)
                                                    : 'Included'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon / Discount Code Box */}
                                <div className="mb-6 space-y-3">
                                    {/* Applied coupon badge */}
                                    {appliedCoupon && (
                                        <div className="flex items-center justify-between bg-black text-white rounded-lg px-3.5 py-3 shadow-xs">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-5 h-5 rounded-full bg-[#bfa81f] flex items-center justify-center flex-shrink-0">
                                                    <Check size={12} className="text-white stroke-[3]" />
                                                </div>
                                                <div>
                                                    <p className="text-white text-[11px] font-bold tracking-widest uppercase">
                                                        {appliedCoupon.code}
                                                    </p>
                                                    <p className="text-white/70 text-[10px] mt-0.5">
                                                        {couponSuccess}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                className="text-[10px] font-bold text-amber-300 hover:text-white transition-colors tracking-wider uppercase ml-2 flex-shrink-0 cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}

                                    {/* Coupon input */}
                                    {!appliedCoupon && (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Discount code"
                                                value={couponInput}
                                                onChange={e => {
                                                    setCouponInput(e.target.value.toUpperCase());
                                                    setCouponError('');
                                                }}
                                                onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                                className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm uppercase font-mono focus:outline-none focus:border-[#bfa81f] transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleApplyCoupon()}
                                                disabled={!couponInput.trim()}
                                                className="px-4 py-2.5 bg-[#bfa81f] hover:bg-[#a89216] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}

                                    {/* Coupon error */}
                                    {couponError && !appliedCoupon && (
                                        <p className="text-xs text-red-500 px-1">{couponError}</p>
                                    )}

                                    {/* See available coupons toggle */}
                                    {!appliedCoupon && AVAILABLE_COUPONS.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowCouponPanel(v => !v)}
                                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#bfa81f] transition-colors cursor-pointer"
                                        >
                                            <Tag size={13} className="text-[#bfa81f]" />
                                            <span>
                                                {showCouponPanel ? 'Hide coupons' : `See available coupons (${AVAILABLE_COUPONS.length})`}
                                            </span>
                                            <ChevronDown size={13} className={`transition-transform ${showCouponPanel ? 'rotate-180' : ''}`} />
                                        </button>
                                    )}

                                    {/* Available coupons panel */}
                                    {showCouponPanel && !appliedCoupon && (
                                        <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 bg-gray-50/70">
                                            {AVAILABLE_COUPONS.map(c => {
                                                const meetsMin = !c.minOrder || subtotal >= c.minOrder;
                                                const needed = c.minOrder ? Math.max(0, c.minOrder - subtotal) : 0;
                                                const label = c.type === 'percent'
                                                    ? `${c.value}% off${c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ''}`
                                                    : `₹${c.value} off`;
                                                return (
                                                    <div key={c.code} className="flex items-center gap-3 px-3.5 py-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="font-mono text-xs font-bold bg-[#bfa81f] text-white px-2 py-0.5 rounded tracking-widest">
                                                                    {c.code}
                                                                </span>
                                                                <span className="text-xs font-semibold text-gray-800">
                                                                    {label}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                                {c.description}
                                                            </p>
                                                            {!meetsMin && needed > 0 && (
                                                                <p className="text-[11px] text-amber-700 mt-0.5 font-medium">
                                                                    Add ₹{needed.toLocaleString('en-IN')} more to unlock
                                                                </p>
                                                            )}
                                                            {c.minOrder && meetsMin && (
                                                                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                                                                    Eligible on your order ✓
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApplyCoupon(c.code)}
                                                            disabled={!meetsMin}
                                                            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                                                                meetsMin
                                                                    ? 'bg-[#bfa81f] text-white hover:bg-[#a89216] cursor-pointer'
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

                                {/* Totals Section */}
                                <div className="space-y-3 border-t border-gray-100 pt-5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium text-black">{formatPrice(subtotal)}</span>
                                    </div>

                                    {discountAmount > 0 && appliedCoupon && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">
                                                Coupon <span className="font-mono text-xs font-bold text-[#bfa81f]">{appliedCoupon.code}</span>
                                            </span>
                                            <span className="font-semibold text-emerald-700">-{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="text-emerald-700 font-semibold">Free</span>
                                    </div>

                                    <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                                        <span className="text-base font-semibold text-black">Total</span>
                                        <div className="text-right">
                                            <span className="text-[10px] text-gray-400 mr-1 font-bold">INR</span>
                                            <span className="text-xl font-extrabold text-black">{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    {discountAmount > 0 && (
                                        <p className="text-[10px] text-emerald-700 font-bold text-right tracking-wide uppercase">
                                            You save {formatPrice(discountAmount)} on this order
                                        </p>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#bfa81f] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}
