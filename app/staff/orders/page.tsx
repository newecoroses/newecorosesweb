'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    ShoppingBag,
    Search,
    RefreshCw,
    CheckCircle2,
    Clock,
    Truck,
    X,
    Phone,
    MapPin,
    Plus,
    ChevronRight,
    MessageSquare,
    Store,
    Bell,
    BellRing,
    Download,
    Printer,
    Tag,
    Crown,
    FileText,
    CheckSquare,
    Square,
    Gift,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { SavedOrder } from '@/lib/order-cache';
import { AddOrderModal } from '@/components/admin/add-order-modal';

// ── Types ─────────────────────────────────────────────────────────
interface StaffInfo {
    id: string; name: string; role: string;
    storeId?: 'director' | 'tollygunge' | 'alipore';
    permissions?: { canAssignOrders?: boolean; canViewAllStores?: boolean; canDownloadLabels?: boolean };
}

const STORE_NAMES: Record<string, string> = {
    tollygunge: 'Tollygunge Store',
    alipore: 'Alipore Store',
    director: 'Boutique Director',
};

const ASSEMBLY_CHECKLIST = [
    { id: 'bouquet', label: 'Bouquet / Arrangement' },
    { id: 'msg_card', label: 'Message Card' },
    { id: 'flower_food', label: 'Flower Food Sachet' },
    { id: 'ribbon', label: 'Ribbon & Wrapping' },
    { id: 'luxury_bag', label: 'Luxury Carry Bag' },
];

// ── Helpers ───────────────────────────────────────────────────────
function parseSpecialNote(note?: string): Record<string, string> {
    if (!note) return {};
    const result: Record<string, string> = {};
    note.split('|').forEach(pair => {
        const [k, ...vParts] = pair.split(':');
        if (k && vParts.length) result[k.trim().toLowerCase().replace(/\s+/g, '_')] = vParts.join(':').trim();
    });
    return result;
}

function beepAudio() {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    } catch {}
}

