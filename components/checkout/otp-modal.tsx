'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Check, ShieldCheck, Mail, ArrowRight, Loader2 } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  email: string;
  name: string;
  onClose: () => void;
  onVerified: () => void;
}

export default function OtpModal({
  isOpen,
  email,
  name,
  onClose,
  onVerified,
}: OtpModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && email) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setCodeSent(false);
      setVerified(false);
      sendOtp();
    }
  }, [isOpen, email]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [isOpen]);

  const sendOtp = async () => {
    setIsSending(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (data.success) {
        setCodeSent(true);
        setResendCooldown(60);
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch {
      setError('Network error while sending verification code.');
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== '') && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split('');
      setOtp(digits);
      verifyOtp(pasted);
    }
  };

  const verifyOtp = async (code: string) => {
    if (code.length !== 6) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (data.success) {
        setVerified(true);
        setTimeout(() => {
          onVerified();
        }, 500);
      } else {
        setError(data.error || 'Invalid code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } catch {
      setError('Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isComplete = otp.every((d) => d !== '') && otp.join('').length === 6;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[460px] bg-white border border-black/[0.08] shadow-2xl rounded-[22px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-[#bfa81f]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f2f2f2] hover:bg-[#e8e8e8] text-[#555] hover:text-[#111] flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-7 pb-2 text-center">
          <div className="w-14 h-14 mx-auto mb-3.5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <span className="text-[11px] uppercase font-bold tracking-[0.14em] text-[#bfa81f]">
            New Eco Roses Security
          </span>
          <h2 className="text-2xl font-bold text-[#111] tracking-tight mt-1">
            Verify Email to Order
          </h2>
          <p className="text-[13.5px] text-[#555] mt-1.5 leading-relaxed">
            We sent a 6-digit confirmation code to:
          </p>
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f4f4] border border-black/[0.08] text-xs font-semibold text-[#111]">
            <Mail size={12} className="text-[#888]" />
            <span>{email}</span>
          </div>
        </div>

        {/* OTP Input Fields */}
        <div className="px-6 sm:px-7 py-4">
          <div className="flex justify-center gap-2 sm:gap-2.5 mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLoading || isSending || verified}
                className={`w-11 h-14 sm:w-12 sm:h-15 text-center text-2xl font-bold font-mono rounded-[12px] transition-all duration-150 outline-none ${
                  verified
                    ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-800'
                    : error
                    ? 'border-2 border-red-400 bg-red-50 text-red-700'
                    : digit
                    ? 'border-2 border-[#111] bg-white text-[#111] shadow-sm'
                    : 'border border-black/[0.12] bg-[#f7f7f7] text-[#111] hover:border-black/30 focus:border-[#111] focus:bg-white focus:ring-2 focus:ring-black/10'
                }`}
              />
            ))}
          </div>

          {/* Verification Status Feedback */}
          {verified ? (
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 my-2.5">
              <Check size={15} className="stroke-[3]" />
              <span>Email Verified! Processing order…</span>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#555] my-2.5">
              <Loader2 size={15} className="animate-spin text-[#111]" />
              <span>Verifying code…</span>
            </div>
          ) : codeSent && !error ? (
            <p className="text-center text-[12px] text-emerald-600 my-2 flex items-center justify-center gap-1 font-medium">
              <Check size={12} />
              Code sent — please check your inbox (or spam)
            </p>
          ) : null}

          {/* Error Message */}
          {error && (
            <p className="text-center text-xs font-semibold text-red-600 my-2">
              {error}
            </p>
          )}

          {/* Explicit Verify Button (Template st-btn style) */}
          <button
            type="button"
            onClick={() => verifyOtp(otp.join(''))}
            disabled={!isComplete || isLoading || isSending || verified}
            className="w-full min-h-[50px] bg-[#111] hover:bg-black text-white font-bold rounded-[14px] text-[15px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-3 shadow-sm hover:shadow-md active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying Code…</span>
              </>
            ) : verified ? (
              <>
                <Check size={18} className="stroke-[3]" />
                <span>Email Verified!</span>
              </>
            ) : (
              <>
                <span>Verify & Proceed to Payment</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Resend Action */}
          <div className="text-center mt-3 pt-1">
            {resendCooldown > 0 ? (
              <p className="text-xs text-[#888]">
                Resend code in <span className="font-bold font-mono text-[#111]">{resendCooldown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={sendOtp}
                disabled={isSending || verified}
                className="text-xs font-semibold text-[#111] hover:text-[#bfa81f] underline underline-offset-3 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSending ? 'Sending…' : 'Resend Code'}
              </button>
            )}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-3.5 bg-[#f7f7f7] border-t border-black/[0.06] text-center">
          <p className="text-[11.5px] text-[#777]">
            🔒 Verification ensures you receive tracking updates & order receipts.
          </p>
        </div>

      </div>
    </div>
  );
}
