'use client';

import { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/section-header';
import WhatsAppFloat from '@/components/ui/whatsapp-float';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import WhatsappIcon from '@/components/ui/whatsapp-icon';
import { fetchWhatsappSettings, fetchAllSettings } from '@/lib/supabase';

const FALLBACK_PHONE = '919936911611';
const FALLBACK_MSG = "Hi, I'd like to enquire about a gift.";

export default function Contact() {
    const [waLink, setWaLink] = useState(`https://wa.me/${FALLBACK_PHONE}?text=${encodeURIComponent(FALLBACK_MSG)}`);
    const [storeAddress, setStoreAddress] = useState('140/1/306, Netaji Subhash Chandra Bose Rd, near RUPAYAN JEWELLERY, Regent Colony, Regent Park, Kolkata, West Bengal 700040');
    const [phoneDisplay, setPhoneDisplay] = useState('+91 99369 11611');
    const [deliveryCutoff, setDeliveryCutoff] = useState('5 PM');
    const [deliveryRadius, setDeliveryRadius] = useState('10');

    useEffect(() => {
        fetchWhatsappSettings().then(s => {
            if (s) {
                const phone = s.phone_number ?? FALLBACK_PHONE;
                const msg = s.default_message ?? FALLBACK_MSG;
                setWaLink(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
                // Format display number
                if (phone.startsWith('91') && phone.length === 12) {
                    const digits = phone.slice(2);
                    setPhoneDisplay(`+91 ${digits.slice(0, 5)} ${digits.slice(5)}`);
                } else {
                    setPhoneDisplay(`+${phone}`);
                }
            }
        }).catch(() => { });

        fetchAllSettings().then(settings => {
            if (settings['store_address']) setStoreAddress(settings['store_address']);
            if (settings['delivery_cutoff_time']) setDeliveryCutoff(settings['delivery_cutoff_time']);
            if (settings['delivery_radius_km']) setDeliveryRadius(settings['delivery_radius_km']);
        }).catch(() => { });
    }, []);

    const CONTACT_INFO = [
        {
            icon: <MapPin size={22} />,
            title: 'Visit Our Store',
            lines: storeAddress.split(',').map(s => s.trim()).reduce<string[][]>((acc, part, i) => {
                if (i % 2 === 0) acc.push([part]);
                else acc[acc.length - 1].push(part);
                return acc;
            }, []).map(g => g.join(', ')),
        },
        {
            icon: <Phone size={22} />,
            title: 'Call Us',
            lines: [phoneDisplay],
        },
        {
            icon: <Mail size={22} />,
            title: 'Email Us',
            lines: ['newecoroses@gmail.com'],
        },
        {
            icon: <Clock size={22} />,
            title: 'Business Hours',
            lines: ['Mon – Sat: 9:00 AM – 9:00 PM', 'Sun: 10:00 AM – 6:00 PM'],
        },
    ];

    return (
        <div className="pt-32 pb-20 bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    label="Get in Touch"
                    title="We'd Love to Hear From You"
                    subtitle="Visit our store, call us, or simply message on WhatsApp for the quickest response."
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-12">
                    {/* Contact Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {CONTACT_INFO.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="flex gap-5 p-6 bg-white rounded-xl shadow-soft"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg text-foreground mb-1">{item.title}</h3>
                                    {item.lines.map((line, i) => (
                                        <p key={i} className="text-muted text-sm font-light">{line}</p>
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        {/* WhatsApp CTA */}
                        <motion.a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-semibold hover:bg-[#1fb855] transition-all shadow-lg shadow-green-500/15"
                        >
                            <WhatsappIcon size={20} />
                            Message on WhatsApp
                        </motion.a>
                    </div>

                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="lg:col-span-3 h-[400px] lg:h-auto bg-secondary rounded-2xl overflow-hidden shadow-soft"
                    >
                        <iframe
                            src="https://maps.google.com/maps?q=22.4855973,88.3518101&z=15&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: 400 }}
                            allowFullScreen
                            loading="lazy"
                            title="New Eco Roses Store Location"
                        />
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
                    <p className="font-serif text-xl text-foreground mb-2">🌹 Same-Day Delivery Available</p>
                    <p className="text-muted text-sm font-light max-w-md mx-auto">
                        Order before {deliveryCutoff} for guaranteed same-day delivery within our {deliveryRadius} km service radius in Kolkata.
                    </p>
                </motion.div>
            </div>

            <WhatsAppFloat />
        </div>
    );
}
