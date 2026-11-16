import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

export const getRazorpay = (): Razorpay => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_U0rMz0vXr8YcOo';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '28uTrCQgjs7RqzWGSGLbOiC7';

    if (!keyId || !keySecret) {
      throw new Error(
        'Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.'
      );
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
};

export const convertToPaise = (amountInRupees: number): number => {
  return Math.round(amountInRupees * 100);
};
