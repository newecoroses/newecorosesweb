import { SavedOrder } from './order-cache';

/**
 * Parse specialNote for key-value pairs like "OCCASION: birthday | RECIPIENT: John"
 */
export function parseSpecialNote(note?: string): Record<string, string> {
    if (!note) return {};
    const result: Record<string, string> = {};
    // Try pipe-separated key:value pairs
    const pairs = note.split('|');
    for (const pair of pairs) {
        const [k, ...vParts] = pair.split(':');
        if (k && vParts.length) {
            result[k.trim().toLowerCase().replace(/\s+/g, '_')] = vParts.join(':').trim();
        }
    }
    return result;
}

/**
 * Generates and prints a 4×6 shipping label
 */
export function generateShippingLabel(order: SavedOrder, storeName: string): void {
    const parsed = parseSpecialNote(order.specialNote);
    const recipientName = parsed['recipient_name'] || order.customer.name;
    const recipientPhone = parsed['recipient_phone'] || order.customer.phone;
    const altPhone = parsed['alt_phone'] || '';
    const occasion = parsed['occasion'] || '';
    const storeAddress = storeName === 'Tollygunge Store'
        ? '12A, Tollygunge Main Road, Kolkata - 700033'
        : storeName === 'Alipore Store'
        ? '5B, Alipore Road, Kolkata - 700027'
        : 'New Eco Roses, Kolkata, West Bengal';

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Shipping Label - ${order.orderNumber}</title>
<style>
  @page { size: 4in 6in; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Arial', sans-serif; }
  body { width: 4in; height: 6in; background: #fff; color: #000; }
  .label { width: 100%; height: 100%; border: 2px solid #000; display: flex; flex-direction: column; }
  .label-header { background: #000; color: #fff; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; }
  .brand { font-size: 13px; font-weight: 900; letter-spacing: 2px; }
  .order-num { font-size: 11px; font-family: monospace; }
  .badges { display: flex; gap: 6px; padding: 6px 10px; border-bottom: 1px solid #000; }
  .badge { padding: 2px 8px; border: 1.5px solid #000; border-radius: 3px; font-size: 9px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; }
  .badge-prepaid { background: #16a34a; color: #fff; border-color: #16a34a; }
  .badge-fragile { background: #dc2626; color: #fff; border-color: #dc2626; }
  .section { padding: 8px 10px; border-bottom: 1px solid #ddd; }
  .section-label { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #666; margin-bottom: 3px; }
  .section-value { font-size: 11px; font-weight: 700; line-height: 1.4; }
  .section-sub { font-size: 10px; color: #333; line-height: 1.4; }
  .qr-box { width: 60px; height: 60px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 7px; color: #999; text-align: center; }
  .split { display: flex; gap: 8px; align-items: flex-start; }
  .split-left { flex: 1; }
  .footer { margin-top: auto; padding: 6px 10px; background: #f9f9f9; border-top: 1px solid #ddd; font-size: 8px; color: #555; text-align: center; }
  .handling { font-size: 8px; color: #333; padding: 4px 10px; border-bottom: 1px solid #eee; font-style: italic; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
<div class="label">
  <div class="label-header">
    <span class="brand">🌹 NEW ECO ROSES</span>
    <span class="order-num">#${order.orderNumber}</span>
  </div>

  <div class="badges">
    <span class="badge badge-prepaid">✓ PREPAID</span>
    <span class="badge badge-fragile">⚠ FRAGILE</span>
    <span class="badge">FLOWERS</span>
    ${occasion ? `<span class="badge" style="background:#fef3c7;border-color:#d97706;color:#92400e;">${occasion.toUpperCase()}</span>` : ''}
  </div>

  <div class="section">
    <div class="section-label">📬 DELIVER TO</div>
    <div class="split">
      <div class="split-left">
        <div class="section-value">${recipientName}</div>
        <div class="section-sub">📱 ${recipientPhone}${altPhone ? ` / ${altPhone}` : ''}</div>
        <div class="section-sub" style="margin-top:4px;">
          ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
          PIN: ${order.shippingAddress.postalCode}
        </div>
      </div>
      <div class="qr-box">QR<br>SCAN</div>
    </div>
  </div>

  <div class="section">
    <div class="section-label">📤 FROM</div>
    <div class="section-value">New Eco Roses — ${storeName}</div>
    <div class="section-sub">${storeAddress}</div>
    <div class="section-sub">newecoroses.com</div>
  </div>

  <div class="section" style="border-bottom:none;">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div class="section-label">ORDER VALUE</div>
        <div class="section-value" style="font-size:14px;">₹${order.total.toLocaleString('en-IN')}</div>
      </div>
      <div>
        <div class="section-label">PAYMENT</div>
        <div class="section-value">${order.paymentMethod}</div>
      </div>
      <div>
        <div class="section-label">DATE</div>
        <div class="section-value">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</div>
      </div>
    </div>
  </div>

  <div class="handling">⚠ Handle with care · Keep upright · Keep away from heat & direct sunlight</div>

  <div class="footer">
    Handcrafted with love · New Eco Roses · newecoroses.com<br>
    <strong>Rider Signature: ___________________</strong>
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=400,height=620');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}

/**
 * Generates and prints a courier dispatch manifest
 */
export function generateCourierManifest(orders: SavedOrder[], storeName: string, date: string): void {
    const rows = orders.map((o, i) => {
        const parsed = parseSpecialNote(o.specialNote);
        const recipientName = parsed['recipient_name'] || o.customer.name;
        const altPhone = parsed['alt_phone'] || '—';
        return `
        <tr>
          <td>${i + 1}</td>
          <td style="font-family:monospace;font-weight:700;">${o.orderNumber}</td>
          <td>${recipientName}</td>
          <td>${o.customer.name}${recipientName !== o.customer.name ? '<br><span style="font-size:9px;color:#666;">Recv: ' + recipientName + '</span>' : ''}</td>
          <td>${o.shippingAddress.line1}, ${o.shippingAddress.city}</td>
          <td style="font-family:monospace;">${o.customer.phone}</td>
          <td style="font-family:monospace;">${altPhone}</td>
          <td>${o.items.length}</td>
          <td>${o.paymentMethod}</td>
          <td style="font-weight:700;">₹${o.total.toLocaleString('en-IN')}</td>
          <td style="width:80px;"></td>
        </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Courier Manifest - ${date}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 10px; color: #000; }
  h1 { font-size: 16px; margin-bottom: 2px; }
  .meta { font-size: 10px; color: #555; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #000; color: #fff; padding: 5px 6px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 5px 6px; border-bottom: 1px solid #ddd; vertical-align: top; }
  tr:nth-child(even) td { background: #f7f7f7; }
  .footer { margin-top: 20px; display: flex; justify-content: space-between; font-size: 10px; }
  .sign-box { border-top: 1px solid #000; padding-top: 4px; min-width: 160px; text-align: center; font-size: 9px; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
<h1>🌹 New Eco Roses — Courier Dispatch Manifest</h1>
<div class="meta">
  <strong>Store:</strong> ${storeName} &nbsp;|&nbsp;
  <strong>Date:</strong> ${date} &nbsp;|&nbsp;
  <strong>Total Orders:</strong> ${orders.length} &nbsp;|&nbsp;
  <strong>Total Value:</strong> ₹${orders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}
</div>

<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Order #</th>
      <th>Customer</th>
      <th>Recipient</th>
      <th>Delivery Address</th>
      <th>Primary Phone</th>
      <th>Alt Phone</th>
      <th>Items</th>
      <th>Payment</th>
      <th>Amount</th>
      <th>Rider Sign</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>

<div class="footer">
  <div class="sign-box">Dispatcher Name &amp; Signature</div>
  <div class="sign-box">Rider Name &amp; Signature</div>
  <div class="sign-box">Received By &amp; Date</div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=900,height=600');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}

/**
 * Generates and prints a luxury gift message card (5x7 inches)
 */
export function generateGiftCard(options: {
    recipientName: string;
    senderName: string;
    message: string;
    occasion: string;
    orderNumber?: string;
}): void {
    const { recipientName, senderName, message, occasion, orderNumber } = options;

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Gift Card${orderNumber ? ' - ' + orderNumber : ''}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
  @page { size: 5in 7in; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 5in; height: 7in; background: #fffef8; }
  .card {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #fffef8 0%, #fef9ec 50%, #fff8f0 100%);
    border: 1px solid #e8d5b7;
    display: flex; flex-direction: column; align-items: center; justify-content: space-between;
    padding: 32px 36px;
    position: relative; overflow: hidden;
  }
  /* Decorative corner SVG borders */
  .corner { position: absolute; width: 80px; height: 80px; opacity: 0.35; }
  .corner-tl { top: 0; left: 0; }
  .corner-tr { top: 0; right: 0; transform: scaleX(-1); }
  .corner-bl { bottom: 0; left: 0; transform: scaleY(-1); }
  .corner-br { bottom: 0; right: 0; transform: scale(-1); }

  .brand-top { text-align: center; }
  .brand-name { font-family: 'Playfair Display', serif; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #bfa81f; font-weight: 700; }
  .floral-divider { font-size: 16px; margin: 4px 0; color: #bfa81f; letter-spacing: 8px; }

  .occasion-tag {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    color: #9a7c4a; border: 1px solid #d4a853; padding: 3px 14px;
    border-radius: 20px; background: rgba(191,168,31,0.07);
  }

  .to-line {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-size: 13px; color: #888; letter-spacing: 1px;
    margin-bottom: 2px;
  }
  .recipient {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #2a1a0a;
    letter-spacing: 1px; text-align: center;
  }

  .message-block {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 10px 0;
  }
  .message {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; line-height: 1.8; color: #2d1a06;
    text-align: center; font-style: italic;
    max-width: 340px;
  }

  .sender-block { text-align: center; }
  .with-love { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 11px; color: #999; letter-spacing: 1px; }
  .sender { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #2a1a0a; margin-top: 2px; }

  .footer-brand {
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #bfa81f;
    border-top: 1px solid #e8d5b7; padding-top: 10px; width: 100%;
  }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
<div class="card">
  <!-- Corner decorations -->
  <svg class="corner corner-tl" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <circle cx="20" cy="20" r="3" fill="#bfa81f" opacity="0.5"/>
    <text x="8" y="14" font-size="10" fill="#bfa81f" opacity="0.6">✿</text>
    <text x="14" y="30" font-size="8" fill="#bfa81f" opacity="0.4">❀</text>
  </svg>
  <svg class="corner corner-tr" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <circle cx="20" cy="20" r="3" fill="#bfa81f" opacity="0.5"/>
    <text x="8" y="14" font-size="10" fill="#bfa81f" opacity="0.6">✿</text>
  </svg>
  <svg class="corner corner-bl" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <circle cx="20" cy="20" r="3" fill="#bfa81f" opacity="0.5"/>
  </svg>
  <svg class="corner corner-br" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <circle cx="20" cy="20" r="3" fill="#bfa81f" opacity="0.5"/>
  </svg>

  <div class="brand-top">
    <div class="brand-name">New Eco Roses</div>
    <div class="floral-divider">· · 🌹 · ·</div>
    ${occasion ? `<div class="occasion-tag">${occasion}</div>` : ''}
  </div>

  <div style="text-align:center;">
    <div class="to-line">To,</div>
    <div class="recipient">${recipientName || 'You'}</div>
  </div>

  <div class="message-block">
    <div class="message">${message ? message.replace(/\n/g, '<br>') : '&#8220; Wishing you a beautiful day filled with joy &amp; love &#8221;'}</div>
  </div>

  <div class="sender-block">
    <div class="with-love">— With love,</div>
    <div class="sender">${senderName || 'Someone Special'}</div>
  </div>

  <div class="footer-brand">
    Handcrafted with love · New Eco Roses · newecoroses.com
    ${orderNumber ? ' · Order #' + orderNumber : ''}
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=500,height=720');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 800);
    }
}
