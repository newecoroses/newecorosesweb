'use client';

import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    MapPin, Calendar, Trash2, ChevronDown, ChevronRight, 
    Gift, Tag, Mail, ShieldCheck, ArrowLeft, Check, Plus, Minus
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { AVAILABLE_COUPONS, calculateDiscount, Coupon } from '@/lib/coupons';
import AddonModal from '@/components/checkout/addon-modal';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface AddressData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
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

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items: cartItems, removeItem, updateQuantity, clearCart } = useCart();
    const razorpayLoadedRef = useRef(false);

    // EXACT 2 STEPS as requested by user: 'cart' (Step 1) and 'checkout' (Step 2: Address & Payment together)
    const [step, setStep] = useState<'cart' | 'checkout'>('cart');
    const [mounted, setMounted] = useState(false);
    const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);

    // Delivery location & date
    const [pincode, setPincode] = useState('700040');
    const [isChangingPin, setIsChangingPin] = useState(false);
    const [pinInput, setPinInput] = useState('700040');

    // Message Card state
    const [showMessageCardDrawer, setShowMessageCardDrawer] = useState(false);
    const [cardMessage, setCardMessage] = useState('');
    const [cardSender, setCardSender] = useState('');

    // Coupon state
    const [showCouponDrawer, setShowCouponDrawer] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    // Address & Customer details
    const [addressData, setAddressData] = useState<AddressData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        line1: '',
        line2: '',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700040',
        deliveryTime: 'Standard Delivery (9 AM - 9 PM)',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setMounted(true);
        // Preload Razorpay checkout script in background
        if (!razorpayLoadedRef.current && typeof window !== 'undefined' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => { razorpayLoadedRef.current = true; };
            document.body.appendChild(script);
        }
    }, []);

    // Buy Now query support
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

    const items = isBuyNow && buyNowItem ? [buyNowItem] : cartItems;

    // Subtotal & Totals calculation
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
    const originalSubtotal = items.reduce((sum, item) => {
        const p = Number(item.price) || 0;
        return sum + Math.round(p * 1.15) * item.quantity;
    }, 0);

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

    const totalBill = Math.max(0, subtotal - discountAmount);
    const totalSavings = Math.max(0, (originalSubtotal - subtotal) + discountAmount);

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
            setShowCouponDrawer(false);
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

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAddressData(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePin = () => {
        const clean = pinInput.trim();
        if (clean.length === 6) {
            setPincode(clean);
            setAddressData(prev => ({ ...prev, postalCode: clean }));
            setIsChangingPin(false);
        }
    };

    const validateAddress = (): boolean => {
        if (!addressData.firstName.trim() || !addressData.phone.trim() || !addressData.email.trim()) {
            setError('Please enter contact information (Recipient name, mobile phone, and email).');
            return false;
        }
        if (!addressData.line1.trim() || !addressData.city.trim() || !addressData.postalCode.trim()) {
            setError('Please complete the delivery address fields.');
            return false;
        }
        const cleanPhone = addressData.phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            setError('Please enter a valid 10-digit mobile number for delivery coordination.');
            return false;
        }
        return true;
    };

    const handleCompletePayment = async () => {
        if (!validateAddress()) return;
        setError('');
        setIsLoading(true);

        try {
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
                        name: `${addressData.firstName} ${addressData.lastName}`.trim(),
                        email: addressData.email,
                        phone: addressData.phone,
                    },
                    shippingAddress: {
                        line1: addressData.line1,
                        line2: addressData.line2,
                        city: addressData.city,
                        state: addressData.state,
                        postalCode: addressData.postalCode,
                        country: 'India',
                    },
                    specialNote: [
                        cardMessage ? `Card Message: "${cardMessage}" (From: ${cardSender || 'Sender'})` : '',
                        addressData.deliveryTime ? `Slot: ${addressData.deliveryTime}` : '',
                    ].filter(Boolean).join(' | '),
                    paymentMethod: 'online',
                    discountCode: appliedCoupon?.code,
                }),
            });

            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to place order.');
            }

            const order = data.order;
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

            if (razorpayKey && typeof window !== 'undefined' && window.Razorpay) {
                const options = {
                    key: razorpayKey,
                    amount: totalBill * 100,
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
                        router.push(`/order-confirmation?order=${order.orderNumber}`);
                    },
                    prefill: {
                        name: `${addressData.firstName} ${addressData.lastName}`.trim(),
                        email: addressData.email,
                        contact: addressData.phone,
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
                router.push(`/order-confirmation?order=${order.orderNumber}`);
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#bfa81f] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isBuyNow && items.length === 0) {
        return (
            <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#bfa81f] mb-4 border border-gray-200 shadow-xs">
                    <Gift size={28} />
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

    // Today's formatted delivery date
    const todayStr = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
    });

    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#1c1917]">
            {/* ── FNP-STYLE TOP HEADER WITH 2 STEPS (Cart ➔ Address & Payment) ── */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2 select-none">
                    <span className="text-base sm:text-xl font-serif font-black tracking-tight text-[#bfa81f]">
                        NEW ECO ROSES
                    </span>
                </Link>

                {/* 2 STEPS STEPPER: 1. Cart ───── 2. Address & Payment */}
                <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
                    {/* Step 1: Cart */}
                    <button
                        onClick={() => setStep('cart')}
                        className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                            step === 'cart' ? 'text-[#bfa81f]' : 'text-gray-400 hover:text-black'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                            step === 'cart' ? 'bg-[#bfa81f] text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                            1
                        </div>
                        <span>Cart</span>
                    </button>

                    <div className="w-8 sm:w-12 h-[1.5px] bg-gray-200" />

                    {/* Step 2: Address & Payment */}
                    <button
                        onClick={() => setStep('checkout')}
                        className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                            step === 'checkout' ? 'text-[#bfa81f]' : 'text-gray-400 hover:text-black'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                            step === 'checkout' ? 'bg-[#bfa81f] text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                            2
                        </div>
                        <span>Address & Payment</span>
                    </button>
                </div>

                {/* Right security info */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <ShieldCheck size={13} className="text-[#bfa81f]" />
                    <span className="hidden sm:inline">100% Secure</span>
                </div>
            </header>

            {/* ── MAIN CONTENT CONTAINER ── */}
            <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
                
                {/* ══════════════════════════════════════════════════════════
                    STEP 1: CART SCREEN (Exact match of User's Image 3)
                   ══════════════════════════════════════════════════════════ */}
                {step === 'cart' ? (
                    <div>
                        {/* Heading */}
                        <div className="flex items-baseline gap-2 mb-4">
                            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#1c1917]">
                                Cart
                            </h1>
                            <span className="text-sm text-gray-500 font-medium">
                                • {items.length} {items.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
                            
                            {/* ── LEFT COLUMN ── */}
                            <div className="space-y-3.5">
                                
                                {/* Card 1: Deliver to Location (with Change button) */}
                                <div className="bg-white rounded-xl p-3.5 border border-gray-200/90 shadow-2xs flex items-center justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#bfa81f] flex-shrink-0 mt-0.5">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1c1917]">
                                                <span>Deliver to:</span>
                                                <span className="font-extrabold">{pincode}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Kolkata, West Bengal
                                            </p>
                                        </div>
                                    </div>

                                    {/* Change Button in #bfa81f */}
                                    {isChangingPin ? (
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="text"
                                                maxLength={6}
                                                value={pinInput}
                                                onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                                                className="w-20 px-2 py-1 text-xs border border-[#bfa81f] rounded-md font-bold focus:outline-none text-center"
                                                placeholder="Pincode"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleSavePin}
                                                className="px-2.5 py-1 text-xs font-bold bg-[#bfa81f] hover:bg-[#a89216] text-white rounded-md cursor-pointer"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setIsChangingPin(true)}
                                            className="px-3.5 py-1.5 rounded-lg border border-[#bfa81f] text-xs font-bold text-[#bfa81f] hover:bg-[#bfa81f] hover:text-white transition-all cursor-pointer"
                                        >
                                            Change
                                        </button>
                                    )}
                                </div>

                                {/* Card 2: Delivery on Today banner */}
                                <div className="bg-white rounded-xl p-3.5 border border-gray-200/90 shadow-2xs flex items-center gap-2.5 text-xs font-bold text-[#1c1917]">
                                    <Calendar size={16} className="text-[#bfa81f]" />
                                    <span>Delivery on {todayStr} (Same-Day / Standard)</span>
                                </div>

                                {/* Card 3: Items in Cart */}
                                <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs divide-y divide-gray-100 overflow-hidden">
                                    {items.map(item => (
                                        <div key={item.id} className="p-4 flex items-start gap-3.5 relative">
                                            {/* Thumbnail */}
                                            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                {item.image_url ? (
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Gift size={20} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0 pr-6">
                                                <h3 className="text-xs sm:text-sm font-semibold text-[#1c1917] leading-snug line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm font-bold text-[#1c1917] mt-1.5">
                                                    {item.price && item.price > 0 ? `₹${item.price.toLocaleString('en-IN')}` : 'Included'}
                                                </p>

                                                {/* Quantity Selector dropdown */}
                                                <div className="mt-2.5 flex items-center gap-2">
                                                    <div className="relative">
                                                        <select
                                                            value={item.quantity}
                                                            onChange={e => updateQuantity(item.id, Number(e.target.value))}
                                                            className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-1 pl-2.5 pr-6 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#bfa81f] cursor-pointer"
                                                        >
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                                <option key={n} value={n}>
                                                                    Qty {n}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Remove Button (✕) */}
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="absolute top-3.5 right-3.5 text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                                title="Remove item"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Card 4: Make It Extra Special! Accordion Banner */}
                                <button
                                    type="button"
                                    onClick={() => setIsAddonModalOpen(true)}
                                    className="w-full bg-white hover:bg-gray-50 rounded-xl p-3.5 border border-gray-200/90 shadow-2xs flex items-center justify-between text-left transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Gift size={18} className="text-[#bfa81f] group-hover:scale-110 transition-transform" />
                                        <span className="text-xs sm:text-sm font-bold text-[#1c1917]">
                                            Make It Extra Special!
                                        </span>
                                        <span className="text-[11px] text-[#bfa81f] font-semibold hidden sm:inline">
                                            (Cakes, Chocolates, Cards & Plants)
                                        </span>
                                    </div>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>
                            </div>

                            {/* ── RIGHT COLUMN ── */}
                            <div className="space-y-3.5">
                                
                                {/* Right Card 1: Add Message Card FREE */}
                                <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setShowMessageCardDrawer(v => !v)}
                                        className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-50 text-[#bfa81f] flex items-center justify-center flex-shrink-0">
                                                <Mail size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs sm:text-sm font-bold text-[#1c1917]">
                                                        Add Message Card
                                                    </span>
                                                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded uppercase">
                                                        FREE
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-gray-500">
                                                    {cardMessage ? 'Message card attached ✓' : 'Make your gift more special'}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={`text-gray-400 transition-transform ${showMessageCardDrawer ? 'rotate-90' : ''}`} />
                                    </button>

                                    {/* Expandable message card inputs */}
                                    {showMessageCardDrawer && (
                                        <div className="p-3.5 bg-gray-50 border-t border-gray-100 space-y-2">
                                            <textarea
                                                rows={2}
                                                value={cardMessage}
                                                onChange={e => setCardMessage(e.target.value)}
                                                placeholder="Write your heartfelt message (e.g. Wishing you a very Happy Birthday! Lots of love.)"
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#bfa81f] resize-none"
                                            />
                                            <input
                                                type="text"
                                                value={cardSender}
                                                onChange={e => setCardSender(e.target.value)}
                                                placeholder="Sender Name (optional)"
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-900 focus:outline-none focus:border-[#bfa81f]"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Right Card 2: Apply Coupon */}
                                <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setShowCouponDrawer(v => !v)}
                                        className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-50 text-[#bfa81f] flex items-center justify-center flex-shrink-0">
                                                <Tag size={16} />
                                            </div>
                                            <div>
                                                <span className="text-xs sm:text-sm font-bold text-[#1c1917]">
                                                    {appliedCoupon ? `Coupon: ${appliedCoupon.code}` : 'Apply Coupon'}
                                                </span>
                                                <p className="text-[11px] text-gray-500">
                                                    {appliedCoupon ? `${couponSuccess}` : 'Save more on your order'}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={`text-gray-400 transition-transform ${showCouponDrawer ? 'rotate-90' : ''}`} />
                                    </button>

                                    {/* Expandable coupon box */}
                                    {showCouponDrawer && (
                                        <div className="p-3.5 bg-gray-50 border-t border-gray-100 space-y-2.5">
                                            {appliedCoupon ? (
                                                <div className="flex items-center justify-between bg-white border border-[#bfa81f]/40 p-2.5 rounded-lg">
                                                    <div>
                                                        <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded">
                                                            {appliedCoupon.code}
                                                        </span>
                                                        <p className="text-[10px] text-amber-800 mt-0.5">{couponSuccess}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveCoupon}
                                                        className="text-xs font-bold text-[#bfa81f] hover:underline uppercase cursor-pointer"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter coupon code"
                                                            value={couponInput}
                                                            onChange={e => {
                                                                setCouponInput(e.target.value.toUpperCase());
                                                                setCouponError('');
                                                            }}
                                                            className="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs uppercase font-mono focus:outline-none focus:border-[#bfa81f]"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApplyCoupon()}
                                                            className="px-3.5 py-1.5 bg-[#bfa81f] hover:bg-[#a89216] text-white text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>
                                                    {couponError && (
                                                        <p className="text-[11px] text-red-600">{couponError}</p>
                                                    )}
                                                    <div className="pt-2 space-y-1.5">
                                                        {AVAILABLE_COUPONS.map(c => (
                                                            <div key={c.code} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 text-xs">
                                                                <div>
                                                                    <span className="font-mono font-bold text-[#bfa81f]">{c.code}</span>
                                                                    <p className="text-[10px] text-gray-500">{c.description}</p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleApplyCoupon(c.code)}
                                                                    className="text-xs font-bold text-[#bfa81f] hover:underline uppercase cursor-pointer"
                                                                >
                                                                    Apply
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Right Card 3: Total Bill & Primary Checkout Button (in #bfa81f) */}
                                <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
                                    <div className="flex items-baseline justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-bold text-[#1c1917]">Total Bill</span>
                                            {discountAmount > 0 && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ₹{subtotal.toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-lg sm:text-xl font-extrabold text-[#1c1917]">
                                            ₹{totalBill.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-400">
                                        Price inclusive of all taxes
                                    </p>

                                    {/* Savings Callout Banner */}
                                    {totalSavings > 0 && (
                                        <div className="bg-amber-50 border border-amber-200 text-amber-900 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                                            <span>🎉</span>
                                            <span>You saved ₹{totalSavings.toLocaleString('en-IN')} on this order</span>
                                        </div>
                                    )}

                                    {/* ── THE BIG "CHECKOUT" BUTTON (Strictly in #bfa81f) ── */}
                                    <button
                                        type="button"
                                        onClick={() => setStep('checkout')}
                                        className="w-full bg-[#bfa81f] hover:bg-[#a89216] active:scale-[0.99] text-white py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                                    >
                                        Checkout
                                    </button>

                                    <p className="text-[10px] text-center text-gray-400 leading-tight pt-1">
                                        By continuing you agree to New Eco Roses Terms & Conditions, Privacy Policy & Disclaimer
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>
                ) : (
                    /* ══════════════════════════════════════════════════════════
                       STEP 2: ADDRESS & PAYMENT (Both Together in One Screen)
                       ══════════════════════════════════════════════════════════ */
                    <div className="max-w-3xl mx-auto">
                        
                        {/* Back to Cart link */}
                        <button
                            type="button"
                            onClick={() => setStep('cart')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#bfa81f] hover:text-[#a89216] mb-4 cursor-pointer"
                        >
                            <ArrowLeft size={14} /> Back to Cart
                        </button>

                        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 sm:p-8 space-y-7">
                            
                            {/* Section 1: Delivery Address */}
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                                    <h2 className="text-base sm:text-lg font-bold text-[#1c1917] flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-[#bfa81f] text-white text-xs font-bold flex items-center justify-center">1</span>
                                        <span>Recipient & Delivery Address</span>
                                    </h2>
                                    <span className="text-xs font-bold text-[#bfa81f] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                        Free Delivery
                                    </span>
                                </div>

                                <div className="space-y-3.5">
                                    {/* First & Last Name */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Recipient Name *</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="Recipient Full Name"
                                                value={addressData.firstName}
                                                onChange={handleAddressChange}
                                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#bfa81f]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address (for invoice) *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="yourname@gmail.com"
                                                value={addressData.email}
                                                onChange={handleAddressChange}
                                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#bfa81f]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number (clean, no suggestions) */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Recipient Mobile Phone *</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3.5 text-xs font-bold text-gray-500 pointer-events-none">+91</span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                maxLength={10}
                                                placeholder="Enter 10-digit mobile number"
                                                value={addressData.phone}
                                                onChange={handleAddressChange}
                                                autoComplete="off"
                                                data-lpignore="true"
                                                className="w-full border border-gray-200 rounded-xl pl-13 pr-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#bfa81f]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Address Line 1 */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address / House No. *</label>
                                        <input
                                            type="text"
                                            name="line1"
                                            placeholder="Flat / Building Name, Street / Locality"
                                            value={addressData.line1}
                                            onChange={handleAddressChange}
                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#bfa81f]"
                                            required
                                        />
                                    </div>

                                    {/* Address Line 2 */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Apartment, Floor, Landmark (optional)</label>
                                        <input
                                            type="text"
                                            name="line2"
                                            placeholder="Near Metro Station, Opposite Park, etc."
                                            value={addressData.line2}
                                            onChange={handleAddressChange}
                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#bfa81f]"
                                        />
                                    </div>

                                    {/* City, State, PIN */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={addressData.city}
                                                onChange={handleAddressChange}
                                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#bfa81f]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                                            <div className="relative">
                                                <select
                                                    name="state"
                                                    value={addressData.state}
                                                    onChange={handleAddressChange}
                                                    className="w-full appearance-none border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#bfa81f]"
                                                >
                                                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">PIN Code *</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                maxLength={6}
                                                value={addressData.postalCode}
                                                onChange={handleAddressChange}
                                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#bfa81f]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Delivery Time Slot */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Time Slot</label>
                                        <div className="relative">
                                            <select
                                                name="deliveryTime"
                                                value={addressData.deliveryTime}
                                                onChange={handleAddressChange}
                                                className="w-full appearance-none border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#bfa81f]"
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
                            </div>

                            {/* Section 2: Payment Details (Online Only) */}
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                                    <h2 className="text-base sm:text-lg font-bold text-[#1c1917] flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-[#bfa81f] text-white text-xs font-bold flex items-center justify-center">2</span>
                                        <span>Payment Details</span>
                                    </h2>
                                    <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                        UPI • Cards • NetBanking
                                    </span>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50/50 border border-[#bfa81f]/40 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-[#1c1917]">Instant Online Payment</p>
                                        <p className="text-[11px] text-gray-600">Secure 256-bit encryption via Google Pay, PhonePe, Paytm, Visa, Mastercard, RuPay & NetBanking.</p>
                                    </div>
                                    <span className="text-base sm:text-lg font-extrabold text-[#1c1917] pl-3">
                                        ₹{totalBill.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Proceed to Payment Button (Strictly in #bfa81f) */}
                            <button
                                type="button"
                                onClick={handleCompletePayment}
                                disabled={isLoading}
                                className="w-full bg-[#bfa81f] hover:bg-[#a89216] active:scale-[0.99] text-white py-4 px-6 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Securing Order…</span>
                                    </div>
                                ) : (
                                    <span>Pay ₹{totalBill.toLocaleString('en-IN')} & Confirm Order</span>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* ── ADD-ON MODAL MOUNT (Triggered on click "Make It Extra Special!") ── */}
            <AddonModal
                isOpen={isAddonModalOpen}
                onClose={() => setIsAddonModalOpen(false)}
                onContinue={() => setIsAddonModalOpen(false)}
            />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#bfa81f] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}
