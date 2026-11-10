'use client';

import React, { useState } from 'react';
import {
    BookOpen,
    LayoutDashboard,
    ShoppingBag,
    Package,
    BarChart3,
    Users,
    Clock,
    Star,
    CheckCircle,
    AlertTriangle,
    Mail,
    ChevronDown,
    ChevronRight,
    Info,
    Zap,
    Shield,
    HeartHandshake,
} from 'lucide-react';

interface Section {
    id: string;
    icon: React.ElementType;
    title: string;
    color: string;
    summary: string;
    steps: { heading: string; body: string }[];
}

const SECTIONS: Section[] = [
    {
        id: 'dashboard',
        icon: LayoutDashboard,
        title: 'Dashboard',
        color: 'text-blue-500',
        summary: 'Your central overview. See today\'s revenue, pending orders, quick stats, and live activity all at a glance.',
        steps: [
            { heading: 'Stats Cards', body: 'The top row shows today\'s total revenue, number of orders, pending fulfilments, and total products. These update automatically.' },
            { heading: 'Recent Orders', body: 'Scroll down to see the latest orders placed. Click any order to view its full details.' },
            { heading: 'Analytics Snapshot', body: 'A line graph shows WhatsApp enquiries, website visits, and other key metrics over time. Hover over points to read exact values.' },
        ],
    },
    {
        id: 'orders',
        icon: ShoppingBag,
        title: 'Orders and Deliveries',
        color: 'text-orange-500',
        summary: 'Track, manage, and update every order. You can also create new orders for walk-in or WhatsApp customers.',
        steps: [
            { heading: 'Viewing Orders', body: 'All orders are listed with an order number (#001, #002, ...), customer name, amount, and current status. The most recent orders appear at the top.' },
            { heading: 'Filtering by Status', body: 'Click the status tabs (All, Confirmed, Processing, Delivered, Cancelled) to filter the list to what you need.' },
            { heading: 'Updating Order Status', body: 'Click on any order card to open its detail view. Use the "Update Status" dropdown to move it from Confirmed to Out for Delivery to Delivered. Changes are saved and logged instantly.' },
            { heading: 'Creating a Manual Order', body: 'Click the "Add Order" button (top right). Fill in the customer\'s name, phone, address, and select the products they ordered. This is used for walk-in customers or WhatsApp orders.' },
            { heading: 'Order Numbering', body: 'Orders are numbered sequentially starting from #1. Every new order, whether placed online or manually, continues the sequence.' },
        ],
    },
    {
        id: 'customers',
        icon: Users,
        title: 'Customers and Reception',
        color: 'text-purple-500',
        summary: 'Register walk-in customers, log their purchases, and send a welcome discount email, all from one place.',
        steps: [
            { heading: 'Adding a Customer', body: 'Click "Add Customer". Enter the customer\'s name and phone number (required). Email, Date of Birth, and special occasions like a Wedding Anniversary are optional but useful for future greetings.' },
            { heading: 'Logging a Purchase', body: 'In the "What did they buy?" field, start typing a product name. Matching suggestions appear from the live product catalogue. Select the right one. You can also note how much they spent.' },
            { heading: 'Welcome Email', body: 'When you save a new customer, the system is set up to automatically send them a welcome email saying "Thank you for shopping with New Eco Roses. Enjoy 15% off on your next online order." Email API keys will be added by the developer. The structure is already in place.' },
            { heading: 'Existing Customers', body: 'All registered customers appear in the table with their total visits, spend, and last order status. You can search by name, phone, or city.' },
        ],
    },
    {
        id: 'products',
        icon: Package,
        title: 'Products and Best Picks',
        color: 'text-green-500',
        summary: 'View all products, set prices, hide or show items on the website, and manage the 12-slot "Our Best Picks" featured section.',
        steps: [
            { heading: 'Product List', body: 'Every product is numbered from #1 upwards. The list shows the product name, collection, current price, visibility status, and whether it is featured.' },
            { heading: 'Setting a Price', body: 'Click the edit (pencil) icon on any product row. Type in the new price and save. The updated price appears instantly on the live website.' },
            { heading: 'Hiding a Product', body: 'Toggle the "Visible" switch on a product to hide it from the website without deleting it. It stays in your system but customers cannot see it. Toggle again to make it visible.' },
            { heading: 'Our Best Picks (12 Slots)', body: 'Go to the "Our Best Picks" tab. You will see 12 slots. Each slot can hold one featured product. Click "Change" on any slot to search for a product and replace it. This section is shown prominently on the homepage.' },
            { heading: 'Note on Adding Products', body: 'Staff cannot upload new products or change product images. That is handled by the Admin. You can only update prices and visibility.' },
        ],
    },
    {
        id: 'analytics',
        icon: BarChart3,
        title: 'Analytics',
        color: 'text-cyan-500',
        summary: 'Understand how the store is performing, including traffic, enquiries, orders over time, and more.',
        steps: [
            { heading: 'Traffic Overview', body: 'See how many people visited the website each day. The chart shows unique visitors and page views side by side.' },
            { heading: 'WhatsApp Enquiries', body: 'Every time a customer clicks "Enquire on WhatsApp" on a product, it is counted and shown here as a green line on the graph.' },
            { heading: 'Revenue and Orders', body: 'Revenue and order count over time help you understand peak days and slow periods, useful for planning stock and staff.' },
            { heading: 'Monthly Reports', body: 'Use the month selector to view data for any past month. All reports are read-only; you cannot edit analytics data.' },
        ],
    },
    {
        id: 'activity',
        icon: Clock,
        title: 'Activity Log',
        color: 'text-zinc-400',
        summary: 'A full audit trail of everything that happens: order changes, product edits, customer additions, and logins.',
        steps: [
            { heading: 'What is Logged', body: 'Every action is recorded: orders created or updated, prices changed, products hidden or shown, customers added, Best Picks changed, and logins or logouts.' },
            { heading: 'Who Did What', body: 'Each entry shows the staff member\'s name, the time, and a description of what was done. This creates full accountability.' },
            { heading: 'Read-Only', body: 'The activity log cannot be edited or deleted. It is a permanent record for the owner and administrator to review.' },
        ],
    },
];

