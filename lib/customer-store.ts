import { ordersStore, SavedOrder } from './order-cache';

export interface CustomerRecord {
    id: string;
    name: string;
    phone: string;
    email?: string;
    dob?: string;               // YYYY-MM-DD
    specialDay?: string;        // YYYY-MM-DD
    specialDayType?: string;    // 'Marriage Anniversary' | 'Birthday' | 'Engagement' | 'Other'
    amountSpent?: number;
    purchasedItems: string[];   // e.g. ['20 Roses Luxury Bouquet', 'Chocolates']
    source: 'in-store' | 'reception' | 'online';
    notes?: string;
    createdAt: string;
    greetingEmailStatus?: {
        sent: boolean;
        queued: boolean;
        couponCode: string;
        discountPercent: number;
        sentAt?: string;
        previewSubject: string;
    };
}

// Global in-memory customer store (persists across HMR and serverless warm container)
const globalForCustomers = global as unknown as {
    nerCustomersMap?: Map<string, CustomerRecord>;
};

export const customersStore = globalForCustomers.nerCustomersMap || new Map<string, CustomerRecord>();
if (process.env.NODE_ENV !== 'production') {
    globalForCustomers.nerCustomersMap = customersStore;
}

// Seed with sample initial in-store reception customers if empty
if (customersStore.size === 0) {
    const seedCustomers: CustomerRecord[] = [
        {
            id: 'cust_rec_1',
            name: 'Priyanka Sen',
            phone: '+91 98301 23456',
            email: 'priyanka.sen@example.com',
            dob: '1994-08-22',
            specialDay: '2026-11-28',
            specialDayType: 'Marriage Anniversary',
            amountSpent: 2499,
            purchasedItems: ['20 Roses Luxury Velvet Bouquet', 'Belgian Truffle Box'],
            source: 'in-store',
            notes: 'Prefers red and blush pink roses. Delivery in Salt Lake.',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            greetingEmailStatus: {
                sent: true,
                queued: false,
                couponCode: 'WELCOME15',
                discountPercent: 15,
                sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                previewSubject: 'Thank you for shopping at New Eco Roses! 🌹 Your 15% discount is inside',
            },
        },
        {
            id: 'cust_rec_2',
            name: 'Anirban Mukherjee',
            phone: '+91 98310 98765',
            email: 'anirban.m@example.com',
            dob: '1989-05-14',
            specialDay: '2026-12-10',
            specialDayType: 'Birthday',
            amountSpent: 1850,
            purchasedItems: ['Red Rose Symphony Heart Box'],
            source: 'reception',
            notes: 'Purchased for fiancé birthday.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            greetingEmailStatus: {
                sent: true,
                queued: false,
                couponCode: 'WELCOME15',
                discountPercent: 15,
                sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                previewSubject: 'Thank you for shopping at New Eco Roses! 🌹 Your 15% discount is inside',
            },
        },
    ];

    seedCustomers.forEach(c => customersStore.set(c.id, c));
}

