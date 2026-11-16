import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: { name: string; price: number; quantity: number; image_url?: string }[];
  total: number;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  specialNote?: string;
  createdAt?: string;
}

export interface OtpEmailData {
  customerName: string;
  customerEmail: string;
  otp: string;
}

// ── Premium brand colours ──────────────────────────────────────────────────
const GOLD = '#bfa81f';
const DARK = '#1c1917';
const BG   = '#faf7f2';
const WHITE = '#ffffff';

// ── Shared layout wrapper ──────────────────────────────────────────────────
function wrapEmail(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>New Eco Roses</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BG};min-height:100vh;">
    <tr><td align="center" style="padding:32px 16px 48px;">
      <!-- Card -->
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background:${WHITE};border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(28,25,23,0.13);">
        
        <!-- Topbar Gold line -->
        <tr><td style="height:5px;background:linear-gradient(90deg,${GOLD} 0%,#e6c845 50%,${GOLD} 100%);"></td></tr>

        <!-- Header -->
        <tr>
          <td style="background:${DARK};padding:36px 40px 32px;text-align:center;">
            <div style="display:inline-block;background:${GOLD};border-radius:50%;width:56px;height:56px;line-height:56px;text-align:center;margin-bottom:16px;">
              <span style="font-size:28px;">🌸</span>
            </div>
            <div style="color:${GOLD};font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:700;margin-bottom:6px;">NEW ECO ROSES</div>
            <div style="width:40px;height:1px;background:${GOLD};opacity:0.4;margin:0 auto 10px;"></div>
            ${body.match(/<!-- HEADER_TITLE -->([\s\S]*?)<!-- \/HEADER_TITLE -->/)
              ? body.match(/<!-- HEADER_TITLE -->([\s\S]*?)<!-- \/HEADER_TITLE -->/)![1]
              : ''}
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          ${body.replace(/<!-- HEADER_TITLE -->[\s\S]*?<!-- \/HEADER_TITLE -->/, '')}
        </td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:${DARK};padding:28px 40px;text-align:center;">
            <p style="margin:0 0 8px;color:${GOLD};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:700;">New Eco Roses</p>
            <p style="margin:0 0 4px;color:#9ca3af;font-size:11px;font-family:Arial,sans-serif;">Premium Fresh Flowers · Kolkata, West Bengal</p>
            <p style="margin:0;color:#6b7280;font-size:10px;font-family:Arial,sans-serif;">© ${new Date().getFullYear()} New Eco Roses. All rights reserved.</p>
          </td>
        </tr>

        <!-- Bottom gold line -->
        <tr><td style="height:4px;background:linear-gradient(90deg,${GOLD} 0%,#e6c845 50%,${GOLD} 100%);"></td></tr>
      </table>

      <!-- Tagline below card -->
      <p style="margin:20px 0 0;color:#9ca3af;font-size:11px;font-family:Arial,sans-serif;text-align:center;">
        Crafted with love, delivered fresh. 🌷
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── OTP Email ──────────────────────────────────────────────────────────────
export function buildOtpEmailHtml(data: OtpEmailData): string {
  const body = `
<!-- HEADER_TITLE -->
<h1 style="margin:0;color:${WHITE};font-size:26px;font-weight:700;letter-spacing:-0.5px;">Verify Your Identity</h1>
<p style="margin:8px 0 0;color:#d1d5db;font-size:13px;font-family:Arial,sans-serif;">One-time code for your checkout</p>
<!-- /HEADER_TITLE -->

<!-- Greeting -->
<p style="margin:0 0 20px;font-size:16px;color:${DARK};font-family:Arial,sans-serif;">
  Hi <strong>${data.customerName || 'there'}</strong>, 👋
</p>
<p style="margin:0 0 28px;font-size:14px;color:#57534e;line-height:1.7;font-family:Arial,sans-serif;">
  You're one step away from completing your New Eco Roses order. 
  Use the verification code below to confirm your identity and proceed to checkout.
</p>

<!-- OTP Box -->
<div style="background:${BG};border:2px dashed ${GOLD};border-radius:16px;padding:32px;text-align:center;margin:0 0 28px;">
  <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#78716c;font-family:Arial,sans-serif;font-weight:700;">Your Verification Code</p>
  <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:${DARK};font-family:'Courier New',monospace;margin:8px 0;">${data.otp}</div>
  <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;font-family:Arial,sans-serif;">Valid for <strong>10 minutes</strong> · Do not share</p>
</div>

<!-- Security Note -->
<div style="background:#fef3c7;border-left:4px solid ${GOLD};border-radius:8px;padding:14px 18px;margin:0 0 24px;">
  <p style="margin:0;font-size:12px;color:#78350f;font-family:Arial,sans-serif;">
    🔒 <strong>Security note:</strong> New Eco Roses will never ask for this code over phone or email. 
    If you didn't request this, please ignore this email.
  </p>
</div>

<p style="margin:0;font-size:13px;color:#9ca3af;font-family:Arial,sans-serif;text-align:center;">
  Didn't request this? <a href="mailto:support@newecoroses.com" style="color:${GOLD};text-decoration:none;">Contact us</a>
</p>`;

  return wrapEmail(body);
}