const TIPS = [
    { icon: Zap, text: 'Always update an order status as soon as it ships or is delivered. This keeps the dashboard accurate.' },
    { icon: Shield, text: 'Never share your staff login credentials with anyone. Each person should have their own account.' },
    { icon: Star, text: 'Keep the Best Picks section fresh. Rotate featured products regularly to highlight seasonal or popular items.' },
    { icon: HeartHandshake, text: 'Register every walk-in customer. Even a name and phone number helps build long-term relationships.' },
];

export default function StaffGuidePage() {
    const [expanded, setExpanded] = useState<string | null>('dashboard');

    const toggle = (id: string) => setExpanded(prev => (prev === id ? null : id));

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-16">

            {/* Hero Header */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-950 dark:bg-[#0f1118] border border-white/[0.08] p-8 sm:p-10">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
                            <BookOpen size={22} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Staff Portal</p>
                            <h1 className="text-xl font-extrabold text-white leading-tight">User Guide</h1>
                        </div>
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">
                        Welcome to the <span className="text-white font-semibold">New Eco Roses Staff Portal</span>. This guide walks you through every section of the portal so you can confidently manage orders, customers, products, and more. Read through each section and reach out to the developer if something is not working.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        {SECTIONS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    setExpanded(s.id);
                                    setTimeout(() => document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/[0.08] text-xs text-zinc-300 hover:text-white font-semibold transition-all cursor-pointer"
                            >
                                <s.icon size={12} />
                                {s.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="grid sm:grid-cols-2 gap-3">
                {TIPS.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06]">
                        <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <tip.icon size={14} className="text-zinc-600 dark:text-zinc-300" />
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{tip.text}</p>
                    </div>
                ))}
            </div>

            {/* Section Accordions */}
            <div className="space-y-3">
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest px-1">Portal Sections - Detailed Guide</p>

                {SECTIONS.map(section => {
                    const isOpen = expanded === section.id;
                    const Icon = section.icon;
                    return (
                        <div
                            key={section.id}
                            id={`section-${section.id}`}
                            className="rounded-2xl bg-white dark:bg-[#0f1118] border border-zinc-200 dark:border-white/[0.07] overflow-hidden transition-all"
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => toggle(section.id)}
                                className="w-full flex items-center gap-4 p-5 text-left hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                            >
                                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center flex-shrink-0">
                                    <Icon size={17} className={section.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{section.title}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug line-clamp-1">{section.summary}</p>
                                </div>
                                {isOpen
                                    ? <ChevronDown size={16} className="text-zinc-400 flex-shrink-0" />
                                    : <ChevronRight size={16} className="text-zinc-400 flex-shrink-0" />
                                }
                            </button>

                            {/* Accordion Body */}
                            {isOpen && (
                                <div className="border-t border-zinc-100 dark:border-white/[0.05] px-5 pb-6 pt-5 space-y-5">
                                    {/* Summary pill */}
                                    <div className="flex items-start gap-2 p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                                        <Info size={13} className="text-zinc-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{section.summary}</p>
                                    </div>

                                    {/* Steps */}
                                    <div className="space-y-4">
                                        {section.steps.map((step, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[11px] font-extrabold flex-shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    {idx < section.steps.length - 1 && (
                                                        <div className="w-[1px] flex-1 bg-zinc-200 dark:bg-zinc-700/60 mt-1" />
                                                    )}
                                                </div>
                                                <div className="pb-4">
                                                    <p className="text-xs font-bold text-zinc-900 dark:text-white mb-1">{step.heading}</p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.body}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* What Staff Can Do */}
            <div className="rounded-3xl bg-white dark:bg-[#0f1118] border border-zinc-200 dark:border-white/[0.07] overflow-hidden">
                <div className="p-6 border-b border-zinc-100 dark:border-white/[0.05]">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Permissions Reference</p>
                    <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">What You Can Do</h2>
                </div>
                <div className="p-6 grid sm:grid-cols-2 gap-3">
                    {[
                        'View dashboard stats and live activity',
                        'View, update, and create orders',
                        'Change order status (Confirmed to Delivered)',
                        'Add walk-in and WhatsApp customers',
                        'Set or update product prices',
                        'Hide or show products on the website',
                        'Manage the 12-slot Best Picks section',
                        'View analytics and reports',
                        'View the full activity log',
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                            <CheckCircle size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Common Issues */}
            <div className="rounded-3xl bg-white dark:bg-[#0f1118] border border-zinc-200 dark:border-white/[0.07] p-6 space-y-4">
                <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Troubleshooting</p>
                    <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">Common Issues and Fixes</h2>
                </div>
                <div className="space-y-3">
                    {[
                        { q: 'The page shows a loading spinner and does not load', a: 'Try refreshing the page. If it persists, log out and log back in. This usually happens if your session has expired.' },
                        { q: 'An order status will not save', a: 'Check your internet connection. If the connection is fine, try refreshing and updating the status again. If it still fails, note down the order number and contact the developer.' },
                        { q: 'A product price update is not reflecting on the website', a: 'Wait up to 60 seconds as the website caches data briefly. If it still has not updated after a minute, try saving the price again.' },
                        { q: 'The Best Picks section is not showing my changes', a: 'Scroll to the bottom of the Best Picks tab and ensure you clicked "Save" after making changes. If the slot still appears wrong, contact the developer.' },
                        { q: 'I cannot log in to the Staff Portal', a: 'Double-check your username and password as they are case-sensitive. If you have forgotten your password, ask the Admin or the developer to reset it.' },
                    ].map((item, i) => (
                        <div key={i} className="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/15">
                            <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-zinc-900 dark:text-white mb-1">{item.q}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Developer Card */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-950 dark:bg-[#080910] border border-white/[0.08] p-8">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/[0.015] rounded-full blur-3xl translate-y-1/2 translate-x-1/4 pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-black text-white font-serif">AC</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">System Architect and Lead Developer</p>
                        <h3 className="text-xl font-extrabold text-white mb-1">Aditya Choudhury</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                            Designed and built the entire New Eco Roses platform, from the customer-facing storefront to this staff portal. If you encounter a bug, something is broken, or you need a new feature, reach out directly.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <a
                                href="https://mail.google.com/mail/?view=cm&to=syncwithadi@gmail.com&su=Staff%20Portal%20Support%20Request&body=Hi%20Aditya%2C%0A%0AI%20am%20reaching%20out%20regarding%20an%20issue%20with%20the%20New%20Eco%20Roses%20Staff%20Portal.%0A%0ADetails%3A"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-900 text-xs font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
                            >
                                <Mail size={13} />
                                Email the Developer
                            </a>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-300 text-xs font-semibold">
                                <Shield size={13} />
                                syncwithadi@gmail.com
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <div className="relative z-10 mt-6 pt-5 border-t border-white/[0.06] text-[11px] text-zinc-600 leading-relaxed">
                    When reporting an issue, please include: <span className="text-zinc-400">your name, the date and time, the page where the issue occurred, and a brief description of what happened.</span> This helps resolve issues faster.
                </div>
            </div>

        </div>
    );
}
