'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Navigation, CheckCircle2, AlertTriangle, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeliveryLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSet: (locationName: string, isAvailable: boolean) => void;
}

// Haversine Distance Formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Real New Eco Roses Store Locations
const STORES = [
    { name: 'Regent Park', lat: 22.4884, lng: 88.3560 },
    { name: 'New Alipore', lat: 22.5112, lng: 88.3281 },
];

const KOLKATA_PINCODE_REGEX = /^700\d{3}$/;

export default function DeliveryLocationModal({ isOpen, onClose, onLocationSet }: DeliveryLocationModalProps) {
    const [pincode, setPincode] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'available' | 'unavailable' | 'error'>('idle');
    const [detectedArea, setDetectedArea] = useState('');
    const [nearestStore, setNearestStore] = useState('');

    // iOS-safe scroll lock when modal is open
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'scroll';
        } else {
            const top = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
            if (top) window.scrollTo(0, parseInt(top || '0', 10) * -1);
        }
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem('newecoroses_delivery_loc');
            if (saved) setDetectedArea(saved);
            setStatus('idle');
            setPincode('');
        }
    }, [isOpen]);

    const checkDistance = (userLat: number, userLng: number) => {
        let minDist = Infinity;
        let nearest = STORES[0].name;
        for (const store of STORES) {
            const d = calculateDistance(userLat, userLng, store.lat, store.lng);
            if (d < minDist) { minDist = d; nearest = store.name; }
        }
        return { minDist, nearest };
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) return alert('Geolocation not supported by your browser.');
        setLoading(true);
        setStatus('idle');

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const { minDist, nearest } = checkDistance(latitude, longitude);

                let areaName = 'Your Area';
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
                        { headers: { 'User-Agent': 'NewEcoRoses/1.0' } }
                    );
                    const data = await res.json();
                    if (data?.address) {
                        areaName = data.address.suburb || data.address.neighbourhood ||
                            data.address.city_district || data.address.city || 'Your Area';
                    }
                } catch {}

                setDetectedArea(areaName);
                setNearestStore(nearest);
                setLoading(false);

                if (minDist <= 20) {
                    setStatus('available');
                    localStorage.setItem('newecoroses_delivery_loc', areaName);
                    onLocationSet(areaName, true);
                } else {
                    setStatus('unavailable');
                    onLocationSet(areaName, false);
                }
            },
            () => { setLoading(false); setStatus('error'); },
            { timeout: 10000 }
        );
    };

    const handlePincodeSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const clean = pincode.trim();
        if (clean.length !== 6) return;
        setLoading(true);
        setStatus('idle');
        setTimeout(() => {
            const area = `Pincode ${clean}`;
            setLoading(false);
            if (KOLKATA_PINCODE_REGEX.test(clean)) {
                setDetectedArea(area);
                setNearestStore('Regent Park');
                setStatus('available');
                localStorage.setItem('newecoroses_delivery_loc', area);
                onLocationSet(area, true);
            } else {
                setDetectedArea(area);
                setStatus('unavailable');
                onLocationSet(area, false);
            }
        }, 400);
    };

    const whatsappMsg = encodeURIComponent(
        `Hi! I'd like to confirm delivery to ${detectedArea || 'my location'}. Please let me know if delivery is available and the charges.`
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center" style={{ touchAction: 'none' }}>
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

                {/* Modal — bottom sheet on mobile, centered on sm+ */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                    className="relative w-full sm:max-w-[400px] bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl border border-[#f0ead8] z-10 overflow-hidden"
                    style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.14), 0 4px 24px rgba(0,0,0,0.06)' }}
                >
                    {/* Drag Handle (mobile) */}
                    <div className="sm:hidden flex justify-center pt-2.5 pb-0">
                        <div className="w-9 h-1 rounded-full bg-[#d0c8b4]" />
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full bg-[#f5f0e8] hover:bg-[#ebe5d5] text-[#6b5c3e] flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                    >
                        <X size={14} strokeWidth={2.5} />
                    </button>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#4a5c3e] to-[#3d4f30] px-5 pt-4 pb-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                            <MapPin size={17} className="text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="font-serif text-[16px] font-bold text-white leading-tight">
                                Where to deliver?
                            </h3>
                            <p className="text-[11px] text-white/65 leading-tight mt-0.5">
                                Kolkata · 20 km radius from our 2 stores
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-4 py-4 space-y-3">
                        {/* Detect Location */}
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleDetectLocation}
                            className="w-full bg-[#4a5c3e] hover:bg-[#3d4f30] active:bg-[#2e3d23] text-white font-semibold text-[13px] py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <><Loader2 size={15} className="animate-spin text-amber-300 flex-shrink-0" /><span>Detecting location...</span></>
                            ) : (
                                <><Navigation size={15} className="text-amber-300 flex-shrink-0" /><span>Use my current location</span></>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-2.5 text-[10px] text-[#9e8f72] font-medium tracking-widest uppercase">
                            <div className="flex-1 h-px bg-[#ede7d5]" />
                            <span>or enter pincode</span>
                            <div className="flex-1 h-px bg-[#ede7d5]" />
                        </div>

                        {/* Pincode Form */}
                        <form onSubmit={handlePincodeSearch} className="relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                placeholder="Enter 6-digit pincode…"
                                className="w-full pl-4 pr-12 py-3 bg-[#faf8f4] border border-[#e8dcc8] focus:border-[#4a5c3e] rounded-2xl text-[13px] text-[#2a2420] placeholder:text-[#b0a48a] focus:outline-none focus:ring-2 focus:ring-[#4a5c3e]/12 transition-all font-mono tracking-wider"
                            />
                            <button
                                type="submit"
                                disabled={pincode.length !== 6 || loading}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#4a5c3e] hover:bg-[#3d4f30] text-white rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Search size={14} strokeWidth={2.5} />
                            </button>
                        </form>

                        {/* Coverage hint */}
                        <p className="text-[10.5px] text-[#9e8f72] text-center leading-snug">
                            Works for all <strong className="text-[#4a5c3e]">Kolkata 700XXX</strong> pincodes — Regent Park &amp; New Alipore
                        </p>

                        {/* ── Status Results ── */}
                        {status === 'available' && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5"
                            >
                                <div className="flex items-center gap-2 text-emerald-800 font-bold text-[13px] mb-1">
                                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                                    <span>Same Day Delivery Available ✓</span>
                                </div>
                                <p className="text-[11px] text-emerald-700 leading-snug pl-6">
                                    We deliver to <strong>{detectedArea}</strong> from our <strong>{nearestStore}</strong> store.
                                </p>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-2.5 ml-6 text-[12px] font-bold text-emerald-900 bg-emerald-200/80 hover:bg-emerald-200 px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                    Start Shopping →
                                </button>
                            </motion.div>
                        )}

                        {status === 'unavailable' && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5"
                            >
                                <div className="flex items-center gap-2 text-amber-900 font-bold text-[13px] mb-1">
                                    <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
                                    <span>Outside Standard Delivery Zone</span>
                                </div>
                                <p className="text-[11px] text-amber-800 leading-snug pl-6 mb-2.5">
                                    <strong>{detectedArea}</strong> is outside our 20 km zone. Contact us on WhatsApp to arrange delivery.
                                </p>
                                <a
                                    href={`https://wa.me/919936911611?text=${whatsappMsg}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-6 inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-[12px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 32 32">
                                        <path d="M16.004 0C7.164 0 0 7.163 0 16c0 2.824.74 5.479 2.031 7.787L0 32l8.455-2.002A15.93 15.93 0 0016.004 32C24.836 32 32 24.837 32 16S24.836 0 16.004 0zm0 29.234a13.21 13.21 0 01-6.726-1.832l-.48-.285-4.977 1.177 1.232-4.843-.313-.494A13.155 13.155 0 012.766 16C2.766 8.685 8.685 2.766 16 2.766S29.234 8.685 29.234 16 23.316 29.234 16.004 29.234zm7.27-9.862c-.398-.2-2.36-1.164-2.726-1.296-.366-.133-.633-.2-.9.2-.266.398-1.03 1.296-1.265 1.563-.233.266-.465.3-.864.1-.398-.2-1.682-.62-3.204-1.977-1.184-1.056-1.983-2.36-2.216-2.758-.232-.398-.024-.613.175-.812.18-.18.398-.465.598-.697.2-.233.266-.398.398-.664.133-.266.067-.498-.033-.697-.1-.2-.9-2.16-1.232-2.958-.325-.78-.657-.674-.9-.686-.232-.012-.498-.015-.764-.015s-.697.1-1.063.498c-.366.398-1.396 1.364-1.396 3.327s1.43 3.86 1.63 4.127c.198.266 2.816 4.296 6.825 6.025.953.412 1.697.657 2.276.841.957.305 1.826.262 2.515.159.767-.115 2.36-.964 2.693-1.896.332-.932.332-1.73.232-1.896-.1-.166-.366-.265-.764-.465z" />
                                    </svg>
                                    Confirm via WhatsApp
                                </a>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <p className="text-[11px] text-center text-red-500 font-medium bg-red-50 rounded-xl px-3 py-2.5 border border-red-100">
                                Could not detect location. Please enter your 6-digit pincode above.
                            </p>
                        )}
                    </div>

                    {/* Bottom safe area for mobile (iPhone home indicator) */}
                    <div className="h-2 sm:hidden" />
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
