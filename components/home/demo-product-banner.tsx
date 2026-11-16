'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, Check } from 'lucide-react';

const DEMO_PRODUCT = {
  id: 'demo-razorpay-test-001',
  name: 'Demo Product — ₹1 Payment Check',
  slug: 'demo-test-payment',
  price: 1,
  image_url: '/images/handpicked/red-romance.webp',
  quantity: 1,
};

export default function DemoProductBanner() {
  const router = useRouter();
  const { addItem, getItemQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const cartQty = getItemQuantity(DEMO_PRODUCT.id);

  const handleBuyNow = () => {
    try {
      sessionStorage.setItem('ner_buy_now', JSON.stringify([DEMO_PRODUCT]));
    } catch {}
    router.push('/checkout?buyNow=true');
  };

  const handleAddToCart = () => {
    addItem(DEMO_PRODUCT);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-r from-[#1c1917] via-[#292524] to-[#1c1917] text-white my-3 border-y border-[#bfa81f]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          
          {/* Left: Product Media + Details */}
          <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
            {/* Image */}
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-stone-800 flex-shrink-0 border border-amber-300/30 shadow-md">
              <img
                src={DEMO_PRODUCT.image_url}
                alt={DEMO_PRODUCT.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp';
                }}
              />
              <span className="absolute top-1.5 left-1.5 bg-[#bfa81f] text-black text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm">
                ₹1 DEMO
              </span>
            </div>

            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-[#bfa81f]/20 text-amber-300 border border-[#bfa81f]/40 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Razorpay Payment Check
                </span>
                <span className="text-stone-400 text-xs">Live Gateway Test</span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight leading-snug">
                Demo Product — ₹1 Payment Check
              </h3>
              <p className="text-xs text-stone-300 mt-1 max-w-lg leading-relaxed">
                Featured test item to verify the live Razorpay payment gateway and automated email receipts.
              </p>
            </div>
          </div>

          {/* Right: Pricing & Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <div className="text-left sm:text-right mr-2">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">Special Test Price</span>
              <span className="text-2xl font-black text-amber-400">₹1</span>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                justAdded
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={14} className="stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  <span>{cartQty > 0 ? `In Cart (${cartQty})` : 'Add to Cart'}</span>
                </>
              )}
            </button>

            {/* Buy Now (Direct checkout) */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-1.5 py-2.5 px-5 rounded-xl bg-[#bfa81f] hover:bg-[#a89216] text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
            >
              <Zap size={14} className="fill-black" />
              <span>Buy Now (₹1)</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
