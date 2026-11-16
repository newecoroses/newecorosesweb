'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { fetchWhatsappSettings } from '@/lib/supabase';

const FALLBACK_PHONE = '919936911611';

function cleanOrderNumber(input: string): string {
    const raw = (input || '').trim().toUpperCase().replace(/^#/, '');
    const digitsMatch = raw.match(/(\d{5,8})/);
    if (digitsMatch) {
        return `NER-${digitsMatch[1]}`;
    }
    return raw.replace(/\s+/g, '-');
}

function findLocalOrder(query: string) {
    if (!query) return null;
    const target = cleanOrderNumber(query);
    const rawTarget = query.trim().toUpperCase();
    try {
        const last = sessionStorage.getItem('ner_last_order') || localStorage.getItem('ner_last_order');
        if (last) {
            const parsed = JSON.parse(last);
            const pNum = cleanOrderNumber(parsed.orderNumber || parsed.id || '');
            if (pNum === target || parsed.orderNumber === rawTarget || parsed.id === rawTarget) {
                return parsed;
            }
        }
        const hist = localStorage.getItem('ner_order_history');
        if (hist) {
            const list = JSON.parse(hist);
            if (Array.isArray(list)) {
                for (const item of list) {
                    const itemNum = cleanOrderNumber(item.orderNumber || item.id || '');
                    if (itemNum === target || item.orderNumber === rawTarget || item.id === rawTarget) {
                        return item;
                    }
                }
            }
        }
    } catch {}
    return null;
}

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const rawOrderNumber = searchParams.get('order') || '';
    const orderNumber = cleanOrderNumber(rawOrderNumber);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [phone, setPhone] = useState(FALLBACK_PHONE);

    useEffect(() => {
        fetchWhatsappSettings()
            .then(s => { if (s?.phone_number) setPhone(s.phone_number); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        // Light celebratory confetti burst
        try {
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#16a34a', '#bfa81f', '#111111', '#e6c845']
            });
        } catch {}

        // 1. Try reading instantly from session or local storage
        const localMatch = findLocalOrder(orderNumber || rawOrderNumber);
        if (localMatch && Array.isArray(localMatch.items) && localMatch.items.length > 0) {
            setOrder(localMatch);
            setLoading(false);
        }

        // 2. Fetch fresh order from API
        if (orderNumber) {
            fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber)}`)
                .then(r => r.json())
                .then(data => {
                    if (data.success && data.order && Array.isArray(data.order.items) && data.order.items.length > 0) {
                        setOrder(data.order);
                        try {
                            localStorage.setItem('ner_last_order', JSON.stringify(data.order));
                        } catch {}
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [orderNumber, rawOrderNumber]);

    if (loading && !order) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-3 border-black/[0.1] border-t-[#111] rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-[#555]">Loading order details…</p>
            </div>
        );
    }

    // Fallback if no order found
    if (!order && !loading) {
        return (
            <div className="min-h-screen bg-white">
                <header className="border-b border-black/[0.08] bg-white sticky top-0 z-40">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#111] hover:text-[#bfa81f] transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6"/>
                            </svg>
                            <span>Back to Shop</span>
                        </Link>
                        <Link href="/" className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#111]">
                            NEW ECO ROSES
                        </Link>
                        <div className="w-16" />
                    </div>
                </header>

                <div className="max-w-[500px] mx-auto px-4 py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-black/[0.05] text-[#555] flex items-center justify-center mx-auto mb-5">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#111] mb-2">No recent order found</h2>
                    <p className="text-[#666] text-sm leading-relaxed mb-6">
                        If you just placed an order, please check your email for confirmation. Otherwise start shopping below.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center h-12 px-8 rounded-[14px] bg-[#111] hover:bg-black text-white font-bold text-sm transition-all"
                    >
                        Continue shopping
                    </Link>
                </div>
            </div>
        );
    }

    const customerName = order?.customer?.name || 'Valued Customer';
    const firstName = customerName.split(' ')[0] || customerName;
    const email = order?.customer?.email || '';
    const displayOrderNum = order?.orderNumber || orderNumber || 'NER-NEW';
    const items = Array.isArray(order?.items) && order.items.length > 0
        ? order.items
        : [{ name: 'Handcrafted Floral Bouquet', price: order?.total || 0, quantity: 1, image_url: '' }];

    const subtotal = order?.subtotal ?? order?.total ?? 0;
    const discount = order?.discountAmount ?? 0;
    const shipping = order?.shippingCost ?? 0;
    const total = order?.total ?? (subtotal - discount + shipping);

    const addr = order?.shippingAddress;
    const addressFormatted = addr
        ? [addr.line1, addr.line2, addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ')
        : 'Kolkata, West Bengal';

    const orderDate = order?.createdAt
        ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const whatsappHelpMessage = `Hi New Eco Roses! I placed order #${displayOrderNum}. Could you please share delivery updates?`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappHelpMessage)}`;

    return (
        <div className="min-h-screen bg-white text-[#111]">
            {/* Scoped CSS directly matching the template */}
            <style jsx global>{`
                .st-order-conf {
                    --st-brand: #111111;
                    --st-btn-text: #ffffff;
                    --st-bg: #ffffff;
                    --st-surface: #f4f4f4;
                    --st-text: #111111;
                    --st-muted: #555555;
                    --st-radius: 14;
                    --st-max: 1200;
                    --st-font-heading: var(--font-inter, sans-serif);
                    --st-font-body: var(--font-inter, sans-serif);
                    padding: clamp(36px, 5cqi, 72px) 0;
                }
                .st-oc-wrap {
                    width: 100%;
                    max-width: 1140px;
                    margin: 0 auto;
                    padding-left: clamp(16px, 4cqi, 40px);
                    padding-right: clamp(16px, 4cqi, 40px);
                }
                .oc-hero {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 14px;
                    margin: 0 auto clamp(28px, 4cqi, 48px);
                    max-width: 42em;
                    text-align: center;
                }
                .oc-check {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: color-mix(in srgb, #16a34a 14%, transparent);
                    color: #16a34a;
                    display: inline-grid;
                    place-items: center;
                }
                .oc-check svg {
                    width: 38px;
                    height: 38px;
                }
                .oc-h2 {
                    font-size: clamp(28px, 2.6cqi + 16px, 46px);
                    font-weight: 800;
                    line-height: 1.1;
                    letter-spacing: -0.025em;
                    color: #111111;
                    margin: 0;
                }
                .oc-sub {
                    font-size: clamp(16px, 1.2cqi + 12px, 19px);
                    line-height: 1.6;
                    color: #555555;
                    max-width: 34em;
                    margin: 0;
                }
                .oc-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1.45fr) minmax(320px, 1fr);
                    gap: clamp(24px, 4cqi, 48px);
                    align-items: start;
                }
                @media (max-width: 860px) {
                    .oc-grid {
                        grid-template-columns: minmax(0, 1fr);
                    }
                }
                .oc-card {
                    padding: clamp(20px, 2.6cqi, 32px);
                    border-radius: 18px;
                    background: #f4f4f4;
                    border: 1px solid rgba(0, 0, 0, 0.07);
                }
                .oc-title {
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #111111;
                    margin-bottom: 16px;
                }
                .oc-list {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    margin: 0;
                }
                .oc-row {
                    display: grid;
                    grid-template-columns: 72px minmax(0, 1fr) auto;
                    gap: 6px 14px;
                    align-items: start;
                    padding: 16px 0;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                }
                .oc-row:first-child {
                    padding-top: 0;
                }
                @media (max-width: 520px) {
                    .oc-row {
                        grid-template-columns: 60px minmax(0, 1fr);
                    }
                    .oc-row-side {
                        grid-column: 2;
                        flex-direction: row !important;
                        align-items: center !important;
                        justify-content: space-between !important;
                        margin-top: 4px;
                    }
                }
                .oc-img {
                    width: 72px;
                    height: 90px;
                    border-radius: 9px;
                    object-fit: cover;
                    background: #eaeaea;
                }
                .oc-img-ph {
                    width: 72px;
                    height: 90px;
                    border-radius: 9px;
                    background: #eaeaea;
                    display: grid;
                    place-items: center;
                    font-size: 26px;
                }
                @media (max-width: 520px) {
                    .oc-img, .oc-img-ph {
                        width: 60px;
                        height: 76px;
                    }
                }
                .oc-info {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    min-width: 0;
                }
                .oc-name {
                    font-weight: 700;
                    font-size: 15.5px;
                    line-height: 1.35;
                    color: #111111;
                    letter-spacing: -0.01em;
                    margin: 0;
                }
                .oc-var {
                    color: #666666;
                    font-size: 13.5px;
                    margin: 0;
                }
                .oc-price {
                    color: #666666;
                    font-size: 14px;
                    margin: 0;
                }
                .oc-row-side {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 6px;
                }
                .oc-line {
                    font-weight: 800;
                    font-size: 16px;
                    line-height: 1;
                    color: #111111;
                    margin: 0;
                }
                .oc-fixed-qty {
                    color: #666666;
                    font-size: 13.5px;
                    margin: 0;
                }
                .oc-sum {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 18px;
                }
                .oc-sum-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 16px;
                    font-size: 15.5px;
                }
                .oc-sum-row span:first-child {
                    color: #555555;
                }
                .oc-sum-row strong {
                    font-weight: 700;
                    color: #111111;
                }
                .oc-sum-row.is-total {
                    padding-top: 12px;
                    margin-top: 2px;
                    border-top: 1px solid rgba(0, 0, 0, 0.12);
                    font-size: 18px;
                }
                .oc-sum-row.is-total span:first-child {
                    color: #111111;
                    font-weight: 700;
                }
                .oc-sum-row.is-total strong {
                    font-weight: 800;
                    font-size: 22px;
                    line-height: 1;
                    color: #111111;
                }
                .oc-dl {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin: 0;
                    padding: 0;
                }
                .oc-dl dt {
                    color: #666666;
                    font-size: 12.5px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin-bottom: 2px;
                }
                .oc-dl dd {
                    font-weight: 600;
                    font-size: 15px;
                    color: #111111;
                    word-break: break-word;
                    margin: 0;
                    line-height: 1.45;
                }
                .oc-next {
                    margin-top: clamp(32px, 4cqi, 56px);
                }
                .oc-steps {
                    list-style: none;
                    counter-reset: s;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 18px;
                    margin: 0;
                    padding: 0;
                }
                .oc-step {
                    display: flex;
                    gap: 14px;
                    align-items: flex-start;
                    counter-increment: s;
                }
                .oc-step-n {
                    display: grid;
                    place-items: center;
                    flex: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #111111;
                    color: #ffffff;
                    font-weight: 800;
                    font-size: 15px;
                    line-height: 1;
                }
                .oc-step-n::before {
                    content: counter(s);
                }
                .oc-step strong {
                    display: block;
                    font-size: 15.5px;
                    font-weight: 700;
                    color: #111111;
                }
                .oc-step p {
                    color: #555555;
                    font-size: 14.5px;
                    margin-top: 3px;
                    line-height: 1.45;
                }
                .oc-btns {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 12px;
                    margin-top: clamp(28px, 4cqi, 48px);
                }
                .oc-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    min-height: 50px;
                    padding: 0 28px;
                    border-radius: 14px;
                    border: 2px solid #111111;
                    background: #111111;
                    color: #ffffff;
                    font-weight: 700;
                    font-size: 15.5px;
                    text-decoration: none;
                    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
                    cursor: pointer;
                }
                .oc-btn-primary:hover {
                    transform: translateY(-1px);
                    background: #000000;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                }
                .oc-btn-ghost {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    min-height: 50px;
                    padding: 0 26px;
                    border-radius: 14px;
                    border: 1.5px solid rgba(0, 0, 0, 0.18);
                    background: transparent;
                    color: #111111;
                    font-weight: 700;
                    font-size: 15.5px;
                    text-decoration: none;
                    transition: all 0.15s ease;
                    cursor: pointer;
                }
                .oc-btn-ghost:hover {
                    border-color: #111111;
                    background: rgba(0, 0, 0, 0.03);
                }
            `}</style>

            {/* Minimal Header (matches Checkout) */}
            <header className="border-b border-black/[0.08] bg-white sticky top-0 z-40">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[#111] hover:text-[#bfa81f] transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        <span>Continue Shopping</span>
                    </Link>

                    <Link href="/" className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#111] text-center">
                        NEW ECO ROSES
                    </Link>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>Order Confirmed</span>
                    </div>
                </div>
            </header>

            {/* Template Section */}
            <section className="st-order-conf">
                <div className="st-oc-wrap">
                    
                    {/* Hero Header */}
                    <header className="oc-hero">
                        <span className="oc-check" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </span>
                        <h2 className="oc-h2">Thank you, {firstName}!</h2>
                        <p className="oc-sub">
                            We have received your order #{displayOrderNum}. We will contact you at {email || 'your email'} about delivery.
                        </p>
                    </header>

                    {/* Two-Column Grid */}
                    <div className="oc-grid">
                        
                        {/* LEFT: Your items */}
                        <div className="oc-card">
                            <h3 className="oc-title">Your items</h3>
                            <ul className="oc-list">
                                {items.map((item: any, idx: number) => {
                                    const itemPrice = Number(item.price) || 0;
                                    const itemQty = Number(item.quantity) || 1;
                                    const itemTotal = itemPrice * itemQty;
                                    const img = item.image_url || item.image;
                                    return (
                                        <li key={item.id || idx} className="oc-row">
                                            {img ? (
                                                <img
                                                    src={img}
                                                    alt={item.name}
                                                    className="oc-img"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="oc-img-ph">🌹</span>
                                            )}
                                            <div className="oc-info">
                                                <p className="oc-name">{item.name}</p>
                                                <p className="oc-var">Fresh Floral Arrangement</p>
                                                <p className="oc-price">₹{itemPrice.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div className="oc-row-side">
                                                <p className="oc-line">₹{itemTotal.toLocaleString('en-IN')}</p>
                                                <p className="oc-fixed-qty">Qty {itemQty}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Summary */}
                            <div className="oc-sum">
                                <div className="oc-sum-row">
                                    <span>Subtotal</span>
                                    <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                                </div>
                                {discount > 0 && (
                                    <div className="oc-sum-row">
                                        <span>Discount ({order?.discountCode || 'Promo'})</span>
                                        <strong style={{ color: '#16a34a' }}>−₹{discount.toLocaleString('en-IN')}</strong>
                                    </div>
                                )}
                                <div className="oc-sum-row">
                                    <span>Shipping</span>
                                    <strong>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</strong>
                                </div>
                                <div className="oc-sum-row is-total">
                                    <span>Total</span>
                                    <strong>₹{total.toLocaleString('en-IN')}</strong>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Order details */}
                        <aside className="oc-card">
                            <h3 className="oc-title">Order details</h3>
                            <dl className="oc-dl">
                                <div>
                                    <dt>ORDER NUMBER</dt>
                                    <dd>#{displayOrderNum}</dd>
                                </div>
                                <div>
                                    <dt>DATE</dt>
                                    <dd>{orderDate}</dd>
                                </div>
                                <div>
                                    <dt>EMAIL</dt>
                                    <dd>{email || 'Provided at checkout'}</dd>
                                </div>
                                <div>
                                    <dt>SHIPPING TO</dt>
                                    <dd>{customerName}, {addressFormatted}</dd>
                                </div>
                                <div>
                                    <dt>DELIVERY</dt>
                                    <dd>Standard delivery (9 AM - 9 PM)</dd>
                                </div>
                                <div>
                                    <dt>PAYMENT</dt>
                                    <dd>Pay online (Razorpay 100% Verified)</dd>
                                </div>
                            </dl>
                        </aside>

                    </div>

                    {/* What happens next */}
                    <section className="oc-next">
                        <h3 className="oc-title">What happens next</h3>
                        <ol className="oc-steps">
                            <li className="oc-step">
                                <span className="oc-step-n" aria-hidden="true" />
                                <div>
                                    <strong>We check your order</strong>
                                    <p>You will get an email and WhatsApp message confirming all details.</p>
                                </div>
                            </li>
                            <li className="oc-step">
                                <span className="oc-step-n" aria-hidden="true" />
                                <div>
                                    <strong>We handcraft with love</strong>
                                    <p>Fresh luxury blooms are hand-selected & wrapped by our master florists.</p>
                                </div>
                            </li>
                            <li className="oc-step">
                                <span className="oc-step-n" aria-hidden="true" />
                                <div>
                                    <strong>It arrives fresh</strong>
                                    <p>Standard delivery arrives in Kolkata between 9 AM and 9 PM.</p>
                                </div>
                            </li>
                        </ol>
                    </section>

                    {/* Actions */}
                    <div className="oc-btns">
                        <Link href="/shop" className="oc-btn-primary">
                            <span>Continue shopping</span>
                        </Link>
                        <Link href={`/track-order?order=${encodeURIComponent(displayOrderNum)}`} className="oc-btn-ghost">
                            <span>Track your order</span>
                        </Link>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="oc-btn-ghost"
                            style={{ borderColor: '#25D366', color: '#128C7E' }}
                        >
                            <span>WhatsApp Updates</span>
                        </a>
                    </div>

                </div>
            </section>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-black/[0.1] border-t-[#111] rounded-full animate-spin" />
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
