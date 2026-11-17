import { SavedOrder } from './order-cache';

/**
 * Robust specialNote parser for:
 * Occasion, Recipient Name & Phone, Alternate Phone, Sender Name, Message
 */
export function parseSpecialNote(note?: string): Record<string, string> {
    if (!note) return {};
    const result: Record<string, string> = {};
    const pairs = note.split('|');
    for (const pair of pairs) {
        const [k, ...vParts] = pair.split(':');
        if (k && vParts.length) {
            const rawKey = k.trim().toLowerCase().replace(/\s+/g, '_');
            const rawVal = vParts.join(':').trim();
            result[rawKey] = rawVal;
        }
    }

    // 1. Recipient extraction (e.g., "John Doe (+91 9876543210)")
    const recipientRaw = result['recipient'] || result['recipient_name'] || '';
    if (recipientRaw) {
        const match = recipientRaw.match(/^([^(]+)(?:\(([^)]+)\))?/);
        if (match) {
            result['recipient_name'] = match[1].trim();
            if (match[2]) result['recipient_phone'] = match[2].trim().replace(/^\+91\s*/, '');
        } else {
            result['recipient_name'] = recipientRaw;
        }
    }

    // 2. Alt phone extraction
    const altRaw = result['alternate_mobile_(mandatory)'] || result['alternate_mobile'] || result['alt_phone'] || result['alternate_phone'] || '';
    if (altRaw) {
        result['alt_phone'] = altRaw.replace(/^\+91\s*/, '').trim();
    }

    // 3. Occasion extraction
    if (result['occasion']) {
        result['occasion'] = result['occasion'].trim();
    }

    // 4. Message extraction & cleaning
    let msgRaw = result['message'] || result['message_card'] || '';
    if (msgRaw) {
        msgRaw = msgRaw.replace(/^["']|["']$/g, '').trim();
        const lines = msgRaw.split(/\\n|\n/);
        const cleanLines: string[] = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (/^To:/i.test(trimmed) && !result['recipient_name']) {
                result['recipient_name'] = trimmed.replace(/^To:\s*/i, '').trim();
            } else if (/^From:/i.test(trimmed) && !result['sender_name']) {
                result['sender_name'] = trimmed.replace(/^From:\s*/i, '').trim();
            } else {
                const stripped = trimmed.replace(/^["']|["']$/g, '').trim();
                if (stripped) cleanLines.push(stripped);
            }
        }
        result['message'] = cleanLines.join(' ');
    }

    return result;
}

/**
 * Generates and prints a 4×6 courier shipping label
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
  .label { width: 100%; height: 100%; border: 2.5px solid #000; display: flex; flex-direction: column; }
  .label-header { background: #000; color: #fff; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; }
  .brand { font-size: 13px; font-weight: 900; letter-spacing: 2px; }
  .order-num { font-size: 12px; font-family: monospace; font-weight: bold; }
  .badges { display: flex; gap: 6px; padding: 6px 10px; border-bottom: 1.5px solid #000; background: #fafafa; }
  .badge { padding: 3px 8px; border: 1.5px solid #000; border-radius: 4px; font-size: 9px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; }
  .badge-prepaid { background: #16a34a; color: #fff; border-color: #16a34a; }
  .badge-fragile { background: #dc2626; color: #fff; border-color: #dc2626; }
  .section { padding: 9px 12px; border-bottom: 1px solid #ddd; }
  .section-label { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #666; margin-bottom: 4px; }
  .section-value { font-size: 12px; font-weight: 800; line-height: 1.3; }
  .section-sub { font-size: 10.5px; color: #333; line-height: 1.4; margin-top: 2px; }
  .qr-box { width: 62px; height: 62px; border: 1.5px solid #000; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; color: #000; text-align: center; flex-shrink: 0; background: #fdfdfd; }
  .split { display: flex; gap: 10px; align-items: flex-start; }
  .split-left { flex: 1; }
  .footer { margin-top: auto; padding: 7px 12px; background: #f5f5f5; border-top: 1.5px solid #000; font-size: 8px; color: #444; text-align: center; }
  .handling { font-size: 8.5px; font-weight: bold; color: #991b1b; padding: 5px 12px; border-bottom: 1px dashed #ccc; background: #fef2f2; }
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
    <span class="badge">FRESH FLOWERS</span>
    ${occasion ? `<span class="badge" style="background:#fef3c7;border-color:#d97706;color:#92400e;">${occasion.toUpperCase()}</span>` : ''}
  </div>

  <div class="section">
    <div class="section-label">📬 SHIP TO (CONSIGNEE)</div>
    <div class="split">
      <div class="split-left">
        <div class="section-value">${recipientName}</div>
        <div class="section-sub"><strong>Primary Phone:</strong> 📱 +91 ${recipientPhone}</div>
        ${altPhone ? `<div class="section-sub"><strong>Alternate Phone:</strong> 📱 +91 ${altPhone}</div>` : ''}
        <div class="section-sub" style="margin-top:4px;">
          ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - <strong>${order.shippingAddress.postalCode}</strong>
        </div>
      </div>
      <div class="qr-box">
        <div style="font-size:18px;line-height:1;">▣</div>
        <div>NER QR</div>
        <div style="font-size:7px;color:#666;">SCAN</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-label">📤 SHIPPED FROM</div>
    <div class="section-value">New Eco Roses Boutique — ${storeName}</div>
    <div class="section-sub">${storeAddress}</div>
    <div class="section-sub">Kolkata, West Bengal &middot; newecoroses.com</div>
  </div>

  <div class="section" style="border-bottom:none;">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div class="section-label">PARCEL VALUE</div>
        <div class="section-value" style="font-size:15px;color:#15803d;">₹${order.total.toLocaleString('en-IN')}</div>
      </div>
      <div>
        <div class="section-label">PAYMENT MODE</div>
        <div class="section-value">${order.paymentMethod || 'Online'}</div>
      </div>
      <div>
        <div class="section-label">DISPATCH DATE</div>
        <div class="section-value">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
      </div>
    </div>
  </div>

  <div class="handling">
    ⚠ CAUTION: Fresh floral arrangement &middot; Keep strictly upright &middot; Do not invert or crush &middot; Same-day express
  </div>

  <div class="footer">
    Handcrafted with love by New Eco Roses Luxury Floral Atelier &middot; newecoroses.com<br>
    <strong>Rider Delivery Acknowledgment &amp; Signature: ___________________________</strong>
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=450,height=680');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}

/**
 * Generates and prints a daily courier dispatch manifest (A4 landscape)
 */
export function generateCourierManifest(orders: SavedOrder[], storeName: string, date?: string): void {
    const manifestDate = date || new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const rows = orders.map((o, i) => {
        const parsed = parseSpecialNote(o.specialNote);
        const recipientName = parsed['recipient_name'] || o.customer.name;
        const altPhone = parsed['alt_phone'] || '—';
        const occasion = parsed['occasion'] || '—';
        return `
        <tr>
          <td style="text-align:center;font-weight:bold;">${i + 1}</td>
          <td style="font-family:monospace;font-weight:bold;">${o.orderNumber}</td>
          <td><strong>${recipientName}</strong>${recipientName !== o.customer.name ? `<br><span style="font-size:8.5px;color:#666;">Buyer: ${o.customer.name}</span>` : ''}</td>
          <td>${o.shippingAddress.line1}, ${o.shippingAddress.city} (${o.shippingAddress.postalCode})</td>
          <td style="font-family:monospace;white-space:nowrap;">+91 ${o.customer.phone}</td>
          <td style="font-family:monospace;white-space:nowrap;">${altPhone !== '—' ? '+91 ' + altPhone : '—'}</td>
          <td style="text-align:center;font-weight:bold;">${o.items.length}</td>
          <td style="text-transform:capitalize;">${occasion}</td>
          <td>${o.paymentMethod || 'Online'}</td>
          <td style="font-weight:bold;text-align:right;">₹${o.total.toLocaleString('en-IN')}</td>
          <td style="width:100px;border-bottom:1px solid #999;"></td>
        </tr>`;
    }).join('');

    const totalValue = orders.reduce((sum, o) => sum + o.total, 0);

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Courier Manifest - ${manifestDate}</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 10px; color: #000; padding: 10px; }
  .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px; }
  h1 { font-size: 17px; font-weight: 900; letter-spacing: 0.5px; }
  .meta { font-size: 10px; color: #333; margin-top: 3px; }
  table { width: 100%; border-collapse: collapse; margin-top: 5px; }
  th { background: #111; color: #fff; padding: 6px 8px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #111; }
  td { padding: 6px 8px; border: 1px solid #ddd; vertical-align: middle; font-size: 9.5px; }
  tr:nth-child(even) td { background: #fafafa; }
  .summary-row td { background: #f0fdf4 !important; font-weight: bold; border-top: 2px solid #000; }
  .footer { margin-top: 35px; display: flex; justify-content: space-between; padding-top: 10px; }
  .sign-box { border-top: 1.5px solid #000; padding-top: 5px; min-width: 180px; text-align: center; font-size: 9px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>🌹 New Eco Roses — Courier Dispatch &amp; Handover Manifest</h1>
    <div class="meta">
      <strong>Outlet / Store:</strong> ${storeName} &nbsp;|&nbsp;
      <strong>Dispatch Date:</strong> ${manifestDate} &nbsp;|&nbsp;
      <strong>Status:</strong> Sealed &amp; Out for Delivery
    </div>
  </div>
  <div style="text-align:right;">
    <div style="font-size:14px;font-weight:900;">Total Parcels: ${orders.length}</div>
    <div style="font-size:11px;font-weight:bold;color:#15803d;">Total Value: ₹${totalValue.toLocaleString('en-IN')}</div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th style="text-align:center;width:30px;">#</th>
      <th>Order #</th>
      <th>Recipient / Customer</th>
      <th>Delivery Address</th>
      <th>Primary Phone</th>
      <th>Alternate Phone</th>
      <th style="text-align:center;">Bouquets</th>
      <th>Occasion</th>
      <th>Payment</th>
      <th style="text-align:right;">Amount</th>
      <th style="text-align:center;">Rider Signature</th>
    </tr>
  </thead>
  <tbody>
    ${rows.length > 0 ? rows : '<tr><td colspan="11" style="text-align:center;padding:20px;color:#888;">No orders found for this dispatch manifest.</td></tr>'}
    <tr class="summary-row">
      <td colspan="6" style="text-align:right;">TOTAL SUMMARY:</td>
      <td style="text-align:center;">${orders.reduce((sum, o) => sum + o.items.length, 0)}</td>
      <td colspan="2"></td>
      <td style="text-align:right;color:#15803d;">₹${totalValue.toLocaleString('en-IN')}</td>
      <td></td>
    </tr>
  </tbody>
</table>

<div class="footer">
  <div class="sign-box">
    <strong>Store Dispatcher Signature</strong><br>
    <span style="font-size:8px;color:#666;">New Eco Roses Atelier</span>
  </div>
  <div class="sign-box">
    <strong>Courier Rider Signature</strong><br>
    <span style="font-size:8px;color:#666;">Name &amp; Vehicle Number</span>
  </div>
  <div class="sign-box">
    <strong>Security / Handover Gate</strong><br>
    <span style="font-size:8px;color:#666;">Time of Dispatch &amp; Stamp</span>
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=950,height=650');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}

/**
 * Generates and prints a luxury gift message card (5×7 inches)
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
<title>Luxury Gift Card${orderNumber ? ' - ' + orderNumber : ''}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
  @page { size: 5in 7in; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 5in; height: 7in; background: #fffef8; margin: 0; font-family: 'Playfair Display', serif; }
  .card {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #fffef8 0%, #fef9ec 50%, #fff8f0 100%);
    border: 2px solid #e8d5b7;
    display: flex; flex-direction: column; align-items: center; justify-content: space-between;
    padding: 34px 38px;
    position: relative; overflow: hidden; text-align: center;
  }
  .corner { position: absolute; width: 85px; height: 85px; opacity: 0.45; }
  .corner-tl { top: 0; left: 0; }
  .corner-tr { top: 0; right: 0; transform: scaleX(-1); }
  .corner-bl { bottom: 0; left: 0; transform: scaleY(-1); }
  .corner-br { bottom: 0; right: 0; transform: scale(-1); }

  .brand-top { text-align: center; }
  .brand-name { font-size: 11px; letter-spacing: 5px; text-transform: uppercase; color: #bfa81f; font-weight: 700; }
  .floral-divider { font-size: 16px; margin: 5px 0; color: #bfa81f; letter-spacing: 8px; }

  .occasion-tag {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11.5px; letter-spacing: 2.5px; text-transform: uppercase;
    color: #9a7c4a; border: 1.5px solid #d4a853; padding: 4px 16px;
    border-radius: 20px; background: rgba(191,168,31,0.08); font-weight: 600;
  }

  .to-line {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-size: 14px; color: #888; letter-spacing: 1px; margin-bottom: 2px;
  }
  .recipient {
    font-size: 24px; font-weight: 700; color: #2a1a0a; letter-spacing: 1px;
  }

  .message-block {
    flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px 6px;
  }
  .message {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16.5px; line-height: 1.8; color: #2d1a06; font-style: italic; max-width: 350px;
  }

  .sender-block { text-align: center; margin-top: 4px; }
  .with-love { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 12px; color: #999; letter-spacing: 1px; }
  .sender { font-size: 17px; font-weight: 700; color: #2a1a0a; margin-top: 2px; }

  .footer-brand {
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 9.5px; letter-spacing: 2px; text-transform: uppercase; color: #bfa81f;
    border-top: 1px solid #e8d5b7; padding-top: 10px; width: 100%;
  }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
<div class="card">
  <svg class="corner corner-tl" viewBox="0 0 80 80" fill="none">
    <path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <circle cx="20" cy="20" r="3" fill="#bfa81f" opacity="0.6"/>
    <text x="8" y="14" font-size="12" fill="#bfa81f" opacity="0.6">✿</text>
  </svg>
  <svg class="corner corner-tr" viewBox="0 0 80 80" fill="none">
    <path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <circle cx="20" cy="20" r="3" fill="#bfa81f" opacity="0.6"/>
    <text x="8" y="14" font-size="12" fill="#bfa81f" opacity="0.6">✿</text>
  </svg>
  <svg class="corner corner-bl" viewBox="0 0 80 80" fill="none">
    <path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <circle cx="20" cy="20" r="3" fill="#bfa81f" opacity="0.6"/>
  </svg>
  <svg class="corner corner-br" viewBox="0 0 80 80" fill="none">
    <path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/>
    <circle cx="20" cy="20" r="3" fill="#bfa81f" opacity="0.6"/>
  </svg>

  <div class="brand-top">
    <div class="brand-name">New Eco Roses</div>
    <div class="floral-divider">· · 🌹 · ·</div>
    ${occasion ? `<div class="occasion-tag">${occasion}</div>` : ''}
  </div>

  <div>
    <div class="to-line">To,</div>
    <div class="recipient">${recipientName || 'You'}</div>
  </div>

  <div class="message-block">
    <div class="message">${message ? message.replace(/\n/g, '<br>') : '&#8220; Wishing you a day as radiant, fragrant &amp; beautiful as these blooms &#8221;'}</div>
  </div>

  <div class="sender-block">
    <div class="with-love">— With heartfelt love,</div>
    <div class="sender">${senderName || 'Someone Special'}</div>
  </div>

  <div class="footer-brand">
    Handcrafted with love &middot; New Eco Roses Atelier &middot; newecoroses.com
    ${orderNumber ? ' &middot; #' + orderNumber : ''}
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=520,height=750');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 800);
    }
}
