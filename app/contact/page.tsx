'use client';

import { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/section-header';
import WhatsAppFloat from '@/components/ui/whatsapp-float';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { fetchWhatsappSettings, fetchAllSettings } from '@/lib/supabase';

const FALLBACK_PHONE = '919936911611';
const SECONDARY_PHONE = '+91 91995 01655';
const FALLBACK_MSG = "Hi, I'd like to enquire about a gift.";

const STORES = [
    {
        id: 'outlet1',
        name: 'Outlet 1 — Regent Park (Main Store)',
        shortName: 'Outlet 1 (Regent Park)',
        address: '140/1/306, Netaji Subhash Chandra Bose Rd, near RUPAYAN JEWELLERY, Regent Colony, Regent Park, Kolkata, West Bengal 700040',
        mapEmbedUrl: 'https://maps.google.com/maps?q=22.4855973,88.3518101&z=15&output=embed',
        mapDirectUrl: 'https://maps.google.com/?q=140/1/306,+Netaji+Subhash+Chandra+Bose+Rd,+Kolkata+700040',
    },
    {
        id: 'outlet2',
        name: 'Outlet 2 — New Alipore',
        shortName: 'Outlet 2 (New Alipore)',
        address: '92/C/1, BL-J, Sahapur, New Alipore, Kolkata, West Bengal 700053',
        mapEmbedUrl: 'https://maps.google.com/maps?q=92/C/1,+BL-J,+Sahapur,+New+Alipore,+Kolkata,+West+Bengal+700053&z=15&output=embed',
        mapDirectUrl: 'https://maps.app.goo.gl/iGyTCXfQG8oEZmv57',
    },
];

export default function Contact() {
    const [waLink, setWaLink] = useState(`https://wa.me/${FALLBACK_PHONE}?text=${encodeURIComponent(FALLBACK_MSG)}`);
    const [primaryPhoneDisplay, setPrimaryPhoneDisplay] = useState('+91 99369 11611');
    const [deliveryCutoff, setDeliveryCutoff] = useState('5 PM');
    const [deliveryRadius, setDeliveryRadius] = useState('10');
    const [selectedOutlet, setSelectedOutlet] = useState(0);

    useEffect(() => {
        fetchWhatsappSettings().then(s => {
            if (s) {
                const phone = s.phone_number ?? FALLBACK_PHONE;
                const msg = s.default_message ?? FALLBACK_MSG;
                setWaLink(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
                if (phone.startsWith('91') && phone.length === 12) {
                    const digits = phone.slice(2);
                    setPrimaryPhoneDisplay(`+91 ${digits.slice(0, 5)} ${digits.slice(5)}`);
                } else {
                    setPrimaryPhoneDisplay(`+${phone}`);
                }
            }
        }).catch(() => { });

        fetchAllSettings().then(settings => {
            if (settings['delivery_cutoff_time']) setDeliveryCutoff(settings['delivery_cutoff_time']);
            if (settings['delivery_radius_km']) setDeliveryRadius(settings['delivery_radius_km']);
        }).catch(() => { });
    }, []);

    const activeStore = STORES[selectedOutlet];

    return (
        <div className="pt-32 pb-20 bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    label="Get in Touch"
                    title="We'd Love to Hear From You"
                    subtitle="Visit our store outlets, call us, or message on WhatsApp for the quickest response."
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-12">
                    {/* Contact Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Outlet 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="flex gap-5 p-6 bg-white rounded-xl shadow-soft border border-primary/5 hover:border-primary/20 transition-all"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                <MapPin size={22} />
                            </div>
                            <div className="flex-1">
                                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block mb-0.5">Outlet 1 — Regent Park</span>
                                <h3 className="font-serif text-lg text-foreground mb-1">Main Store</h3>
                                <p className="text-muted text-sm font-light leading-relaxed">
                                    140/1/306, Netaji Subhash Chandra Bose Rd, near RUPAYAN JEWELLERY, Regent Colony, Regent Park, Kolkata, West Bengal 700040
                                </p>
                            </div>
                        </motion.div>

                        {/* Outlet 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex gap-5 p-6 bg-white rounded-xl shadow-soft border border-primary/5 hover:border-primary/20 transition-all"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                <MapPin size={22} />
                            </div>
                            <div className="flex-1">
                                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block mb-0.5">Outlet 2 — New Alipore</span>
                                <h3 className="font-serif text-lg text-foreground mb-1">New Outlet</h3>
                                <p className="text-muted text-sm font-light leading-relaxed mb-2">
                                    92/C/1, BL-J, Sahapur, New Alipore, Kolkata, West Bengal 700053
                                </p>
                                <a
                                    href="https://maps.app.goo.gl/iGyTCXfQG8oEZmv57"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                                >
                                    <ExternalLink size={13} />
                                    Open in Google Maps
                                </a>
                            </div>
                        </motion.div>

                        {/* Call Us */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="flex gap-5 p-6 bg-white rounded-xl shadow-soft"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                <Phone size={22} />
                            </div>
                            <div>
                                <h3 className="font-serif text-lg text-foreground mb-1">Call Us</h3>
                                <p className="text-muted text-sm font-light">
                                    Primary: <a href={`tel:${primaryPhoneDisplay.replace(/\s+/g, '')}`} className="text-foreground font-medium hover:text-primary transition-colors">{primaryPhoneDisplay}</a>
                                </p>
                                <p className="text-muted text-sm font-light mt-0.5">
                                    Secondary: <a href="tel:+919199501655" className="text-foreground font-medium hover:text-primary transition-colors">{SECONDARY_PHONE}</a>
                                </p>
                            </div>
                        </motion.div>

                        {/* Email & Business Hours */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            <div className="p-5 bg-white rounded-xl shadow-soft flex items-start gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-base text-foreground mb-0.5">Email</h4>
                                    <a href="mailto:newecoroses@gmail.com" className="text-muted text-xs font-light hover:text-primary transition-colors block truncate">
                                        newecoroses@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="p-5 bg-white rounded-xl shadow-soft flex items-start gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-base text-foreground mb-0.5">Hours</h4>
                                    <p className="text-muted text-xs font-light">Mon–Sat: 9AM–9PM</p>
                                    <p className="text-muted text-xs font-light">Sun: 10AM–6PM</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* WhatsApp CTA */}
                        <motion.a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            viewport={{ once: true }}
                            className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-semibold hover:bg-[#1fb855] transition-all shadow-lg shadow-green-500/15"
                        >
                            <WhatsappIcon size={20} />
                            Message on WhatsApp
                        </motion.a>
                    </div>

                    {/* Interactive Map View */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="lg:col-span-3 flex flex-col bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100"
                    >
                        {/* Outlet Selector Tabs */}
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex gap-2">
                                {STORES.map((store, idx) => (
                                    <button
                                        key={store.id}
                                        onClick={() => setSelectedOutlet(idx)}
                                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                                            selectedOutlet === idx
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'bg-white text-muted hover:text-foreground border border-gray-200'
                                        }`}
                                    >
                                        {store.shortName}
                                    </button>
                                ))}
                            </div>
                            <a
                                href={activeStore.mapDirectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-foreground hover:text-primary hover:border-primary transition-all"
                            >
                                <ExternalLink size={13} />
                                View on Google Maps
                            </a>
                        </div>

                        {/* Map iframe */}
                        <div className="relative flex-1 min-h-[400px] lg:min-h-[480px]">
                            <iframe
                                key={activeStore.id}
                                src={activeStore.mapEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: 400 }}
                                allowFullScreen
                                loading="lazy"
                                title={`${activeStore.name} Location`}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Delivery Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center py-10 px-8 bg-blush rounded-2xl"
                >
                    <p className="font-serif text-xl text-foreground mb-2">🌹 Same-Day Delivery Available across Kolkata</p>
                    <p className="text-muted text-sm font-light max-w-md mx-auto">
                        Order before {deliveryCutoff} for guaranteed same-day delivery from our Regent Park or New Alipore outlets within our {deliveryRadius} km service radius.
                    </p>
                </motion.div>
            </div>

            <WhatsAppFloat />
        </div>
    );
}

