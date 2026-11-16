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

// ── Brand tokens ───────────────────────────────────────────────────────────
const GOLD   = '#bfa81f';
const GOLD2  = '#e6c845';
const DARK   = '#1c1917';
const BG     = '#faf7f2';
const WHITE  = '#ffffff';
const GREY   = '#6b7280';
const LIGHT  = '#f3f0eb';

// ── SVG Logo (inline, email-safe) ─────────────────────────────────────────
const LOGO_SVG = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="24" fill="${GOLD}"/>
  <!-- Rose petals -->
  <ellipse cx="24" cy="16" rx="4.5" ry="7" fill="${WHITE}" opacity="0.95"/>
  <ellipse cx="24" cy="16" rx="4.5" ry="7" fill="${WHITE}" opacity="0.95" transform="rotate(72 24 24)"/>
  <ellipse cx="24" cy="16" rx="4.5" ry="7" fill="${WHITE}" opacity="0.95" transform="rotate(144 24 24)"/>
  <ellipse cx="24" cy="16" rx="4.5" ry="7" fill="${WHITE}" opacity="0.95" transform="rotate(216 24 24)"/>
  <ellipse cx="24" cy="16" rx="4.5" ry="7" fill="${WHITE}" opacity="0.95" transform="rotate(288 24 24)"/>
  <!-- Centre -->
  <circle cx="24" cy="24" r="5" fill="${GOLD2}"/>
  <circle cx="24" cy="24" r="3" fill="${DARK}"/>
</svg>`.trim();

// ── SVG check icon ─────────────────────────────────────────────────────────
const CHECK_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${GOLD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

// ── Gold gradient bar ──────────────────────────────────────────────────────
const GOLD_BAR = `<tr><td style="height:5px;background:linear-gradient(90deg,${DARK} 0%,${GOLD} 30%,${GOLD2} 50%,${GOLD} 70%,${DARK} 100%);font-size:0;line-height:0;">&nbsp;</td></tr>`;

// ── Email shell ───────────────────────────────────────────────────────────
function shell(headerHtml: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>New Eco Roses</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:${BG};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BG};min-height:100vh;">
    <tr><td align="center" style="padding:40px 16px 56px;">

      <!-- Outer card -->
      <table width="600" cellpadding="0" cellspacing="0" role="presentation"
             style="max-width:600px;width:100%;background:${WHITE};border-radius:28px;overflow:hidden;
                    box-shadow:0 12px 48px rgba(28,25,23,0.14),0 2px 8px rgba(28,25,23,0.06);">

        ${GOLD_BAR}

        <!-- Header -->
        <tr>
          <td style="background:${DARK};padding:44px 48px 40px;text-align:center;">
            <!-- SVG Logo circle -->
            <div style="display:inline-block;margin-bottom:20px;">
              ${LOGO_SVG}
            </div>
            <!-- Brand name -->
            <div style="color:${GOLD};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;font-weight:700;margin-bottom:4px;">
              NEW ECO ROSES
            </div>
            <!-- Thin gold rule -->
            <div style="width:48px;height:1px;background:${GOLD};opacity:0.5;margin:10px auto 16px;"></div>
            ${headerHtml}
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:44px 48px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${DARK};padding:32px 48px;text-align:center;">
            <p style="margin:0 0 6px;color:${GOLD};font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:700;">
              New Eco Roses
            </p>
            <p style="margin:0 0 4px;color:#9ca3af;font-size:11px;font-family:Arial,sans-serif;">
              Premium Fresh Flowers &amp; Luxury Gifts · Kolkata, West Bengal
            </p>
            <p style="margin:16px 0 0;color:#4b5563;font-size:10px;font-family:Arial,sans-serif;">
              © ${new Date().getFullYear()} New Eco Roses. All rights reserved.
            </p>
          </td>
        </tr>

        ${GOLD_BAR}
      </table>

      <!-- Below-card tagline -->
      <p style="margin:20px 0 0;color:#9ca3af;font-size:11px;font-family:Arial,sans-serif;text-align:center;letter-spacing:0.05em;">
        Crafted with love · Delivered fresh 🌷
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Gold CTA button ────────────────────────────────────────────────────────
function goldButton(href: string, label: string): string {
  return `
