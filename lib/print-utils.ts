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

function getStoreAddress(storeName: string): string {
    if (storeName.includes('Tollygunge')) {
        return '12A, Tollygunge Main Road, Kolkata - 700033';
    }
    if (storeName.includes('Alipore')) {
        return '5B, Alipore Road, Kolkata - 700027';
    }
    return 'New Eco Roses Boutique, Kolkata, West Bengal';
}

function getTrackingUrl(orderNumber: string): string {
    return `https://newecoroses.com/track-order?order=${encodeURIComponent(orderNumber)}`;
}

function getQrCodeUrl(orderNumber: string): string {
    const url = getTrackingUrl(orderNumber);
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=2&data=${encodeURIComponent(url)}`;
}

// ═══════════════════════════════════════════════════════════════════
// LABEL OPTION 1: Modern 4×6″ Courier Thermal Shipping Label
// ═══════════════════════════════════════════════════════════════════
export function generateCourierShippingLabel(order: SavedOrder, storeName: string): void {
    const parsed = parseSpecialNote(order.specialNote);
    const recipientName = parsed['recipient_name'] || order.customer.name;
    const recipientPhone = parsed['recipient_phone'] || order.customer.phone;
    const altPhone = parsed['alt_phone'] || '';
    const occasion = parsed['occasion'] || '';
    const storeAddress = getStoreAddress(storeName);
    const qrUrl = getQrCodeUrl(order.orderNumber);
    const trackingUrl = getTrackingUrl(order.orderNumber);

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Courier Label - ${order.orderNumber}</title>
<style>
  @page { size: 4in 6in; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
  body { width: 4in; height: 6in; background: #fff; color: #000; padding: 6px; }
  .label-container { width: 100%; height: 100%; border: 2.5px solid #000; display: flex; flex-direction: column; justify-content: space-between; }
  
  .header { background: #000; color: #fff; padding: 7px 10px; display: flex; justify-content: space-between; align-items: center; }
  .brand { font-size: 13px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; }
  .order-no { font-size: 12px; font-family: monospace; font-weight: 800; }
  
  .badges-row { display: flex; gap: 4px; padding: 5px 8px; border-bottom: 1.5px solid #000; background: #f8f8f8; flex-wrap: wrap; }
  .badge { padding: 2px 7px; border: 1.5px solid #000; border-radius: 4px; font-size: 8.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; }
  .b-prepaid { background: #16a34a; color: #fff; border-color: #16a34a; }
  .b-fragile { background: #dc2626; color: #fff; border-color: #dc2626; }
  .b-occasion { background: #fef3c7; color: #92400e; border-color: #d97706; }
  
  .consignee-section { padding: 8px 10px; border-bottom: 1.5px solid #000; }
  .sec-title { font-size: 8px; font-weight: 900; color: #666; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 3px; }
  .rec-name { font-size: 14px; font-weight: 900; line-height: 1.2; text-transform: uppercase; }
  .rec-phones { font-size: 11px; font-weight: 700; margin-top: 3px; color: #111; }
  .rec-address { font-size: 10px; line-height: 1.35; color: #222; margin-top: 4px; }
  .pincode-highlight { font-size: 14px; font-weight: 900; background: #000; color: #fff; padding: 1px 6px; border-radius: 3px; display: inline-block; margin-top: 3px; }
  
  .middle-split { display: flex; border-bottom: 1.5px solid #000; }
  .split-left { flex: 1; padding: 7px 10px; border-right: 1.5px solid #000; font-size: 9.5px; line-height: 1.3; }
  .split-right { width: 110px; padding: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .qr-img { width: 78px; height: 78px; border: 1px solid #000; display: block; }
  .qr-hint { font-size: 7px; font-weight: 800; color: #000; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.3px; line-height: 1.1; }
  
  .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); padding: 6px 10px; border-bottom: 1px solid #ccc; font-size: 9px; }
  .meta-col { display: flex; flex-direction: column; }
  .meta-val { font-size: 11px; font-weight: 800; }
  
  .caution-strip { background: #fee2e2; border-bottom: 1px solid #f87171; color: #991b1b; padding: 4px 8px; font-size: 7.5px; font-weight: 800; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; }
  
  .footer { padding: 6px 10px; background: #fafafa; font-size: 7.5px; color: #444; }
  .sig-line { margin-top: 4px; font-size: 8px; font-weight: 700; display: flex; justify-content: space-between; border-top: 1px dashed #999; padding-top: 3px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<div class="label-container">
  <!-- Header -->
  <div class="header">
    <span class="brand">🌹 NEW ECO ROSES</span>
    <span class="order-no">#${order.orderNumber}</span>
  </div>

  <!-- Priority Badges -->
  <div class="badges-row">
    <span class="badge b-prepaid">✓ PREPAID COURIER</span>
    <span class="badge b-fragile">⚠ FRAGILE FLOWERS</span>
    <span class="badge">SAME-DAY EXPRESS</span>
    ${occasion ? `<span class="badge b-occasion">🎉 ${occasion.toUpperCase()}</span>` : ''}
  </div>

  <!-- Consignee Information -->
  <div class="consignee-section">
    <div class="sec-title">📬 SHIP TO (DELIVERY RECIPIENT)</div>
    <div class="rec-name">${recipientName}</div>
    <div class="rec-phones">
      Primary: 📱 +91 ${recipientPhone}
      ${altPhone ? ` &nbsp;|&nbsp; Alt: 📱 +91 ${altPhone}` : ''}
    </div>
    <div class="rec-address">
      ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : ''}<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state}
    </div>
    <div>
      <span class="pincode-highlight">PIN: ${order.shippingAddress.postalCode}</span>
    </div>
  </div>

  <!-- Shipped From & Scannable QR -->
  <div class="middle-split">
    <div class="split-left">
      <div class="sec-title">📤 DISPATCHED FROM</div>
      <div style="font-weight:800;font-size:10.5px;">${storeName}</div>
      <div style="color:#444;font-size:9px;margin-top:2px;">${storeAddress}</div>
      <div style="margin-top:4px;color:#222;font-size:8.5px;">
        <strong>Care Hotline:</strong> +91 99369 11611<br>
        <strong>Web:</strong> newecoroses.com
      </div>
    </div>
    <div class="split-right">
      <img src="${qrUrl}" alt="Scan Delivery QR" class="qr-img" />
      <span class="qr-hint">Scan with Camera<br>Live Route &amp; Nav</span>
    </div>
  </div>

  <!-- Order Meta Information -->
  <div class="meta-grid">
    <div class="meta-col">
      <span class="sec-title">PARCEL VALUE</span>
      <span class="meta-val" style="color:#15803d;font-size:12px;">₹${order.total.toLocaleString('en-IN')}</span>
    </div>
    <div class="meta-col">
      <span class="sec-title">PAYMENT MODE</span>
      <span class="meta-val">${order.paymentMethod || 'Prepaid Online'}</span>
    </div>
    <div class="meta-col">
      <span class="sec-title">ITEMS COUNT</span>
      <span class="meta-val">${order.items.reduce((sum, i) => sum + i.quantity, 0)} Bouquet(s)</span>
    </div>
  </div>

  <!-- Handling Notice -->
  <div class="caution-strip">
    ⚠ KEEP STRICTLY UPRIGHT 90° &middot; WATER RESERVOIR IN TUBE &middot; DO NOT STACK OR DROP
  </div>

  <!-- Footer Handover -->
  <div class="footer">
    <div>Handcrafted by New Eco Roses Luxury Floral Atelier &middot; newecoroses.com</div>
    <div class="sig-line">
      <span>Rider Signature: ______________________</span>
      <span>Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
    </div>
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=440,height=660');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}

// ═══════════════════════════════════════════════════════════════════
// LABEL OPTION 2: Luxury Gift Delivery Slip & Presentation Card
// ═══════════════════════════════════════════════════════════════════
export function generateLuxuryDeliverySlip(order: SavedOrder, storeName: string): void {
    const parsed = parseSpecialNote(order.specialNote);
    const recipientName = parsed['recipient_name'] || order.customer.name;
    const recipientPhone = parsed['recipient_phone'] || order.customer.phone;
    const occasion = parsed['occasion'] || '';
    const qrUrl = getQrCodeUrl(order.orderNumber);

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Luxury Delivery Slip - ${order.orderNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@400;600;700&display=swap');
  @page { size: 4in 6in; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 4in; height: 6in; background: #faf8f5; color: #1a150e; padding: 8px; font-family: 'Cormorant Garamond', serif; }
  .slip-box { width: 100%; height: 100%; border: 1.5px solid #d4af37; background: #fffdfa; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
  .corner-gold { position: absolute; width: 28px; height: 28px; border-color: #bfa81f; border-style: solid; }
  .c-tl { top: 3px; left: 3px; border-width: 2px 0 0 2px; }
  .c-tr { top: 3px; right: 3px; border-width: 2px 2px 0 0; }
  .c-bl { bottom: 3px; left: 3px; border-width: 0 0 2px 2px; }
  .c-br { bottom: 3px; right: 3px; border-width: 0 2px 2px 0; }
  
  .head { text-align: center; border-bottom: 1px solid #ebdcb5; padding-bottom: 8px; }
  .brand-title { font-family: 'Playfair Display', serif; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #bfa81f; font-weight: 700; }
  .sub-tag { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: #88724d; margin-top: 1px; }
  
  .rec-block { text-align: center; padding: 8px 0; }
  .for-label { font-size: 10px; font-style: italic; color: #777; letter-spacing: 1px; }
  .rec-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #1c140a; line-height: 1.2; }
  .rec-locality { font-size: 10.5px; color: #555; margin-top: 2px; }
  
  .items-list { background: #faf7f0; border: 1px solid #f0e6d2; border-radius: 8px; padding: 8px 10px; font-size: 10.5px; }
  .item-row { display: flex; justify-content: space-between; font-weight: 600; padding: 2px 0; }
  
  .care-guide { padding: 6px 0; border-top: 1px dashed #e8d7b5; border-bottom: 1px dashed #e8d7b5; font-size: 9px; color: #443522; line-height: 1.35; }
  .care-title { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #96742e; font-size: 8.5px; margin-bottom: 2px; text-align: center; }
  
  .qr-row { display: flex; align-items: center; justify-content: space-between; padding: 4px 6px; }
  .qr-code { width: 55px; height: 55px; border: 1px solid #d4af37; border-radius: 4px; }
  .qr-text { flex: 1; padding-left: 10px; font-size: 9px; color: #5c4728; line-height: 1.3; }
  
  .footer-sig { text-align: center; font-size: 8.5px; letter-spacing: 1px; text-transform: uppercase; color: #bfa81f; padding-top: 4px; border-top: 1px solid #ebdcb5; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<div class="slip-box">
  <div class="corner-gold c-tl"></div>
  <div class="corner-gold c-tr"></div>
  <div class="corner-gold c-bl"></div>
  <div class="corner-gold c-br"></div>

  <div class="head">
    <div class="brand-title">New Eco Roses</div>
    <div class="sub-tag">Haute Floral Atelier &middot; ${storeName}</div>
    ${occasion ? `<div style="font-size:10px;font-weight:700;color:#96742e;margin-top:2px;text-transform:uppercase;">✨ ${occasion} Special</div>` : ''}
  </div>

  <div class="rec-block">
    <div class="for-label">Specially Handcrafted For</div>
    <div class="rec-name">${recipientName}</div>
    <div class="rec-locality">${order.shippingAddress.city} &middot; #${order.orderNumber}</div>
  </div>

  <div class="items-list">
    <div style="font-size:8.5px;text-transform:uppercase;color:#8c7146;font-weight:700;margin-bottom:3px;">Arrangement Manifest:</div>
    ${order.items.map(i => `
      <div class="item-row">
        <span>${i.quantity}× ${i.name}</span>
        <span>Included</span>
      </div>
    `).join('')}
  </div>

  <div class="care-guide">
    <div class="care-title">🌸 Fresh Flower Care Ritual</div>
    <div>1. Trim stems at a 45° angle before placing in fresh cold water</div>
    <div>2. Dissolve the enclosed floral preservative sachet thoroughly</div>
    <div>3. Keep away from direct sunlight, air conditioning &amp; heat vents</div>
  </div>

  <div class="qr-row">
    <img src="${qrUrl}" alt="Delivery QR" class="qr-code" />
    <div class="qr-text">
      <strong>Live Concierge &amp; Unboxing:</strong><br>
      Scan with your phone to track flower freshness or contact our master florists directly.
    </div>
  </div>

  <div class="footer-sig">
    With Warmest Greetings &middot; newecoroses.com
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=440,height=660');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}

// ═══════════════════════════════════════════════════════════════════
// MANIFEST OPTION 1: Master Daily Courier Dispatch Manifest (A4 Landscape)
// ═══════════════════════════════════════════════════════════════════
export function generateBatchManifest(orders: SavedOrder[], storeName: string, date?: string): void {
    const manifestDate = date || new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const totalValue = orders.reduce((sum, o) => sum + o.total, 0);

    const rows = orders.map((o, i) => {
        const parsed = parseSpecialNote(o.specialNote);
        const recipientName = parsed['recipient_name'] || o.customer.name;
        const altPhone = parsed['alt_phone'] || '—';
        const occasion = parsed['occasion'] || '—';
        const qrUrl = getQrCodeUrl(o.orderNumber);

        return `
        <tr>
          <td style="text-align:center;font-weight:bold;">${i + 1}</td>
          <td style="font-family:monospace;font-weight:800;white-space:nowrap;">${o.orderNumber}</td>
          <td>
            <strong>${recipientName}</strong>
            ${recipientName !== o.customer.name ? `<br><span style="font-size:8px;color:#666;">Buyer: ${o.customer.name}</span>` : ''}
          </td>
          <td>${o.shippingAddress.line1}, ${o.shippingAddress.city} <strong>(${o.shippingAddress.postalCode})</strong></td>
          <td style="font-family:monospace;white-space:nowrap;">📱 +91 ${o.customer.phone}</td>
          <td style="font-family:monospace;white-space:nowrap;">${altPhone !== '—' ? '📱 +91 ' + altPhone : '—'}</td>
          <td style="text-align:center;font-weight:bold;">${o.items.reduce((s, it) => s + it.quantity, 0)}</td>
          <td style="text-transform:capitalize;">${occasion}</td>
          <td><span style="font-size:8.5px;padding:1px 5px;border-radius:3px;background:#e2e8f0;font-weight:700;">${o.paymentMethod || 'Online'}</span></td>
          <td style="font-weight:800;text-align:right;">₹${o.total.toLocaleString('en-IN')}</td>
          <td style="text-align:center;">
            <img src="${qrUrl}" alt="QR" style="width:36px;height:36px;display:inline-block;" />
          </td>
          <td style="width:90px;border-bottom:1px solid #999;"></td>
        </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Dispatch Manifest - ${manifestDate}</title>
<style>
  @page { size: A4 landscape; margin: 8mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 9.5px; color: #000; padding: 10px; }
  .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2.5px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
  h1 { font-size: 16px; font-weight: 900; letter-spacing: 0.5px; }
  .meta { font-size: 9.5px; color: #333; margin-top: 3px; }
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  th { background: #111; color: #fff; padding: 5px 6px; text-align: left; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #111; }
  td { padding: 4px 6px; border: 1px solid #ddd; vertical-align: middle; font-size: 9px; }
  tr:nth-child(even) td { background: #fafafa; }
  .summary-row td { background: #f0fdf4 !important; font-weight: 800; border-top: 2px solid #000; font-size: 10px; }
  .footer { margin-top: 25px; display: flex; justify-content: space-between; padding-top: 10px; }
  .sign-box { border-top: 1.5px solid #000; padding-top: 4px; min-width: 170px; text-align: center; font-size: 8.5px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>🌹 New Eco Roses &mdash; Master Courier Dispatch Manifest</h1>
    <div class="meta">
      <strong>Store Outlet:</strong> ${storeName} &nbsp;|&nbsp;
      <strong>Dispatch Date:</strong> ${manifestDate} &nbsp;|&nbsp;
      <strong>Parcels Dispatched:</strong> ${orders.length}
    </div>
  </div>
  <div style="text-align:right;">
    <div style="font-size:13px;font-weight:900;">Total Parcels: ${orders.length}</div>
    <div style="font-size:12px;font-weight:800;color:#15803d;">Total Value: ₹${totalValue.toLocaleString('en-IN')}</div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th style="text-align:center;width:24px;">#</th>
      <th>Order #</th>
      <th>Recipient / Consignee</th>
      <th>Delivery Address</th>
      <th>Primary Phone</th>
      <th>Alt Phone</th>
      <th style="text-align:center;">Bouquets</th>
      <th>Occasion</th>
      <th>Payment</th>
      <th style="text-align:right;">Amount</th>
      <th style="text-align:center;">Scan QR</th>
      <th style="text-align:center;">Rider Handover</th>
    </tr>
  </thead>
  <tbody>
    ${rows.length > 0 ? rows : '<tr><td colspan="12" style="text-align:center;padding:20px;color:#888;">No orders recorded for this manifest.</td></tr>'}
    <tr class="summary-row">
      <td colspan="6" style="text-align:right;">TOTAL SUMMARY:</td>
      <td style="text-align:center;">${orders.reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0), 0)}</td>
      <td colspan="2"></td>
      <td style="text-align:right;color:#15803d;">₹${totalValue.toLocaleString('en-IN')}</td>
      <td colspan="2"></td>
    </tr>
  </tbody>
</table>

<div class="footer">
  <div class="sign-box">
    <strong>Store Dispatcher Signature</strong><br>
    <span style="font-size:7.5px;color:#666;">New Eco Roses Atelier</span>
  </div>
  <div class="sign-box">
    <strong>Courier Rider Signature</strong><br>
    <span style="font-size:7.5px;color:#666;">Name &amp; Vehicle Number</span>
  </div>
  <div class="sign-box">
    <strong>Security / Gate Outpass</strong><br>
    <span style="font-size:7.5px;color:#666;">Time Stamp &amp; Exit Verified</span>
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=980,height=650');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}

// ═══════════════════════════════════════════════════════════════════
// MANIFEST OPTION 2: Individual Product Manifest (Per-Bouquet Atelier Docket)
// ═══════════════════════════════════════════════════════════════════
export function generateProductManifest(order: SavedOrder, storeName: string, productIndex?: number): void {
    const parsed = parseSpecialNote(order.specialNote);
    const recipientName = parsed['recipient_name'] || order.customer.name;
    const recipientPhone = parsed['recipient_phone'] || order.customer.phone;
    const altPhone = parsed['alt_phone'] || '';
    const occasion = parsed['occasion'] || '';
    const qrUrl = getQrCodeUrl(order.orderNumber);
    const storeAddress = getStoreAddress(storeName);

    // Target specific product or all products in order
    const itemsToRender = typeof productIndex === 'number' && order.items[productIndex]
        ? [{ item: order.items[productIndex], index: productIndex }]
        : order.items.map((it, idx) => ({ item: it, index: idx }));

    const pages = itemsToRender.map(({ item, index }) => `
    <div class="product-docket-page">
      <!-- Docket Header -->
      <div class="docket-header">
        <div>
          <div class="brand-row">🌹 NEW ECO ROSES ATELIER</div>
          <div class="docket-sub">INDIVIDUAL PRODUCT DISPATCH MANIFEST &middot; ITEM #${index + 1} OF ${order.items.length}</div>
        </div>
        <div style="text-align:right;">
          <div class="order-badge">#${order.orderNumber}</div>
          <div style="font-size:9px;color:#666;margin-top:2px;">Item SKU: ${item.slug || 'NER-FLORAL'}</div>
        </div>
      </div>

      <!-- Product Showcase Block -->
      <div class="product-highlight-box">
        <div class="prod-left">
          <div class="prod-tag">🌸 BOUQUET SPECIFICATION</div>
          <div class="prod-title">${item.name}</div>
          <div class="prod-meta">
            <strong>Quantity:</strong> ${item.quantity} Unit &nbsp;|&nbsp;
            <strong>Item Value:</strong> ₹${(item.price * item.quantity).toLocaleString('en-IN')} &nbsp;|&nbsp;
            <strong>Status:</strong> Floral Pack Complete ✓
          </div>
        </div>
        <div class="prod-right">
          <img src="${qrUrl}" alt="Delivery QR" class="prod-qr" />
          <div class="qr-lbl">SCAN FOR ROUTE</div>
        </div>
      </div>

      <!-- Recipient & Delivery Grid -->
      <div class="info-grid">
        <div class="info-cell">
          <div class="cell-title">📬 CONSIGNEE (DELIVER TO)</div>
          <div class="cell-main">${recipientName}</div>
          <div class="cell-sub">
            📱 Primary: <strong>+91 ${recipientPhone}</strong><br>
            ${altPhone ? `📱 Alternate: <strong>+91 ${altPhone}</strong>` : ''}
          </div>
          <div class="cell-sub" style="margin-top:4px;">
            ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : ''}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} &middot; <strong>PIN ${order.shippingAddress.postalCode}</strong>
          </div>
        </div>

        <div class="info-cell">
          <div class="cell-title">📤 FULFILMENT ATELIER</div>
          <div class="cell-main">${storeName}</div>
          <div class="cell-sub">${storeAddress}</div>
          <div class="cell-sub" style="margin-top:4px;">
            <strong>Dispatch Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}<br>
            <strong>Payment Mode:</strong> ${order.paymentMethod || 'Prepaid'} (₹${order.total})
          </div>
          ${occasion ? `<div style="margin-top:4px;font-size:9.5px;color:#92400e;font-weight:bold;">🎉 Occasion: ${occasion}</div>` : ''}
        </div>
      </div>

      <!-- Florist Inspection & Quality Checklist -->
      <div class="checklist-section">
        <div class="check-title">📋 FLORIST PRE-DISPATCH QUALITY CONTROL PASS</div>
        <div class="checks-grid">
          <div class="check-item"><span class="chk-box">✓</span> 45° Clean Slanted Stem Cut</div>
          <div class="check-item"><span class="chk-box">✓</span> Hydration Water Gel / Tube Secured</div>
          <div class="check-item"><span class="chk-box">✓</span> Guard Petals Groomed &amp; De-thorned</div>
          <div class="check-item"><span class="chk-box">✓</span> Matte Luxury Wrap &amp; Satin Bow Tied</div>
          <div class="check-item"><span class="chk-box">✓</span> Floral Care &amp; Food Sachet Enclosed</div>
          <div class="check-item"><span class="chk-box">✓</span> Calligraphy Message Card Attached</div>
        </div>
      </div>

      <!-- Sign-off Footer -->
      <div class="docket-footer">
        <div class="sign-slot">
          <strong>Lead Florist Sign</strong><br>
          <span>Bouquet Arrangement Pass</span>
        </div>
        <div class="sign-slot">
          <strong>Store Dispatcher</strong><br>
          <span>Quality &amp; Packing Verified</span>
        </div>
        <div class="sign-slot">
          <strong>Courier Rider Pickup</strong><br>
          <span>Received in Perfect Upright State</span>
        </div>
      </div>
    </div>
    `).join('<div class="page-break"></div>');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Product Manifest - ${order.orderNumber}</title>
<style>
  @page { size: A4 portrait; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; }
  body { background: #fff; color: #000; font-size: 10px; }
  .product-docket-page { border: 2px solid #000; padding: 16px; margin-bottom: 20px; border-radius: 4px; }
  .page-break { page-break-after: always; height: 0; }
  
  .docket-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 12px; }
  .brand-row { font-size: 14px; font-weight: 900; letter-spacing: 1px; }
  .docket-sub { font-size: 8.5px; font-weight: 700; color: #666; margin-top: 1px; }
  .order-badge { font-size: 14px; font-family: monospace; font-weight: 900; background: #000; color: #fff; padding: 2px 8px; border-radius: 4px; }
  
  .product-highlight-box { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 12px 14px; margin-bottom: 12px; }
  .prod-left { flex: 1; padding-right: 14px; }
  .prod-tag { font-size: 8.5px; font-weight: 900; color: #bfa81f; letter-spacing: 1px; text-transform: uppercase; }
  .prod-title { font-size: 16px; font-weight: 900; color: #0f172a; margin: 2px 0; }
  .prod-meta { font-size: 10.5px; color: #475569; margin-top: 2px; }
  .prod-right { text-align: center; width: 85px; }
  .prod-qr { width: 75px; height: 75px; border: 1.5px solid #000; }
  .qr-lbl { font-size: 7px; font-weight: 900; margin-top: 2px; }
  
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .info-cell { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; background: #fff; }
  .cell-title { font-size: 8.5px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .cell-main { font-size: 13px; font-weight: 800; color: #0f172a; }
  .cell-sub { font-size: 10px; color: #334155; line-height: 1.4; margin-top: 3px; }
  
  .checklist-section { border: 1.5px solid #000; border-radius: 6px; padding: 10px 12px; margin-bottom: 16px; background: #fdfdfd; }
  .check-title { font-size: 8.5px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; color: #000; }
  .checks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10px; font-weight: 600; }
  .check-item { display: flex; align-items: center; gap: 6px; }
  .chk-box { font-size: 11px; font-weight: 900; color: #16a34a; }
  
  .docket-footer { display: flex; justify-content: space-between; border-top: 1.5px solid #000; padding-top: 10px; margin-top: 10px; }
  .sign-slot { min-width: 150px; text-align: center; font-size: 8.5px; border-top: 1px dashed #666; padding-top: 4px; }
  .sign-slot span { color: #666; font-size: 7.5px; }
  @media print { body { padding: 0; } .product-docket-page { border-color: #000; } }
</style>
</head>
<body>
${pages}
</body>
</html>`;

    const win = window.open('', '_blank', 'width=850,height=700');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}

// ═══════════════════════════════════════════════════════════════════
// LUXURY GIFT MESSAGE CARD (5×7″ Calligraphy)
// ═══════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY EXPORTS
// ═══════════════════════════════════════════════════════════════════
export const generateShippingLabel = generateCourierShippingLabel;
export const generateCourierManifest = generateBatchManifest;
