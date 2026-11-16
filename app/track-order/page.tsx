'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  Search, 
  ArrowLeft, 
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { fetchWhatsappSettings } from '@/lib/supabase';

const FALLBACK_PHONE = '919936911611';

const STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Order & payment successfully received' },
  { key: 'processing', label: 'Bouquet Handcrafted', desc: 'Artisans hand-arranging fresh blooms' },
  { key: 'delivery', label: 'Out for Delivery', desc: 'Dispatched in climate-controlled care' },
  { key: 'delivered', label: 'Delivered', desc: 'Delivered fresh with signature packaging' },
];

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
      .then(s => {
        if (s?.phone_number) setPhone(s.phone_number);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder(orderNumber);
    }
  }, [orderNumber]);

  const fetchOrder = async (no: string) => {
    const cleanNo = no.trim().toUpperCase();
    if (!cleanNo) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(cleanNo)}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
      }
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setOrderNumber(searchInput.trim());
    }
  };

  // Determine current step index
  const getStepIndex = (status?: string) => {
    const s = (status || 'confirmed').toLowerCase();
    if (s === 'delivered') return 3;
    if (s === 'out_for_delivery' || s === 'dispatched' || s === 'delivery') return 2;
    if (s === 'processing' || s === 'handcrafting') return 1;
    return 0; // confirmed / paid / pending
  };

  const activeStep = getStepIndex(order?.status);

  const whatsappMsg = `Hi New Eco Roses! I'm tracking Order #${orderNumber || searchInput}. Could you please update me on delivery progress? Thank you!`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="min-h-screen bg-[#faf7f2] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider font-bold text-[#bfa81f] hover:text-[#a89216] transition-colors"
          >
            Explore Bouquet Shop →
          </Link>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#bfa81f]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#bfa81f]">
              Live Order Tracking
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight mb-2">
            Track Your Floral Delivery
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
            Enter your New Eco Roses Order ID (e.g. <span className="font-mono text-gray-800 font-semibold">NER-123456</span>) to view real-time handcrafted progress and delivery updates.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order Number (e.g. NER-592812)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#faf7f2] border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-mono font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:border-[#bfa81f] focus:ring-1 focus:ring-[#bfa81f] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="px-6 py-3.5 bg-[#bfa81f] hover:bg-[#a89216] text-white rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2 flex-shrink-0"
            >
              <Search size={16} />
              <span>{loading ? 'Searching…' : 'Track'}</span>
            </button>
          </form>
        </div>

        {/* Order Details Result */}
        {order ? (
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            
            {/* Top Gold Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#bfa81f] via-[#e6c845] to-[#bfa81f]" />

            {/* Status Header */}
            <div className="bg-[#1c1917] text-white p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-300">
                      Order Confirmed & Active
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
                    #{order.orderNumber}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    <Calendar size={13} />
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'Just now'}
                  </p>
                </div>

                <div className="text-left sm:text-right bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">Total Amount</span>
                  <span className="text-2xl font-extrabold text-amber-400">
                    ₹{order.total ? order.total.toLocaleString('en-IN') : '0'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                    ✓ Verified Paid
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Timeline Tracker */}
            <div className="p-6 sm:p-8 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-6">
                Delivery Milestones
              </h3>

              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-gray-100 z-0">
                  <div
                    className="h-full bg-[#bfa81f] transition-all duration-500"
                    style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                  {STEPS.map((step, idx) => {
                    const isDone = idx <= activeStep;
                    const isCurrent = idx === activeStep;
                    return (
                      <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        {/* Milestone Circle */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                            isDone
                              ? 'bg-[#bfa81f] text-white shadow-md ring-4 ring-amber-100'
                              : 'bg-white border-2 border-gray-200 text-gray-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={16} strokeWidth={2.5} /> : idx + 1}
                        </div>

                        {/* Text */}
                        <div className="flex-1 sm:flex-none">
                          <p className={`text-xs font-bold tracking-tight ${
                            isCurrent ? 'text-black' : isDone ? 'text-[#bfa81f]' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div className="p-6 sm:p-8 border-b border-gray-100 bg-[#faf7f2]/50">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Bouquet Order Items ({order.items.length})
                </h3>
                <div className="space-y-3">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3.5 bg-white p-3 rounded-2xl border border-gray-100">
                      <div className="w-12 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={item.image_url || '/images/placeholder.webp'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        {item.price > 0 ? `₹${(item.price * item.quantity).toLocaleString('en-IN')}` : 'Included'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Details */}
            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {order.shippingAddress && (
                <div className="border border-gray-100 rounded-2xl p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2 text-[#bfa81f]">
                    <MapPin size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Delivery Address
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed font-medium">
                    {order.customer?.name}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
                  </p>
                  <p className="text-xs text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                  </p>
                </div>
              )}

              {order.specialNote && (
                <div className="border border-amber-200/60 rounded-2xl p-4 bg-amber-50/50">
                  <div className="flex items-center gap-2 mb-2 text-amber-800">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Delivery Note & Gift Card
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    {order.specialNote}
                  </p>
                </div>
              )}
            </div>

            {/* Help & Support Actions */}
            <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-gray-900">Need immediate help with delivery?</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Our floral concierge is available on WhatsApp daily 9 AM - 9 PM.
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <WhatsappIcon size={16} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

          </div>
        ) : searched && !loading ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package size={26} />
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
              No Order Found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
              We couldn't find an order matching <span className="font-mono font-bold text-gray-800">#{orderNumber}</span>. Please verify your order number from your confirmation email.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#bfa81f] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#a89216] transition-all"
            >
              Contact Support on WhatsApp
            </a>
          </div>
        ) : null}

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#bfa81f] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
