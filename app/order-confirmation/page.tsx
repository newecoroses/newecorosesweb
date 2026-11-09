'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
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
            .then(s => {
                if (s?.phone_number) setPhone(s.phone_number);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        // Trigger celebratory confetti on mount
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }
            const particleCount = 40 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
                colors: ['#bfa81f', '#e6c845', '#1c1917', '#22c55e', '#f43f5e'],
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
                colors: ['#bfa81f', '#e6c845', '#1c1917', '#22c55e', '#f43f5e'],
            });
        }, 300);

        // Fetch order details
        if (orderNumber) {
            fetch(`/api/orders?orderNumber=${orderNumber}`)
                .then(r => r.json())
                .then(data => {
                    if (data.success && data.order) {
                        setOrder(data.order);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }

        return () => clearInterval(interval);
    }, [orderNumber]);

    const statusSteps = [
        'Order Received',
        'Bouquet Handcrafted',
        'Out for Delivery',
        'Delivered',
    ];

    const whatsappHelpMessage = `Hi New Eco Roses! I placed an order with Order ID #${orderNumber}. Could you please share the delivery progress? Thank you!`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappHelpMessage)}`;

    return (
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4 sm:p-6 text-[#1c1917]">
            <div className="w-full max-w-lg">
                
                {/* Luxury Confirmation Card */}
                <div className="bg-white border border-gray-200/90 shadow-xl rounded-3xl overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-[#1c1917] text-white p-6 sm:p-8 text-center relative overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center">
                            {/* Animated Checkmark in Brand Gold */}
                            <div className="w-14 h-14 mb-3.5 bg-[#bfa81f] text-white rounded-full flex items-center justify-center shadow-lg">
                                <Check size={28} strokeWidth={3} />
                            </div>
                            <span className="text-[11px] tracking-[0.25em] uppercase text-amber-300 font-bold mb-1">
                                New Eco Roses
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-1">
                                Order Confirmed
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-300 font-light">
                                Thank you! Your floral arrangement is being prepared with love.
                            </p>
                        </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="p-6 sm:p-8 space-y-6">
                        
                        {/* Order Info Row */}
                        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Order No.</p>
                                <p className="text-base font-bold text-[#1c1917]">#{orderNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Date</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    }) : new Date().toLocaleDateString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div>
                            <p className="text-xs font-bold text-gray-700 mb-3">Delivery Progress</p>
                            <div className="flex items-center justify-between relative px-2">
                                <div className="absolute left-3 right-3 top-2.5 h-[2px] bg-gray-200 z-0">
                                    <div className="h-full bg-[#bfa81f]" style={{ width: '15%' }} />
                                </div>
                                {statusSteps.map((step, idx) => (
                                    <div key={step} className="relative z-10 flex flex-col items-center">
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                                idx === 0
                                                    ? 'bg-[#bfa81f] text-white ring-4 ring-amber-100'
                                                    : 'bg-white border-2 border-gray-300 text-gray-400'
                                            }`}
                                        >
                                            {idx === 0 ? <Check size={11} strokeWidth={3} /> : idx + 1}
                                        </div>
                                        <span className={`text-[9px] uppercase tracking-wider mt-2 font-semibold text-center max-w-[65px] ${
                                            idx === 0 ? 'text-[#bfa81f]' : 'text-gray-400'
                                        }`}>
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Items (if loaded) */}
                        {order?.items && order.items.length > 0 && (
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-700 mb-2.5">Items in Bouquet Order</p>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {order.items.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center text-xs py-1">
                                            <span className="text-gray-800 font-medium">
                                                {item.quantity}x {item.name}
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                {item.price > 0 ? `₹${(item.price * item.quantity).toLocaleString('en-IN')}` : 'Included'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Total Amount */}
                        <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                            <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Total Paid</span>
                                <span className="text-[10px] text-gray-400 block">Payment: {order?.paymentMethod === 'cod' ? 'Cash / Pay on Delivery' : 'Online Payment (Confirmed)'}</span>
                            </div>
                            <span className="text-xl font-extrabold text-[#1c1917]">
                                {order?.total ? `₹${order.total.toLocaleString('en-IN')}` : 'Order Received'}
                            </span>
                        </div>

                        {/* Customer Email Notice */}
                        {order?.customer?.email && (
                            <div className="text-[11px] text-gray-600 bg-amber-50/60 border border-amber-100 py-2.5 px-3.5 rounded-xl text-center">
                                Confirmation receipt and updates sent to <span className="font-semibold text-gray-800">{order.customer.email}</span>
                            </div>
                        )}

                        {/* Action CTAs */}
                        <div className="space-y-2.5 pt-2">
                            {/* WhatsApp Updates Button */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-all"
                            >
                                <WhatsappIcon size={18} />
                                <span>Get Live Updates on WhatsApp</span>
                            </a>

                            {/* Continue Shopping */}
                            <Link
                                href="/shop"
                                className="w-full flex items-center justify-center gap-2 bg-[#1c1917] hover:bg-black text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-all"
                            >
                                <ShoppingBag size={16} />
                                <span>Explore More Floral Gifts</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Help */}
                <p className="text-center text-xs text-gray-500 mt-5">
                    Questions about your order? Call or WhatsApp us directly at <a href={`tel:${phone}`} className="font-bold underline text-gray-700">+{phone}</a>
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
