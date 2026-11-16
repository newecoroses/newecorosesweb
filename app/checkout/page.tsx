'use client';

import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { AVAILABLE_COUPONS, calculateDiscount, Coupon } from '@/lib/coupons';
import OtpModal from '@/components/checkout/otp-modal';
import { evaluatePincode, PincodeCheckResult } from '@/lib/kolkata-pincodes';

declare global {
    interface Window { Razorpay: any; }
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
    'West Bengal','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
    'Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
    'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha',
    'Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
    'Uttarakhand','Chandigarh','Puducherry',
];

/* ── Shared field class (template style) ── */
const fieldCls = [
    'w-full bg-[#f7f7f7] border border-black/[0.09] rounded-[11px] px-4 py-3',
    'text-[15px] text-[#111] placeholder:text-[#888] outline-none',
    'focus:border-[#bfa81f] focus:ring-2 focus:ring-[#bfa81f]/20 transition-all',
].join(' ');

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items: cartItems, clearCart, removeItem } = useCart();
    const razorpayLoadedRef = useRef(false);

    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    /* Buy Now */
    const isBuyNow = searchParams.get('buyNow') === 'true';
    const [buyNowSessionItems, setBuyNowSessionItems] = useState<any[] | null>(null);
    useEffect(() => {
        if (isBuyNow) {
            try {
                const stored = sessionStorage.getItem('ner_buy_now');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) setBuyNowSessionItems(parsed);
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

    /* Coupon */
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [showCouponPanel, setShowCouponPanel] = useState(false);

    /* OTP */
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    /* Pincode */
    const [pincodeStatus, setPincodeStatus] = useState<PincodeCheckResult | null>(null);

    /* Form */
    const [formData, setFormData] = useState<FormData>({
        email: '', emailNews: false,
        firstName: '', lastName: '', phone: '',
        line1: '', line2: '',
        city: '', state: 'West Bengal', postalCode: '',
        country: 'India', billingSame: true,
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

    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
    const total = Math.max(0, subtotal - discountAmount);
    const formatPrice = (v: number) => `₹${Math.round(v).toLocaleString('en-IN')}`;

    useEffect(() => {
        if (!appliedCoupon) return;
        const result = calculateDiscount(appliedCoupon, subtotal);
        if (result.valid) { setDiscountAmount(result.discountAmount); setCouponSuccess(result.message); }
        else { setAppliedCoupon(null); setDiscountAmount(0); setCouponError(result.message); setCouponSuccess(''); }
    }, [subtotal, appliedCoupon]);

    const handleApplyCoupon = (codeOverride?: string) => {
        const code = (codeOverride || couponInput).trim().toUpperCase();
        if (!code) return;
        setCouponError(''); setCouponSuccess('');
        const found = AVAILABLE_COUPONS.find(c => c.code === code);
        if (!found) { setCouponError('Invalid coupon code.'); return; }
        const result = calculateDiscount(found, subtotal);
        if (result.valid) { setAppliedCoupon(found); setDiscountAmount(result.discountAmount); setCouponSuccess(result.message); setCouponInput(''); setShowCouponPanel(false); }
        else { setCouponError(result.message); setAppliedCoupon(null); setDiscountAmount(0); }
    };

    const handleRemoveCoupon = () => { setAppliedCoupon(null); setDiscountAmount(0); setCouponSuccess(''); setCouponError(''); setCouponInput(''); };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        if (name === 'postalCode') {
            const cleanPin = value.replace(/\D/g, '').slice(0, 6);
            const result = evaluatePincode(cleanPin);
            setPincodeStatus(cleanPin.length > 0 ? result : null);
            setFormData(prev => ({
                ...prev, postalCode: cleanPin,
                city: cleanPin.length === 6 && result.city ? result.city : prev.city,
                state: cleanPin.length === 6 && result.state ? result.state : prev.state,
            }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? target.checked : value }));
    };

    const validateForm = (): boolean => {
        if (!formData.email.trim() || !formData.firstName.trim() || !formData.phone.trim()) { setError('Please fill in your name, email and phone.'); return false; }
        if (!formData.line1.trim() || !formData.city.trim() || !formData.postalCode.trim()) { setError('Please complete your delivery address.'); return false; }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) { setError('Please enter a valid email address.'); return false; }
        if (formData.phone.replace(/\D/g, '').length < 10) { setError('Please enter a valid 10-digit mobile number.'); return false; }
        const cleanPin = formData.postalCode.replace(/\D/g, '');
        if (cleanPin.length !== 6) { setError('Please enter a valid 6-digit PIN code.'); return false; }
        const pinResult = evaluatePincode(cleanPin);
        if (!pinResult.isServiceable) { setError(pinResult.message); return false; }
        return true;
    };

    const loadRazorpayScript = (): Promise<boolean> => new Promise((resolve) => {
        if (typeof window === 'undefined') return resolve(false);
        if (window.Razorpay) return resolve(true);
        const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existing) { existing.addEventListener('load', () => resolve(true)); existing.addEventListener('error', () => resolve(false)); if (window.Razorpay) return resolve(true); }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    const handlePayment = async () => {
        if (!validateForm()) return;
        setError('');
        if (!isOtpVerified) { setShowOtpModal(true); return; }
        proceedWithCheckout();
    };

    const handleOtpVerified = () => { setIsOtpVerified(true); setShowOtpModal(false); proceedWithCheckout(); };

    const proceedWithCheckout = async () => {
        setIsLoading(true); setError('');
        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded || !window.Razorpay) throw new Error('Unable to connect to Razorpay. Please disable ad blockers and retry.');
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_U0rMz0vXr8YcOo';
            const orderResponse = await fetch('/api/orders', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({ id: i.id, name: i.name, slug: i.slug, price: i.price, quantity: i.quantity, image_url: i.image_url })),
                    customer: { name: `${formData.firstName} ${formData.lastName}`.trim(), email: formData.email, phone: formData.phone },
                    shippingAddress: { line1: formData.line1, line2: formData.line2, city: formData.city, state: formData.state, postalCode: formData.postalCode, country: formData.country || 'India' },
                    specialNote: [formData.deliveryTime ? `Slot: ${formData.deliveryTime}` : '', formData.messageCard ? `Message: "${formData.messageCard}"` : ''].filter(Boolean).join(' | '),
                    paymentMethod: 'online', discountCode: appliedCoupon?.code,
                }),
            });
            const orderData = await orderResponse.json();
            if (!orderData.success) throw new Error(orderData.error || 'Failed to place order');
            const order = orderData.order;
            let razorpayOrderId: string | undefined;
            try {
                const rzpRes = await fetch('/api/payment/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: total, currency: 'INR', receipt: order.orderNumber, notes: { orderId: order.id, orderNumber: order.orderNumber } }) });
                const rzpData = await rzpRes.json();
                if (rzpData.success && rzpData.order?.id) razorpayOrderId = rzpData.order.id;
            } catch (err) { console.warn('create-order warn:', err); }
            const rp = new window.Razorpay({
                key: razorpayKey, amount: Math.round(total * 100), currency: 'INR',
                name: 'New Eco Roses', description: `Order #${order.orderNumber}`,
                image: '/favicon_io/android-chrome-192x192.png',
                ...(razorpayOrderId ? { order_id: razorpayOrderId } : {}),
                handler: async (response: any) => {
                    try {
                        sessionStorage.setItem('ner_last_order', JSON.stringify(order));
                        localStorage.setItem('ner_last_order', JSON.stringify(order));
                    } catch {}
                    try { await fetch('/api/payment/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.id, razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }) }); } catch {}
                    if (!isBuyNow) clearCart();
                    try { sessionStorage.removeItem('ner_buy_now'); } catch {}
                    router.push(`/order-confirmation?order=${order.orderNumber}`);
                },
                prefill: { name: `${formData.firstName} ${formData.lastName}`.trim(), email: formData.email, contact: formData.phone },
                theme: { color: '#bfa81f' },
                modal: { ondismiss: () => setIsLoading(false) },
            });
            rp.on('payment.failed', (resp: any) => { setIsLoading(false); setError(resp.error?.description || 'Payment failed. Please try again.'); });
            rp.open();
        } catch (err: any) { setError(err.message || 'Something went wrong. Please try again.'); setIsLoading(false); }
    };

    if (!mounted) return null;

    if (!isBuyNow && items.length === 0) {
        return (
            <div style={{ '--st-brand': '#bfa81f' } as any} className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center font-[Inter,sans-serif]">
                <div className="w-16 h-16 rounded-full bg-[#bfa81f]/10 flex items-center justify-center mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bfa81f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
                <h1 className="text-[28px] font-extrabold tracking-tight text-[#111] mb-2">Your cart is empty</h1>
                <p className="text-[#555] text-[15px] mb-6 max-w-xs leading-relaxed">Browse our fresh flower bouquets and celebratory hampers.</p>
                <Link href="/shop" className="inline-flex items-center gap-2 bg-[#bfa81f] hover:bg-[#a89216] text-white px-6 py-3 rounded-[14px] text-[14px] font-bold tracking-wide transition-all">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* ── CSS Design System Variables (injected via style tag) ── */}
            <style>{`
                .ner-checkout {
                    --st-brand: #bfa81f;
                    --st-btn-text: #ffffff;
                    --st-bg: #ffffff;
                    --st-surface: #f4f4f4;
                    --st-text: #111111;
                    --st-muted: #555555;
                    --st-radius: 14;
                    --st-pad: clamp(16px, 4vw, 48px);
                    font-family: 'Inter', system-ui, sans-serif;
                    font-size: 15px;
                    line-height: 1.6;
                    color: var(--st-text);
                    background: var(--st-bg);
                    -webkit-font-smoothing: antialiased;
                }
                .ner-checkout *, .ner-checkout *::before, .ner-checkout *::after { box-sizing: border-box; }
                .ner-cx-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1.55fr) minmax(300px, 1fr);
                    gap: clamp(24px, 4vw, 56px);
                    align-items: start;
                }
                .ner-cx-card {
                    padding: clamp(18px, 2.5vw, 28px);
                    border-radius: calc(var(--st-radius) * 1.3px);
                    background: var(--st-surface);
                    border: 1px solid rgba(17,17,17,0.07);
                }
                .ner-cx-sticky { position: sticky; top: 80px; }
                .ner-wc-row {
                    display: grid;
                    grid-template-columns: 68px minmax(0,1fr) auto;
                    gap: 6px 14px;
                    align-items: start;
                    padding: 14px 0;
                    border-bottom: 1px solid rgba(17,17,17,0.08);
                }
                .ner-wc-img {
                    width: 68px; height: 86px;
                    border-radius: 9px;
                    object-fit: cover;
                    background: var(--st-surface);
                }
                .ner-wc-img-ph {
                    width: 68px; height: 86px;
                    border-radius: 9px;
                    background: var(--st-surface);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 26px;
                }
                .ner-wc-sum { display: flex; flex-direction: column; gap: 9px; margin-top: 18px; }
                .ner-wc-sum-row { display: flex; justify-content: space-between; gap: 14px; font-size: 14.5px; }
                .ner-wc-sum-row span:first-child { color: var(--st-muted); }
                .ner-wc-sum-row.is-total { padding-top: 11px; margin-top: 2px; border-top: 1px solid rgba(17,17,17,0.12); font-size: 17px; }
                .ner-wc-sum-row.is-total span:first-child { color: var(--st-text); font-weight: 700; }
                .ner-wc-sum-row.is-total strong { font-size: 21px; font-weight: 800; letter-spacing: -0.02em; }
                .ner-oc-dl { display: flex; flex-direction: column; gap: 13px; }
                .ner-oc-dl dt { color: var(--st-muted); font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
                .ner-oc-dl dd { font-weight: 600; font-size: 14px; word-break: break-word; }
                .ner-st-btn {
                    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                    min-height: 48px; padding: 0 24px;
                    border-radius: calc(var(--st-radius) * 1px);
                    border: 2px solid var(--st-brand);
                    background: var(--st-brand); color: var(--st-btn-text);
                    font: 700 15px/1 'Inter', sans-serif;
                    text-decoration: none; cursor: pointer;
                    transition: transform .15s ease, box-shadow .15s ease;
                }
                .ner-st-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(191,168,31,.35); }
                .ner-st-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
                .ner-st-btn--ghost { background: transparent; color: var(--st-text); border-color: rgba(17,17,17,0.22); }
                .ner-st-btn--ghost:hover { box-shadow: none; border-color: var(--st-text); }
                .ner-cx-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--st-muted); margin-bottom: 10px; }
                .ner-cx-section-h { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; color: var(--st-text); margin-bottom: 14px; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
                .ner-pincode-ok { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); border-radius: 11px; padding: 11px 14px; }
                .ner-pincode-bad { background: #fef2f2; border: 1px solid rgba(239,68,68,0.25); border-radius: 11px; padding: 11px 14px; }
                .ner-pincode-warn { background: #fefce8; border: 1px solid rgba(234,179,8,0.3); border-radius: 11px; padding: 11px 14px; }
                .ner-msg-bad { background: #fef2f2; color: #b91c1c; border-radius: 10px; padding: 10px 14px; font-size: 14px; font-weight: 600; }
                @media (max-width: 860px) {
                    .ner-cx-grid { grid-template-columns: 1fr; }
                    .ner-cx-sticky { position: static; }
                }
                @media (max-width: 520px) {
                    .ner-wc-row { grid-template-columns: 58px minmax(0,1fr); }
                    .ner-wc-img, .ner-wc-img-ph { width: 58px; height: 74px; }
                }
            `}</style>

            {/* ── Minimal checkout header ── */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/[0.07] h-[60px] flex items-center justify-between px-6">
                <Link href="/shop" className="flex items-center gap-1.5 text-[13px] font-semibold text-[#555] hover:text-[#111] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                    Back
                </Link>
                <Link href="/" className="flex items-center gap-2.5">
                    <img src="/favicon_io/android-chrome-512x512.png" alt="New Eco Roses" width={32} height={32} className="w-8 h-8 rounded-lg object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/favicon_io/android-chrome-192x192.png'; }} />
                    <span className="text-[13px] font-black tracking-[0.14em] uppercase text-[#111] hidden sm:inline">New Eco Roses</span>
                </Link>
                <div className="w-14" />
            </header>

            {/* ── Page shell ── */}
            <div className="ner-checkout min-h-screen bg-white">
                <div className="max-w-[1140px] mx-auto px-[var(--st-pad)] py-10">

                    {/* Page heading */}
                    <div className="mb-9">
                        <p className="ner-cx-section-title">New Eco Roses</p>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 'clamp(26px,3vw,36px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                            Secure Checkout
                        </h1>
                    </div>

                    <div className="ner-cx-grid">

                        {/* ════════════════════════════════════════
                            LEFT — Form
                        ════════════════════════════════════════ */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

                            {/* ── Contact ── */}
                            <div className="ner-cx-card">
                                <p className="ner-cx-section-title">Contact</p>
                                <h2 className="ner-cx-section-h">Your Details</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} className={fieldCls} required autoComplete="email" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className={fieldCls} required />
                                        <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className={fieldCls} />
                                    </div>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ position: 'absolute', left: 14, fontSize: 13, fontWeight: 700, color: '#555', pointerEvents: 'none' }}>+91</span>
                                        <input type="tel" name="phone" placeholder="10-digit mobile number" maxLength={10} value={formData.phone} onChange={handleChange} autoComplete="off" className={fieldCls} style={{ paddingLeft: 42 }} required />
                                    </div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#555', cursor: 'pointer', paddingTop: 2 }}>
                                        <input type="checkbox" name="emailNews" checked={formData.emailNews} onChange={handleChange} style={{ accentColor: '#bfa81f', width: 15, height: 15 }} />
                                        Email me with new arrivals and exclusive offers
                                    </label>
                                </div>
                            </div>

                            {/* ── Delivery Address ── */}
                            <div className="ner-cx-card">
                                <p className="ner-cx-section-title">Delivery</p>
                                <h2 className="ner-cx-section-h">Shipping Address</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <input type="text" name="line1" placeholder="Address — House / Flat, Street, Area" value={formData.line1} onChange={handleChange} className={fieldCls} required />
                                    <input type="text" name="line2" placeholder="Landmark / Apartment (optional)" value={formData.line2} onChange={handleChange} className={fieldCls} />

                                    {/* City + State + PIN */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                                        <input type="text" name="city" placeholder="City (auto-fills)" value={formData.city} onChange={handleChange} className={fieldCls} readOnly={formData.city === 'Kolkata'} style={formData.city === 'Kolkata' ? { background: '#f0f0f0', color: '#444' } : {}} required />
                                        <select name="state" value={formData.state} onChange={handleChange} className={fieldCls}>
                                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <input type="text" name="postalCode" placeholder="PIN code" maxLength={6} value={formData.postalCode} onChange={handleChange} className={fieldCls} required />
                                    </div>

                                    {/* Pincode badge */}
                                    {pincodeStatus && formData.postalCode.length > 0 && (
                                        <div className={
                                            pincodeStatus.status === 'serviceable' ? 'ner-pincode-ok'
                                            : pincodeStatus.status === 'invalid' ? 'ner-pincode-warn'
                                            : 'ner-pincode-bad'
                                        }>
                                            {pincodeStatus.status === 'serviceable' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <span style={{ position: 'relative', display: 'flex', width: 10, height: 10, flexShrink: 0 }}>
                                                        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#16a34a', opacity: 0.4, animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite' }} />
                                                        <span style={{ position: 'relative', display: 'block', width: 10, height: 10, borderRadius: '50%', background: '#16a34a' }} />
                                                    </span>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Delivery Available</p>
                                                        {pincodeStatus.area && <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#374151', fontWeight: 500 }}>📍 {pincodeStatus.area}, Kolkata</p>}
                                                        <p style={{ margin: '1px 0 0', fontSize: 11.5, color: '#16a34a', fontWeight: 500 }}>9 AM – 9 PM · Free delivery</p>
                                                    </div>
                                                    {pincodeStatus.distanceKm !== undefined && (
                                                        <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(22,163,74,0.12)', color: '#15803d', padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>~{pincodeStatus.distanceKm} km</span>
                                                    )}
                                                </div>
                                            ) : pincodeStatus.status === 'invalid' ? (
                                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#854d0e' }}>⚠️ Enter a valid 6-digit PIN code</p>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', flexShrink: 0, marginTop: 3 }} />
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Not Serviceable{pincodeStatus.distanceKm !== undefined ? ` · ${pincodeStatus.distanceKm} km away` : ''}</p>
                                                        {pincodeStatus.area && <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#374151', fontWeight: 500 }}>📍 {pincodeStatus.area}</p>}
                                                        <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#ef4444', fontWeight: 500 }}>We deliver within 15 km of Tollygunge, Kolkata only.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <input type="text" name="messageCard" placeholder="🌸 Gift message card (e.g. Happy Birthday! Love, Rahul)" value={formData.messageCard} onChange={handleChange} className={fieldCls} />
                                </div>
                            </div>

                            {/* ── Delivery Time Slot ── */}
                            <div className="ner-cx-card">
                                <p className="ner-cx-section-title">Delivery Window</p>
                                <h2 className="ner-cx-section-h">Shipping Method</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, border: '1.5px solid rgba(191,168,31,0.4)', background: 'rgba(191,168,31,0.05)' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bfa81f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111' }}>Standard Delivery — 9:00 AM to 9:00 PM</p>
                                        <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#555' }}>Fresh handcrafted delivery in luxury packaging</p>
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: '#bfa81f', background: 'rgba(191,168,31,0.12)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(191,168,31,0.25)', whiteSpace: 'nowrap', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Free</span>
                                </div>
                            </div>

                            {/* ── Payment ── */}
                            <div className="ner-cx-card">
                                <p className="ner-cx-section-title">Payment</p>
                                <h2 className="ner-cx-section-h">Pay Online</h2>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 12, border: '1.5px solid rgba(191,168,31,0.4)', background: 'rgba(191,168,31,0.05)', cursor: 'default' }}>
                                    <input type="radio" checked readOnly className="mt-1" style={{ accentColor: '#bfa81f', width: 15, height: 15 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Razorpay — All UPI &amp; Cards</span>
                                            {/* Payment badges */}
                                            <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                                                {[
                                                    <svg key="visa" viewBox="0 0 38 12" height="14" xmlns="http://www.w3.org/2000/svg"><text x="1" y="10" fontFamily="Arial Black,sans-serif" fontSize="10" fontWeight="900" fontStyle="italic" fill="#1a1f71" letterSpacing="0.5">VISA</text></svg>,
                                                    <svg key="mc" viewBox="0 0 34 22" height="14" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="11" r="10" fill="#EB001B"/><circle cx="22" cy="11" r="10" fill="#F79E1B"/><path d="M17 3.8a10 10 0 0 1 0 14.4A10 10 0 0 1 17 3.8z" fill="#FF5F00"/></svg>,
                                                    <svg key="upi" viewBox="0 0 32 12" height="14" xmlns="http://www.w3.org/2000/svg"><text x="1" y="10" fontFamily="Arial,sans-serif" fontSize="9.5" fontWeight="800" fill="#6c3aab" letterSpacing="0.5">UPI</text></svg>,
                                                ].map((badge, i) => (
                                                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 5px', border: '1px solid #e5e5e5', borderRadius: 5, background: '#fff' }}>{badge}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ margin: '5px 0 0', fontSize: 12.5, color: '#555' }}>GPay · PhonePe · Paytm · Credit/Debit Cards · Net Banking</p>
                                        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #eee', borderRadius: 9, padding: '8px 12px' }}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bfa81f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                            <p style={{ margin: 0, fontSize: 12, color: '#555' }}>Secured via Razorpay 256-bit SSL encryption</p>
                                        </div>
                                    </div>
                                </label>

                                {/* Billing address */}
                                <div style={{ marginTop: 16 }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8 }}>Billing address</p>
                                    <div style={{ border: '1px solid rgba(17,17,17,0.09)', borderRadius: 11, overflow: 'hidden' }}>
                                        {[
                                            { label: 'Same as shipping address', val: true },
                                            { label: 'Use a different billing address', val: false },
                                        ].map(({ label, val }) => (
                                            <label key={String(val)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', background: formData.billingSame === val ? 'rgba(191,168,31,0.06)' : 'transparent', borderBottom: val ? '1px solid rgba(17,17,17,0.07)' : 'none' }}>
                                                <input type="radio" name="billing" checked={formData.billingSame === val} onChange={() => setFormData(p => ({ ...p, billingSame: val }))} style={{ accentColor: '#bfa81f' }} />
                                                <span style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ── Error ── */}
                            {error && <div className="ner-msg-bad">⚠️ {error}</div>}

                            {/* ── Pay Button ── */}
                            <button type="button" onClick={handlePayment} disabled={isLoading} className="ner-st-btn" style={{ width: '100%', fontSize: 15, minHeight: 54, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                {isLoading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                        Securing Order…
                                    </span>
                                ) : (
                                    <span>Pay {formatPrice(total)} &amp; Confirm Order</span>
                                )}
                            </button>

                            {/* Footer links */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', paddingBottom: 16 }}>
                                {[['Refund policy', '/terms'], ['Shipping policy', '/terms'], ['Privacy policy', '/privacy'], ['Terms of service', '/terms']].map(([label, href]) => (
                                    <Link key={label} href={href} style={{ fontSize: 12, color: '#888', textDecoration: 'underline', textUnderlineOffset: 3 }} className="hover:text-[#555] transition-colors">{label}</Link>
                                ))}
                            </div>
                        </div>

                        {/* ════════════════════════════════════════
                            RIGHT — Order Summary (sticky)
                        ════════════════════════════════════════ */}
                        <div className="ner-cx-sticky">
                            <div className="ner-cx-card">
                                <p className="ner-cx-section-title">Summary</p>
                                <h2 className="ner-cx-section-h">Your Bouquet Order</h2>

                                {/* Items */}
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {items.map(item => (
                                        <li key={item.id} className="ner-wc-row">
                                            {/* Image */}
                                            <div style={{ position: 'relative' }}>
                                                {item.image_url
                                                    ? <img src={item.image_url} alt={item.name} className="ner-wc-img" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                                    : <div className="ner-wc-img-ph">🌸</div>
                                                }
                                                {/* Qty badge */}
                                                <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, background: '#bfa81f', color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                                                    {item.quantity}
                                                </span>
                                                {/* Remove */}
                                                {!isBuyNow && (
                                                    <button type="button" onClick={() => removeItem(item.id)} title="Remove" style={{ position: 'absolute', top: -6, left: -6, width: 18, height: 18, background: '#111', color: '#fff', border: 'none', borderRadius: '50%', fontSize: 9, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .15s' }}
                                                        onMouseOver={e => (e.currentTarget.style.opacity = '1')} onMouseOut={e => (e.currentTarget.style.opacity = '0')} aria-label={`Remove ${item.name}`}>✕</button>
                                                )}
                                            </div>
                                            {/* Info */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.35, color: '#111' }}>{item.name}</p>
                                                <p style={{ margin: 0, fontSize: 12.5, color: '#888' }}>Fresh Handpicked Bloom</p>
                                                <p style={{ margin: 0, fontSize: 12.5, color: '#888' }}>Qty {item.quantity}</p>
                                            </div>
                                            {/* Price */}
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>
                                                    {item.price && item.price > 0 ? formatPrice(item.price * item.quantity) : 'Included'}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Coupon */}
                                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {appliedCoupon ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111', color: '#fff', borderRadius: 10, padding: '10px 14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#bfa81f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase' }}>{appliedCoupon.code}</p>
                                                    <p style={{ margin: '1px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{couponSuccess}</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={handleRemoveCoupon} style={{ fontSize: 11, fontWeight: 700, color: '#e6c845', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Remove</button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <input type="text" placeholder="Discount code" value={couponInput}
                                                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                                                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                                    style={{ flex: 1, background: '#f4f4f4', border: '1px solid rgba(17,17,17,0.09)', borderRadius: 11, padding: '10px 14px', fontSize: 13, fontFamily: 'monospace', fontWeight: 600, outline: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }} />
                                                <button type="button" onClick={() => handleApplyCoupon()} disabled={!couponInput.trim()}
                                                    style={{ padding: '10px 16px', background: '#bfa81f', color: '#fff', border: 'none', borderRadius: 11, fontSize: 12, fontWeight: 700, cursor: couponInput.trim() ? 'pointer' : 'not-allowed', opacity: couponInput.trim() ? 1 : 0.5, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                                                    Apply
                                                </button>
                                            </div>
                                            {couponError && <p style={{ margin: 0, fontSize: 12.5, color: '#dc2626', fontWeight: 600 }}>{couponError}</p>}
                                            {AVAILABLE_COUPONS.length > 0 && (
                                                <button type="button" onClick={() => setShowCouponPanel(v => !v)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bfa81f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                                                    {showCouponPanel ? 'Hide offers' : `See available offers (${AVAILABLE_COUPONS.length})`}
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: showCouponPanel ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path d="m6 9 6 6 6-6"/></svg>
                                                </button>
                                            )}
                                            {showCouponPanel && (
                                                <div style={{ border: '1px solid rgba(17,17,17,0.08)', borderRadius: 11, overflow: 'hidden' }}>
                                                    {AVAILABLE_COUPONS.map(c => {
                                                        const meetsMin = !c.minOrder || subtotal >= c.minOrder;
                                                        const needed = c.minOrder ? Math.max(0, c.minOrder - subtotal) : 0;
                                                        const label = c.type === 'percent' ? `${c.value}% off${c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ''}` : `₹${c.value} off`;
                                                        return (
                                                            <div key={c.code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: '1px solid rgba(17,17,17,0.06)', background: '#fafafa' }}>
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                                        <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 800, background: '#bfa81f', color: '#fff', padding: '2px 7px', borderRadius: 5, letterSpacing: '0.1em' }}>{c.code}</span>
                                                                        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111' }}>{label}</span>
                                                                    </div>
                                                                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>{c.description}</p>
                                                                    {!meetsMin && needed > 0 && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#b45309', fontWeight: 600 }}>Add ₹{needed.toLocaleString('en-IN')} more to unlock</p>}
                                                                    {c.minOrder && meetsMin && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#16a34a', fontWeight: 600 }}>✓ Eligible on your order</p>}
                                                                </div>
                                                                <button type="button" onClick={() => handleApplyCoupon(c.code)} disabled={!meetsMin}
                                                                    style={{ padding: '7px 12px', borderRadius: 9, fontSize: 11, fontWeight: 700, border: 'none', cursor: meetsMin ? 'pointer' : 'not-allowed', background: meetsMin ? '#bfa81f' : '#e5e5e5', color: meetsMin ? '#fff' : '#999', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
                                                                    {meetsMin ? 'Apply' : 'Locked'}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Totals */}
                                <div className="ner-wc-sum">
                                    <div className="ner-wc-sum-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
                                    {discountAmount > 0 && appliedCoupon && (
                                        <div className="ner-wc-sum-row"><span>Coupon <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#bfa81f' }}>{appliedCoupon.code}</span></span><strong style={{ color: '#16a34a' }}>−{formatPrice(discountAmount)}</strong></div>
                                    )}
                                    <div className="ner-wc-sum-row"><span>Shipping</span><strong style={{ color: '#16a34a' }}>Free</strong></div>
                                    <div className="ner-wc-sum-row is-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
                                    {discountAmount > 0 && (
                                        <p style={{ margin: '4px 0 0', fontSize: 11.5, color: '#16a34a', fontWeight: 700, textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.07em' }}>You save {formatPrice(discountAmount)} 🎉</p>
                                    )}
                                </div>

                                {/* Order details summary */}
                                <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(17,17,17,0.08)' }}>
                                    <dl className="ner-oc-dl">
                                        <div><dt>Delivery slot</dt><dd>9:00 AM – 9:00 PM (Standard)</dd></div>
                                        <div><dt>Delivery area</dt><dd>{pincodeStatus?.status === 'serviceable' ? `${pincodeStatus.area || ''}, Kolkata` : 'Within 15 km of Tollygunge, Kolkata'}</dd></div>
                                        <div><dt>Payment</dt><dd>Online via Razorpay (UPI / Cards)</dd></div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`@keyframes ping{75%,100%{transform:scale(2);opacity:0}} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

            {/* OTP Modal */}
            <OtpModal isOpen={showOtpModal} email={formData.email} name={`${formData.firstName} ${formData.lastName}`.trim()} onClose={() => setShowOtpModal(false)} onVerified={handleOtpVerified} />
        </>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div style={{ width: 32, height: 32, border: '2.5px solid #bfa81f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