<table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
  <tr>
    <td style="border-radius:50px;background:linear-gradient(135deg,${GOLD} 0%,${GOLD2} 50%,${GOLD} 100%);
               box-shadow:0 6px 24px rgba(191,168,31,0.45);">
      <a href="${href}"
         style="display:inline-block;padding:16px 44px;font-family:Arial,sans-serif;
                font-size:13px;font-weight:800;color:${DARK};text-decoration:none;
                letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;
}

// ── Divider ────────────────────────────────────────────────────────────────
const DIVIDER = `<div style="height:1px;background:linear-gradient(90deg,transparent,${LIGHT},transparent);margin:28px 0;"></div>`;

// ── OTP Email ──────────────────────────────────────────────────────────────
export function buildOtpEmailHtml(data: OtpEmailData): string {
  const header = `
    <h1 style="margin:0;color:${WHITE};font-size:28px;font-weight:800;letter-spacing:-0.5px;font-family:Georgia,serif;">
      Verify Your Email
    </h1>
    <p style="margin:10px 0 0;color:#d1d5db;font-size:13px;font-family:Arial,sans-serif;font-weight:400;">
      One-time code for secure checkout
    </p>`;

  const body = `
    <!-- Greeting -->
    <p style="margin:0 0 6px;font-size:17px;color:${DARK};font-family:Georgia,serif;font-weight:700;">
      Hi ${data.customerName || 'there'} 👋
    </p>
    <p style="margin:0 0 32px;font-size:14px;color:#57534e;line-height:1.75;font-family:Arial,sans-serif;">
      You're one step away from completing your New Eco Roses order.
      Use the code below to verify your identity and proceed to checkout securely.
    </p>

    <!-- OTP card -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 32px;">
      <tr>
        <td style="background:${BG};border:2px solid ${GOLD};border-radius:20px;padding:36px 24px;text-align:center;">
          <!-- Label -->
          <p style="margin:0 0 12px;font-size:10px;text-transform:uppercase;letter-spacing:0.25em;color:#78716c;
                    font-family:Arial,sans-serif;font-weight:700;">
            Your Verification Code
          </p>
          <!-- OTP digits with individual styling -->
          <div style="display:inline-block;margin:8px 0;">
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                ${data.otp.split('').map(d => `
                  <td style="padding:0 4px;">
                    <div style="width:48px;height:64px;background:${WHITE};border:2px solid ${LIGHT};border-radius:14px;
                                font-size:32px;font-weight:900;color:${DARK};font-family:'Courier New',Courier,monospace;
                                text-align:center;line-height:64px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                      ${d}
                    </div>
                  </td>`).join('')}
              </tr>
            </table>
          </div>
          <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;font-family:Arial,sans-serif;">
            Valid for <strong style="color:${DARK};">10 minutes</strong> &nbsp;·&nbsp; Do not share this code
          </p>
        </td>
      </tr>
    </table>

    <!-- Security note -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;">
      <tr>
        <td style="background:#fef9ec;border-left:4px solid ${GOLD};border-radius:0 12px 12px 0;padding:16px 20px;">
          <p style="margin:0;font-size:12px;color:#78350f;font-family:Arial,sans-serif;line-height:1.6;">
            🔒 <strong>Security notice:</strong> New Eco Roses will <strong>never</strong> ask for this
            code over phone or email. If you did not request this, you may safely ignore it.
          </p>
        </td>
      </tr>
    </table>

    ${DIVIDER}

    <p style="margin:0;font-size:12px;color:#9ca3af;font-family:Arial,sans-serif;text-align:center;">
      Questions? <a href="mailto:support@newecoroses.com" style="color:${GOLD};text-decoration:none;font-weight:700;">Contact us</a>
    </p>`;

  return shell(header, body);
}

