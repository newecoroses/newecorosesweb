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
    return 'New Eco Roses Atelier, Kolkata, West Bengal';
}

function getTrackingUrl(orderNumber: string): string {
    return `https://newecoroses.com/track-order?order=${encodeURIComponent(orderNumber)}`;
}

function getQrCodeUrl(orderNumber: string): string {
    const url = getTrackingUrl(orderNumber);
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=2&data=${encodeURIComponent(url)}`;
}

// ═══════════════════════════════════════════════════════════════════
// LABEL OPTION 1: ALL-BLACK VERTICAL PRODUCT LABEL (50-60% of A4 Page)
// Premium Luxury Edition with Gold SVGs, Logo, & Live Scannable QR
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

    const logoOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const logoSrc = `${logoOrigin}/favicon_io/android-chrome-512x512.png`;

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Product Shipping Label - ${order.orderNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;0,900;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@700&display=swap');
  
  @page {
    size: A4 portrait;
    margin: 14mm auto;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  
  body {
    background: #0d0f17;
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 10px;
  }
  
  @media print {
    body {
      background: #ffffff !important;
      padding: 0;
      min-height: auto;
    }
  }

  /* ── 50-60% of A4 Page (Vertical Portrait: 130mm × 190mm) ── */
  .label-card {
    width: 132mm;
    min-height: 192mm;
    max-width: 135mm;
    background: #000000 !important;
    color: #ffffff;
    border: 2px solid #bfa81f;
    border-radius: 12px;
    position: relative;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7);
    margin: 0 auto;
  }

  /* Inner dashed gold border */
  .inner-border {
    position: absolute;
    inset: 4px;
    border: 1px dashed rgba(191, 168, 31, 0.35);
    border-radius: 8px;
    pointer-events: none;
  }

  /* Premium Botanical Gold SVG Corners */
  .corner {
    position: absolute;
    width: 38px;
    height: 38px;
    pointer-events: none;
    z-index: 2;
  }
  .c-tl { top: 7px; left: 7px; }
  .c-tr { top: 7px; right: 7px; transform: scaleX(-1); }
  .c-bl { bottom: 7px; left: 7px; transform: scaleY(-1); }
  .c-br { bottom: 7px; right: 7px; transform: scale(-1); }

  /* ── Header Branding with Official Logo ── */
  .header-brand {
    text-align: center;
    position: relative;
    z-index: 5;
    padding-bottom: 7px;
    border-bottom: 1px solid rgba(191, 168, 31, 0.3);
  }
  .logo-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-bottom: 3px;
  }
  .logo-badge {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid #bfa81f;
    padding: 2px;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo-badge img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
  .brand-title {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    color: #d4af37;
    line-height: 1;
  }
  .brand-subtitle {
    font-size: 7.5px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #a39063;
    margin-top: 1px;
    font-weight: 700;
  }

  /* Badges Strip */
  .badge-strip {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-top: 6px;
    flex-wrap: wrap;
  }
  .badge {
    padding: 2.5px 7px;
    border-radius: 4px;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }
  .b-prepaid {
    background: rgba(22, 163, 74, 0.18);
    color: #4ade80;
    border: 1px solid #22c55e;
  }
  .b-fragile {
    background: rgba(220, 38, 38, 0.2);
    color: #f87171;
    border: 1px solid #ef4444;
  }
  .b-occasion {
    background: rgba(191, 168, 31, 0.15);
    color: #fde047;
    border: 1px solid #eab308;
  }
  .b-order {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── Delivery Consignee Section ── */
  .section-box {
    background: #090b10;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    padding: 8px 10px;
    margin-top: 7px;
  }
  .sec-tag {
    font-size: 7.5px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #bfa81f;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 3px;
  }
  .recipient-name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.2;
    letter-spacing: 0.5px;
  }
  .phone-row {
    display: flex;
    gap: 10px;
    font-size: 10px;
    font-weight: 700;
    color: #e2e8f0;
    margin-top: 3px;
    font-family: 'JetBrains Mono', monospace;
  }
  .phone-tag {
    color: #bfa81f;
  }
  .address-text {
    font-size: 9.5px;
    color: #cbd5e1;
    line-height: 1.35;
    margin-top: 4px;
  }
  .pin-badge {
    display: inline-block;
    background: #bfa81f;
    color: #000;
    font-weight: 900;
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 3px;
    margin-top: 4px;
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── Product & Dispatch Row with Live QR ── */
  .middle-grid {
    display: grid;
    grid-template-columns: 1fr 88px;
    gap: 8px;
    margin-top: 7px;
  }
  .items-panel {
    background: #090b10;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    padding: 7px 9px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .item-entry {
    display: flex;
    justify-content: space-between;
    font-size: 9.5px;
    color: #f1f5f9;
    font-weight: 600;
    padding: 1.5px 0;
  }
  .item-entry strong {
    color: #bfa81f;
  }

  /* Scannable QR Code Block */
  .qr-panel {
    background: #090b10;
    border: 1px solid #bfa81f;
    border-radius: 8px;
    padding: 6px 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .qr-image {
    width: 68px;
    height: 68px;
    border-radius: 4px;
    background: #fff;
    padding: 2px;
    display: block;
  }
  .qr-caption {
    font-size: 6.5px;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #bfa81f;
    margin-top: 3px;
    line-height: 1.1;
  }

  /* Logistics & Handover Row */
  .meta-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    background: #06070a;
    border: 1px solid rgba(191, 168, 31, 0.25);
    border-radius: 6px;
    padding: 5px 8px;
    margin-top: 7px;
    text-align: center;
  }
  .meta-item .m-lbl {
    font-size: 6.5px;
    font-weight: 800;
    color: #887a55;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  .meta-item .m-val {
    font-size: 10px;
    font-weight: 800;
    color: #ffffff;
    margin-top: 1px;
  }

  /* Caution & Freshness Handling */
  .handling-strip {
    background: rgba(220, 38, 38, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
    border-radius: 5px;
    color: #fca5a5;
    font-size: 7.5px;
    font-weight: 700;
    padding: 4px 6px;
    text-align: center;
    letter-spacing: 0.4px;
    margin-top: 6px;
  }

  /* Footer Signature */
  .footer-sig {
    border-top: 1px dashed rgba(191, 168, 31, 0.35);
    padding-top: 6px;
    margin-top: 7px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 7.5px;
    color: #94a3b8;
  }
  .sig-block {
    min-width: 100px;
    border-top: 1px solid rgba(255, 255, 255, 0.4);
    padding-top: 2px;
    text-align: center;
    color: #cbd5e1;
    font-size: 7px;
  }
</style>
</head>
<body>
<div class="label-card">
  <!-- Inner Border Line -->
  <div class="inner-border"></div>

  <!-- Luxury Botanical Gold Corners -->
  <svg class="corner c-tl" viewBox="0 0 45 45" fill="none">
    <path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3" opacity="0.85"/>
    <circle cx="18" cy="18" r="2.2" fill="#bfa81f"/>
    <circle cx="2" cy="2" r="2" fill="#bfa81f"/>
  </svg>
  <svg class="corner c-tr" viewBox="0 0 45 45" fill="none">
    <path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3" opacity="0.85"/>
    <circle cx="18" cy="18" r="2.2" fill="#bfa81f"/>
  </svg>
  <svg class="corner c-bl" viewBox="0 0 45 45" fill="none">
    <path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3" opacity="0.85"/>
    <circle cx="18" cy="18" r="2.2" fill="#bfa81f"/>
  </svg>
  <svg class="corner c-br" viewBox="0 0 45 45" fill="none">
    <path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3" opacity="0.85"/>
    <circle cx="18" cy="18" r="2.2" fill="#bfa81f"/>
  </svg>

  <!-- ── 1. Header with Official Logo ── -->
  <div class="header-brand">
    <div class="logo-row">
      <div class="logo-badge">
        <img src="${logoSrc}" alt="NER Logo" onerror="this.src='/favicon_io/android-chrome-192x192.png'" />
      </div>
      <div>
        <div class="brand-title">New Eco Roses</div>
        <div class="brand-subtitle">Haute Floral Atelier &middot; ${storeName}</div>
      </div>
    </div>

    <!-- Gold Floral Ribbon SVG -->
    <svg width="150" height="8" viewBox="0 0 150 8" fill="none" style="margin:2px auto 0;display:block;">
      <path d="M0 4h55M95 4h55" stroke="#bfa81f" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6"/>
      <circle cx="75" cy="4" r="3" fill="#bfa81f" fill-opacity="0.25" stroke="#bfa81f" stroke-width="0.8"/>
      <path d="M71 4c0-1.8 1.8-3 4-3s4 1.2 4 3-1.8 3-4 3-4-1.2-4-3z" fill="#bfa81f"/>
    </svg>

    <!-- Priority Status Badges -->
    <div class="badge-strip">
      <span class="badge b-prepaid">✓ PREPAID PRIORITY</span>
      <span class="badge b-fragile">⚠ FRAGILE BLOOMS</span>
      ${occasion ? `<span class="badge b-occasion">🎉 ${occasion.toUpperCase()}</span>` : ''}
      <span class="badge b-order">#${order.orderNumber}</span>
    </div>
  </div>

  <!-- ── 2. Consignee Delivery Destination ── -->
  <div class="section-box">
    <div class="sec-tag">
      <span>📬</span>
      <span>SHIP TO (DELIVERY RECIPIENT)</span>
    </div>
    <div class="recipient-name">${recipientName}</div>
    <div class="phone-row">
      <span><span class="phone-tag">PRIMARY:</span> +91 ${recipientPhone}</span>
      ${altPhone ? `<span><span class="phone-tag">ALT:</span> +91 ${altPhone}</span>` : ''}
    </div>
    <div class="address-text">
      ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : ''}<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state}
    </div>
    <div>
      <span class="pin-badge">PINCODE: ${order.shippingAddress.postalCode}</span>
    </div>
  </div>

  <!-- ── 3. Arrangement Items & Scannable Live QR Code ── -->
  <div class="middle-grid">
    <div class="items-panel">
      <div>
        <div class="sec-tag">
          <span>🌸</span>
          <span>BOUQUET MANIFEST</span>
        </div>
        <div style="margin-top:2px;">
          ${order.items.slice(0, 3).map(i => `
            <div class="item-entry">
              <span style="max-width:130px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i.quantity}× ${i.name}</span>
              <strong>Included</strong>
            </div>
          `).join('')}
          ${order.items.length > 3 ? `<div style="font-size:7.5px;color:#94a3b8;margin-top:2px;">+${order.items.length - 3} more items included</div>` : ''}
        </div>
      </div>
      <div style="font-size:7px;color:#85754e;border-top:1px dashed rgba(191,168,31,0.25);padding-top:3px;margin-top:3px;">
        <strong>Care Tube:</strong> Water Reservoir Attached &middot; Stems Trimmed
      </div>
    </div>

    <!-- Scannable QR -->
    <div class="qr-panel">
      <img src="${qrUrl}" alt="Delivery Route QR" class="qr-image" />
      <div class="qr-caption">SCAN FOR LIVE<br>GPS ROUTE &amp; NAV</div>
    </div>
  </div>

  <!-- ── 4. Dispatch Logistics Meta ── -->
  <div class="meta-strip">
    <div class="meta-item">
      <div class="m-lbl">ORDER VALUE</div>
      <div class="m-val" style="color:#4ade80;">₹${order.total.toLocaleString('en-IN')}</div>
    </div>
    <div class="meta-item">
      <div class="m-lbl">PAYMENT MODE</div>
      <div class="m-val">${order.paymentMethod || 'Prepaid'}</div>
    </div>
    <div class="meta-item">
      <div class="m-lbl">DISPATCH DATE</div>
      <div class="m-val">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
    </div>
  </div>

  <!-- ── 5. Handling & Orientation Notice ── -->
  <div class="handling-strip">
    ⚠ KEEP STRICTLY UPRIGHT 90° &middot; WATER RESERVOIR SEALED &middot; DO NOT CRUSH OR INVERT
  </div>

  <!-- ── 6. Atelier Origin & Rider Sign-Off ── -->
  <div class="footer-sig">
    <div>
      <div style="font-weight:700;color:#e2e8f0;">New Eco Roses &middot; ${storeAddress}</div>
      <div style="color:#64748b;font-size:7px;">Emergency Floral Helpline: +91 99369 11611</div>
    </div>
    <div class="sig-block">
      Rider Delivery Signature
    </div>
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=520,height=760');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}

// ═══════════════════════════════════════════════════════════════════
// LABEL OPTION 2: ALL-BLACK LUXURY GIFT DELIVERY SLIP & PRESENTATION
// ═══════════════════════════════════════════════════════════════════
export function generateLuxuryDeliverySlip(order: SavedOrder, storeName: string): void {
    const parsed = parseSpecialNote(order.specialNote);
    const recipientName = parsed['recipient_name'] || order.customer.name;
    const recipientPhone = parsed['recipient_phone'] || order.customer.phone;
    const occasion = parsed['occasion'] || '';
    const qrUrl = getQrCodeUrl(order.orderNumber);

    const logoOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const logoSrc = `${logoOrigin}/favicon_io/android-chrome-512x512.png`;

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Luxury Delivery Slip - ${order.orderNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;0,900;1,400&family=Cormorant+Garamond:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700&display=swap');
  @page { size: A4 portrait; margin: 14mm auto; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { background: #0d0f17; color: #ffffff; font-family: 'Cormorant Garamond', serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 10px; }
  @media print { body { background: #fff !important; padding: 0; min-height: auto; } }

  .slip-box {
    width: 132mm;
    min-height: 192mm;
    max-width: 135mm;
    background: #000000 !important;
    color: #ffffff;
    border: 2px solid #bfa81f;
    border-radius: 12px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    box-shadow: 0 20px 45px rgba(0,0,0,0.7);
    margin: 0 auto;
  }
  .inner-dashed { position: absolute; inset: 5px; border: 1px dashed rgba(191,168,31,0.3); border-radius: 8px; pointer-events: none; }
  
  .corner { position: absolute; width: 36px; height: 36px; pointer-events: none; }
  .c-tl { top: 7px; left: 7px; }
  .c-tr { top: 7px; right: 7px; transform: scaleX(-1); }
  .c-bl { bottom: 7px; left: 7px; transform: scaleY(-1); }
  .c-br { bottom: 7px; right: 7px; transform: scale(-1); }

  .head-section { text-align: center; border-bottom: 1px solid rgba(191,168,31,0.3); padding-bottom: 10px; }
  .logo-circle { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid #bfa81f; padding: 2px; background: #111; margin: 0 auto 4px; display: flex; align-items: center; justify-content: center; }
  .logo-circle img { width: 100%; height: 100%; border-radius: 50%; object-fit: contain; }
  .brand-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; color: #d4af37; }
  .sub-title { font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: #a89464; margin-top: 1px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; }

  .greeting-block { text-align: center; padding: 10px 0; }
  .for-label { font-size: 11px; font-style: italic; color: #94a3b8; letter-spacing: 1px; }
  .rec-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; margin-top: 2px; }
  .rec-locality { font-size: 11px; color: #cbd5e1; margin-top: 2px; font-family: 'Plus Jakarta Sans', sans-serif; }

  .manifest-box { background: #08090d; border: 1px solid rgba(191,168,31,0.25); border-radius: 8px; padding: 8px 12px; font-family: 'Plus Jakarta Sans', sans-serif; }
  .box-tag { font-size: 7.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #bfa81f; margin-bottom: 4px; }
  .item-line { display: flex; justify-content: space-between; font-size: 10px; color: #f1f5f9; padding: 2px 0; font-weight: 600; }

  .care-section { background: rgba(191,168,31,0.06); border: 1px dashed rgba(191,168,31,0.3); border-radius: 8px; padding: 8px 10px; font-size: 9.5px; color: #f1f5f9; line-height: 1.4; }
  .care-head { font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #d4af37; font-size: 8px; margin-bottom: 3px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif; }

  .qr-concierge { display: flex; align-items: center; justify-content: space-between; padding: 4px 6px; }
  .qr-concierge img { width: 60px; height: 60px; border: 1px solid #bfa81f; border-radius: 6px; background: #fff; padding: 2px; }
  .qr-guide { flex: 1; padding-left: 12px; font-size: 9px; color: #cbd5e1; line-height: 1.35; font-family: 'Plus Jakarta Sans', sans-serif; }

  .footer-sig { text-align: center; font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: #bfa81f; padding-top: 6px; border-top: 1px solid rgba(191,168,31,0.3); font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; }
</style>
</head>
<body>
<div class="slip-box">
  <div class="inner-dashed"></div>

  <!-- Gold Botanical Corners -->
  <svg class="corner c-tl" viewBox="0 0 45 45" fill="none"><path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3"/><circle cx="18" cy="18" r="2.2" fill="#bfa81f"/></svg>
  <svg class="corner c-tr" viewBox="0 0 45 45" fill="none"><path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3"/><circle cx="18" cy="18" r="2.2" fill="#bfa81f"/></svg>
  <svg class="corner c-bl" viewBox="0 0 45 45" fill="none"><path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3"/><circle cx="18" cy="18" r="2.2" fill="#bfa81f"/></svg>
  <svg class="corner c-br" viewBox="0 0 45 45" fill="none"><path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3"/><circle cx="18" cy="18" r="2.2" fill="#bfa81f"/></svg>

  <div class="head-section">
    <div class="logo-circle">
      <img src="${logoSrc}" alt="NER Logo" onerror="this.src='/favicon_io/android-chrome-192x192.png'" />
    </div>
    <div class="brand-title">New Eco Roses</div>
    <div class="sub-title">Haute Floral Atelier &middot; ${storeName}</div>
    ${occasion ? `<div style="font-size:9.5px;font-weight:700;color:#fde047;margin-top:3px;text-transform:uppercase;">✨ ${occasion} Special Collection</div>` : ''}
  </div>

  <div class="greeting-block">
    <div class="for-label">Specially Handcrafted For</div>
    <div class="rec-name">${recipientName}</div>
    <div class="rec-locality">${order.shippingAddress.city} &middot; Order #${order.orderNumber}</div>
  </div>

  <div class="manifest-box">
    <div class="box-tag">🌸 Arrangement Inclusions:</div>
    ${order.items.map(i => `
      <div class="item-line">
        <span>${i.quantity}× ${i.name}</span>
        <span style="color:#bfa81f;">Hand-Arranged ✓</span>
      </div>
    `).join('')}
  </div>

  <div class="care-section">
    <div class="care-head">✨ Freshness Ritual</div>
    <div>1. Cut stems at a 45° angle under cool water before placing in vase</div>
    <div>2. Dissolve the enclosed floral preservative sachet thoroughly</div>
    <div>3. Display away from direct sunlight, heating &amp; air conditioning vents</div>
  </div>

  <div class="qr-concierge">
    <img src="${qrUrl}" alt="Delivery QR" />
    <div class="qr-guide">
      <strong style="color:#d4af37;">Concierge &amp; Unboxing:</strong><br>
      Scan with your camera for unboxing instructions, flower care notes, or to reach our master florists directly.
    </div>
  </div>

  <div class="footer-sig">
    Crafted with Passion &middot; newecoroses.com &middot; Kolkata
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=520,height=760');
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
// MANIFEST OPTION 2: ALL-BLACK VERTICAL PRODUCT MANIFEST DOCKET
// 50-60% of A4 Page with Official Logo, Gold SVGs & Quality Checks
// ═══════════════════════════════════════════════════════════════════
export function generateProductManifest(order: SavedOrder, storeName: string, productIndex?: number): void {
    const parsed = parseSpecialNote(order.specialNote);
    const recipientName = parsed['recipient_name'] || order.customer.name;
    const recipientPhone = parsed['recipient_phone'] || order.customer.phone;
    const altPhone = parsed['alt_phone'] || '';
    const occasion = parsed['occasion'] || '';
    const qrUrl = getQrCodeUrl(order.orderNumber);
    const storeAddress = getStoreAddress(storeName);

    const logoOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const logoSrc = `${logoOrigin}/favicon_io/android-chrome-512x512.png`;

    const itemsToRender = typeof productIndex === 'number' && order.items[productIndex]
        ? [{ item: order.items[productIndex], index: productIndex }]
        : order.items.map((it, idx) => ({ item: it, index: idx }));

    const pages = itemsToRender.map(({ item, index }) => `
    <div class="docket-page-wrapper">
      <div class="docket-card">
        <div class="inner-border"></div>

        <!-- Gold Botanical Corners -->
        <svg class="corner c-tl" viewBox="0 0 45 45" fill="none"><path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3"/><circle cx="18" cy="18" r="2.2" fill="#bfa81f"/></svg>
        <svg class="corner c-tr" viewBox="0 0 45 45" fill="none"><path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3"/><circle cx="18" cy="18" r="2.2" fill="#bfa81f"/></svg>
        <svg class="corner c-bl" viewBox="0 0 45 45" fill="none"><path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3"/><circle cx="18" cy="18" r="2.2" fill="#bfa81f"/></svg>
        <svg class="corner c-br" viewBox="0 0 45 45" fill="none"><path d="M2 2h38M2 2v38M2 2l16 16M9 2l12 12M2 9l12 12" stroke="#bfa81f" stroke-width="1.3"/><circle cx="18" cy="18" r="2.2" fill="#bfa81f"/></svg>

        <!-- Header with Logo -->
        <div class="docket-head">
          <div class="head-left">
            <div class="logo-circ">
              <img src="${logoSrc}" alt="NER Logo" onerror="this.src='/favicon_io/android-chrome-192x192.png'" />
            </div>
            <div>
              <div class="brand-title">NEW ECO ROSES ATELIER</div>
              <div class="docket-sub">INDIVIDUAL PRODUCT DISPATCH MANIFEST &middot; ITEM #${index + 1} OF ${order.items.length}</div>
            </div>
          </div>
          <div class="order-tag">#${order.orderNumber}</div>
        </div>

        <!-- Product Highlight Box -->
        <div class="product-banner">
          <div class="prod-details">
            <div class="prod-tag">🌸 BOUQUET SPECIFICATION</div>
            <div class="prod-name">${item.name}</div>
            <div class="prod-sub">
              <strong>Quantity:</strong> ${item.quantity} Unit &nbsp;|&nbsp;
              <strong>Price:</strong> ₹${(item.price * item.quantity).toLocaleString('en-IN')} &nbsp;|&nbsp;
              <span style="color:#4ade80;">Arrangement Passed ✓</span>
            </div>
          </div>
          <div class="qr-col">
            <img src="${qrUrl}" alt="Route QR" class="qr-img" />
            <div class="qr-txt">SCAN FOR ROUTE</div>
          </div>
        </div>

        <!-- Consignee & Route -->
        <div class="two-grid">
          <div class="grid-box">
            <div class="box-lbl">📬 DELIVER TO (CONSIGNEE)</div>
            <div class="rec-name">${recipientName}</div>
            <div class="phone-line">📱 Primary: +91 ${recipientPhone}</div>
            ${altPhone ? `<div class="phone-line">📱 Alt: +91 ${altPhone}</div>` : ''}
            <div class="addr-line">${order.shippingAddress.line1}, ${order.shippingAddress.city}</div>
            <div class="pin-highlight">PIN ${order.shippingAddress.postalCode}</div>
          </div>

          <div class="grid-box">
            <div class="box-lbl">📤 FULFILMENT ORIGIN</div>
            <div class="rec-name" style="font-size:12px;">${storeName}</div>
            <div class="addr-line">${storeAddress}</div>
            <div class="addr-line" style="margin-top:4px;">
              <strong>Payment:</strong> ${order.paymentMethod || 'Prepaid'} (₹${order.total})<br>
              <strong>Dispatch:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </div>
            ${occasion ? `<div style="font-size:8px;color:#fde047;font-weight:bold;margin-top:2px;">🎉 ${occasion}</div>` : ''}
          </div>
        </div>

        <!-- Florist Quality Control Checklist -->
        <div class="checks-box">
          <div class="checks-lbl">📋 FLORIST PRE-DISPATCH QUALITY CONTROL PASS</div>
          <div class="checks-row">
            <div class="chk"><span class="tick">✓</span> 45° Clean Slanted Stem Cut</div>
            <div class="chk"><span class="tick">✓</span> Hydration Water Gel / Tube Secured</div>
            <div class="chk"><span class="tick">✓</span> Guard Petals Groomed &amp; De-thorned</div>
            <div class="chk"><span class="tick">✓</span> Matte Luxury Wrap &amp; Satin Bow Tied</div>
            <div class="chk"><span class="tick">✓</span> Floral Food Preservative Enclosed</div>
            <div class="chk"><span class="tick">✓</span> Calligraphy Message Card Sealed</div>
          </div>
        </div>

        <!-- Sign-Off Line -->
        <div class="docket-foot">
          <div class="sig-slot">
            <strong>Lead Florist Sign</strong><br>
            <span>Bouquet Assembly Verified</span>
          </div>
          <div class="sig-slot">
            <strong>Store Dispatcher</strong><br>
            <span>Quality &amp; Pack Passed</span>
          </div>
          <div class="sig-slot">
            <strong>Courier Rider Pickup</strong><br>
            <span>Received Upright &amp; Intact</span>
          </div>
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
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;0,900;1,400&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@700&display=swap');
  @page { size: A4 portrait; margin: 14mm auto; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { background: #0d0f17; color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; flex-direction: column; align-items: center; padding: 10px; }
  @media print { body { background: #fff !important; padding: 0; } }

  .docket-page-wrapper { width: 100%; display: flex; justify-content: center; margin-bottom: 20px; }
  .page-break { page-break-after: always; height: 0; }

  /* 50-60% of A4 Vertical */
  .docket-card {
    width: 132mm;
    min-height: 192mm;
    max-width: 135mm;
    background: #000000 !important;
    color: #ffffff;
    border: 2px solid #bfa81f;
    border-radius: 12px;
    padding: 14px 16px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 20px 45px rgba(0,0,0,0.7);
  }
  .inner-border { position: absolute; inset: 4px; border: 1px dashed rgba(191,168,31,0.35); border-radius: 8px; pointer-events: none; }

  .corner { position: absolute; width: 34px; height: 34px; pointer-events: none; }
  .c-tl { top: 6px; left: 6px; }
  .c-tr { top: 6px; right: 6px; transform: scaleX(-1); }
  .c-bl { bottom: 6px; left: 6px; transform: scaleY(-1); }
  .c-br { bottom: 6px; right: 6px; transform: scale(-1); }

  .docket-head { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(191,168,31,0.3); padding-bottom: 8px; }
  .head-left { display: flex; align-items: center; gap: 8px; }
  .logo-circ { width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid #bfa81f; padding: 2px; background: #111; display: flex; align-items: center; justify-content: center; }
  .logo-circ img { width: 100%; height: 100%; border-radius: 50%; object-fit: contain; }
  .brand-title { font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 900; letter-spacing: 2px; color: #d4af37; }
  .docket-sub { font-size: 7px; color: #94a3b8; font-weight: 700; letter-spacing: 1px; }
  .order-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 900; background: #bfa81f; color: #000; padding: 2px 7px; border-radius: 4px; }

  .product-banner { display: flex; justify-content: space-between; align-items: center; background: #08090d; border: 1px solid rgba(191,168,31,0.3); border-radius: 8px; padding: 8px 10px; margin-top: 7px; }
  .prod-details { flex: 1; padding-right: 8px; }
  .prod-tag { font-size: 7px; font-weight: 800; letter-spacing: 1px; color: #bfa81f; text-transform: uppercase; }
  .prod-name { font-size: 13px; font-weight: 800; color: #ffffff; margin: 1px 0; }
  .prod-sub { font-size: 8.5px; color: #cbd5e1; }
  .qr-col { text-align: center; width: 65px; }
  .qr-img { width: 55px; height: 55px; border-radius: 4px; background: #fff; padding: 2px; }
  .qr-txt { font-size: 6px; font-weight: 800; color: #bfa81f; margin-top: 2px; }

  .two-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-top: 7px; }
  .grid-box { background: #08090d; border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; padding: 7px 9px; }
  .box-lbl { font-size: 7px; font-weight: 800; color: #bfa81f; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px; }
  .rec-name { font-size: 12px; font-weight: 800; color: #ffffff; }
  .phone-line { font-size: 8.5px; font-weight: 700; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
  .addr-line { font-size: 8px; color: #94a3b8; line-height: 1.3; margin-top: 2px; }
  .pin-highlight { display: inline-block; background: #bfa81f; color: #000; font-weight: 900; font-size: 9px; padding: 1px 4px; border-radius: 2px; margin-top: 3px; font-family: 'JetBrains Mono', monospace; }

  .checks-box { background: #08090d; border: 1px solid rgba(191,168,31,0.25); border-radius: 7px; padding: 7px 9px; margin-top: 7px; }
  .checks-lbl { font-size: 7px; font-weight: 800; color: #bfa81f; letter-spacing: 1px; margin-bottom: 4px; text-transform: uppercase; }
  .checks-row { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 8px; font-weight: 600; color: #e2e8f0; }
  .chk { display: flex; align-items: center; gap: 4px; }
  .tick { color: #4ade80; font-weight: 900; font-size: 9px; }

  .docket-foot { border-top: 1px dashed rgba(191,168,31,0.3); padding-top: 6px; margin-top: 7px; display: flex; justify-content: space-between; }
  .sig-slot { min-width: 90px; text-align: center; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 2px; font-size: 7px; color: #cbd5e1; }
  .sig-slot span { font-size: 6px; color: #64748b; }
</style>
</head>
<body>
${pages}
</body>
</html>`;

    const win = window.open('', '_blank', 'width=520,height=760');
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
