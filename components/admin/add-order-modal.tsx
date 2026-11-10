'use client';

import React, { useState, useEffect } from 'react';
import {
    X,
    ShoppingBag,
    User,
    Phone,
    MapPin,
    IndianRupee,
    Plus,
    Trash2,
    Check,
    MessageSquare,
    Store,
    Calendar,
    FileText
} from 'lucide-react';
import { PRODUCTS } from '@/lib/products';

interface AddOrderModalProps {
    open: boolean;
    onClose: () => void;
    onOrderCreated: () => void;
    staffName?: string;
}

interface OrderLineItem {
    name: string;
    price: number;
    quantity: number;
}

export function AddOrderModal({ open, onClose, onOrderCreated, staffName }: AddOrderModalProps) {
    const [orderSource, setOrderSource] = useState<'whatsapp' | 'in-store'>('whatsapp');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
    const [addressLine, setAddressLine] = useState('');
    const [city, setCity] = useState('Kolkata');
    const [postalCode, setPostalCode] = useState('700001');

    const [items, setItems] = useState<OrderLineItem[]>([
        { name: 'Red Rose Bouquet', price: 1499, quantity: 1 }
    ]);

    const [paymentMethod, setPaymentMethod] = useState('UPI / GPay');
    const [orderStatus, setOrderStatus] = useState<'confirmed' | 'processing' | 'delivered'>('confirmed');
    const [notes, setNotes] = useState('');

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const addItem = () => {
        setItems(prev => [...prev, { name: 'Pink Roses Bouquet', price: 1299, quantity: 1 }]);
    };

    const updateItem = (index: number, field: keyof OrderLineItem, value: any) => {
        setItems(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(prev => prev.filter((_, i) => i !== index));
        }
    };

    const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!customerName.trim() || !customerPhone.trim()) {
            setError('Please provide customer name and phone number.');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({
                        id: 'item_' + Date.now() + Math.random().toString(36).slice(2, 5),
                        name: i.name,
                        price: Number(i.price),
                        quantity: Number(i.quantity) || 1,
                    })),
                    customer: {
                        name: customerName.trim(),
                        phone: customerPhone.trim(),
                        email: customerEmail.trim() || '',
                    },
                    shippingAddress: {
                        line1: deliveryType === 'pickup' ? 'Store Pickup (Boutique Counter)' : addressLine.trim() || 'Kolkata Address',
                        city: city.trim() || 'Kolkata',
                        state: 'West Bengal',
                        postalCode: postalCode.trim() || '700001',
                    },
                    specialNote: notes ? `[Source: ${orderSource === 'whatsapp' ? 'WhatsApp Order' : 'In-Store Walk-in'}] ${notes}` : `[Source: ${orderSource === 'whatsapp' ? 'WhatsApp Order' : 'In-Store Walk-in'}]`,
                    paymentMethod: `${paymentMethod} (${orderSource === 'whatsapp' ? 'WhatsApp' : 'Store'})`,
                    status: orderStatus,
                    staffName: staffName || 'Staff Member',
                }),
            });

            const data = await res.json();
            if (data.success) {
                onOrderCreated();
                onClose();
            } else {
                setError(data.error || 'Failed to create order');
            }
        } catch (err: any) {
            setError(err.message || 'Server error creating order');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-[#12141c] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#151824]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-bold">
                            <ShoppingBag size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                Create Customer Order
                                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
                                    Manual Entry
                                </span>
                            </h2>
                            <p className="text-xs text-zinc-400">
                                Book orders for WhatsApp enquiries &amp; in-store boutique walk-ins
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                            {error}
                        </div>
                    )}

                    {/* Source Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Order Channel</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setOrderSource('whatsapp')}
                                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                    orderSource === 'whatsapp'
                                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold'
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                            >
                                <MessageSquare size={14} className="text-[#25D366]" />
                                <span>WhatsApp Order</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setOrderSource('in-store')}
                                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                    orderSource === 'in-store'
                                        ? 'bg-white text-zinc-950 font-bold border-white'
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                            >
                                <Store size={14} />
                                <span>In-Store Walk-In</span>
                            </button>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                Customer Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Sourav Ganguly"
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                Customer Phone <span className="text-rose-400">*</span>
                            </label>
                            <input
                                required
                                type="tel"
                                placeholder="+91 98300 12345"
                                value={customerPhone}
                                onChange={e => setCustomerPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                            />
                        </div>
                    </div>

                    {/* Delivery Options */}
                    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-200">Delivery or Pickup</span>
                            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl text-xs border border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setDeliveryType('delivery')}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                        deliveryType === 'delivery' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    Home Delivery
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliveryType('pickup')}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                        deliveryType === 'pickup' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    Store Pickup
                                </button>
                            </div>
                        </div>

                        {deliveryType === 'delivery' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-[11px] text-zinc-400 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        placeholder="Flat, building, street, area..."
                                        value={addressLine}
                                        onChange={e => setAddressLine(e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-zinc-400 mb-1">City / Region</label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Ordered Items */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-zinc-300">Bouquets &amp; Products</label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-xs text-white hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                                <Plus size={12} />
                                <span>Add Item</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Bouquet / Product name..."
                                        value={item.name}
                                        onChange={e => updateItem(idx, 'name', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                                    />
                                    <div className="w-24 relative">
                                        <IndianRupee size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={item.price}
                                            onChange={e => updateItem(idx, 'price', e.target.value)}
                                            className="w-full pl-6 pr-2 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white tabular-nums focus:outline-none focus:border-zinc-500"
                                        />
                                    </div>
                                    <div className="w-16">
                                        <input
                                            type="number"
                                            min={1}
                                            placeholder="Qty"
                                            value={item.quantity}
                                            onChange={e => updateItem(idx, 'quantity', e.target.value)}
                                            className="w-full px-2 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white text-center tabular-nums focus:outline-none focus:border-zinc-500"
                                        />
                                    </div>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="p-2 text-zinc-500 hover:text-rose-400 cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Payment Method</label>
                            <select
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value)}
                                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500"
                            >
                                <option value="UPI / GPay">UPI / GPay / PhonePe</option>
                                <option value="Cash on Counter">Cash on Counter</option>
                                <option value="WhatsApp Pay">WhatsApp Pay</option>
                                <option value="Card (POS Machine)">Debit / Credit Card (POS)</option>
                                <option value="Pay on Delivery">Cash on Delivery</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Initial Status</label>
                            <select
                                value={orderStatus}
                                onChange={e => setOrderStatus(e.target.value as any)}
                                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-500"
                            >
                                <option value="confirmed">Confirmed (Ready to prepare)</option>
                                <option value="processing">In Transit (Out for delivery)</option>
                                <option value="delivered">Delivered (Completed)</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Special Note / Card Message</label>
                        <textarea
                            rows={2}
                            placeholder="Recipient message, delivery time preference..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                        <div>
                            <span className="text-xs text-zinc-400">Total Order Amount:</span>
                            <p className="text-lg font-extrabold text-white tabular-nums">
                                ₹{totalAmount.toLocaleString('en-IN')}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={14} />
                                        <span>Confirm Order</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