// ── Order Confirmation Email ───────────────────────────────────────────────
export function buildOrderConfirmationHtml(data: OrderEmailData, siteUrl = 'https://www.newecoroses.com'): string {
  const trackingUrl = `${siteUrl}/track-order?order=${data.orderNumber}`;
  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const itemsHtml = data.items.map((item, i) => `
    <tr>
      <td style="padding:14px 0;${i < data.items.length - 1 ? `border-bottom:1px solid ${LIGHT};` : ''}">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <!-- Flower icon pill -->
            <td width="52" valign="middle" style="padding-right:14px;">
              <div style="width:52px;height:52px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:14px;
                          text-align:center;line-height:52px;font-size:22px;border:1px solid #fcd34d;">
                🌸
              </div>
            </td>
            <!-- Name + qty -->
            <td valign="middle">
              <p style="margin:0;font-size:14px;font-weight:700;color:${DARK};font-family:Arial,sans-serif;">${item.name}</p>
              <p style="margin:4px 0 0;font-size:12px;color:${GREY};font-family:Arial,sans-serif;">Qty: ${item.quantity}</p>
            </td>
            <!-- Price -->
            <td valign="middle" align="right" style="white-space:nowrap;">
              <span style="font-size:15px;font-weight:800;color:${DARK};font-family:Arial,sans-serif;">
                ${item.price > 0 ? `&#8377;${(item.price * item.quantity).toLocaleString('en-IN')}` : 'Included'}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join('');

  const addressHtml = data.shippingAddress
    ? [data.shippingAddress.line1, data.shippingAddress.line2, data.shippingAddress.city, data.shippingAddress.state, data.shippingAddress.postalCode].filter(Boolean).join(', ')
    : '';

  const steps = ['Order Received ✓', 'Being Crafted', 'Out for Delivery', 'Delivered'];

  const header = `
    <h1 style="margin:0;color:${WHITE};font-size:30px;font-weight:800;font-family:Georgia,serif;letter-spacing:-0.5px;">
      Order Confirmed! 🎉
    </h1>
    <p style="margin:10px 0 0;color:#d1d5db;font-size:13px;font-family:Arial,sans-serif;">
      Your floral arrangement is being handcrafted with love
    </p>`;

  const body = `
    <!-- Greeting -->
    <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:${DARK};font-family:Georgia,serif;">
      Hello ${data.customerName} 🌷
    </p>
    <p style="margin:0 0 32px;font-size:14px;color:#57534e;line-height:1.75;font-family:Arial,sans-serif;">
      Thank you for choosing New Eco Roses! Your order is confirmed and our artisans are
      already handcrafting your beautiful floral arrangement. We'll keep you updated every step of the way.
    </p>

    <!-- Order summary card -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
           style="background:${BG};border-radius:20px;margin:0 0 28px;overflow:hidden;">
      <tr>
        <td style="padding:24px 28px;">
          <!-- Order # + date row -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                 style="border-bottom:1px solid #e8dcc8;padding-bottom:18px;margin-bottom:18px;">
            <tr>
              <td>
                <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">Order Number</p>
                <p style="margin:5px 0 0;font-size:20px;font-weight:900;color:${DARK};font-family:Arial,sans-serif;letter-spacing:-0.3px;">#${data.orderNumber}</p>
              </td>
              <td align="right">
                <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">Date</p>
                <p style="margin:5px 0 0;font-size:13px;font-weight:600;color:#57534e;font-family:Arial,sans-serif;">${dateStr}</p>
              </td>
            </tr>
          </table>
          <!-- Items -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            ${itemsHtml}
          </table>
          <!-- Total -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                 style="border-top:2px solid ${GOLD};padding-top:18px;margin-top:18px;">
            <tr>
              <td>
                <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#78716c;font-family:Arial,sans-serif;font-weight:700;">Total Paid</p>
                <p style="margin:5px 0 0;font-size:11px;color:#22c55e;font-family:Arial,sans-serif;font-weight:700;">✓ Payment Verified &amp; Secure</p>
              </td>
              <td align="right">
                <p style="margin:0;font-size:28px;font-weight:900;color:${DARK};font-family:Arial,sans-serif;letter-spacing:-0.5px;">
                  &#8377;${data.total.toLocaleString('en-IN')}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${addressHtml ? `
    <!-- Delivery address -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
           style="border:1.5px solid #e8dcc8;border-radius:16px;margin:0 0 28px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">
            📦 Delivery Address
          </p>
          <p style="margin:0;font-size:14px;color:${DARK};font-family:Arial,sans-serif;line-height:1.65;">${addressHtml}</p>
        </td>
      </tr>
    </table>` : ''}

    ${data.specialNote ? `
    <!-- Special note -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
           style="margin:0 0 28px;">
      <tr>
        <td style="background:#fef9ec;border-left:4px solid ${GOLD};border-radius:0 12px 12px 0;padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#92400e;font-family:Arial,sans-serif;font-weight:700;">📝 Special Note</p>
          <p style="margin:0;font-size:13px;color:#78350f;font-family:Arial,sans-serif;line-height:1.6;">${data.specialNote}</p>
        </td>
      </tr>
    </table>` : ''}

    <!-- Delivery progress timeline -->
    <p style="margin:0 0 18px;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">
      Delivery Progress
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 32px;">
      <tr>
        ${steps.map((step, i) => `
        <td align="center" valign="top" style="width:25%;">
          <!-- Circle -->
          <div style="width:36px;height:36px;border-radius:50%;margin:0 auto 10px;
                      ${i === 0
                        ? `background:${GOLD};box-shadow:0 0 0 5px #fef3c7;`
                        : `background:${LIGHT};border:2px solid #e8dcc8;`}
                      display:inline-block;line-height:36px;text-align:center;
                      font-size:12px;font-weight:800;color:${i === 0 ? WHITE : GREY};
                      font-family:Arial,sans-serif;">
            ${i === 0 ? '✓' : (i + 1)}
          </div>
          <!-- Label -->
          <p style="margin:0;font-size:10px;color:${i === 0 ? GOLD : '#9ca3af'};
                    font-family:Arial,sans-serif;font-weight:${i === 0 ? '700' : '400'};
                    line-height:1.4;text-align:center;">
            ${step}
          </p>
        </td>`).join('')}
      </tr>
    </table>

    ${DIVIDER}

    <!-- Track CTA -->
    <div style="text-align:center;margin:0 0 20px;">
      ${goldButton(trackingUrl, '📦 Track My Order')}
      <p style="margin:12px 0 0;font-size:11px;color:#9ca3af;font-family:Arial,sans-serif;">
        Real-time delivery updates for order #${data.orderNumber}
      </p>
    </div>

    ${DIVIDER}

    <!-- WhatsApp help -->
    <div style="text-align:center;">
      <p style="margin:0 0 12px;font-size:14px;color:#57534e;font-family:Arial,sans-serif;font-weight:600;">Need help with your order?</p>
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
        <tr>
          <td style="border-radius:50px;background:#25D366;box-shadow:0 4px 16px rgba(37,211,102,0.3);">
            <a href="https://wa.me/919936911611"
               style="display:inline-block;padding:14px 36px;font-family:Arial,sans-serif;
                      font-size:13px;font-weight:800;color:${WHITE};text-decoration:none;
                      letter-spacing:0.06em;text-transform:uppercase;">
              💬 WhatsApp Us
            </a>
          </td>
        </tr>
      </table>
    </div>`;

  return shell(header, body);
}

// ── Status Update Email ────────────────────────────────────────────────────
export function buildStatusUpdateHtml(data: OrderEmailData & { newStatus: string }, siteUrl = 'https://www.newecoroses.com'): string {
  const trackingUrl = `${siteUrl}/track-order?order=${data.orderNumber}`;

  const statusConfig: Record<string, { emoji: string; title: string; msg: string; colour: string; bg: string }> = {
    processing: { emoji: '🌸', title: 'Your Bouquet is Being Crafted!',    msg: 'Our expert florists are handcrafting your arrangement with the freshest blooms.',          colour: '#8b5cf6', bg: '#f5f3ff' },
    delivered:  { emoji: '🎉', title: 'Your Order Has Been Delivered!',     msg: 'Your gorgeous floral arrangement has been delivered. We hope it brings a big smile!',       colour: '#22c55e', bg: '#f0fdf4' },
    cancelled:  { emoji: '😔', title: 'Order Cancelled',                    msg: 'Your order has been cancelled. If this was unexpected, please contact us immediately.',     colour: '#ef4444', bg: '#fef2f2' },
    confirmed:  { emoji: '✅', title: 'Order Confirmed!',                   msg: 'Your order is confirmed and being prepared with love.',                                     colour: GOLD,      bg: '#fefce8' },
  };

  const cfg = statusConfig[data.newStatus] || statusConfig['confirmed'];

  const header = `
    <h1 style="margin:0;color:${WHITE};font-size:26px;font-weight:800;font-family:Georgia,serif;">
      ${cfg.emoji} Order Update
    </h1>
    <p style="margin:8px 0 0;color:#d1d5db;font-size:13px;font-family:Arial,sans-serif;">
      Order #${data.orderNumber}
    </p>`;

  const body = `
    <!-- Status hero -->
    <div style="text-align:center;padding:32px 0 24px;">
      <div style="display:inline-block;width:72px;height:72px;border-radius:50%;background:${cfg.bg};
                  border:2px solid ${cfg.colour};line-height:72px;font-size:34px;margin-bottom:20px;">
        ${cfg.emoji}
      </div>
      <h2 style="margin:0 0 12px;font-size:24px;font-weight:800;color:${DARK};font-family:Georgia,serif;">${cfg.title}</h2>
      <p style="margin:0 auto;font-size:14px;color:#57534e;font-family:Arial,sans-serif;line-height:1.7;max-width:380px;">${cfg.msg}</p>
    </div>

    ${DIVIDER}

    <!-- Order meta -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
           style="background:${BG};border-radius:16px;margin:0 0 28px;">
      <tr>
        <td style="padding:22px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td>
                <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">Order No.</p>
                <p style="margin:5px 0 0;font-size:18px;font-weight:900;color:${DARK};font-family:Arial,sans-serif;">#${data.orderNumber}</p>
              </td>
              <td align="right">
                <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#9ca3af;font-family:Arial,sans-serif;font-weight:700;">Total</p>
                <p style="margin:5px 0 0;font-size:18px;font-weight:900;color:${DARK};font-family:Arial,sans-serif;">&#8377;${data.total.toLocaleString('en-IN')}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Track CTA -->
    <div style="text-align:center;margin:0 0 28px;">
      ${goldButton(trackingUrl, '📦 Track My Order')}
    </div>

    ${DIVIDER}

    <!-- WhatsApp -->
    <div style="text-align:center;">
      <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
        <tr>
          <td style="border-radius:50px;background:#25D366;box-shadow:0 4px 16px rgba(37,211,102,0.3);">
            <a href="https://wa.me/919936911611"
               style="display:inline-block;padding:12px 32px;font-family:Arial,sans-serif;
                      font-size:13px;font-weight:800;color:${WHITE};text-decoration:none;
                      letter-spacing:0.06em;text-transform:uppercase;">
              💬 WhatsApp for Help
            </a>
          </td>
        </tr>
      </table>
    </div>`;

  return shell(header, body);
}

// ── Send Functions ─────────────────────────────────────────────────────────
const FROM = process.env.RESEND_FROM_EMAIL || 'New Eco Roses <noreply@newecoroses.com>';

export async function sendOtpEmail(data: OtpEmailData) {
  try {
    const res = await resend.emails.send({
      from: FROM,
      to: [data.customerEmail],
      subject: `${data.otp} — Your New Eco Roses Verification Code`,
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
      subject: `Order Confirmed #${data.orderNumber} — New Eco Roses 🌸`,
      html: buildOrderConfirmationHtml(data, siteUrl),
    });
    if (res.error) console.error('Resend sendOrderConfirmationEmail error:', res.error);
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
      subject: `Order #${data.orderNumber} Update — New Eco Roses`,
      html: buildStatusUpdateHtml(data, siteUrl),
    });
    if (res.error) console.error('Resend sendStatusUpdateEmail error:', res.error);
    return res;
  } catch (err) {
    console.error('Failed to send Status Update email via Resend:', err);
    return null;
  }
}
