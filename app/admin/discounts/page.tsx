'use client';

import React, { useState } from 'react';
import { Tag, Copy, Ticket, Percent, IndianRupee, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card';
import { Badge } from '@/components/admin/ui/badge';
import { AVAILABLE_COUPONS, type Coupon } from '@/lib/coupons';

export default function AdminDiscountsPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(code);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Discounts & Coupons"
                description="Manage promo codes and discount rules for the storefront"
                tag="E-Commerce"
            />

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Coupons', value: AVAILABLE_COUPONS.length, icon: Ticket },
                    { label: 'Active Codes', value: AVAILABLE_COUPONS.length, icon: CheckCircle2 },
                    { label: 'Percent Discounts', value: AVAILABLE_COUPONS.filter(c => c.type === 'percent').length, icon: Percent },
                    { label: 'Fixed Discounts', value: AVAILABLE_COUPONS.filter(c => c.type === 'fixed').length, icon: IndianRupee },
                ].map(item => (
                    <Card key={item.label}>
                        <CardContent className="flex items-center gap-4 py-5">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 flex-shrink-0">
                                <item.icon size={18} className="text-zinc-200" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium">{item.label}</p>
                                <p className="text-2xl font-bold text-white tabular-nums">{item.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Coupons Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Coupon Codes</CardTitle>
                    <CardDescription>All promo codes available to customers at checkout</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                        {AVAILABLE_COUPONS.map((coupon) => (
                            <div
                                key={coupon.code}
                                className="p-5 rounded-2xl bg-[#0f1118] border border-white/[0.08] hover:border-zinc-700 transition-all group"
                            >
                                {/* Code Row */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Tag size={14} className="text-zinc-400" />
                                        <code className="text-sm font-black text-white tracking-widest font-mono">
                                            {coupon.code}
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(coupon.code)}
                                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                                        title="Copy code"
                                    >
                                        {copied === coupon.code ? (
                                            <CheckCircle2 size={14} className="text-emerald-400" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{coupon.description}</p>

                                {/* Details */}
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="default">
                                        {coupon.type === 'percent' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}
                                    </Badge>
                                    {coupon.minOrder && (
                                        <Badge variant="secondary">
                                            Min ₹{coupon.minOrder.toLocaleString('en-IN')}
                                        </Badge>
                                    )}
                                    {coupon.maxDiscount && (
                                        <Badge variant="secondary">
                                            Max ₹{coupon.maxDiscount.toLocaleString('en-IN')} off
                                        </Badge>
                                    )}
                                    <Badge variant="success">Active</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Info Note */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                <p className="font-semibold text-zinc-300 mb-1">ℹ️ Managing Coupons</p>
                <p>Coupon codes are defined in <code className="font-mono text-zinc-200">lib/coupons.ts</code>. To add, edit, or disable a coupon, update that file and redeploy. Each coupon validates minimum order amounts and maximum discount caps automatically at checkout.</p>
            </div>
        </div>
    );
}
