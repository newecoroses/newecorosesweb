'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchWhatsappSettings } from '@/lib/supabase';

const FALLBACK_PHONE = '919936911611';

const STEPS = [
  { key: 'confirmed', label: 'Order Received', desc: 'Order & payment verified securely' },
  { key: 'processing', label: 'Bouquet Handcrafted', desc: 'Fresh blooms hand-arranged by florists' },
  { key: 'delivery', label: 'Out for Delivery', desc: 'Dispatched for 9 AM – 9 PM delivery' },
  { key: 'delivered', label: 'Delivered', desc: 'Delivered fresh with signature care' },
];

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

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [searchInput, setSearchInput] = useState(initialOrder);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [phone, setPhone] = useState(FALLBACK_PHONE);

  useEffect(() => {
    fetchWhatsappSettings()
      .then(s => { if (s?.phone_number) setPhone(s.phone_number); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder(orderNumber);
    }
  }, [orderNumber]);

  const fetchOrder = async (no: string) => {
    const normalizedNo = cleanOrderNumber(no);
    if (!normalizedNo) return;
    setLoading(true);
    setSearched(true);

    // 1. Immediately check local storage to avoid waiting or blank screen
    const localMatch = findLocalOrder(normalizedNo);
    if (localMatch && Array.isArray(localMatch.items) && localMatch.items.length > 0) {
      setOrder(localMatch);
    }

    try {
      const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(normalizedNo)}`);
      const data = await res.json();
      if (data.success && data.order && Array.isArray(data.order.items) && data.order.items.length > 0) {
        setOrder(data.order);
        try {
          localStorage.setItem('ner_last_order', JSON.stringify(data.order));
        } catch {}
      } else if (!localMatch) {
        setOrder(null);
      }
    } catch {
      if (!localMatch) {
        setOrder(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const normalized = cleanOrderNumber(searchInput);
      setOrderNumber(normalized);
      fetchOrder(normalized);
    }
  };

  // Determine current step index
  const getStepIndex = (status?: string) => {
    const s = (status || 'confirmed').toLowerCase();
    if (s === 'delivered') return 3;
    if (s === 'out_for_delivery' || s === 'dispatched' || s === 'delivery') return 2;
    if (s === 'processing' || s === 'handcrafting') return 1;
    return 0; // confirmed
  };

  const activeStep = getStepIndex(order?.status);
  const displayOrderNum = order?.orderNumber || orderNumber || searchInput;

  const whatsappMsg = `Hi New Eco Roses! I'm tracking order #${displayOrderNum}. Could you please update me on delivery progress? Thank you!`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMsg)}`;

  const items = Array.isArray(order?.items) && order.items.length > 0
    ? order.items
    : order?.total ? [{ name: 'Handcrafted Floral Bouquet', price: order.total, quantity: 1, image_url: '' }] : [];

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
    : 'Recently Placed';

  return (
    <div className="min-h-screen bg-white text-[#111]">
      {/* Scoped CSS directly matching the template */}
      <style jsx global>{`
        .st-track-conf {
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
          padding: clamp(32px, 5cqi, 64px) 0;
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
          gap: 12px;
          margin: 0 auto clamp(24px, 4cqi, 40px);
          max-width: 44em;
          text-align: center;
        }
        .oc-check {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: color-mix(in srgb, #16a34a 14%, transparent);
          color: #16a34a;
          display: inline-grid;
          place-items: center;
        }
        .oc-check svg {
          width: 36px;
          height: 36px;
        }
        .oc-h2 {
          font-size: clamp(26px, 2.6cqi + 16px, 44px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: #111111;
          margin: 0;
        }
        .oc-sub {
          font-size: clamp(15px, 1.2cqi + 11px, 18px);
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
          font-weight: 800;
          font-size: 15px;
          line-height: 1;
        }
        .oc-step-n.done {
          background: #111111;
          color: #ffffff;
        }
        .oc-step-n.current {
          background: #111111;
          color: #ffffff;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.12);
        }
        .oc-step-n.pending {
          background: #e5e5e5;
          color: #888888;
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

      {/* Minimal Header (matches Checkout & Order Confirmation) */}
      <header className="border-b border-black/[0.08] bg-white sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[#111] hover:text-[#bfa81f] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span>Back to Shop</span>
          </Link>

          <Link href="/" className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#111] text-center">
            NEW ECO ROSES
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Order Tracking</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <section className="st-track-conf">
        <div className="st-oc-wrap">

          {/* Search Bar Bar Card (Clean Template Style) */}
          <div className="max-w-[620px] mx-auto mb-10">
            <form onSubmit={handleSearch} className="flex gap-2.5">
              <input
                type="text"
                placeholder="Enter order number (e.g. NER-533673)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#f4f4f4] border border-black/[0.1] rounded-[14px] px-4 py-3.5 text-[15px] font-mono text-[#111] placeholder:text-[#888] placeholder:font-sans focus:bg-white focus:border-[#111] focus:ring-2 focus:ring-black/10 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={loading || !searchInput.trim()}
                className="h-[50px] px-7 bg-[#111] hover:bg-black text-white font-bold rounded-[14px] text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Searching…</span>
                ) : (
                  <>
                    <span>Track</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* When Order Is Found */}
          {order ? (
            <div>
              {/* Hero Header */}
              <header className="oc-hero">
                <span className="oc-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <h2 className="oc-h2">Order #{order.orderNumber}</h2>
                <p className="oc-sub">
                  Status: <strong>{STEPS[activeStep]?.label || 'Order Received'}</strong> · Scheduled for 9 AM – 9 PM Kolkata delivery
                </p>
              </header>

              {/* Two-Column Grid */}
              <div className="oc-grid">
                
                {/* LEFT: Items List */}
                <div className="oc-card">
                  <h3 className="oc-title">Items in Bouquet Order</h3>
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
                      <span>Total Paid</span>
                      <strong>₹{total.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Order Details */}
                <aside className="oc-card">
                  <h3 className="oc-title">Delivery Details</h3>
                  <dl className="oc-dl">
                    <div>
                      <dt>ORDER NUMBER</dt>
                      <dd>#{order.orderNumber}</dd>
                    </div>
                    <div>
                      <dt>ORDER DATE</dt>
                      <dd>{orderDate}</dd>
                    </div>
                    <div>
                      <dt>CUSTOMER</dt>
                      <dd>{order.customer?.name || 'Customer'}</dd>
                    </div>
                    <div>
                      <dt>SHIPPING ADDRESS</dt>
                      <dd>{addressFormatted}</dd>
                    </div>
                    <div>
                      <dt>DELIVERY SLOT</dt>
                      <dd>Standard delivery (9 AM – 9 PM)</dd>
                    </div>
                    <div>
                      <dt>PAYMENT STATUS</dt>
                      <dd>Paid Online (100% Verified)</dd>
                    </div>
                    {order.specialNote && (
                      <div>
                        <dt>MESSAGE CARD NOTE</dt>
                        <dd className="italic bg-white p-3 rounded-[10px] border border-black/[0.08]">
                          &ldquo;{order.specialNote}&rdquo;
                        </dd>
                      </div>
                    )}
                  </dl>
                </aside>

              </div>

              {/* Delivery Progress Milestones */}
              <section className="oc-next">
                <h3 className="oc-title">Delivery Progress</h3>
                <ol className="oc-steps">
                  {STEPS.map((step, idx) => {
                    const isDone = idx < activeStep;
                    const isCurrent = idx === activeStep;
                    const statusClass = isDone ? 'done' : isCurrent ? 'current' : 'pending';
                    return (
                      <li key={step.key} className="oc-step">
                        <span className={`oc-step-n ${statusClass}`} aria-hidden="true">
                          {isDone ? '✓' : idx + 1}
                        </span>
                        <div>
                          <strong>{step.label}</strong>
                          <p>{step.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>

              {/* Bottom Actions */}
              <div className="oc-btns">
                <Link href="/shop" className="oc-btn-primary">
                  <span>Continue shopping</span>
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="oc-btn-ghost"
                  style={{ borderColor: '#25D366', color: '#128C7E' }}
                >
                  <span>WhatsApp Concierge</span>
                </a>
              </div>

            </div>
          ) : searched && !loading ? (
            /* No Order Found */
            <div className="max-w-[480px] mx-auto text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#f4f4f4] text-[#555] flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#111] mb-2">
                No order found for &ldquo;{searchInput}&rdquo;
              </h3>
              <p className="text-sm text-[#666] leading-relaxed mb-6">
                Please check the order number in your confirmation email or message us on WhatsApp for instant assistance.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="oc-btn-primary"
                  style={{ background: '#25D366', borderColor: '#25D366' }}
                >
                  <span>Help on WhatsApp</span>
                </a>
                <Link href="/shop" className="oc-btn-ghost">
                  <span>Explore Bouquets</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Initial Search State (Clean template introduction) */
            <div className="max-w-[500px] mx-auto text-center py-8">
              <div className="oc-card text-left p-6 sm:p-7">
                <h4 className="font-bold text-base text-[#111] mb-2">Where to find your order number?</h4>
                <p className="text-sm text-[#555] leading-relaxed mb-4">
                  Your order number starts with <strong>NER-</strong> and was sent to your email and displayed on the confirmation receipt right after checkout.
                </p>
                <div className="text-xs text-[#888] pt-3 border-t border-black/[0.06] flex items-center justify-between">
                  <span>Need help?</span>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#111] underline hover:text-[#bfa81f]">
                    Chat with Concierge →
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-black/[0.1] border-t-[#111] rounded-full animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
