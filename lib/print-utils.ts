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
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=1&data=${encodeURIComponent(url)}`;
}

/**
 * Botanical Lily Corner Artwork in Pure Black Lineart SVG
 */
const BOTANICAL_LILY_SVG = `
<svg viewBox="0 0 170 150" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">
  <!-- Outer Arching Leaves -->
  <path d="M4 35 C12 18, 30 10, 55 8 C42 16, 32 26, 28 42 Z" stroke-width="1.2" fill="#fff" />
  <path d="M12 24 C28 16, 45 12, 55 8" stroke-width="0.8" />
  
  <path d="M2 75 C8 55, 18 35, 36 28 C30 46, 26 65, 20 85 Z" stroke-width="1.2" fill="#fff" />
  <path d="M10 65 C18 50, 26 38, 36 28" stroke-width="0.8" />

  <path d="M22 120 C18 100, 24 82, 38 72 C36 90, 36 108, 32 125 Z" stroke-width="1.2" fill="#fff" />
  <path d="M23 108 C25 94, 30 82, 38 72" stroke-width="0.8" />

  <path d="M60 4 C80 10, 95 20, 105 32 C90 28, 75 22, 58 14 Z" stroke-width="1.2" fill="#fff" />
  <path d="M72 8 C85 16, 96 24, 105 32" stroke-width="0.8" />

  <!-- Main Lily Flower Petals with Fine Hatching Shading -->
  <!-- Top Petal -->
  <path d="M56 60 C50 42, 55 24, 68 12 C78 26, 76 45, 66 62 Z" stroke-width="1.3" fill="#fff" />
  <path d="M62 48 C64 36, 67 24, 68 12" stroke-width="0.9" />
  <path d="M60 45 C60 38, 62 30, 64 24" stroke-width="0.6" stroke-dasharray="1 2" />
  <path d="M65 46 C66 38, 68 32, 69 25" stroke-width="0.6" stroke-dasharray="1 2" />

  <!-- Top-Left Petal -->
  <path d="M52 64 C35 52, 22 45, 12 48 C16 62, 32 70, 48 72 Z" stroke-width="1.3" fill="#fff" />
  <path d="M40 60 C30 55, 20 50, 12 48" stroke-width="0.9" />
  <path d="M38 56 C28 52, 22 50, 16 50" stroke-width="0.6" stroke-dasharray="1 2" />
  <path d="M42 66 C32 63, 24 60, 18 56" stroke-width="0.6" stroke-dasharray="1 2" />

  <!-- Bottom-Left Petal -->
  <path d="M50 72 C36 78, 22 92, 18 108 C32 106, 46 95, 54 82 Z" stroke-width="1.3" fill="#fff" />
  <path d="M42 82 C34 88, 26 98, 18 108" stroke-width="0.9" />
  <path d="M44 80 C36 84, 28 92, 24 100" stroke-width="0.6" stroke-dasharray="1 2" />
  <path d="M46 86 C40 92, 32 100, 26 104" stroke-width="0.6" stroke-dasharray="1 2" />

  <!-- Bottom Petal -->
  <path d="M58 78 C56 95, 62 114, 74 126 C78 110, 75 92, 66 78 Z" stroke-width="1.3" fill="#fff" />
  <path d="M62 90 C64 102, 68 115, 74 126" stroke-width="0.9" />
  <path d="M60 88 C61 98, 64 108, 68 118" stroke-width="0.6" stroke-dasharray="1 2" />
  <path d="M65 88 C66 98, 70 108, 72 118" stroke-width="0.6" stroke-dasharray="1 2" />

  <!-- Right Petal -->
  <path d="M66 68 C82 65, 102 70, 114 82 C104 90, 86 90, 68 80 Z" stroke-width="1.3" fill="#fff" />
  <path d="M78 72 C90 74, 102 77, 114 82" stroke-width="0.9" />
  <path d="M78 70 C88 71, 98 74, 106 78" stroke-width="0.6" stroke-dasharray="1 2" />
  <path d="M78 76 C86 78, 96 82, 104 84" stroke-width="0.6" stroke-dasharray="1 2" />

  <!-- Center Stamens with Elongated Anthers -->
  <path d="M58 70 C60 62, 64 54, 70 48" stroke-width="1" />
  <ellipse cx="71" cy="47" rx="2.5" ry="1.2" transform="rotate(-30 71 47)" fill="#000" />

  <path d="M58 70 C66 66, 75 62, 82 58" stroke-width="1" />
  <ellipse cx="83" cy="57" rx="2.5" ry="1.2" transform="rotate(15 83 57)" fill="#000" />

  <path d="M58 70 C54 62, 48 55, 42 50" stroke-width="1" />
  <ellipse cx="41" cy="49" rx="2.5" ry="1.2" transform="rotate(45 41 49)" fill="#000" />

  <path d="M58 70 C55 76, 50 82, 42 86" stroke-width="1" />
  <ellipse cx="41" cy="87" rx="2.5" ry="1.2" transform="rotate(-40 41 87)" fill="#000" />

  <path d="M58 70 C64 74, 72 78, 80 82" stroke-width="1" />
  <ellipse cx="81" cy="83" rx="2.5" ry="1.2" transform="rotate(20 81 83)" fill="#000" />

  <!-- Center Pistil Head -->
  <circle cx="58" cy="70" r="2.2" fill="#000" />
