'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Phone, ArrowLeft, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface AuthDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (userData: { email: string; name: string; phone: string }) => void;
    initialEmail?: string;
}

export default function AuthDrawer({ isOpen, onClose, onSuccess, initialEmail = '' }: AuthDrawerProps) {
    const [step, setStep] = useState<'email' | 'details' | 'otp'>('email');
    const [email, setEmail] = useState(initialEmail);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(30);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Reset or initialize when drawer opens
    useEffect(() => {
        if (isOpen) {
            setError('');
            setShowSuccessToast(false);
            // Check if there is already an email/name saved in localStorage
            try {
                const storedUser = localStorage.getItem('ner_verified_user');
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    if (parsed.email) setEmail(parsed.email);
                    if (parsed.name) setName(parsed.name);
                    if (parsed.phone) setPhone(parsed.phone);
                } else {
                    const savedEmail = localStorage.getItem('ner_user_email');
                    if (savedEmail) setEmail(savedEmail);
                }
            } catch {}
        } else {
            // reset to step email on close after slight delay
            setTimeout(() => {
                setStep('email');
                setOtp(['', '', '', '', '', '']);
                setError('');
            }, 300);
        }
    }, [isOpen]);

    // Resend countdown timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'otp' && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, resendTimer]);

    // Focus first OTP box on entering OTP step
    useEffect(() => {
        if (step === 'otp') {
            setTimeout(() => {
                otpInputRefs.current[0]?.focus();
            }, 250);
        }
    }, [step]);

    // Mask helper
    const getMaskedPhone = (num: string) => {
        const clean = num.replace(/\D/g, '');
        if (clean.length < 4) return '******' + clean;
        return '******' + clean.slice(-4);
    };

    const getMaskedEmail = (em: string) => {
        const parts = em.split('@');
        if (parts.length !== 2) return em;
        const namePart = parts[0];
        const domain = parts[1];
        if (namePart.length <= 4) return namePart.slice(0, 1) + '****@' + domain;
        return namePart.slice(0, 2) + '****' + namePart.slice(-3) + '@' + domain;
    };

    // Step 1: Continue
    const handleContinueEmail = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError('');
        const trimmed = email.trim().toLowerCase();
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setError('Please enter a valid email address');
            return;
        }
        setEmail(trimmed);
        setStep('details');
    };

    // Step 2: Start Gifting (Send OTP)
    const handleStartGifting = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError('');
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();
        const cleanPhone = phone.replace(/\D/g, '');

        if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError('Valid email address is required');
            return;
        }
        if (!trimmedName || trimmedName.length < 2) {
            setError('Please enter your full name');
            return;
        }
        if (!cleanPhone || cleanPhone.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmedEmail, name: trimmedName }),
            });
            const data = await res.json();
            if (data.success) {
                setResendTimer(30);
                setShowSuccessToast(true);
                setStep('otp');
            } else {
                setError(data.error || 'Failed to send OTP. Please try again.');
            }
        } catch {
            setError('Network error sending verification code. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (resendTimer > 0 || isLoading) return;
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), name: name.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setResendTimer(30);
                setShowSuccessToast(true);
                setOtp(['', '', '', '', '', '']);
                otpInputRefs.current[0]?.focus();
            } else {
                setError(data.error || 'Failed to resend code');
            }
        } catch {
            setError('Network error resending code');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: OTP Input Handlers
    const handleOtpChange = (index: number, val: string) => {
        if (!/^\d*$/.test(val)) return;
        const newOtp = [...otp];
        newOtp[index] = val.slice(-1);
        setOtp(newOtp);
        setError('');

        if (val && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }

        // Auto verify when all 6 digits entered
        if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
            submitVerifyOtp(newOtp.join(''));
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            const digits = pasted.split('');
            setOtp(digits);
            submitVerifyOtp(pasted);
        }
    };

    // Verify OTP API Call
    const submitVerifyOtp = async (otpCode?: string) => {
        const code = otpCode || otp.join('');
        if (code.length !== 6) {
            setError('Please enter all 6 digits of the OTP');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp: code }),
            });
            const data = await res.json();
            if (data.success) {
                const verifiedUser = {
                    email: email.trim(),
                    name: name.trim(),
                    phone: phone.replace(/\D/g, ''),
                    verified: true,
                    verifiedAt: Date.now(),
                };
                localStorage.setItem('ner_verified_user', JSON.stringify(verifiedUser));
                localStorage.setItem('ner_user_email', verifiedUser.email);
                localStorage.setItem('ner_user_name', verifiedUser.name);
                localStorage.setItem('ner_user_phone', verifiedUser.phone);

                onSuccess(verifiedUser);
            } else {
                setError(data.error || 'Invalid OTP. Please check and try again.');
            }
        } catch {
            setError('Verification failed due to a network error.');
        } finally {
            setIsLoading(false);
        }
    };

    // Google Login Sim / Quick Auth
    const handleGoogleLogin = () => {
        const defaultGoogleEmail = email || 'customer@gmail.com';
        const defaultGoogleName = name || 'Valued Customer';
        const defaultGooglePhone = phone || '9876543210';
        setEmail(defaultGoogleEmail);
        setName(defaultGoogleName);
        setPhone(defaultGooglePhone);

        const verifiedUser = {
            email: defaultGoogleEmail,
            name: defaultGoogleName,
            phone: defaultGooglePhone,
            verified: true,
            verifiedAt: Date.now(),
        };
        localStorage.setItem('ner_verified_user', JSON.stringify(verifiedUser));
        localStorage.setItem('ner_user_email', verifiedUser.email);
        localStorage.setItem('ner_user_name', verifiedUser.name);
        localStorage.setItem('ner_user_phone', verifiedUser.phone);

        onSuccess(verifiedUser);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
                    />

                    {/* Floating Close Button outside drawer (matches reference Image 2) */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="fixed top-5 right-[450px] sm:right-[470px] z-[1001] w-10 h-10 rounded-full bg-white text-[#111] shadow-lg flex items-center justify-center hover:bg-gray-100 transition-transform active:scale-95 cursor-pointer max-lg:hidden"
                        title="Close"
                        aria-label="Close drawer"
                    >
                        <X size={20} className="stroke-[2.5]" />
                    </button>

                    {/* Slide-over Sheet */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                        className="relative z-[1000] w-full max-w-[440px] sm:max-w-[460px] h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto"
                    >
                        {/* Mobile close button (inside sheet on small screens) */}
                        <div className="lg:hidden flex justify-end p-3.5 pb-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-[#333] flex items-center justify-center cursor-pointer transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Top Content Area */}
                        <div className="px-6 sm:px-8 pt-5 sm:pt-7 flex-1">
                            <AnimatePresence mode="wait">
                                {/* ── SCREEN 1: Enter Email (Reference Image 2) ── */}
                                {step === 'email' && (
                                    <motion.div
                                        key="step-email"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-5"
                                    >
                                        <div className="text-center pt-2">
                                            <h2 className="font-sans text-[24px] sm:text-[27px] font-black text-[#111] tracking-tight">
                                                Sign Up/Login to NER!
                                            </h2>
                                            <p className="text-[13px] text-[#666] font-medium mt-1">
                                                For a personalized experience &amp; faster checkout
                                            </p>
                                        </div>

                                        <form onSubmit={handleContinueEmail} className="space-y-4 pt-3">
                                            {/* Floating Outline Input */}
                                            <div className="relative border border-black/[0.22] focus-within:border-[#bfa81f] focus-within:ring-1 focus-within:ring-[#bfa81f] rounded-[10px] px-3.5 py-3 transition-all bg-white">
                                                <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-bold text-[#666] leading-none select-none">
                                                    Enter email address
                                                </label>
                                                <div className="flex items-center gap-2.5">
                                                    <Mail size={18} className="text-[#666] flex-shrink-0" />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                                        placeholder="name@example.com"
                                                        autoFocus
                                                        className="w-full text-[14.5px] font-semibold text-[#111] bg-transparent outline-none placeholder:text-gray-400"
                                                    />
                                                </div>
                                            </div>

                                            {error && (
                                                <p className="text-xs font-semibold text-rose-600 pl-1">{error}</p>
                                            )}

                                            {/* Continue CTA */}
                                            <button
                                                type="submit"
                                                className="w-full h-[46px] rounded-[10px] bg-[#bfa81f] hover:bg-[#a89216] active:scale-[0.99] text-white font-bold text-[15px] tracking-wide transition-all shadow-sm flex items-center justify-center cursor-pointer"
                                            >
                                                Continue
                                            </button>
                                        </form>

                                        {/* Divider */}
                                        <div className="flex items-center gap-3 my-2 pt-1">
                                            <div className="h-px bg-black/[0.1] flex-1" />
                                            <span className="text-[12px] font-medium text-[#777] uppercase tracking-wider">
                                                or Login with
                                            </span>
                                            <div className="h-px bg-black/[0.1] flex-1" />
                                        </div>

                                        {/* Google Login Button */}
                                        <button
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            className="w-full h-[44px] rounded-[10px] border border-black/[0.16] hover:border-black/[0.3] bg-white hover:bg-gray-50/80 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                            </svg>
                                        </button>

                                        {/* Legal Disclaimer */}
                                        <p className="text-[11px] text-[#777] text-center leading-relaxed pt-1 select-none">
                                            By continuing you agree to NER&apos;s{' '}
                                            <span className="font-semibold text-[#111] underline underline-offset-2">Terms &amp; Conditions</span>,{' '}
                                            <span className="font-semibold text-[#111] underline underline-offset-2">Privacy Policy</span> &amp;{' '}
                                            <span className="font-semibold text-[#111] underline underline-offset-2">Disclaimer</span>
                                        </p>
                                    </motion.div>
                                )}

                                {/* ── SCREEN 2: Welcome / Name & Phone (Reference Image 3) ── */}
                                {step === 'details' && (
                                    <motion.div
                                        key="step-details"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <div className="text-center pt-1">
                                            <h2 className="font-sans text-[24px] sm:text-[27px] font-black text-[#111] tracking-tight">
                                                Welcome To NER!
                                            </h2>
                                            <p className="text-[13px] text-[#666] font-medium mt-1">
                                                Happiness is just a click away
                                            </p>
                                        </div>

                                        <form onSubmit={handleStartGifting} className="space-y-3.5 pt-2">
                                            {/* Field 1: Email (Editable / Clearable) */}
                                            <div className="relative border border-black/[0.22] focus-within:border-[#bfa81f] focus-within:ring-1 focus-within:ring-[#bfa81f] rounded-[10px] px-3.5 py-2.5 transition-all bg-white">
                                                <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-bold text-[#666] leading-none select-none">
                                                    Enter email address
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={17} className="text-[#666] flex-shrink-0" />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full text-[14px] font-semibold text-[#111] bg-transparent outline-none"
                                                    />
                                                    {email && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setEmail('')}
                                                            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                                                        >
                                                            <X size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Field 2: Name */}
                                            <div className="relative border border-black/[0.22] focus-within:border-[#bfa81f] focus-within:ring-1 focus-within:ring-[#bfa81f] rounded-[10px] px-3.5 py-2.5 transition-all bg-white">
                                                <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-bold text-[#666] leading-none select-none">
                                                    Name
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <User size={17} className="text-[#666] flex-shrink-0" />
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="Your full name"
                                                        autoFocus
                                                        className="w-full text-[14px] font-semibold text-[#111] bg-transparent outline-none placeholder:text-gray-400"
                                                    />
                                                    {name && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setName('')}
                                                            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                                                        >
                                                            <X size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Field 3: Mobile Number */}
                                            <div className="relative border border-black/[0.22] focus-within:border-[#bfa81f] focus-within:ring-1 focus-within:ring-[#bfa81f] rounded-[10px] px-3.5 py-2.5 transition-all bg-white">
                                                <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-[11px] font-bold text-[#666] leading-none select-none">
                                                    Enter Mobile Number
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 text-[13px] font-bold text-[#111] pr-2 border-r border-black/[0.12] select-none flex-shrink-0">
                                                        <span>🇮🇳</span>
                                                        <span>+91</span>
                                                        <span className="text-[10px] text-gray-500">▼</span>
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        maxLength={10}
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                        placeholder="10-digit number"
                                                        className="w-full text-[14px] font-semibold text-[#111] bg-transparent outline-none placeholder:text-gray-400 tracking-wider"
                                                    />
                                                    {phone && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setPhone('')}
                                                            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                                                        >
                                                            <X size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {error && (
                                                <p className="text-xs font-semibold text-rose-600 pl-1">{error}</p>
                                            )}

                                            {/* Start Gifting Button */}
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full h-[46px] rounded-[10px] bg-[#bfa81f] hover:bg-[#a89216] active:scale-[0.99] text-white font-bold text-[15px] tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        <span>Sending Verification OTP...</span>
                                                    </>
                                                ) : (
                                                    <span>Start Gifting</span>
                                                )}
                                            </button>
                                        </form>

                                        {/* Divider */}
                                        <div className="flex items-center gap-3 my-1.5 pt-1">
                                            <div className="h-px bg-black/[0.1] flex-1" />
                                            <span className="text-[12px] font-medium text-[#777] uppercase tracking-wider">
                                                or Login with
                                            </span>
                                            <div className="h-px bg-black/[0.1] flex-1" />
                                        </div>

                                        {/* Google Login Button */}
                                        <button
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            className="w-full h-[44px] rounded-[10px] border border-black/[0.16] hover:border-black/[0.3] bg-white hover:bg-gray-50/80 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                            </svg>
                                        </button>

                                        {/* Legal Disclaimer */}
                                        <p className="text-[11px] text-[#777] text-center leading-relaxed select-none">
                                            By continuing you agree to NER&apos;s{' '}
                                            <span className="font-semibold text-[#111] underline underline-offset-2">Terms &amp; Conditions</span>,{' '}
                                            <span className="font-semibold text-[#111] underline underline-offset-2">Privacy Policy</span> &amp;{' '}
                                            <span className="font-semibold text-[#111] underline underline-offset-2">Disclaimer</span>
                                        </p>
                                    </motion.div>
                                )}

                                {/* ── SCREEN 3: Verify Details / OTP (Reference Image 4) ── */}
                                {step === 'otp' && (
                                    <motion.div
                                        key="step-otp"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-5"
                                    >
                                        {/* Back Header */}
                                        <div className="flex items-center gap-3 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => setStep('details')}
                                                className="p-1 -ml-1 text-[#111] hover:text-[#bfa81f] transition-colors cursor-pointer"
                                                title="Back"
                                            >
                                                <ArrowLeft size={21} className="stroke-[2.5]" />
                                            </button>
                                            <h2 className="font-sans text-[20px] font-black text-[#111] tracking-tight">
                                                Verify Details
                                            </h2>
                                        </div>

                                        {/* Subtitle with Masked info */}
                                        <div className="space-y-1">
                                            <p className="text-[13px] text-[#333] font-medium leading-relaxed">
                                                OTP sent to mobile number{' '}
                                                <strong className="text-[#111] font-bold">+91 {getMaskedPhone(phone)}</strong>{' '}
                                                and email ID <strong className="text-[#111] font-bold">{getMaskedEmail(email)}</strong>
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setStep('details')}
                                                className="text-[12.5px] font-bold text-[#bfa81f] hover:underline cursor-pointer"
                                            >
                                                Change
                                            </button>
                                        </div>

                                        {/* 6 Rounded OTP Boxes */}
                                        <div className="pt-2">
                                            <div className="flex items-center justify-between gap-2 max-w-[340px] mx-auto">
                                                {otp.map((digit, idx) => (
                                                    <input
                                                        key={idx}
                                                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={1}
                                                        value={digit}
                                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                                        onPaste={handleOtpPaste}
                                                        className="w-11 sm:w-12 h-13 sm:h-14 text-center text-[20px] font-black text-[#111] bg-white border border-black/[0.22] focus:border-[#bfa81f] focus:ring-2 focus:ring-[#bfa81f]/20 rounded-[12px] outline-none transition-all shadow-2xs"
                                                    />
                                                ))}
                                            </div>

                                            {/* Validity & Resend Row */}
                                            <div className="flex items-center justify-between text-[12px] text-[#666] font-medium mt-3 px-1">
                                                <span>Valid for 10 mins</span>
                                                {resendTimer > 0 ? (
                                                    <span>
                                                        Resend OTP in <strong className="text-[#bfa81f] font-bold">{resendTimer}s</strong>
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleResendOtp}
                                                        disabled={isLoading}
                                                        className="text-[#bfa81f] font-bold hover:underline cursor-pointer"
                                                    >
                                                        Resend OTP
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {error && (
                                            <p className="text-xs font-semibold text-rose-600 text-center">{error}</p>
                                        )}

                                        {/* Confirm OTP CTA */}
                                        <button
                                            type="button"
                                            onClick={() => submitVerifyOtp()}
                                            disabled={isLoading}
                                            className="w-full h-[46px] rounded-[10px] bg-[#bfa81f] hover:bg-[#a89216] active:scale-[0.99] text-white font-bold text-[15px] tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    <span>Verifying Code...</span>
                                                </>
                                            ) : (
                                                <span>Confirm OTP</span>
                                            )}
                                        </button>

                                        {/* Success Toast Banner (as in Image 4) */}
                                        {showSuccessToast && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-[#dcfce7] border border-[#86efac] rounded-[11px] p-3 flex items-center gap-2.5 text-[#166534] shadow-xs"
                                            >
                                                <CheckCircle2 size={18} className="text-[#16a34a] flex-shrink-0 stroke-[2.4]" />
                                                <span className="text-[12.5px] font-bold">
                                                    OTP sent to your mobile number and email ID
                                                </span>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── BOTTOM BANNER (Reference Images 2, 3, 4) ── */}
                        <div className="mt-6 border-t border-black/[0.06] bg-gradient-to-tr from-[#ffe4e6] via-[#fff1f2] to-[#ffedd5] p-5 sm:p-6 relative overflow-hidden select-none">
                            {/* Decorative soft circles */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-rose-200/40 blur-xl pointer-events-none" />
                            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-amber-200/40 blur-lg pointer-events-none" />

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="text-[21px] sm:text-[23px] font-black text-[#e11d48] tracking-tight leading-none drop-shadow-2xs">
                                        Send Gifts
                                    </h3>
                                    <p className="text-[14px] sm:text-[15px] font-extrabold text-[#1e293b] tracking-tight leading-none mt-1">
                                        Anywhere, Everywhere!
                                    </p>
                                    <p className="text-[9px] text-[#888] font-semibold pt-3 leading-none">
                                        *T&amp;C Apply · Handcrafted Luxury Flowers &amp; Hampers
                                    </p>
                                </div>

                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[14px] overflow-hidden bg-white/60 shadow-xs border border-white/80 flex-shrink-0">
                                    <Image
                                        src="/images/products/celebrations-gift-box-2.jpg"
                                        alt="Send Gifts Everywhere"
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