function generateShippingLabel(order: SavedOrder, storeName: string) {
    const parsed = parseSpecialNote(order.specialNote);
    const recipientName = parsed['recipient_name'] || order.customer.name;
    const recipientPhone = parsed['recipient_phone'] || order.customer.phone;
    const altPhone = parsed['alt_phone'] || '';
    const occasion = parsed['occasion'] || '';
    const storeAddress = storeName === 'Tollygunge Store' ? '12A, Tollygunge Main Road, Kolkata - 700033'
        : storeName === 'Alipore Store' ? '5B, Alipore Road, Kolkata - 700027'
        : 'New Eco Roses, Kolkata, West Bengal';

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Label - ${order.orderNumber}</title>
<style>@page{size:4in 6in;margin:0}*{box-sizing:border-box;margin:0;padding:0;font-family:Arial,sans-serif}body{width:4in;height:6in;background:#fff}
.label{width:100%;height:100%;border:2px solid #000;display:flex;flex-direction:column}
.hdr{background:#000;color:#fff;padding:8px 12px;display:flex;align-items:center;justify-content:space-between}
.brand{font-size:13px;font-weight:900;letter-spacing:2px}.onum{font-size:11px;font-family:monospace}
.badges{display:flex;gap:6px;padding:6px 10px;border-bottom:1px solid #000}
.badge{padding:2px 8px;border:1.5px solid #000;border-radius:3px;font-size:9px;font-weight:900;letter-spacing:1px;text-transform:uppercase}
.bp{background:#16a34a;color:#fff;border-color:#16a34a}.bf{background:#dc2626;color:#fff;border-color:#dc2626}
.sec{padding:8px 10px;border-bottom:1px solid #ddd}
.sl{font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#666;margin-bottom:3px}
.sv{font-size:11px;font-weight:700;line-height:1.4}.ss{font-size:10px;color:#333;line-height:1.4}
.split{display:flex;gap:8px}.split-l{flex:1}
.qr{width:60px;height:60px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:7px;color:#999;text-align:center;flex-shrink:0}
.foot{margin-top:auto;padding:6px 10px;background:#f9f9f9;border-top:1px solid #ddd;font-size:8px;color:#555;text-align:center}
.hand{font-size:8px;color:#333;padding:4px 10px;border-bottom:1px solid #eee;font-style:italic}
</style></head><body><div class="label">
<div class="hdr"><span class="brand">🌹 NEW ECO ROSES</span><span class="onum">#${order.orderNumber}</span></div>
<div class="badges">
  <span class="badge bp">✓ PREPAID</span><span class="badge bf">⚠ FRAGILE</span><span class="badge">FLOWERS</span>
  ${occasion ? `<span class="badge" style="background:#fef3c7;border-color:#d97706;color:#92400e;">${occasion.toUpperCase()}</span>` : ''}
</div>
<div class="sec"><div class="sl">📬 DELIVER TO</div><div class="split"><div class="split-l">
  <div class="sv">${recipientName}</div>
  <div class="ss">📱 ${recipientPhone}${altPhone ? ` / ${altPhone}` : ''}</div>
  <div class="ss" style="margin-top:4px">${order.shippingAddress.line1}${order.shippingAddress.line2 ? ', '+order.shippingAddress.line2 : ''}<br>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}</div>
</div><div class="qr">QR<br>SCAN</div></div></div>
<div class="sec"><div class="sl">📤 FROM</div><div class="sv">New Eco Roses — ${storeName}</div><div class="ss">${storeAddress}</div><div class="ss">newecoroses.com</div></div>
<div class="sec" style="border-bottom:none"><div style="display:flex;justify-content:space-between;align-items:center">
  <div><div class="sl">VALUE</div><div class="sv" style="font-size:14px">₹${order.total.toLocaleString('en-IN')}</div></div>
  <div><div class="sl">PAYMENT</div><div class="sv">${order.paymentMethod}</div></div>
  <div><div class="sl">DATE</div><div class="sv">${new Date(order.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'2-digit'})}</div></div>
</div></div>
<div class="hand">⚠ Handle with care · Keep upright · Keep away from heat &amp; direct sunlight</div>
<div class="foot">Handcrafted with love · New Eco Roses · newecoroses.com<br><strong>Rider Signature: ___________________</strong></div>
</div></body></html>`;
    const win = window.open('', '_blank', 'width=400,height=620');
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 500); }
}

function generateManifest(orders: SavedOrder[], storeName: string) {
    const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const rows = orders.map((o, i) => {
        const p = parseSpecialNote(o.specialNote);
        const rec = p['recipient_name'] || o.customer.name;
        return `<tr><td>${i+1}</td><td style="font-family:monospace;font-weight:700">${o.orderNumber}</td>
<td>${o.customer.name}</td><td>${rec}</td>
<td>${o.shippingAddress.line1}, ${o.shippingAddress.city}</td>
<td style="font-family:monospace">${o.customer.phone}</td>
<td style="font-family:monospace">${p['alt_phone']||'—'}</td>
<td>${o.items.length}</td><td>${o.paymentMethod}</td>
<td style="font-weight:700">₹${o.total.toLocaleString('en-IN')}</td>
<td style="width:80px"></td></tr>`;
    }).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Manifest</title>
<style>@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:10px}
h1{font-size:16px;margin-bottom:2px}.meta{font-size:10px;color:#555;margin-bottom:10px}
table{width:100%;border-collapse:collapse}
th{background:#000;color:#fff;padding:5px 6px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:.5px}
td{padding:5px 6px;border-bottom:1px solid #ddd;vertical-align:top}tr:nth-child(even) td{background:#f7f7f7}
.foot{margin-top:20px;display:flex;justify-content:space-between}
.sign{border-top:1px solid #000;padding-top:4px;min-width:160px;text-align:center;font-size:9px}
</style></head><body>
<h1>🌹 New Eco Roses — Courier Dispatch Manifest</h1>
<div class="meta"><strong>Store:</strong> ${storeName} &nbsp;|&nbsp; <strong>Date:</strong> ${date} &nbsp;|&nbsp; <strong>Total:</strong> ${orders.length} orders &nbsp;|&nbsp; <strong>Value:</strong> ₹${orders.reduce((s,o)=>s+o.total,0).toLocaleString('en-IN')}</div>
<table><thead><tr><th>#</th><th>Order #</th><th>Customer</th><th>Recipient</th><th>Address</th><th>Phone</th><th>Alt Phone</th><th>Items</th><th>Payment</th><th>Amount</th><th>Rider Sign</th></tr></thead>
<tbody>${rows}</tbody></table>
<div class="foot"><div class="sign">Dispatcher Name &amp; Signature</div><div class="sign">Rider Name &amp; Signature</div><div class="sign">Received By &amp; Date</div></div>
</body></html>`;
    const win = window.open('', '_blank', 'width=900,height=600');
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 500); }
}

function generateGiftCard(order: SavedOrder) {
    const p = parseSpecialNote(order.specialNote);
    const recipient = p['recipient_name'] || order.customer.name;
    const sender = p['sender_name'] || '';
    const message = p['message'] || '';
    const occasion = p['occasion'] || '';
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Gift Card - ${order.orderNumber}</title>
<style>@page{size:5in 7in;margin:0}*{box-sizing:border-box;margin:0;padding:0}body{width:5in;height:7in;background:#fffef8}
.card{width:100%;height:100%;background:linear-gradient(135deg,#fffef8 0%,#fef9ec 50%,#fff8f0 100%);border:1px solid #e8d5b7;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:32px 36px;position:relative;overflow:hidden;text-align:center}
.corner{position:absolute;width:80px;height:80px;opacity:.35}
.tl{top:0;left:0}.tr{top:0;right:0;transform:scaleX(-1)}.bl{bottom:0;left:0;transform:scaleY(-1)}.br{bottom:0;right:0;transform:scale(-1)}
.brand{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#bfa81f;font-weight:700;font-family:Georgia,serif}
.floral{font-size:16px;margin:4px 0;color:#bfa81f;letter-spacing:8px}
.occ{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a7c4a;border:1px solid #d4a853;padding:3px 14px;border-radius:20px;background:rgba(191,168,31,.07);font-family:Georgia,serif}
.to{font-style:italic;font-size:13px;color:#888;letter-spacing:1px;margin-bottom:2px;font-family:Georgia,serif}
.rec{font-size:22px;font-weight:700;color:#2a1a0a;letter-spacing:1px;font-family:Georgia,serif}
.msgbox{flex:1;display:flex;align-items:center;justify-content:center;padding:10px 0}
.msg{font-size:15px;line-height:1.8;color:#2d1a06;font-style:italic;max-width:340px;font-family:Georgia,serif}
.wl{font-style:italic;font-size:11px;color:#999;letter-spacing:1px;font-family:Georgia,serif}
.sndr{font-size:16px;font-weight:700;color:#2a1a0a;margin-top:2px;font-family:Georgia,serif}
.foot{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#bfa81f;border-top:1px solid #e8d5b7;padding-top:10px;width:100%;font-family:Georgia,serif}
</style></head><body><div class="card">
<svg class="corner tl" viewBox="0 0 80 80" fill="none"><path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/><path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/><circle cx="20" cy="20" r="3" fill="#bfa81f" opacity=".5"/><text x="8" y="14" font-size="12" fill="#bfa81f" opacity=".6">✿</text></svg>
<svg class="corner tr" viewBox="0 0 80 80" fill="none"><path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/><path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/><circle cx="20" cy="20" r="3" fill="#bfa81f" opacity=".5"/></svg>
<svg class="corner bl" viewBox="0 0 80 80" fill="none"><path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/><path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/><circle cx="20" cy="20" r="3" fill="#bfa81f" opacity=".5"/></svg>
<svg class="corner br" viewBox="0 0 80 80" fill="none"><path d="M2 2 Q20 2 20 20 Q20 2 38 2" stroke="#bfa81f" stroke-width="1.5" fill="none"/><path d="M2 2 Q2 20 20 20 Q2 20 2 38" stroke="#bfa81f" stroke-width="1.5" fill="none"/><circle cx="20" cy="20" r="3" fill="#bfa81f" opacity=".5"/></svg>
<div><div class="brand">New Eco Roses</div><div class="floral">· · 🌹 · ·</div>${occasion?`<div class="occ">${occasion}</div>`:''}</div>
<div><div class="to">To,</div><div class="rec">${recipient||'You'}</div></div>
<div class="msgbox"><div class="msg">${message?message.replace(/\n/g,'<br>'):'&#8220; Wishing you a beautiful day filled with joy &amp; love &#8221;'}</div></div>
<div><div class="wl">— With love,</div><div class="sndr">${sender||'Someone Special'}</div></div>
<div class="foot">Handcrafted with love · New Eco Roses · newecoroses.com · Order #${order.orderNumber}</div>
</div></body></html>`;
    const win = window.open('', '_blank', 'width=500,height=720');
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => { win.focus(); win.print(); }, 800); }
}

// ── Main Component ────────────────────────────────────────────────
export default function StaffOrdersPage() {
    const [orders, setOrders] = useState<SavedOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'processing' | 'delivered' | 'cancelled'>('all');
    const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);
    const [addOrderOpen, setAddOrderOpen] = useState(false);
    const [staff, setStaff] = useState<StaffInfo | null>(null);
    const [checklist, setChecklist] = useState<Record<string, boolean>>({});
    const [alertOrder, setAlertOrder] = useState<SavedOrder | null>(null);
    const beepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Fetch staff session ───────────────────────────────────────
    useEffect(() => {
        fetch('/api/staff/auth').then(r => r.json()).then(d => {
            if (d.authenticated && d.staff) setStaff(d.staff);
        }).catch(() => {});
    }, []);

    const isDirector = staff?.role === 'director' || staff?.role === 'supervisor';
    const storeId = staff?.storeId;
    const storeName = storeId ? STORE_NAMES[storeId] || 'Store' : 'All Stores';

    // ── Fetch orders ──────────────────────────────────────────────
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (data.success && data.orders) setOrders(data.orders);
        } catch {}
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    // ── Live alert polling (store staff only) ─────────────────────
    useEffect(() => {
        if (isDirector || !storeId || storeId === 'director') return;

        const poll = async () => {
            try {
                const res = await fetch('/api/staff/notify');
                const data = await res.json();
                if (data.unacknowledged && data.unacknowledged.length > 0 && !alertOrder) {
                    setAlertOrder(data.unacknowledged[0]);
                    setOrders(prev => {
                        // merge new order if not in list
                        const exists = prev.find(o => o.id === data.unacknowledged[0].id);
                        if (!exists) return [data.unacknowledged[0], ...prev];
                        return prev.map(o => o.id === data.unacknowledged[0].id ? data.unacknowledged[0] : o);
                    });
                }
            } catch {}
        };

        const interval = setInterval(poll, 8000);
        poll();
        return () => clearInterval(interval);
    }, [isDirector, storeId, alertOrder]);

    // ── Beep while alert is showing ───────────────────────────────
    useEffect(() => {
        if (alertOrder) {
            beepAudio();
            beepIntervalRef.current = setInterval(() => beepAudio(), 1500);
        } else {
            if (beepIntervalRef.current) clearInterval(beepIntervalRef.current);
        }
        return () => { if (beepIntervalRef.current) clearInterval(beepIntervalRef.current); };
    }, [alertOrder]);

    // ── Acknowledge order ─────────────────────────────────────────
    const handleAcknowledge = async (order: SavedOrder) => {
        setAlertOrder(null);
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, storeAcknowledged: true, status: 'processing' } : o));
        await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order.id, storeAcknowledged: true }),
        });
        await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order.id, status: 'processing' }),
        });
    };

    // ── Assign order to store (director) ─────────────────────────
    const handleAssign = async (orderId: string, store: 'tollygunge' | 'alipore' | null) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedStore: store ?? undefined } : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, assignedStore: store ?? undefined } : null);
        await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, assignedStore: store }),
        });
    };

    // ── Status update ─────────────────────────────────────────────
    const handleUpdateStatus = (orderId: string, newStatus: SavedOrder['status']) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status: newStatus }),
        }).then(r => r.json()).then(data => {
            if (data.success && data.order) {
                setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
                if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
            }
        }).catch(() => {});
    };

    // ── Filtered orders ───────────────────────────────────────────
    const filtered = useMemo(() => {
        return orders.filter(o => {
            // Store staff: only see their assigned orders
            if (!isDirector && storeId && storeId !== 'director') {
                if (o.assignedStore !== storeId) return false;
            }
            const matchSearch =
                o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                o.customer.phone.includes(search) ||
                o.shippingAddress.city.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === 'all' || o.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [orders, search, statusFilter, isDirector, storeId]);

    const confirmedCount = filtered.filter(o => o.status === 'confirmed').length;
    const processingCount = filtered.filter(o => o.status === 'processing').length;
    const deliveredCount = filtered.filter(o => o.status === 'delivered').length;

    const getStatusBadge = (status: SavedOrder['status']) => {
        switch (status) {
            case 'confirmed': return <Badge variant="default"><Clock size={10} /> Confirmed</Badge>;
            case 'processing': return <Badge variant="info"><Truck size={10} /> In Transit</Badge>;
            case 'delivered': return <Badge variant="success"><CheckCircle2 size={10} /> Delivered</Badge>;
            case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getAssignedBadge = (order: SavedOrder) => {
        if (!order.assignedStore) return null;
        const color = order.assignedStore === 'tollygunge'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-sky-500/10 text-sky-400 border-sky-500/30';
        return (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${color}`}>
                {STORE_NAMES[order.assignedStore]}
            </span>
        );
    };

    const todayOrders = filtered.filter(o => {
        const d = new Date(o.createdAt);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    });

    return (
        <div className="space-y-6">
            {/* ── Live Alert Overlay ─────────────────────────── */}
            {alertOrder && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm">
                    <div className="animate-pulse-slow max-w-md w-full mx-4 bg-[#12141c] border-2 border-rose-500 rounded-3xl p-8 text-center shadow-2xl space-y-5">
                        <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto animate-bounce">
                            <BellRing size={28} className="text-rose-400" />
                        </div>
                        <div>
                            <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-1">🚨 New Order Assigned</p>
                            <h2 className="text-white text-2xl font-extrabold">Order #{alertOrder.orderNumber}</h2>
                            <p className="text-zinc-400 text-sm mt-1">{alertOrder.customer.name} · ₹{alertOrder.total.toLocaleString('en-IN')}</p>
                            <p className="text-zinc-500 text-xs mt-1">{alertOrder.shippingAddress.line1}, {alertOrder.shippingAddress.city}</p>
                        </div>
                        <button
                            onClick={() => handleAcknowledge(alertOrder)}
                            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                        >
                            ✓ Acknowledge &amp; Start Preparing
                        </button>
                        <p className="text-zinc-500 text-[11px]">Beeping will stop once you acknowledge</p>
                    </div>
                </div>
            )}

            {/* ── Page Header ───────────────────────────────── */}
            <PageHeader
                title="Orders & Fulfilment"
                description={isDirector ? 'All store bookings, assignment & dispatch control' : `${storeName} — Assigned orders & delivery management`}
                tag={isDirector ? 'Director View' : storeName}
            >
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                </button>

                {/* Download Today's Manifest */}
                <button
                    onClick={() => generateManifest(todayOrders, storeName)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold border border-zinc-600 transition-colors cursor-pointer"
                >
                    <FileText size={13} />
                    <span>Today's Manifest</span>
                </button>

                <button
                    onClick={() => setAddOrderOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                    <Plus size={14} className="stroke-[2.5]" />
                    <span>Add Manual Order</span>
                </button>
            </PageHeader>

            {/* ── Stats Cards ───────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { key: 'all' as const, label: 'Total Orders', count: filtered.length, icon: ShoppingBag, desc: 'All bookings' },
                    { key: 'confirmed' as const, label: 'Awaiting Prep', count: confirmedCount, icon: Clock, desc: 'Ready to prepare' },
                    { key: 'processing' as const, label: 'In Transit', count: processingCount, icon: Truck, desc: 'Out on road' },
                    { key: 'delivered' as const, label: 'Delivered', count: deliveredCount, icon: CheckCircle2, desc: 'Completed' },
                ].map(card => {
                    const isSelected = statusFilter === card.key;
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.key}
                            onClick={() => setStatusFilter(card.key)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer group shadow-xs ${
                                isSelected
                                    ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white shadow-md'
                                    : 'bg-white dark:bg-[#12141c]/90 border-zinc-200 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-zinc-700/80 text-zinc-900 dark:text-zinc-100'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>{card.label}</span>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${isSelected ? 'bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white border-transparent' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700/60'}`}>
                                    <Icon size={16} />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between gap-2">
                                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${isSelected ? 'text-white dark:text-zinc-950' : 'text-zinc-950 dark:text-white'}`}>
                                    {loading ? '—' : card.count}
                                </span>
                                <span className={`text-[11px] font-medium ${isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>{card.desc}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Orders Table ──────────────────────────────── */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle>{statusFilter === 'all' ? 'All Orders' : statusFilter === 'confirmed' ? 'Awaiting Preparation' : statusFilter === 'processing' ? 'In Transit' : statusFilter === 'delivered' ? 'Delivered' : 'Cancelled'}</CardTitle>
                        <CardDescription>Showing {filtered.length} order{filtered.length !== 1 ? 's' : ''}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search by order #, phone, name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-64"
                            />
                        </div>
                        {statusFilter !== 'all' && (
                            <button onClick={() => setStatusFilter('all')} className="text-xs text-zinc-400 hover:text-white underline px-2 cursor-pointer">Clear</button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="px-0 py-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.01] text-zinc-400 uppercase text-[10px] tracking-wider font-semibold">
                                    <th className="py-4 px-4 text-center">#</th>
                                    <th className="py-4 px-5">Order #</th>
                                    <th className="py-4 px-5">Customer & Phone</th>
                                    <th className="py-4 px-5">Delivery Location</th>
                                    <th className="py-4 px-5">Items</th>
                                    <th className="py-4 px-4 text-right">Amount</th>
                                    {isDirector && <th className="py-4 px-5">Assign Store</th>}
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    <tr><td colSpan={isDirector ? 9 : 8} className="py-12 text-center text-zinc-500">Loading orders...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={isDirector ? 9 : 8} className="py-12 text-center text-zinc-500">
                                        {!isDirector && storeId !== 'director' ? 'No orders assigned to this store yet. The director will assign orders shortly.' : 'No orders found. Click "Add Manual Order" to create one.'}
                                    </td></tr>
                                ) : (
                                    filtered.map((o, idx) => (
                                        <tr key={o.id} className={`hover:bg-white/[0.02] transition-colors ${o.storeAcknowledged === false && o.assignedStore ? 'bg-rose-500/5' : ''}`}>
                                            <td className="py-4 px-4 text-center font-mono font-bold text-zinc-400">#{idx + 1}</td>
                                            <td className="py-4 px-5 font-mono font-bold text-white">
                                                <button onClick={() => setSelectedOrder(o)} className="hover:underline cursor-pointer">{o.orderNumber}</button>
                                                <div className="mt-0.5">{getAssignedBadge(o)}</div>
                                            </td>
                                            <td className="py-4 px-5">
                                                <p className="font-semibold text-zinc-200">{o.customer.name}</p>
                                                <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono"><Phone size={10} />{o.customer.phone}</span>
                                            </td>
                                            <td className="py-4 px-5 text-zinc-300">
                                                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-zinc-500 flex-shrink-0" /><span className="truncate max-w-[180px]">{o.shippingAddress.line1}, {o.shippingAddress.city}</span></span>
                                            </td>
                                            <td className="py-4 px-5 text-zinc-300">
                                                <div className="flex flex-col gap-0.5">
                                                    {o.items.slice(0, 2).map((item, i) => <span key={i} className="truncate max-w-[200px]">{item.quantity}× {item.name}</span>)}
                                                    {o.items.length > 2 && <span className="text-[10px] text-zinc-500">+{o.items.length - 2} more</span>}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right font-bold text-white tabular-nums">₹{o.total.toLocaleString('en-IN')}</td>
                                            {isDirector && (
                                                <td className="py-4 px-5">
                                                    <select
                                                        value={o.assignedStore || ''}
                                                        onChange={e => handleAssign(o.id, (e.target.value || null) as any)}
                                                        className="px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500 cursor-pointer"
                                                    >
                                                        <option value="">Unassigned</option>
                                                        <option value="tollygunge">Tollygunge</option>
                                                        <option value="alipore">Alipore</option>
                                                    </select>
                                                </td>
                                            )}
                                            <td className="py-4 px-5">
                                                <select
                                                    value={o.status}
                                                    onChange={e => handleUpdateStatus(o.id, e.target.value as any)}
                                                    className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500 cursor-pointer"
                                                >
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="processing">In Transit</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-5 text-center">
                                                <div className="flex items-center gap-1.5 justify-center">
                                                    <button onClick={() => setSelectedOrder(o)} className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer">Details</button>
                                                    <button onClick={() => generateShippingLabel(o, storeName)} title="Print Label" className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer transition-colors"><Printer size={12} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ── Order Detail Modal ────────────────────────── */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="relative w-full max-w-lg bg-[#12141c] border border-white/[0.12] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
                                    Order #{selectedOrder.orderNumber}
                                    {getStatusBadge(selectedOrder.status)}
                                    {getAssignedBadge(selectedOrder)}
                                </h3>
                                <p className="text-xs text-zinc-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-white p-1 rounded-lg"><X size={18} /></button>
                        </div>

                        {/* Customer & Address */}
                        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                            <p className="font-bold text-zinc-200 flex items-center gap-1.5">
                                <Phone size={13} className="text-zinc-400" />
                                {selectedOrder.customer.name} · <span className="font-mono text-zinc-100">{selectedOrder.customer.phone}</span>
                            </p>
                            <p className="text-zinc-400 flex items-start gap-1.5 leading-relaxed">
                                <MapPin size={13} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                                <span>{selectedOrder.shippingAddress.line1}{selectedOrder.shippingAddress.line2 ? `, ${selectedOrder.shippingAddress.line2}` : ''}, {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.postalCode}</span>
                            </p>
                            {selectedOrder.specialNote && (
                                <p className="text-amber-300 text-[11px] bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                                    📝 {selectedOrder.specialNote}
                                </p>
                            )}
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-zinc-300">Items to Prepare:</p>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-[11px]">{item.quantity}×</div>
                                            <span className="font-semibold text-zinc-200">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-white tabular-nums">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
                            <span className="text-zinc-400">Total Order Value:</span>
                            <span className="text-base font-extrabold text-white tabular-nums">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                        </div>

                        {/* Assembly Checklist */}
                        <div className="pt-2 border-t border-white/[0.08] space-y-2">
                            <p className="text-xs font-bold text-zinc-300">🌸 Assembly Checklist</p>
                            <div className="grid grid-cols-2 gap-1.5">
                                {ASSEMBLY_CHECKLIST.map(item => {
                                    const key = `${selectedOrder.id}_${item.id}`;
                                    const checked = checklist[key] || false;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setChecklist(prev => ({ ...prev, [key]: !checked }))}
                                            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left ${checked ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                                        >
                                            {checked ? <CheckSquare size={13} className="flex-shrink-0" /> : <Square size={13} className="flex-shrink-0" />}
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Store Assignment (Director only) */}
                        {isDirector && (
                            <div className="pt-2 border-t border-white/[0.08] space-y-2">
                                <p className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5"><Store size={13} /> Assign to Store:</p>
                                <div className="flex gap-2">
                                    {[
                                        { val: null, label: 'Unassigned', color: 'bg-zinc-900 border-zinc-700 text-zinc-300' },
                                        { val: 'tollygunge', label: 'Tollygunge', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
                                        { val: 'alipore', label: 'Alipore', color: 'bg-sky-500/10 border-sky-500/30 text-sky-400' },
                                    ].map(opt => (
                                        <button
                                            key={String(opt.val)}
                                            onClick={() => handleAssign(selectedOrder.id, opt.val as any)}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                                (selectedOrder.assignedStore ?? null) === opt.val
                                                    ? opt.color + ' ring-1 ring-offset-0'
                                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Status Update */}
                        <div className="pt-2 border-t border-white/[0.08] space-y-2">
                            <p className="text-xs font-semibold text-zinc-300">Update Delivery Status:</p>
                            <div className="grid grid-cols-3 gap-2">
                                {(['confirmed', 'processing', 'delivered'] as const).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                            selectedOrder.status === s
                                                ? 'bg-white text-zinc-950 font-bold border-white'
                                                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                                        }`}
                                    >
                                        {s === 'confirmed' ? 'Confirmed' : s === 'processing' ? 'In Transit' : 'Delivered'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Print Actions */}
                        <div className="pt-2 border-t border-white/[0.08] space-y-2">
                            <p className="text-xs font-semibold text-zinc-300">Print & Download:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => generateShippingLabel(selectedOrder, storeName)}
                                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
                                >
                                    <Tag size={13} />
                                    <span>Shipping Label</span>
                                </button>
                                <button
                                    onClick={() => generateGiftCard(selectedOrder)}
                                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#bfa81f]/10 hover:bg-[#bfa81f]/20 text-[#bfa81f] text-xs font-semibold border border-[#bfa81f]/30 transition-colors cursor-pointer"
                                >
                                    <Gift size={13} />
                                    <span>Gift Card</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Order Modal */}
            <AddOrderModal
                open={addOrderOpen}
                onClose={() => setAddOrderOpen(false)}
                onOrderCreated={() => fetchOrders()}
            />
        </div>
    );
}