export function getAllCustomers(): CustomerRecord[] {
    // 1. Gather all reception / in-store recorded customers
    const inStoreCustomers = Array.from(customersStore.values());

    // 2. Derive unique customers from online store orders
    const onlineOrdersMap = new Map<string, CustomerRecord>();
    const orders = Array.from(ordersStore.values());

    orders.forEach(order => {
        const phoneKey = order.customer.phone || order.customer.name;
        const existing = onlineOrdersMap.get(phoneKey);
        const itemNames = order.items.map(i => i.name);

        if (existing) {
            existing.amountSpent = (existing.amountSpent || 0) + (order.status !== 'cancelled' ? order.total : 0);
            existing.purchasedItems = Array.from(new Set([...existing.purchasedItems, ...itemNames]));
            if (new Date(order.createdAt) > new Date(existing.createdAt)) {
                existing.createdAt = order.createdAt;
            }
        } else {
            onlineOrdersMap.set(phoneKey, {
                id: `online_${order.id}`,
                name: order.customer.name,
                phone: order.customer.phone,
                email: order.customer.email,
                amountSpent: order.status !== 'cancelled' ? order.total : 0,
                purchasedItems: itemNames,
                source: 'online',
                notes: `Ordered online (${order.orderNumber}) · ${order.shippingAddress.city}`,
                createdAt: order.createdAt,
                greetingEmailStatus: {
                    sent: true,
                    queued: false,
                    couponCode: 'WELCOME15',
                    discountPercent: 15,
                    previewSubject: 'Order Confirmation & 15% VIP Shopping Discount',
                },
            });
        }
    });

    // Merge in-store and online (avoid duplicate phone entries if customer visited both)
    const phoneSet = new Set<string>();
    const merged: CustomerRecord[] = [];

    // Prioritize in-store rich records (they have DOB and special occasions)
    for (const c of inStoreCustomers) {
        phoneSet.add(c.phone.replace(/\D/g, '').slice(-10));
        merged.push(c);
    }

    for (const c of onlineOrdersMap.values()) {
        const cleanPhone = c.phone.replace(/\D/g, '').slice(-10);
        if (!phoneSet.has(cleanPhone)) {
            phoneSet.add(cleanPhone);
            merged.push(c);
        }
    }

    // Sort by latest createdAt first
    return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addInStoreCustomer(data: {
    name: string;
    phone: string;
    email?: string;
    dob?: string;
    specialDay?: string;
    specialDayType?: string;
    amountSpent?: number;
    purchasedItems?: string[];
    notes?: string;
}): CustomerRecord {
    const id = `cust_rec_${Date.now()}`;
    const newCustomer: CustomerRecord = {
        id,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || undefined,
        dob: data.dob || undefined,
        specialDay: data.specialDay || undefined,
        specialDayType: data.specialDayType || undefined,
        amountSpent: Number(data.amountSpent) || 0,
        purchasedItems: data.purchasedItems || [],
        source: 'reception',
        notes: data.notes?.trim() || undefined,
        createdAt: new Date().toISOString(),
        greetingEmailStatus: {
            sent: false,
            queued: true,
            couponCode: 'WELCOME15',
            discountPercent: 15,
            previewSubject: `Thank you for shopping with New Eco Roses, ${data.name.split(' ')[0]}! 🌹 Enjoy 15% off online`,
        },
    };

    customersStore.set(id, newCustomer);
    return newCustomer;
}

// ── Email Template Generator Structure ─────────────────────
export function generateGreetingEmailHtml(customer: CustomerRecord): { subject: string; html: string; text: string } {
    const firstName = customer.name.split(' ')[0] || 'Valued Guest';
    const coupon = customer.greetingEmailStatus?.couponCode || 'WELCOME15';
    const itemsList = customer.purchasedItems.length > 0 
        ? customer.purchasedItems.join(', ')
        : 'handcrafted floral arrangement';

    const subject = `Thank you for visiting New Eco Roses, ${firstName}! 🌹 Enjoy 15% off your next online order`;

    const text = `
Dear ${firstName},

Thank you for shopping with New Eco Roses boutique! We hope you love your ${itemsList}.

As a warm welcome to our floral family, here is an exclusive 15% discount for your next online order on our storefront:
Discount Code: ${coupon}
Valid on all bouquets, luxury hampers, and floral arrangements.

Shop online: https://newecoroses.com
Store Location: Kolkata, West Bengal
WhatsApp / Call: +91 98300 00000

With love,
New Eco Roses Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You from New Eco Roses</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e4e4e7;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0d14; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="560" border="0" cellspacing="0" cellpadding="0" style="background-color: #12141f; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 36px 30px 24px; border-bottom: 1px solid #1f2230;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 2px;">
                NEW ECO ROSES
              </h1>
              <p style="margin: 6px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #a1a1aa;">
                Luxury Blooms & Floral Creations
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 36px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #ffffff;">
                Dear ${firstName},
              </h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #d4d4d8;">
                Thank you for choosing <strong>New Eco Roses</strong>. It was our pleasure to serve you today! We hope your flowers bring warmth, beauty, and joy to your special moments.
              </p>

              ${customer.purchasedItems.length > 0 ? `
              <div style="background-color: #1a1d2e; border: 1px solid #272738; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #a1a1aa; letter-spacing: 1px;">Selected Selection:</p>
                <p style="margin: 6px 0 0; font-size: 13px; font-weight: 600; color: #ffffff;">${itemsList}</p>
              </div>` : ''}

              <!-- VIP Offer Box -->
              <div style="background: linear-gradient(135deg, #181b2a, #131522); border: 1px dashed #52525b; border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 28px;">
                <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; font-weight: 700; color: #e4e4e7; letter-spacing: 1.5px;">
                  Exclusive In-Store Guest Privilege
                </p>
                <h3 style="margin: 0 0 8px; font-size: 26px; font-weight: 800; color: #ffffff;">
                  15% OFF YOUR NEXT ONLINE ORDER
                </h3>
                <p style="margin: 0 0 18px; font-size: 12px; color: #a1a1aa;">
                  Use this promo code at checkout on our official online boutique
                </p>
                <div style="display: inline-block; background-color: #ffffff; color: #09090b; font-size: 18px; font-weight: 800; letter-spacing: 3px; font-family: monospace; padding: 12px 28px; border-radius: 8px;">
                  ${coupon}
                </div>
              </div>

              <div style="text-align: center; margin-bottom: 12px;">
                <a href="https://newecoroses.com" style="display: inline-block; background-color: #ffffff; color: #09090b; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 10px;">
                  Explore Storefront &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; border-top: 1px solid #1f2230; text-align: center; font-size: 11px; color: #71717a; line-height: 1.5;">
              <p style="margin: 0 0 4px;">New Eco Roses Boutique · Kolkata, West Bengal</p>
              <p style="margin: 0;">Designed by Aditya Choudhury · For assistance WhatsApp us anytime</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    return { subject, html, text };
}
