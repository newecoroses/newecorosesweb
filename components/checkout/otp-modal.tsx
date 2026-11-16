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
        }, 600);
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white border border-gray-100 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Gold Border Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#bfa81f] via-[#e6c845] to-[#bfa81f]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="p-6 pb-2 text-center">
          <div className="w-14 h-14 mx-auto mb-3.5 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-[#bfa81f]">
            <ShieldCheck size={28} />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#bfa81f]">
            New Eco Roses Security
          </span>
          <h2 className="text-xl font-serif font-bold text-gray-900 mt-1">
            Verify Email to Order
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            We sent a 6-digit confirmation code to:
          </p>
          <p className="text-xs font-bold text-gray-900 mt-0.5 font-mono bg-gray-50 py-1 px-3 rounded-lg inline-block border border-gray-100">
            {email}
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="px-6 py-4">
          <div className="flex justify-center gap-2 sm:gap-2.5 mb-3">
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
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl border transition-all duration-200 outline-none ${
                  verified
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : error
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : digit
                    ? 'border-[#bfa81f] ring-1 ring-[#bfa81f] bg-white text-black'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 focus:border-[#bfa81f] focus:ring-1 focus:ring-[#bfa81f]'
                }`}
              />
            ))}
          </div>

          {/* Verification Status Feedback */}
          {verified ? (
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 my-2">
              <Check size={14} className="stroke-[3]" />
              <span>Email Verified! Processing order…</span>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 my-2">
              <Loader2 size={14} className="animate-spin text-[#bfa81f]" />
              <span>Verifying code…</span>
            </div>
          ) : codeSent && !error ? (
            <p className="text-center text-[11px] text-emerald-600 my-2 flex items-center justify-center gap-1 font-medium">
              <Mail size={12} />
              Code sent — please check your inbox (and spam folder)
            </p>
          ) : null}

          {/* Error Message */}
          {error && (
            <p className="text-center text-xs font-semibold text-red-500 my-2">
              {error}
            </p>
          )}

          {/* Resend Action */}
          <div className="text-center mt-3 pt-2">
            {resendCooldown > 0 ? (
              <p className="text-xs text-gray-400">
                Resend code in <span className="font-bold font-mono text-gray-700">{resendCooldown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={sendOtp}
                disabled={isSending || verified}
                className="text-xs font-bold text-[#bfa81f] hover:text-[#a89216] transition-colors cursor-pointer underline underline-offset-4 disabled:opacity-50"
              >
                {isSending ? 'Sending…' : 'Resend Code'}
              </button>
            )}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400">
            🔒 Verification ensures you receive tracking updates & order receipts.
          </p>
        </div>

      </div>
    </div>
  );
}