// ── Order Confirmation Email ───────────────────────────────────────────────
export function buildOrderConfirmationHtml(data: OrderEmailData, siteUrl = 'https://www.newecoroses.com'): string {
  const trackingUrl = `${siteUrl}/track-order?order=${data.orderNumber}`;
  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f3f0eb;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="background:${BG};border-radius:8px;width:44px;height:44px;display:inline-block;text-align:center;line-height:44px;font-size:20px;flex-shrink:0;">🌸</div>
          <div style="flex:1;">
            <p style="margin:0;font-size:14px;font-weight:600;color:${DARK};font-family:Arial,sans-serif;">${item.name}</p>
            <p style="margin:3px 0 0;font-size:12px;color:#78716c;font-family:Arial,sans-serif;">Qty: ${item.quantity}</p>
          </div>
          <span style="font-size:14px;font-weight:700;color:${DARK};font-family:Arial,sans-serif;white-space:nowrap;">
            ${item.price > 0 ? `₹${(item.price * item.quantity).toLocaleString('en-IN')}` : 'Included'}
          </span>
        </div>
      </td>
    </tr>`).join('');

  const addressHtml = data.shippingAddress
    ? `${data.shippingAddress.line1 || ''}${data.shippingAddress.line2 ? ', ' + data.shippingAddress.line2 : ''}, ${data.shippingAddress.city || ''}, ${data.shippingAddress.state || ''} - ${data.shippingAddress.postalCode || ''}`
    : '';

  const body = `
<!-- HEADER_TITLE -->
<h1 style="margin:0;color:${WHITE};font-size:28px;font-weight:700;letter-spacing:-0.5px;">Order Confirmed! 🎉</h1>
<p style="margin:10px 0 0;color:#d1d5db;font-size:14px;font-family:Arial,sans-serif;">Your floral arrangement is being handcrafted with love</p>
<!-- /HEADER_TITLE -->

<!-- Greeting -->
<p style="margin:0 0 6px;font-size:17px;color:${DARK};font-family:Arial,sans-serif;">
  Hello <strong>${data.customerName}</strong>, 🌷
</p>
<p style="margin:0 0 28px;font-size:14px;color:#57534e;line-height:1.7;font-family:Arial,sans-serif;">
  Thank you for choosing New Eco Roses! Your order has been confirmed and our artisans are already 
  handcrafting your beautiful floral arrangement. We'll keep you updated every step of the way.
</p>

<!-- Order Summary Card -->
<div style="background:${BG};border-radius:16px;padding:24px;margin:0 0 24px;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e8dcc8;">
    <div>
      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">Order Number</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:800;color:${DARK};font-family:Arial,sans-serif;">#${data.orderNumber}</p>
    </div>
    <div style="text-align:right;">
      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">Date</p>
      <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#57534e;font-family:Arial,sans-serif;">${dateStr}</p>
    </div>
  </div>
  
  <!-- Items -->
  <table width="100%" cellpadding="0" cellspacing="0">
    ${itemsHtml}
  </table>

  <!-- Total -->
  <div style="margin-top:16px;padding-top:16px;border-top:2px solid ${GOLD};display:flex;justify-content:space-between;align-items:center;">
    <div>
      <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#78716c;font-family:Arial,sans-serif;font-weight:700;">Total Paid</p>
      <p style="margin:4px 0 0;font-size:11px;color:#22c55e;font-family:Arial,sans-serif;font-weight:600;">✓ Payment Verified</p>
    </div>
    <p style="margin:0;font-size:24px;font-weight:900;color:${DARK};font-family:Arial,sans-serif;">₹${data.total.toLocaleString('en-IN')}</p>
  </div>
</div>

${addressHtml ? `
<!-- Delivery Address -->
<div style="border:1px solid #e8dcc8;border-radius:12px;padding:18px 20px;margin:0 0 24px;">
  <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">📦 Delivery Address</p>
  <p style="margin:0;font-size:14px;color:${DARK};font-family:Arial,sans-serif;line-height:1.6;">${addressHtml}</p>
</div>` : ''}

${data.specialNote ? `
<!-- Special Note -->
<div style="background:#fef3c7;border-left:4px solid ${GOLD};border-radius:8px;padding:14px 18px;margin:0 0 24px;">
  <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#92400e;font-family:Arial,sans-serif;font-weight:700;">📝 Special Note</p>
  <p style="margin:0;font-size:13px;color:#78350f;font-family:Arial,sans-serif;">${data.specialNote}</p>
</div>` : ''}

<!-- Status Timeline -->
<div style="margin:0 0 28px;">
  <p style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">Delivery Progress</p>
  <div style="display:flex;align-items:flex-start;gap:0;position:relative;">
    ${['Order Received ✓', 'Bouquet Handcrafted', 'Out for Delivery', 'Delivered'].map((step, i) => `
    <div style="flex:1;text-align:center;">
      <div style="width:28px;height:28px;border-radius:50%;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:Arial,sans-serif;
        ${i === 0
          ? `background:${GOLD};color:${WHITE};box-shadow:0 0 0 4px #fef3c7;`
          : 'background:#f3f0eb;color:#9ca3af;border:2px solid #e8dcc8;'}">
        ${i === 0 ? '✓' : i + 1}
      </div>
      <p style="margin:0;font-size:10px;color:${i === 0 ? GOLD : '#9ca3af'};font-family:Arial,sans-serif;font-weight:${i === 0 ? '700' : '400'};line-height:1.3;">${step}</p>
    </div>`).join('')}
  </div>
</div>

<!-- Track Order CTA (Premium Button) -->
<div style="text-align:center;margin:0 0 28px;">
  <a href="${trackingUrl}" 
     style="display:inline-block;background:linear-gradient(135deg,${GOLD} 0%,#e6c845 50%,${GOLD} 100%);color:${DARK};text-decoration:none;padding:16px 40px;border-radius:50px;font-size:14px;font-weight:800;font-family:Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;box-shadow:0 4px 20px rgba(191,168,31,0.4);border:none;">
    📦 Track My Order
  </a>
  <p style="margin:10px 0 0;font-size:11px;color:#9ca3af;font-family:Arial,sans-serif;">
    Click above to see live delivery updates for order #${data.orderNumber}
  </p>
</div>

<!-- Divider -->
<div style="height:1px;background:linear-gradient(90deg,transparent,#e8dcc8,transparent);margin:0 0 24px;"></div>

<!-- Help -->
<div style="text-align:center;">
  <p style="margin:0 0 8px;font-size:14px;color:#57534e;font-family:Arial,sans-serif;">Need help with your order?</p>
  <a href="https://wa.me/919936911611" style="display:inline-block;background:#25D366;color:${WHITE};text-decoration:none;padding:10px 24px;border-radius:50px;font-size:12px;font-weight:700;font-family:Arial,sans-serif;letter-spacing:0.05em;">💬 WhatsApp Us</a>
</div>`;

  return wrapEmail(body);
}

// ── Order Status Update Email ──────────────────────────────────────────────
export function buildStatusUpdateHtml(data: OrderEmailData & { newStatus: string }, siteUrl = 'https://www.newecoroses.com'): string {
  const trackingUrl = `${siteUrl}/track-order?order=${data.orderNumber}`;

  const statusConfig: Record<string, { emoji: string; title: string; msg: string; colour: string }> = {
    processing: { emoji: '🌸', title: 'Your Bouquet is Being Crafted!', msg: 'Our expert florists are handcrafting your beautiful arrangement with the freshest blooms.', colour: '#8b5cf6' },
    delivered:  { emoji: '🎉', title: 'Your Order Has Been Delivered!', msg: 'Your gorgeous floral arrangement has been delivered. We hope it brings a smile!', colour: '#22c55e' },
    cancelled:  { emoji: '😔', title: 'Order Cancelled', msg: 'Your order has been cancelled. If this was unexpected, please contact us immediately.', colour: '#ef4444' },
    confirmed:  { emoji: '✅', title: 'Order Confirmed!', msg: 'Your order is confirmed and being prepared with love.', colour: GOLD },
  };

  const cfg = statusConfig[data.newStatus] || statusConfig['confirmed'];

  const body = `
<!-- HEADER_TITLE -->
<h1 style="margin:0;color:${WHITE};font-size:26px;font-weight:700;">${cfg.emoji} Order Update</h1>
<p style="margin:8px 0 0;color:#d1d5db;font-size:13px;font-family:Arial,sans-serif;">Order #${data.orderNumber}</p>
<!-- /HEADER_TITLE -->

<div style="text-align:center;padding:28px 0 20px;">
  <div style="display:inline-block;background:${cfg.colour}20;border:2px solid ${cfg.colour};border-radius:50%;width:60px;height:60px;line-height:60px;font-size:30px;margin-bottom:16px;">${cfg.emoji}</div>
  <h2 style="margin:0 0 10px;font-size:22px;color:${DARK};font-family:Arial,sans-serif;font-weight:800;">${cfg.title}</h2>
  <p style="margin:0;font-size:14px;color:#57534e;font-family:Arial,sans-serif;line-height:1.6;max-width:400px;margin:0 auto;">${cfg.msg}</p>
</div>

<div style="background:${BG};border-radius:12px;padding:20px 24px;margin:20px 0;">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <div><p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">Order No.</p>
    <p style="margin:4px 0 0;font-size:16px;font-weight:800;color:${DARK};font-family:Arial,sans-serif;">#${data.orderNumber}</p></div>
    <div style="text-align:right;"><p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">Total</p>
    <p style="margin:4px 0 0;font-size:16px;font-weight:800;color:${DARK};font-family:Arial,sans-serif;">₹${data.total.toLocaleString('en-IN')}</p></div>
  </div>
</div>

<div style="text-align:center;margin:24px 0;">
  <a href="${trackingUrl}" 
     style="display:inline-block;background:linear-gradient(135deg,${GOLD} 0%,#e6c845 50%,${GOLD} 100%);color:${DARK};text-decoration:none;padding:16px 40px;border-radius:50px;font-size:14px;font-weight:800;font-family:Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;box-shadow:0 4px 20px rgba(191,168,31,0.4);">
    📦 Track My Order
  </a>
</div>

<div style="text-align:center;">
  <a href="https://wa.me/919936911611" style="display:inline-block;background:#25D366;color:${WHITE};text-decoration:none;padding:10px 24px;border-radius:50px;font-size:12px;font-weight:700;font-family:Arial,sans-serif;">💬 WhatsApp for Help</a>
</div>`;

  return wrapEmail(body);
}

// ── Send Functions ─────────────────────────────────────────────────────────
const FROM = process.env.RESEND_FROM_EMAIL || 'New Eco Roses <noreply@newecoroses.com>';

export async function sendOtpEmail(data: OtpEmailData) {
  try {
    const res = await resend.emails.send({
      from: FROM,
      to: [data.customerEmail],
      subject: `🔐 ${data.otp} — Your New Eco Roses Verification Code`,
      html: buildOtpEmailHtml(data),
    });
    if (res.error) {
      console.error('Resend sendOtpEmail error:', res.error);
      throw new Error(res.error.message || 'Failed to send OTP email');
    }
    return res;
  } catch (err) {
    console.error('Failed to send OTP email via Resend:', err);
    throw err;
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  if (!data.customerEmail) return null;
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.newecoroses.com';
    const res = await resend.emails.send({
      from: FROM,
      to: [data.customerEmail],
      subject: `🎉 Order Confirmed! #${data.orderNumber} — New Eco Roses`,
      html: buildOrderConfirmationHtml(data, siteUrl),
    });
    if (res.error) {
      console.error('Resend sendOrderConfirmationEmail error:', res.error);
    }
    return res;
  } catch (err) {
    console.error('Failed to send Order Confirmation email via Resend:', err);
    return null;
  }
}

export async function sendStatusUpdateEmail(data: OrderEmailData & { newStatus: string }) {
  if (!data.customerEmail) return null;
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.newecoroses.com';
    const res = await resend.emails.send({
      from: FROM,
      to: [data.customerEmail],
      subject: `📦 Order #${data.orderNumber} Status Update — New Eco Roses`,
      html: buildStatusUpdateHtml(data, siteUrl),
    });
    if (res.error) {
      console.error('Resend sendStatusUpdateEmail error:', res.error);
    }
    return res;
  } catch (err) {
    console.error('Failed to send Status Update email via Resend:', err);
    return null;
  }
}
