// In-memory OTP store (survives HMR in dev, good enough for serverless warm containers)
const globalForOtp = global as unknown as {
    nerOtpStore?: Map<string, { otp: string; name: string; expiresAt: number; attempts: number }>;
};

export const otpStore =
    globalForOtp.nerOtpStore ||
    new Map<string, { otp: string; name: string; expiresAt: number; attempts: number }>();

if (process.env.NODE_ENV !== 'production') {
    globalForOtp.nerOtpStore = otpStore;
}