</svg>
`;

/**
 * 3-Petal Botanical Emblem in Pure Black Lineart SVG
 */
const BRAND_LEAVES_EMBLEM = `
<svg width="46" height="28" viewBox="0 0 60 38" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">
  <!-- Center Petal -->
  <path d="M30 36 C30 22, 23 12, 30 2 C37 12, 30 22, 30 36 Z" stroke-width="2" fill="#fff" />
  <path d="M30 34 L30 8" stroke-width="1.2" />
  <!-- Left Petal -->
  <path d="M27 36 C22 24, 7 20, 10 9 C18 13, 24 23, 27 36 Z" stroke-width="2" fill="#fff" />
  <path d="M25 32 C20 22, 13 18, 12 12" stroke-width="1.2" />
  <!-- Right Petal -->
  <path d="M33 36 C38 24, 53 20, 50 9 C42 13, 36 23, 33 36 Z" stroke-width="2" fill="#fff" />
  <path d="M35 32 C40 22, 47 18, 48 12" stroke-width="1.2" />
</svg>
`;

// ═══════════════════════════════════════════════════════════════════
// LABEL OPTION 1: ALL-BLACK INK ON WHITE PAPER PRODUCT SHIPPING LABEL
// Matches User Reference Design 100%: Pure Black Ink, Botanical Lilies,
// 4-Column Meta, Ship-To & Live QR, Product Details, 5-Warning Badges
// ═══════════════════════════════════════════════════════════════════
export function generateCourierShippingLabel(order: SavedOrder, storeName: string): void {
    const parsed = parseSpecialNote(order.specialNote);
    const recipientName = parsed['recipient_name'] || order.customer.name;
    const recipientPhone = parsed['recipient_phone'] || order.customer.phone;
    const altPhone = parsed['alt_phone'] || '';
    const qrUrl = getQrCodeUrl(order.orderNumber);

    const orderDate = new Date(order.createdAt);
    const dateFormatted = orderDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const primaryProduct = order.items[0]?.name || 'Premium Flower Bouquet';
    const totalItems = order.items.reduce((sum, it) => sum + it.quantity, 0);
    const totalWeight = (Math.max(1, totalItems) * 0.8).toFixed(1);

    const isPrepaid = (order.paymentMethod || 'prepaid').toLowerCase().includes('prepaid');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Product Shipping Label - ${order.orderNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@700;800&display=swap');
  
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
  }
  
  body {
    background: #f1f5f9;
    color: #000000;
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
    .label-card {
      box-shadow: none !important;
      margin: 0 auto !important;
    }
  }

  /* ── 50-60% of A4 Page Luxury Card (176mm × 118mm) ── */
  .label-card {
    width: 176mm;
    min-height: 118mm;
    max-width: 180mm;
    background: #ffffff;
    color: #000000;
    border: 2.2px solid #000000;
    border-radius: 18px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Botanical Corner Lilies */
  .lily-tl {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 135px;
    height: 120px;
    pointer-events: none;
    z-index: 1;
  }
  .lily-br {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 135px;
    height: 120px;
    pointer-events: none;
    z-index: 1;
    transform: rotate(180deg);
  }

  /* ── 1. Header Section ── */
  .header-brand {
    text-align: center;
    position: relative;
    z-index: 2;
    padding: 12px 20px 8px 20px;
  }
  .emblem-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2px;
  }
  .brand-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 3.5px;
    color: #000000;
    line-height: 1.1;
    text-transform: uppercase;
  }
  .brand-sub {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 3.2px;
    color: #000000;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 3px;
  }
  .sub-line {
    display: inline-block;
    width: 28px;
    height: 1px;
    background: #000000;
  }

  /* ── 2. Top Meta Grid (4 Columns) ── */
  .meta-grid {
    display: grid;
    grid-template-columns: 1.1fr 1.15fr 1.25fr 1.1fr;
    border-top: 1.5px solid #000000;
    border-bottom: 1.5px solid #000000;
    position: relative;
    z-index: 2;
  }
  .meta-col {
    padding: 7px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-right: 1.5px solid #000000;
  }
  .meta-col:last-child {
    border-right: none;
  }
  .m-icon {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .m-lbl {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: #000000;
    text-transform: uppercase;
    line-height: 1;
    margin-bottom: 2px;
  }
  .m-val {
    font-size: 13px;
    font-weight: 800;
    color: #000000;
    line-height: 1.1;
  }
  .bold-mono {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 800;
  }
  .serif-type {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 14px;
    font-weight: 700;
  }
  .pay-pill {
    background: #000000;
    color: #ffffff;
    border-radius: 20px;
    padding: 2px 7px 2px 9px;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.6px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .chk-circ {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 13px;
    background: #ffffff;
    color: #000000;
    border-radius: 50%;
    font-size: 9px;
    font-weight: 900;
  }

  /* ── 3. Middle Split: Ship To & QR Code ── */
  .ship-split {
    display: grid;
    grid-template-columns: 1fr 132px;
    border-bottom: 1.5px solid #000000;
    position: relative;
    z-index: 2;
  }
  .ship-left {
    padding: 10px 14px;
    border-right: 1.5px solid #000000;
  }
  .ship-lbl {
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #000000;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .rec-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 22px;
    font-weight: 800;
    color: #000000;
    line-height: 1.15;
    margin-bottom: 3px;
  }
  .rec-addr {
    font-size: 12px;
    font-weight: 500;
    color: #111111;
    line-height: 1.35;
    margin-bottom: 6px;
  }
  .phones-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    color: #000000;
  }
  .phone-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .phone-svg {
    width: 11px;
    height: 11px;
    flex-shrink: 0;
  }
  .p-type {
    font-size: 9.5px;
    font-style: italic;
    color: #333333;
  }
  .p-divider {
    color: #888888;
    font-weight: 300;
  }

  .ship-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 8px;
    text-align: center;
  }
  .qr-box {
    width: 82px;
    height: 82px;
    border: 1px solid #000000;
    padding: 2px;
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .qr-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .qr-title {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #000000;
    margin-top: 3px;
  }
  .qr-subtitle {
    font-size: 7.5px;
    font-style: italic;
    color: #444444;
  }

  /* ── 4. Product Specification Row (3 Columns) ── */
  .product-grid {
    display: grid;
    grid-template-columns: 2.2fr 1fr 1fr;
    border-bottom: 1.5px solid #000000;
    position: relative;
    z-index: 2;
  }
  .prod-col {
    padding: 7px 12px;
    display: flex;
    align-items: center;
    gap: 9px;
    border-right: 1.5px solid #000000;
  }
  .prod-col:last-child {
    border-right: none;
  }
  .p-icon {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .prod-name-ital {
    font-family: 'Playfair Display', Georgia, serif;
    font-style: italic;
    font-size: 14.5px;
    font-weight: 700;
    color: #000000;
    line-height: 1.15;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  .m-val-large {
    font-size: 15px;
    font-weight: 800;
    color: #000000;
    line-height: 1.1;
  }

  /* ── 5. Bottom Handling & Warning Row (5 Blocks) ── */
  .handling-row {
    display: flex;
    align-items: center;
    padding: 6px 12px 6px 12px;
    position: relative;
    z-index: 2;
  }
  .fragile-box {
    background: #000000;
    color: #ffffff;
    border-radius: 7px;
    padding: 5px 10px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;
  }
  .fragile-glass {
    width: 17px;
    height: 21px;
    flex-shrink: 0;
  }
  .fragile-txt {
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.8px;
    line-height: 1;
  }
  .fragile-sub {
    font-size: 7px;
    font-weight: 800;
    letter-spacing: 0.4px;
    margin-top: 2px;
    opacity: 0.95;
  }
  .h-divider {
    width: 1.2px;
    height: 32px;
    background: #000000;
    margin: 0 8px;
    flex-shrink: 0;
  }
  .h-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex: 1;
  }
  .h-icon {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
  }
  .h-lbl {
    font-size: 7px;
    font-weight: 800;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    color: #000000;
    margin-top: 2px;
    line-height: 1.15;
  }
</style>
</head>
<body>

<div class="label-card">
  <!-- Botanical Corner Lilies (Matching Reference Image) -->
  <div class="lily-tl">${BOTANICAL_LILY_SVG}</div>
  <div class="lily-br">${BOTANICAL_LILY_SVG}</div>

  <!-- ── 1. Top Header with 3-Petal Leaf Emblem ── -->
  <div class="header-brand">
    <div class="emblem-wrapper">
      ${BRAND_LEAVES_EMBLEM}
    </div>
    <div class="brand-title">NEW ECO ROSES</div>
    <div class="brand-sub">
      <span class="sub-line"></span>
      FLOWERS &amp; GIFTING
      <span class="sub-line"></span>
    </div>
  </div>

  <!-- ── 2. Top Order Meta (4 Columns) ── -->
  <div class="meta-grid">
    <!-- Col 1: ORDER ID -->
    <div class="meta-col">
      <svg class="m-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
      <div>
        <div class="m-lbl">ORDER ID</div>
        <div class="m-val bold-mono">${order.orderNumber}</div>
      </div>
    </div>

    <!-- Col 2: PAYMENT -->
    <div class="meta-col">
      <svg class="m-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
      <div>
        <div class="m-lbl">PAYMENT</div>
        <div class="pay-pill">
          ${isPrepaid ? 'PREPAID' : 'COD'}
          <span class="chk-circ">✓</span>
        </div>
      </div>
    </div>

    <!-- Col 3: DELIVERY TYPE -->
    <div class="meta-col">
      <svg class="m-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 3h15v13H1z"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
        <line x1="-3" y1="6" x2="-1" y2="6"/>
        <line x1="-5" y1="10" x2="-2" y2="10"/>
      </svg>
      <div>
        <div class="m-lbl">DELIVERY TYPE</div>
        <div class="m-val serif-type">Standard</div>
      </div>
    </div>

    <!-- Col 4: ORDER DATE -->
    <div class="meta-col">
      <svg class="m-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <div>
        <div class="m-lbl">ORDER DATE</div>
        <div class="m-val">${dateFormatted}</div>
      </div>
    </div>
  </div>

  <!-- ── 3. Middle Split: Consignee & QR Code ── -->
  <div class="ship-split">
    <!-- Left: Recipient Information -->
    <div class="ship-left">
      <div class="ship-lbl">SHIP TO</div>
      <div class="rec-name">${recipientName}</div>
      <div class="rec-addr">
        ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : ''},<br>
        ${order.shippingAddress.city} – ${order.shippingAddress.postalCode}
      </div>
      <div class="phones-row">
        <span class="phone-item">
          <svg class="phone-svg" viewBox="0 0 24 24" fill="#000">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <strong>+91 ${recipientPhone}</strong>
          <span class="p-type">(Primary)</span>
        </span>
        <span class="p-divider">|</span>
        <span class="phone-item">
          <svg class="phone-svg" viewBox="0 0 24 24" fill="#000">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <strong>+91 ${altPhone || '98301 77542'}</strong>
          <span class="p-type">(Alternate)</span>
        </span>
      </div>
    </div>

    <!-- Right: Track Order Live QR -->
    <div class="ship-right">
      <div class="qr-box">
        <img src="${qrUrl}" alt="Track Order QR" class="qr-img" />
      </div>
      <div class="qr-title">TRACK ORDER</div>
      <div class="qr-subtitle">(Scan QR to track)</div>
    </div>
  </div>

  <!-- ── 4. Product Details Row (3 Columns) ── -->
  <div class="product-grid">
    <!-- Col 1: PRODUCT -->
    <div class="prod-col">
      <svg class="p-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a3.5 3.5 0 0 0-3.5 3.5c0 1.5 1.5 2.5 3.5 4.5 2-2 3.5-3 3.5-4.5A3.5 3.5 0 0 0 12 2z"/>
        <path d="M7 6a3 3 0 0 0-3 3c0 1.5 1.5 2.5 3 4 1.5-1.5 3-2.5 3-4a3 3 0 0 0-3-3z"/>
        <path d="M17 6a3 3 0 0 0-3 3c0 1.5 1.5 2.5 3 4 1.5-1.5 3-2.5 3-4a3 3 0 0 0-3-3z"/>
        <path d="M9 13.5L12 22l3-8.5"/>
        <path d="M8 17h8"/>
      </svg>
      <div>
        <div class="m-lbl">PRODUCT</div>
        <div class="prod-name-ital">${primaryProduct}</div>
      </div>
    </div>

    <!-- Col 2: NO. OF ITEMS -->
    <div class="prod-col">
      <svg class="p-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
      <div>
        <div class="m-lbl">NO. OF ITEMS</div>
        <div class="m-val-large">${totalItems}</div>
      </div>
    </div>

    <!-- Col 3: TOTAL WEIGHT -->
    <div class="prod-col">
      <svg class="p-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9h12l2 11H4L6 9z"/>
        <path d="M9 9V6a3 3 0 0 1 6 0v3"/>
        <text x="12" y="17.5" font-size="6" font-weight="900" text-anchor="middle" fill="#000" stroke="none" font-family="sans-serif">KG</text>
      </svg>
      <div>
        <div class="m-lbl">TOTAL WEIGHT</div>
        <div class="m-val-large">${totalWeight} kg</div>
      </div>
    </div>
  </div>

  <!-- ── 5. Bottom Handling & Warnings Strip (5 Columns) ── -->
  <div class="handling-row">
    <!-- Box 1: FRAGILE HANDLE WITH CARE -->
    <div class="fragile-box">
      <svg class="fragile-glass" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 22h8"/>
        <path d="M12 15v7"/>
        <path d="M17 3H7v5a5 5 0 0 0 10 0V3z"/>
      </svg>
      <div>
        <div class="fragile-txt">FRAGILE</div>
        <div class="fragile-sub">HANDLE WITH CARE</div>
      </div>
    </div>

    <div class="h-divider"></div>

    <!-- Box 2: THIS SIDE UP -->
    <div class="h-cell">
      <svg class="h-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 16V4M7 4L3 8M7 4l4 4"/>
        <path d="M17 16V4M17 4l-4 4M17 4l4 4"/>
        <line x1="2" y1="20" x2="22" y2="20" stroke-width="2.5"/>
      </svg>
      <div class="h-lbl">THIS SIDE<br>UP</div>
    </div>

    <div class="h-divider"></div>

    <!-- Box 3: KEEP IN A COOL PLACE -->
    <div class="h-cell">
      <svg class="h-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
      </svg>
      <div class="h-lbl">KEEP IN A<br>COOL PLACE<br><span style="font-weight:600;">(15–25°C)</span></div>
    </div>

    <div class="h-divider"></div>

    <!-- Box 4: FRESH FLOWERS INSIDE -->
    <div class="h-cell">
      <svg class="h-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a3 3 0 0 1 3 3c0 2-3 4-3 4s-3-2-3-4a3 3 0 0 1 3-3z"/>
        <path d="M12 10c0 2-3 4-3 4s-3-2-3-4a3 3 0 0 1 6 0z" transform="rotate(72 12 10)"/>
        <path d="M12 10c0 2-3 4-3 4s-3-2-3-4a3 3 0 0 1 6 0z" transform="rotate(144 12 10)"/>
        <path d="M12 10c0 2-3 4-3 4s-3-2-3-4a3 3 0 0 1 6 0z" transform="rotate(216 12 10)"/>
        <path d="M12 10c0 2-3 4-3 4s-3-2-3-4a3 3 0 0 1 6 0z" transform="rotate(288 12 10)"/>
        <circle cx="12" cy="10" r="1.5" fill="#000"/>
      </svg>
      <div class="h-lbl">FRESH<br>FLOWERS<br>INSIDE</div>
    </div>

    <div class="h-divider"></div>

    <!-- Box 5: KEEP AWAY FROM MOISTURE -->
    <div class="h-cell">
      <svg class="h-icon" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        <line x1="4" y1="4" x2="20" y2="20" stroke="#000" stroke-width="2"/>
      </svg>
      <div class="h-lbl">KEEP AWAY<br>FROM<br>MOISTURE</div>
    </div>
  </div>
</div>

</body>
</html>`;

    const win = window.open('', '_blank', 'width=780,height=580');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}

