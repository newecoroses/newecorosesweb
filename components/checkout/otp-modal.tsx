'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

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
  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && email) {
      setOtp(['', '', '', '', '', '']);
      setError('');
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
        setResendCooldown(60);
      } else {
        setError(data.error || 'Failed to send code. Please try again.');
      }
    } catch {
      setError('Network error sending code.');
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
        }, 400);
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
      <div className="relative w-full max-w-[400px] bg-white border border-black/[0.08] shadow-2xl rounded-[18px] overflow-hidden p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full text-[#666] hover:text-[#111] hover:bg-black/[0.05] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <h3 className="text-xl font-bold text-[#111] tracking-tight">
            Verify your email
          </h3>
          <p className="text-[13.5px] text-[#555] mt-1.5 leading-snug">
            Enter the 6-digit code sent to <br />
            <strong className="text-[#111] font-semibold">{email}</strong>
          </p>
        </div>

        {/* 6 Clean Input Boxes */}
        <div className="flex justify-center gap-2 mb-2">
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
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-[11px] outline-none transition-all duration-150 ${
                verified
                  ? 'border border-[#16a34a] bg-emerald-50 text-[#16a34a]'
                  : error
                  ? 'border border-red-500 bg-red-50 text-red-600'
                  : digit
                  ? 'border border-[#111] bg-white text-[#111]'
                  : 'border border-black/[0.1] bg-[#f4f4f4] text-[#111] focus:bg-white focus:border-[#111] focus:ring-1 focus:ring-black/10'
              }`}
            />
          ))}
        </div>

        {/* Status / Error Message */}
        {error ? (
          <p className="text-center text-xs text-red-600 font-medium my-2">
            {error}
          </p>
        ) : verified ? (
          <p className="text-center text-xs text-emerald-600 font-semibold my-2">
            ✓ Verified! Completing checkout…
          </p>
        ) : null}

        {/* Action Button */}
        <button
          type="button"
          onClick={() => verifyOtp(otp.join(''))}
          disabled={!isComplete || isLoading || isSending || verified}
          className="w-full h-[48px] bg-[#111] hover:bg-black text-white font-bold rounded-[14px] text-sm tracking-wide transition-all mt-4 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Verifying…</span>
            </>
          ) : verified ? (
            <span>Verified</span>
          ) : (
            <span>Verify code</span>
          )}
        </button>

        {/* Resend Link */}
        <div className="text-center mt-3.5 text-[13px] text-[#555]">
          Didn&apos;t get the code?{' '}
          {resendCooldown > 0 ? (
            <span>Resend in <strong className="text-[#111] font-mono">{resendCooldown}s</strong></span>
          ) : (
            <button
              type="button"
              onClick={sendOtp}
              disabled={isSending || verified}
              className="text-[#111] font-semibold underline underline-offset-2 hover:text-black cursor-pointer disabled:opacity-50"
            >
              {isSending ? 'Sending…' : 'Resend'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
