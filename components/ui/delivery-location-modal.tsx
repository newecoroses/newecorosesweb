'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Navigation, CheckCircle2, AlertTriangle, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { evaluatePincode, PincodeCheckResult } from '@/lib/kolkata-pincodes';

interface DeliveryLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSet: (locationName: string, isAvailable: boolean) => void;
}

const POPULAR_PINCODES = [
    { code: '700040', name: 'Regent Park' },
    { code: '700053', name: 'New Alipore' },
    { code: '700033', name: 'Tollygunge' },
    { code: '700019', name: 'Ballygunge' },
    { code: '700016', name: 'Park Street' },
    { code: '700091', name: 'Salt Lake' },
];

export default function DeliveryLocationModal({ isOpen, onClose, onLocationSet }: DeliveryLocationModalProps) {
    const [pincode, setPincode] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkResult, setCheckResult] = useState<PincodeCheckResult | null>(null);
    const [detectedArea, setDetectedArea] = useState('');

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
            setCheckResult(null);
            setPincode('');
        }
    }, [isOpen]);

    const performPincodeCheck = (code: string) => {
        const clean = code.trim().replace(/\D/g, '');
        setPincode(clean);
        if (clean.length === 6) {
            setLoading(true);
            setTimeout(() => {
                const res = evaluatePincode(clean);
                setCheckResult(res);
                setLoading(false);
                if (res.isServiceable) {
                    const locLabel = res.area ? res.area.split('/')[0].trim() : `Kolkata, ${clean}`;
                    setDetectedArea(locLabel);
                    localStorage.setItem('newecoroses_delivery_loc', locLabel);
                    onLocationSet(locLabel, true);
                } else {
                    onLocationSet(`PIN ${clean}`, false);
                }
            }, 250);
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setLoading(true);
        setCheckResult(null);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                let areaName = 'Kolkata Central';
                let detectedPostcode = '700040';

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
                        { headers: { 'User-Agent': 'NewEcoRoses/1.0' } }
                    );
                    const data = await res.json();
                    if (data?.address) {
                        detectedPostcode = data.address.postcode || '700040';
                        areaName = data.address.suburb || data.address.neighbourhood || data.address.city || 'Kolkata';
                    }
                } catch {}

                setLoading(false);
                performPincodeCheck(detectedPostcode);
            },
            () => {
                setLoading(false);
                alert('Could not access current location. Please enter your 6-digit pincode.');
            },
            { timeout: 9000 }
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/45 backdrop-blur-xs"
                    onClick={onClose}
                />

                {/* Modal Container (Secure Checkout UI Style) */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative w-full sm:max-w-[430px] bg-white rounded-t-[24px] sm:rounded-[22px] border border-black/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.14)] z-10 overflow-hidden"
                >
                    {/* Mobile drag bar */}
                    <div className="sm:hidden flex justify-center pt-2.5 pb-1">
                        <div className="w-10 h-1 rounded-full bg-black/15" />
                    </div>

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#f4f4f4] hover:bg-[#eaeaea] text-[#111] flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={16} className="stroke-[2.2]" />
                    </button>

                    {/* Modal Content */}
                    <div className="p-6 sm:p-7 space-y-4">
                        {/* Header */}
                        <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#777] mb-1">
                                Delivery Location
                            </p>
                            <h3 className="font-sans text-[20px] font-extrabold text-[#111] tracking-tight leading-tight">
                                Where should we deliver?
                            </h3>
                            <p className="text-xs text-[#666] mt-1 font-normal">
                                Same-day &amp; slot delivery across Kolkata from our Tollygunge &amp; New Alipore hubs.
                            </p>
                        </div>

                        {/* Pincode Input Box (Checkout Field Style) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#111] flex items-center gap-1.5">
                                <MapPin size={13} className="text-[#bfa81f]" />
                                <span>Enter 6-digit Pincode</span>
                            </label>
                            
                            <div className="flex items-center bg-[#f7f7f7] border border-black/[0.1] rounded-[13px] overflow-hidden focus-within:border-[#bfa81f] focus-within:ring-2 focus-within:ring-[#bfa81f]/20 transition-all shadow-2xs">
                                <div className="flex items-center gap-1.5 px-3 py-3 border-r border-black/[0.08] bg-white flex-shrink-0 cursor-default">
                                    <div className="w-5 h-3.5 rounded-[2px] overflow-hidden border border-black/10 flex-shrink-0">
                                        <svg className="w-full h-full" viewBox="0 0 36 24" fill="none">
                                            <rect width="36" height="8" fill="#FF9933" />
                                            <rect y="8" width="36" height="8" fill="#FFFFFF" />
                                            <rect y="16" width="36" height="8" fill="#138808" />
                                            <circle cx="18" cy="12" r="3" fill="none" stroke="#000080" strokeWidth="0.8" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-bold text-[#111]">IND</span>
                                </div>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={pincode}
                                    onChange={(e) => performPincodeCheck(e.target.value)}
                                    placeholder="e.g. 700001"
                                    className="w-full px-3 py-3 text-sm font-mono tracking-wider font-bold text-[#111] placeholder:text-gray-400 focus:outline-none bg-transparent"
                                />

                                <button
                                    type="button"
                                    disabled={pincode.length !== 6 || loading}
                                    onClick={() => performPincodeCheck(pincode)}
                                    className="px-4 py-3 bg-[#bfa81f] hover:bg-[#a89216] disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0 cursor-pointer"
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin" /> : 'Check'}
                                </button>
                            </div>
                        </div>

                        {/* ── Status Result Alert (Matching Checkout Page Style) ── */}
                        {checkResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3.5 rounded-[13px] border ${
                                    checkResult.isServiceable
                                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-950'
                                        : 'bg-amber-500/10 border-amber-500/25 text-amber-950'
                                }`}
                            >
                                <div className="flex items-start gap-2.5">
                                    {checkResult.isServiceable ? (
                                        <CheckCircle2 size={17} className="text-emerald-700 stroke-[2.5] flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertTriangle size={17} className="text-amber-700 stroke-[2.2] flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-xs font-bold leading-tight">
                                            {checkResult.isServiceable
                                                ? 'Same-Day Delivery Available ✓'
                                                : 'Special Delivery Route Required'}
                                        </p>
                                        <p className="text-[11.5px] opacity-90 leading-snug mt-1">
                                            {checkResult.message}
                                        </p>
                                        {checkResult.isServiceable && (
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="mt-2 text-xs font-extrabold uppercase tracking-wider text-emerald-800 hover:underline"
                                            >
                                                Confirm &amp; Continue →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Detect GPS Location Button */}
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleDetectLocation}
                            className="w-full bg-white hover:bg-gray-50 border border-black/[0.12] rounded-[13px] py-2.5 px-4 text-xs font-bold text-[#111] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin text-[#bfa81f]" />
                                    <span>Detecting location...</span>
                                </>
                            ) : (
                                <>
                                    <Navigation size={14} className="text-[#bfa81f]" />
                                    <span>Use My Current Location</span>
                                </>
                            )}
                        </button>

                        {/* Popular Areas Quick-Pills */}
                        <div className="pt-2 border-t border-black/[0.07]">
                            <p className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#777] mb-2">
                                Popular Kolkata Hubs
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {POPULAR_PINCODES.map((p) => (
                                    <button
                                        key={p.code}
                                        type="button"
                                        onClick={() => performPincodeCheck(p.code)}
                                        className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#f7f7f7] hover:bg-[#bfa81f]/10 hover:border-[#bfa81f] border border-black/[0.08] text-[#111] transition-all cursor-pointer"
                                    >
                                        {p.name} ({p.code})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