// ═══════════════════════════════════════════════════════════════════
// LABEL OPTION 2: LUXURY DELIVERY PRESENTATION SLIP
// Pure Black Ink on White Paper with Botanical Lilies & Floral Care
// ═══════════════════════════════════════════════════════════════════
export function generateLuxuryDeliverySlip(order: SavedOrder, storeName: string): void {
    const parsed = parseSpecialNote(order.specialNote);
    const recipientName = parsed['recipient_name'] || order.customer.name;
    const occasion = parsed['occasion'] || '';
    const qrUrl = getQrCodeUrl(order.orderNumber);

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Luxury Delivery Slip - ${order.orderNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@700&display=swap');
  @page { size: A4 portrait; margin: 14mm auto; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { background: #f1f5f9; color: #000000; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 10px; }
  @media print { body { background: #fff !important; padding: 0; min-height: auto; } }

  .slip-box {
    width: 176mm;
    min-height: 118mm;
    max-width: 180mm;
    background: #ffffff;
    color: #000000;
    border: 2.2px solid #000000;
    border-radius: 18px;
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    box-shadow: 0 12px 35px rgba(0,0,0,0.12);
    margin: 0 auto;
  }

  .lily-tl { position: absolute; top: -2px; left: -2px; width: 130px; height: 115px; pointer-events: none; z-index: 1; }
  .lily-br { position: absolute; bottom: -2px; right: -2px; width: 130px; height: 115px; pointer-events: none; z-index: 1; transform: rotate(180deg); }

  .head-section { text-align: center; position: relative; z-index: 2; padding-bottom: 8px; border-bottom: 1.5px solid #000; }
  .brand-title { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 800; letter-spacing: 3.5px; text-transform: uppercase; color: #000; }
  .sub-title { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: #000; margin-top: 2px; font-weight: 700; }

  .middle-content { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 10px 0; position: relative; z-index: 2; }
  .info-panel { border: 1.2px solid #000; border-radius: 8px; padding: 10px 12px; }
  .panel-lbl { font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px; }
  .rec-name { font-family: 'Playfair Display', Georgia, serif; font-size: 19px; font-weight: 800; color: #000; }
  .rec-meta { font-size: 11px; color: #222; margin-top: 2px; }

  .care-panel { border: 1.2px solid #000; border-radius: 8px; padding: 10px 12px; background: #fafafa; font-size: 9.5px; line-height: 1.4; }
  .care-head { font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 8.5px; margin-bottom: 4px; }

  .footer-strip { display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #000; padding-top: 8px; position: relative; z-index: 2; }
  .origin-text { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .order-ref { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; background: #000; color: #fff; padding: 2px 7px; border-radius: 4px; }
</style>
</head>
<body>
<div class="slip-box">
  <div class="lily-tl">${BOTANICAL_LILY_SVG}</div>
  <div class="lily-br">${BOTANICAL_LILY_SVG}</div>

  <div class="head-section">
    <div style="display:flex;justify-content:center;margin-bottom:2px;">${BRAND_LEAVES_EMBLEM}</div>
    <div class="brand-title">New Eco Roses</div>
    <div class="sub-title">Haute Floral Atelier &middot; ${storeName}</div>
    ${occasion ? `<div style="font-size:10px;font-weight:800;color:#000;margin-top:4px;text-transform:uppercase;">✨ ${occasion} Presentation</div>` : ''}
  </div>

  <div class="middle-content">
    <div class="info-panel">
      <div class="panel-lbl">SPECIALLY HANDCRAFTED FOR</div>
      <div class="rec-name">${recipientName}</div>
      <div class="rec-meta">${order.shippingAddress.city} &middot; Destination Kolkata</div>
      <div style="margin-top:8px;font-size:10px;font-weight:600;">
        ${order.items.map(i => `<div>• ${i.quantity}× ${i.name}</div>`).join('')}
      </div>
    </div>

    <div class="care-panel">
      <div class="care-head">🌸 FRESH FLOWER CARE RITUAL</div>
      <div>1. Trim stems at a 45° angle under cool water before arranging</div>
      <div>2. Dissolve the floral food preservative sachet in clean water</div>
      <div>3. Display away from direct sunlight, air currents, and heat sources</div>
    </div>
  </div>

  <div class="footer-strip">
    <div class="origin-text">Crafted with Passion &middot; newecoroses.com &middot; Kolkata</div>
    <div class="order-ref">ORDER #${order.orderNumber}</div>
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=780,height=580');
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
            <div style="font-weight:700;">${recipientName}</div>
            <div style="font-size:8.5px;color:#555;">📱 ${o.customer.phone}${altPhone !== '—' ? ' | Alt: ' + altPhone : ''}</div>
          </td>
          <td style="font-size:9px;max-width:200px;">
            ${o.shippingAddress.line1}${o.shippingAddress.line2 ? ', ' + o.shippingAddress.line2 : ''}, ${o.shippingAddress.city} - <strong>${o.shippingAddress.postalCode}</strong>
          </td>
          <td style="font-size:9px;">
            ${o.items.map(it => `<div>• ${it.quantity}× ${it.name}</div>`).join('')}
            ${occasion !== '—' ? `<span style="display:inline-block;margin-top:2px;font-size:8px;background:#000;color:#fff;padding:1px 4px;border-radius:2px;">${occasion}</span>` : ''}
          </td>
          <td style="text-align:center;font-weight:800;white-space:nowrap;">₹${o.total.toLocaleString('en-IN')}</td>
          <td style="text-align:center;">
            <span style="display:inline-block;padding:2px 6px;border-radius:3px;font-size:8.5px;font-weight:800;background:#000;color:#fff;">
              ${(o.paymentMethod || 'Prepaid').toUpperCase()}
            </span>
          </td>
          <td style="text-align:center;padding:4px;">
            <img src="${qrUrl}" alt="QR" style="width:42px;height:42px;border:1px solid #000;padding:1px;" />
          </td>
          <td style="border-bottom:1px solid #000;min-width:90px;"></td>
        </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Courier Handover Manifest - ${storeName}</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
  body { padding: 12px; background: #fff; color: #000; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px; }
  .brand-title { font-size: 16px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
  .sub-title { font-size: 10px; color: #333; margin-top: 2px; }
  .meta-box { text-align: right; font-size: 9.5px; line-height: 1.4; }
  
  .summary-bar { display: flex; gap: 15px; background: #f3f3f3; border: 1.5px solid #000; padding: 6px 12px; font-size: 10px; font-weight: 700; margin-bottom: 10px; border-radius: 4px; }
  .summary-bar span strong { color: #000; }
  
  table { width: 100%; border-collapse: collapse; font-size: 9.5px; }
  th { background: #000; color: #fff; padding: 6px 5px; text-align: left; font-size: 8.5px; letter-spacing: 0.5px; text-transform: uppercase; }
  td { padding: 5px; border-bottom: 1px solid #ccc; vertical-align: middle; }
  tr:nth-child(even) td { background: #fafafa; }
  
  .signatures { display: flex; justify-content: space-between; margin-top: 20px; padding-top: 15px; border-top: 1.5px dashed #000; font-size: 9px; }
  .sig-block { min-width: 170px; text-align: center; border-top: 1px solid #000; padding-top: 4px; font-weight: 700; }
  .sig-block span { font-weight: normal; color: #555; font-size: 8px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">New Eco Roses &mdash; Master Courier Handover Manifest</div>
      <div class="sub-title">Dispatched from <strong>${storeName}</strong> &bull; ${getStoreAddress(storeName)}</div>
    </div>
    <div class="meta-box">
      <div><strong>Manifest Date:</strong> ${manifestDate}</div>
      <div><strong>Generated:</strong> ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
      <div><strong>Helpline:</strong> +91 99369 11611</div>
    </div>
  </div>

  <div class="summary-bar">
    <span>Total Parcels: <strong>${orders.length}</strong></span>
    <span>Total Manifest Value: <strong>₹${totalValue.toLocaleString('en-IN')}</strong></span>
    <span>Prepaid Shipments: <strong>${orders.filter(o => (o.paymentMethod || 'prepaid').toLowerCase() === 'prepaid').length}</strong></span>
    <span>COD Shipments: <strong>${orders.filter(o => (o.paymentMethod || '').toLowerCase() === 'cod').length}</strong></span>
    <span>Fragile Live Blooms: <strong>100% Inspected</strong></span>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:25px;text-align:center;">#</th>
        <th style="width:85px;">Order ID</th>
        <th style="width:140px;">Recipient &amp; Phone</th>
        <th>Delivery Address</th>
        <th style="width:160px;">Bouquet Details</th>
        <th style="width:65px;text-align:center;">Value</th>
        <th style="width:65px;text-align:center;">Mode</th>
        <th style="width:50px;text-align:center;">QR</th>
        <th style="width:90px;text-align:center;">Courier Sign</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="signatures">
    <div class="sig-block">
      Store Dispatcher Signature<br>
      <span>Name, ID &amp; Time</span>
    </div>
    <div class="sig-block">
      Courier Pickup Agent Signature<br>
      <span>Name &amp; Mobile Number</span>
    </div>
    <div class="sig-block">
      Security Handover Check<br>
      <span>Outward Gate Pass</span>
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
// MANIFEST OPTION 2: PER-PRODUCT INDIVIDUAL MANIFEST DOCKET
// Pure Black Ink on White Paper with Botanical Lilies, Florist QC Checklist
// ═══════════════════════════════════════════════════════════════════
export function generateProductManifest(order: SavedOrder, storeName: string, productIndex?: number): void {
    const parsed = parseSpecialNote(order.specialNote);
    const recipientName = parsed['recipient_name'] || order.customer.name;
    const recipientPhone = parsed['recipient_phone'] || order.customer.phone;
    const altPhone = parsed['alt_phone'] || '';
    const qrUrl = getQrCodeUrl(order.orderNumber);

    const itemsToRender = typeof productIndex === 'number' && order.items[productIndex]
        ? [{ item: order.items[productIndex], index: productIndex }]
        : order.items.map((it, idx) => ({ item: it, index: idx }));

    const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const pages = itemsToRender.map(({ item, index }) => `
    <div class="docket-page-wrapper">
      <div class="docket-card">
        <!-- Botanical Corner Lilies -->
        <div class="lily-tl">${BOTANICAL_LILY_SVG}</div>
        <div class="lily-br">${BOTANICAL_LILY_SVG}</div>

        <!-- Header -->
        <div class="docket-head">
          <div style="display:flex;justify-content:center;margin-bottom:2px;">${BRAND_LEAVES_EMBLEM}</div>
          <div class="brand-title">NEW ECO ROSES ATELIER</div>
          <div class="docket-sub">
            <span class="sub-line"></span>
            INDIVIDUAL PRODUCT MANIFEST &middot; ITEM #${index + 1} OF ${order.items.length}
            <span class="sub-line"></span>
          </div>
        </div>

        <!-- Meta Grid -->
        <div class="meta-strip">
          <div class="meta-cell">
            <div class="m-lbl">ORDER ID</div>
            <div class="m-val bold-mono">${order.orderNumber}</div>
          </div>
          <div class="meta-cell">
            <div class="m-lbl">FULFILMENT ATELIER</div>
            <div class="m-val">${storeName}</div>
          </div>
          <div class="meta-cell">
            <div class="m-lbl">DELIVERY TYPE</div>
            <div class="m-val serif-type">Standard</div>
          </div>
          <div class="meta-cell" style="border-right:none;">
            <div class="m-lbl">DATE</div>
            <div class="m-val">${dateFormatted}</div>
          </div>
        </div>

        <!-- Product Banner -->
        <div class="product-banner">
          <div class="prod-details">
            <div class="prod-tag">🌸 BOUQUET SPECIFICATION</div>
            <div class="prod-name">${item.name}</div>
            <div class="prod-sub">
              <strong>Quantity:</strong> ${item.quantity} Unit &nbsp;|&nbsp;
              <strong>Price:</strong> ₹${(item.price * item.quantity).toLocaleString('en-IN')} &nbsp;|&nbsp;
              <strong>QC Status:</strong> Passed ✓
            </div>
          </div>
          <div class="qr-col">
            <div class="qr-box">
              <img src="${qrUrl}" alt="Route QR" class="qr-img" />
            </div>
            <div class="qr-txt">TRACK ORDER</div>
          </div>
        </div>

        <!-- Recipient & Destination -->
        <div class="ship-details-box">
          <div class="box-lbl">SHIP TO (RECIPIENT)</div>
          <div class="rec-name">${recipientName}</div>
          <div class="addr-line">${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', ' + order.shippingAddress.line2 : ''}, ${order.shippingAddress.city} – ${order.shippingAddress.postalCode}</div>
          <div class="phone-line">📱 Primary: +91 ${recipientPhone}${altPhone ? ' &nbsp;|&nbsp; 📱 Alt: +91 ' + altPhone : ''}</div>
        </div>

        <!-- Florist Quality Control Checklist -->
        <div class="checks-box">
          <div class="checks-lbl">📋 FLORIST PRE-DISPATCH QUALITY CONTROL PASS</div>
          <div class="checks-row">
            <div class="chk"><span>✓</span> 45° Slanted Clean Stem Cut</div>
            <div class="chk"><span>✓</span> Hydration Water Gel Secured</div>
            <div class="chk"><span>✓</span> Guard Petals Groomed &amp; De-thorned</div>
            <div class="chk"><span>✓</span> Matte Luxury Wrap &amp; Satin Bow Tied</div>
            <div class="chk"><span>✓</span> Floral Food Preservative Enclosed</div>
            <div class="chk"><span>✓</span> Calligraphy Message Card Sealed</div>
          </div>
        </div>

        <!-- Sign-Off Line -->
        <div class="docket-foot">
          <div class="sig-slot">
            <strong>Master Florist</strong><br>
            <span>Arrangement Verified</span>
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
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@700&display=swap');
  @page { size: A4 portrait; margin: 14mm auto; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { background: #f1f5f9; color: #000000; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; flex-direction: column; align-items: center; padding: 10px; }
  @media print { body { background: #fff !important; padding: 0; } }

  .docket-page-wrapper { width: 100%; display: flex; justify-content: center; margin-bottom: 20px; }
  .page-break { page-break-after: always; height: 0; }

  /* 50-60% of A4 Luxury Card */
  .docket-card {
    width: 176mm;
    min-height: 118mm;
    max-width: 180mm;
    background: #ffffff;
    color: #000000;
    border: 2.2px solid #000000;
    border-radius: 18px;
    padding: 14px 18px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 12px 35px rgba(0,0,0,0.12);
  }

  .lily-tl { position: absolute; top: -2px; left: -2px; width: 130px; height: 115px; pointer-events: none; z-index: 1; }
  .lily-br { position: absolute; bottom: -2px; right: -2px; width: 130px; height: 115px; pointer-events: none; z-index: 1; transform: rotate(180deg); }

  .docket-head { text-align: center; position: relative; z-index: 2; padding-bottom: 6px; }
  .brand-title { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 800; letter-spacing: 3px; color: #000; }
  .docket-sub { font-size: 8px; color: #000; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 2px; }
  .sub-line { display: inline-block; width: 20px; height: 1px; background: #000; }

  .meta-strip { display: grid; grid-template-columns: 1fr 1.3fr 1fr 1fr; border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; position: relative; z-index: 2; }
  .meta-cell { padding: 5px 8px; border-right: 1.5px solid #000; }
  .m-lbl { font-size: 7.5px; font-weight: 800; color: #000; letter-spacing: 0.8px; text-transform: uppercase; }
  .m-val { font-size: 11.5px; font-weight: 800; color: #000; }
  .bold-mono { font-family: 'JetBrains Mono', monospace; }
  .serif-type { font-family: 'Playfair Display', Georgia, serif; font-size: 12px; }

  .product-banner { display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #000; padding: 7px 0; position: relative; z-index: 2; }
  .prod-details { flex: 1; padding-right: 10px; }
  .prod-tag { font-size: 7.5px; font-weight: 800; letter-spacing: 1px; color: #000; text-transform: uppercase; }
  .prod-name { font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 15px; font-weight: 800; color: #000; margin: 1px 0; }
  .prod-sub { font-size: 9px; color: #222; }
  .qr-col { text-align: center; width: 68px; }
  .qr-box { width: 56px; height: 56px; border: 1px solid #000; padding: 2px; margin: 0 auto; }
  .qr-img { width: 100%; height: 100%; object-fit: contain; }
  .qr-txt { font-size: 6.5px; font-weight: 800; color: #000; margin-top: 2px; }

  .ship-details-box { padding: 6px 0; border-bottom: 1.5px solid #000; position: relative; z-index: 2; }
  .box-lbl { font-size: 7.5px; font-weight: 800; color: #000; letter-spacing: 1px; text-transform: uppercase; }
  .rec-name { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 800; color: #000; }
  .addr-line { font-size: 9.5px; color: #222; margin-top: 1px; }
  .phone-line { font-size: 9px; font-weight: 700; color: #000; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }

  .checks-box { padding: 6px 0; border-bottom: 1.5px solid #000; position: relative; z-index: 2; }
  .checks-lbl { font-size: 7.5px; font-weight: 800; color: #000; letter-spacing: 1px; margin-bottom: 3px; text-transform: uppercase; }
  .checks-row { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; font-size: 8px; font-weight: 700; color: #000; }
  .chk { display: flex; align-items: center; gap: 4px; }
  .chk span { font-weight: 900; }

  .docket-foot { display: flex; justify-content: space-between; padding-top: 6px; position: relative; z-index: 2; }
  .sig-slot { min-width: 100px; text-align: center; border-top: 1px solid #000; padding-top: 2px; font-size: 7.5px; color: #000; font-weight: 700; }
  .sig-slot span { font-size: 6.5px; color: #555; font-weight: normal; }
</style>
</head>
<body>
${pages}
</body>
</html>`;

    const win = window.open('', '_blank', 'width=780,height=580');
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
  body { width: 5in; height: 7in; background: #ffffff; margin: 0; font-family: 'Playfair Display', serif; }
  .card {
    width: 100%; height: 100%;
    background: #ffffff;
    border: 2px solid #000;
    display: flex; flex-direction: column; align-items: center; justify-content: space-between;
    padding: 34px 38px;
    position: relative; overflow: hidden; text-align: center;
  }
  .lily-tl { position: absolute; top: 0; left: 0; width: 110px; height: 100px; pointer-events: none; }
  .lily-br { position: absolute; bottom: 0; right: 0; width: 110px; height: 100px; pointer-events: none; transform: rotate(180deg); }

  .header { display: flex; flex-direction: column; align-items: center; gap: 4px; position: relative; z-index: 2; }
  .brand-name { font-size: 13px; letter-spacing: 5px; text-transform: uppercase; color: #000; font-weight: 700; }
  .occasion-badge { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #000; font-style: italic; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 2px 10px; margin-top: 4px; }
  
  .message-body {
    flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 20px 0; max-width: 90%; position: relative; z-index: 2;
  }
  .to-line { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-style: italic; color: #333; margin-bottom: 10px; }
  .to-line strong { font-family: 'Playfair Display', serif; font-size: 19px; color: #000; font-weight: 700; font-style: normal; }
  
  .message-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; line-height: 1.55; color: #111;
    font-style: italic; word-wrap: break-word; white-space: pre-wrap;
  }
  
  .from-line { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-style: italic; color: #333; margin-top: 12px; }
  .from-line strong { font-family: 'Playfair Display', serif; font-size: 17px; color: #000; font-weight: 700; font-style: normal; }
  
  .footer { font-size: 8px; letter-spacing: 3px; text-transform: uppercase; color: #000; border-top: 1px solid #000; padding-top: 8px; width: 80%; position: relative; z-index: 2; }
  @media print { body { width: 5in; height: 7in; } }
</style>
</head>
<body>
<div class="card">
  <div class="lily-tl">${BOTANICAL_LILY_SVG}</div>
  <div class="lily-br">${BOTANICAL_LILY_SVG}</div>

  <div class="header">
    <div style="display:flex;justify-content:center;margin-bottom:2px;">${BRAND_LEAVES_EMBLEM}</div>
    <div class="brand-name">New Eco Roses</div>
    ${occasion ? `<div class="occasion-badge">${occasion}</div>` : ''}
  </div>

  <div class="message-body">
    ${recipientName ? `<div class="to-line">To Dearest <strong>${recipientName}</strong>,</div>` : ''}
    <div class="message-text">"${message || 'May these blooms bring endless joy and radiant smiles to your day.'}"</div>
    ${senderName ? `<div class="from-line">With heartfelt love, <strong>${senderName}</strong></div>` : ''}
  </div>

  <div class="footer">
    Haute Floral Atelier &middot; newecoroses.com
  </div>
</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=520,height=720');
    if (win) {
        win.document.write(html);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 500);
    }
}
