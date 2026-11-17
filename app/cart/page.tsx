'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    ChevronDown,
    ChevronUp,
    ChevronRight,
    MapPin,
    Calendar,
    X,
    Plus,
    Check,
    Tag,
    CreditCard,
    FileText,
    ArrowRight,
    ShoppingBag,
    Gift,
    Heart,
    Sparkles,
    Zap,
    Clock
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { ADDON_ITEMS } from '@/lib/addons';
import { AVAILABLE_COUPONS, calculateDiscount, Coupon } from '@/lib/coupons';
import DeliveryLocationModal from '@/components/ui/delivery-location-modal';
import AuthDrawer from '@/components/cart/auth-drawer';

interface OccasionOption {
    id: string;
    label: string;
    emoji: string;
    title: string;
    suggestionIds: string[];
}

const OCCASIONS: OccasionOption[] = [
    {
        id: 'birthday',
        label: 'Birthday',
        emoji: '??',
        title: 'Birthday Celebration',
        suggestionIds: ['addon-truffle-cake', 'addon-birthday-topper', 'addon-card-occasion', 'addon-chocolate-combo'],
    },
    {
        id: 'anniversary',
        label: 'Anniversary',
        emoji: '??',
        title: 'Anniversary Special',
        suggestionIds: ['addon-scented-candle', 'addon-ferrero-box', 'addon-strawberry-cake', 'addon-card-occasion'],
    },
    {
        id: 'romance',
        label: 'Romance & Love',
        emoji: '??',
        title: 'Love & Romance',
        suggestionIds: ['addon-plush-teddy', 'addon-ferrero-box', 'addon-scented-candle', 'addon-card-occasion'],
    },
    {
        id: 'wedding',
        label: 'Wedding / Engagement',
        emoji: '??',
        title: 'Wedding & Engagement',
        suggestionIds: ['addon-scented-candle', 'addon-butterscotch-cake', 'addon-card-occasion', 'addon-ferrero-box'],
    },
    {
        id: 'congratulations',
        label: 'Congratulations',
        emoji: '??',
        title: 'Congratulations',
        suggestionIds: ['addon-butterscotch-cake', 'addon-lucky-bamboo', 'addon-chocolate-combo', 'addon-card-occasion'],
    },
    {
        id: 'get-well',
        label: 'Get Well Soon',
        emoji: '??',
        title: 'Get Well Soon',
        suggestionIds: ['addon-lucky-bamboo', 'addon-jade-plant', 'addon-flower-food', 'addon-card-occasion'],
    },
    {
        id: 'thank-you',
        label: 'Thank You',
        emoji: '??',
        title: 'Thank You & Gratitude',
        suggestionIds: ['addon-ferrero-box', 'addon-lucky-bamboo', 'addon-card-occasion'],
    },
    {
        id: 'housewarming',
        label: 'Housewarming',
        emoji: '??',
        title: 'Housewarming',
        suggestionIds: ['addon-jade-plant', 'addon-lucky-bamboo', 'addon-scented-candle', 'addon-card-occasion'],
    },
    {
        id: 'just-because',
        label: 'Just Because / Surprise',
        emoji: '?',
        title: 'Special Surprise',
        suggestionIds: ['addon-chocolate-combo', 'addon-plush-teddy', 'addon-truffle-cake', 'addon-card-occasion'],
    },
];

type MessageTone = 'sweet' | 'romantic' | 'warm' | 'playful';

const MESSAGE_SUGGESTIONS: Record<string, Record<MessageTone, string[]>> = {
    birthday: {
        sweet: ["May your birthday bloom as beautifully as these flowers! ?? Wishing you joy, laughter, and a day as magical as you are. Happy Birthday!", "Sending you a bouquet full of birthday wishes and warm hugs! ?? Hope your special day is filled with everything you love."],
        romantic: ["On your birthday, I want you to know how deeply loved you are. ?? Every day with you is a gift — today we celebrate YOU. Happy Birthday, my love.", "You make every day feel special just by being in my life. ?? Happy Birthday — here's to another year of love and adventures together."],
        warm: ["Wishing you a birthday that's as warm and wonderful as you are. ?? May this year bring you everything your heart desires. Happy Birthday!", "So grateful to celebrate another year of your amazing life! ?? Sending all my love and best wishes on your special day."],
        playful: ["Happy Birthday! ?? You're not getting older — you're just getting more fabulous! Hope your day is as awesome as you are! ????", "Warning: These flowers may cause extreme happiness and uncontrollable smiling! ?? Happy Birthday — have the most epic day ever!"],
    },
    anniversary: {
        sweet: ["Every year with you is a beautiful chapter in our story. ?? Happy Anniversary — here's to forever and beyond.", "These flowers are as timeless as the love we share. ?? Wishing us many more beautiful years together. Happy Anniversary!"],
        romantic: ["From the moment I met you, my world became more beautiful. ?? Happy Anniversary, my love — you are my greatest adventure.", "Every rose in this bouquet represents a reason I love you more with each passing day. ?? Happy Anniversary!"],
        warm: ["Happy Anniversary! ?? Celebrating the love, laughter, and beautiful memories we've built together. Here's to us!", "Another year of growing together, laughing together, and loving each other. ?? Happy Anniversary — you mean the world to me."],
        playful: ["Happy Anniversary! ?? Still my favourite person to be weird with after all these years! Love you tons! ??", "Roses are red, violets are blue — these flowers are for you because I love only you! ?? Happy Anniversary!"],
    },
    romance: {
        sweet: ["Just wanted to remind you how special you are to me. ?? These flowers carry all the love I have for you. With all my heart.", "No reason needed to say 'I love you'. ?? You make my world so much brighter just by being in it."],
        romantic: ["You are the poetry my heart writes every single day. ?? These roses are just a small reflection of how deeply I love you.", "In a garden full of flowers, you would still be my favourite bloom. ?? Yours, forever."],
        warm: ["Thinking of you today and always. ?? Sending these flowers with all the love and warmth I feel for you every day.", "You deserve all the beautiful things in this world. ?? Starting with these flowers and all the love I have for you."],
        playful: ["Surprise! These flowers are as extra as my love for you! ???? Just because you're awesome and I love you tons!", "I saw these flowers and thought of you. ?? Because you're beautiful, wonderful, and I really like you a lot (understatement of the year)!"],
    },
    wedding: {
        sweet: ["Wishing you both a lifetime of love, laughter, and endless joy. ?? May your journey together be as beautiful as today. Congratulations!", "May your marriage be filled with all the magic and wonder of this day. ?? Wishing you both endless happiness. Congratulations!"],
        romantic: ["Two souls becoming one — today marks the beginning of your most beautiful story. ?? May your love grow deeper with every passing day.", "Love found its perfect home in both of you. ?? Wishing you a lifetime of romance, adventure, and unwavering love. Congratulations!"],
        warm: ["Warmest congratulations on your wedding! ?? May your home be filled with love, your hearts with laughter, and your life with blessings.", "What a beautiful day to celebrate two beautiful people! ?? Wishing you both a lifetime of happiness. Congratulations!"],
        playful: ["You two are officially stuck with each other — and we couldn't be happier about it! ?? Congratulations and welcome to forever!", "Love is in the air (and so are flower petals)! ?? Congratulations on your wedding — may you always make each other laugh!"],
    },
    congratulations: {
        sweet: ["Your hard work and dedication have truly paid off. ?? So proud of you and everything you've achieved. Congratulations!", "Every great achievement begins with someone who dared to dream. ?? Congratulations on making yours come true!"],
        romantic: ["Your success is a reflection of your beautiful soul and incredible spirit. ?? So incredibly proud of you. Congratulations, my love!", "Celebrating your amazing achievement with all the love in my heart. ?? You deserve every bit of this success. Congratulations!"],
        warm: ["Congratulations! ?? Your determination and passion brought you here. We're all so proud and happy for you!", "This is YOUR moment — earned by your talent, your effort, and your beautiful heart. ?? Congratulations!"],
        playful: ["YOU DID IT! ???? We always knew you would — now it's time to celebrate! Congratulations, superstar!", "Warning: This success may lead to even greater things! ?? Congratulations — here's to the first of many achievements!"],
    },
    'get-well': {
        sweet: ["Sending you these flowers and all my healing thoughts. ?? Wishing you a quick and peaceful recovery. Take care!", "May these blooms brighten your day and remind you that you're deeply loved. ?? Get well soon!"],
        romantic: ["Being apart from you while you're unwell is hard — these flowers carry all my love to you. ?? Get well soon, my darling.", "I'm sending all my love and warmth with these flowers. ?? Come back to full health soon — I miss you dearly."],
        warm: ["Hope these flowers bring a little sunshine to your recovery. ?? Sending warm thoughts, healing wishes, and lots of love your way!", "Take all the rest you need — healing takes time. ?? These flowers are here to cheer you on. Get well soon!"],
        playful: ["Get well soon! ?? The world is a better place with you healthy and happy in it! These flowers are rooting for you!", "Doctor's orders: Accept these flowers, rest lots, and get back to being your amazing self ASAP! ?? Get well soon!"],
    },
    'thank-you': {
        sweet: ["These flowers are a small token of my deep gratitude. ?? Thank you so much for everything — you truly made a difference.", "Your kindness means more than words can express. ?? Thank you from the bottom of my heart."],
        romantic: ["You are the most thoughtful person I know. ?? Thank you for everything you do — I'm so grateful to have you in my life.", "Every act of kindness you show makes my world a little brighter. ?? Thank you for being so wonderful."],
        warm: ["Thank you for your warmth, generosity, and kindness. ?? These flowers are a small reflection of how grateful I am for you!", "Your support means everything to me. ?? Thank you so much — you are truly one in a million!"],
        playful: ["THANK YOU! ?? You're basically a superhero and these flowers are your cape! So grateful for you! ??", "These flowers = 1% of how grateful I am (the other 99% is in my heart)! ?? Thank you so much!"],
    },
    housewarming: {
        sweet: ["May your new home be filled with love, laughter, and beautiful memories. ?? Wishing you all the warmth and happiness in your new space!", "A new home is where new stories begin. ?? Wishing you joy and peace in every corner of your beautiful new home!"],
        romantic: ["A new home, a new chapter — may it be filled with all our love and dreams. ?? Here's to building our most beautiful life together.", "Every corner of your new home will hold a piece of our hearts. ?? Wishing you endless happiness here."],
        warm: ["Warmest wishes for your beautiful new home! ?? May it be a place of comfort, joy, and endless wonderful memories.", "May your new home always be filled with laughter, the smell of fresh flowers, and the warmth of loved ones. ?? Congratulations!"],
        playful: ["Welcome to your new home! ?? May it be as amazing as you are (and may the Wi-Fi always be strong)! ??", "New house alert! ?? These flowers are your first official housewarming gift — may many more good things follow! Congratulations!"],
    },
    'just-because': {
        sweet: ["No special occasion needed — you deserve beautiful things every day. ?? Just a little reminder of how special you are to me.", "Sometimes love needs no reason. ?? These flowers are just a small way of saying how much you mean to me."],
        romantic: ["Just wanted you to know that I'm thinking of you today and always. ?? You make my ordinary days extraordinary. With all my love.", "You deserve to be surprised with flowers just because — because you're wonderful, because you're you. ?? Thinking of you always."],
        warm: ["Just because you're amazing and you deserve lovely things! ?? Sending these with all my warmth and affection. Hope this makes you smile!", "Life is better with you in it. ?? These flowers are just a little thank-you for being the wonderful person you are!"],
        playful: ["SURPRISE! ?? No reason needed — just wanted to remind you that you're awesome! ?? Hope these flowers make your day!", "These flowers arrived with a simple mission: make you smile! ?? Mission status: hopefully accomplished! Just because you're wonderful! ??"],
    },
};

const TONES: { id: MessageTone; label: string; emoji: string }[] = [
    { id: 'sweet', label: 'Sweet', emoji: '??' },
    { id: 'romantic', label: 'Romantic', emoji: '??' },
    { id: 'warm', label: 'Warm', emoji: '??' },
    { id: 'playful', label: 'Playful', emoji: '??' },
];

export default function CartPage() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, addItem, itemCount } = useCart();

    // Verification state
    const [isVerified, setIsVerified] = useState(false);
    const [verifiedUser, setVerifiedUser] = useState<{ email: string; name: string; phone: string } | null>(null);
    const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);

    // Delivery location modal & values
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [deliveryPincode, setDeliveryPincode] = useState('700040');
    const [deliveryArea, setDeliveryArea] = useState('Kolkata, West Bengal');

    // Addon category tab
    const [selectedAddonCategory, setSelectedAddonCategory] = useState<string>('all');
    const [isAddonsExpanded, setIsAddonsExpanded] = useState(true);
    const addonsScrollRef = useRef<HTMLDivElement>(null);

    // Occasion state (Mandatory checklist)
    const [selectedOccasion, setSelectedOccasion] = useState<string>('');
    const [occasionError, setOccasionError] = useState(false);
    const occasionSectionRef = useRef<HTMLDivElement>(null);

    // Right column expandables
    const [isMessageCardOpen, setIsMessageCardOpen] = useState(false);
    const [messageCardText, setMessageCardText] = useState('');
    const [messageRecipient, setMessageRecipient] = useState('');
    const [messageSender, setMessageSender] = useState('');
    const [messageSaved, setMessageSaved] = useState(false);
    const [messageTone, setMessageTone] = useState<MessageTone | ''>('');

    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    const [isTotalBillOpen, setIsTotalBillOpen] = useState(true);
    const [qtyDropdownOpenId, setQtyDropdownOpenId] = useState<string | null>(null);

    // Check verification status and saved selections from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('ner_verified_user');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.verified && parsed.email) {
                    setIsVerified(true);
                    setVerifiedUser(parsed);
                }
            }
            const savedLoc = localStorage.getItem('newecoroses_delivery_loc');
            const savedPin = localStorage.getItem('newecoroses_delivery_pincode');
            if (savedPin) setDeliveryPincode(savedPin);
            if (savedLoc) setDeliveryArea(savedLoc);

            const savedMsg = localStorage.getItem('ner_message_card');
            if (savedMsg) {
                setMessageCardText(savedMsg);
                setMessageSaved(true);
            }

            const savedOccasion = localStorage.getItem('ner_cart_occasion');
            if (savedOccasion) {
                setSelectedOccasion(savedOccasion);
            }
        } catch {}
    }, []);

    const handleSelectOccasion = (id: string) => {
        setSelectedOccasion(id);
        setOccasionError(false);
        try {
            localStorage.setItem('ner_cart_occasion', id);
        } catch {}
    };

    // Smart delivery date & schedule logic:
    // IST = UTC + 5:30. Same-day delivery accepted until 8:00 PM (20:00 IST).
    // After 8:00 PM IST, delivery is automatically scheduled for the next day.
    const deliveryInfo = useMemo(() => {
        const now = new Date();
        const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ist = new Date(utcMs + (3600000 * 5.5));
        const hour = ist.getHours();
        const isPastCutoff = hour >= 20; // 8:00 PM cutoff

        const deliveryDate = new Date(ist);
        if (isPastCutoff) {
            deliveryDate.setDate(deliveryDate.getDate() + 1);
        }

        const day = deliveryDate.getDate();
        const suffix = (d: number) => {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        const month = deliveryDate.toLocaleString('en-US', { month: 'short' });
        const dayLabel = isPastCutoff ? 'Tomorrow' : 'Today';

        return {
            isSameDay: !isPastCutoff,
            isPastCutoff,
            cutoffHour: 20,
            dateFormatted: `${day}${suffix(day)} ${month}`,
            bannerText: `Delivery ${dayLabel}, ${day}${suffix(day)} ${month}`,
            windowText: '9:00 AM – 9:00 PM (Anytime)',
        };
    }, []);

    // Calculate subtotal & estimated MRP savings
    const subtotal = useMemo(() => {
        return items.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
    }, [items]);

    const estimatedSavings = useMemo(() => {
        return Math.max(200, Math.round(subtotal * 0.12));
    }, [subtotal]);

    const estimatedMRP = subtotal + estimatedSavings;

    // Recalculate coupon on subtotal change
    useEffect(() => {
        if (!appliedCoupon) return;
        const result = calculateDiscount(appliedCoupon, subtotal);
        if (result.valid) {
            setDiscountAmount(result.discountAmount);
            setCouponSuccess(result.message);
            setCouponError('');
        } else {
            setAppliedCoupon(null);
            setDiscountAmount(0);
            setCouponError(result.message);
            setCouponSuccess('');
        }
    }, [subtotal, appliedCoupon]);

    const totalBill = Math.max(0, subtotal - discountAmount);

    // Coupon handlers
    const handleApplyCoupon = (codeToApply?: string) => {
        setCouponError('');
        setCouponSuccess('');
        const code = (codeToApply || couponInput).trim().toUpperCase();
        if (!code) {
            setCouponError('Please enter a coupon code');
            return;
        }

        const found = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code);
        if (!found) {
            setCouponError('Invalid coupon code');
            return;
        }

        const result = calculateDiscount(found, subtotal);
        if (!result.valid) {
            setCouponError(result.message);
            return;
        }

        setAppliedCoupon(found);
        setDiscountAmount(result.discountAmount);
        setCouponSuccess(result.message);
        setCouponInput('');
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponSuccess('');
        setCouponError('');
    };

    // Save message card to localStorage
    const handleSaveMessageCard = () => {
        const fullMessage = [
            messageRecipient ? `To: ${messageRecipient}` : '',
            messageCardText ? `"${messageCardText}"` : '',
            messageSender ? `From: ${messageSender}` : ''
        ].filter(Boolean).join('\n');

        if (fullMessage) {
            localStorage.setItem('ner_message_card', fullMessage);
            setMessageSaved(true);
        }
    };

    // Filter addons by category tab
    const filteredAddons = useMemo(() => {
        if (selectedAddonCategory === 'all') return ADDON_ITEMS;
        if (selectedAddonCategory === 'gourmet') {
            return ADDON_ITEMS.filter(a => a.category === 'chocolates');
        }
        if (selectedAddonCategory === 'keepsakes') {
            return ADDON_ITEMS.filter(a => a.category === 'keepsakes');
        }
        if (selectedAddonCategory === 'accessories') {
            return ADDON_ITEMS.filter(a => a.category === 'accessories');
        }
        if (selectedAddonCategory === 'cards') {
            return ADDON_ITEMS.filter(a => a.category === 'cards');
        }
        if (selectedAddonCategory === 'cakes') {
            return ADDON_ITEMS.filter(a => a.category === 'cakes');
        }
        if (selectedAddonCategory === 'plants') {
            return ADDON_ITEMS.filter(a => a.category === 'plants');
        }
        return ADDON_ITEMS;
    }, [selectedAddonCategory]);

    const scrollAddonsRight = () => {
        if (addonsScrollRef.current) {
            addonsScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
    };

    // Auth drawer completed callback
    const handleAuthSuccess = (userData: { email: string; name: string; phone: string }) => {
        setIsVerified(true);
        setVerifiedUser(userData);
        setIsAuthDrawerOpen(false);
        // After confirming email, only then proceed to checkout as requested!
        router.push('/checkout');
    };

    // Main CTA button click (Occasion is mandatory before proceeding)
    const handleMainCtaClick = () => {
        if (!selectedOccasion) {
            setOccasionError(true);
            occasionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        // Save occasion to localStorage for checkout
        try {
            localStorage.setItem('ner_cart_occasion', selectedOccasion);
        } catch {}

        if (!isVerified) {
            setIsAuthDrawerOpen(true);
        } else {
            router.push('/checkout');
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfbfa] text-[#111] antialiased">
            {/* -- TOP HEADER WITH STEPPER (Reference Image 1) -- */}
            <header className="sticky top-0 z-40 bg-white border-b border-black/[0.08] shadow-2xs">
                <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2 group flex-shrink-0 select-none">
                        <Image
                            src="/favicon_io/android-chrome-512x512.png"
                            alt="New Eco Roses Logo"
                            width={32}
                            height={32}
                            priority
                            className="rounded-full transition-transform group-hover:scale-105"
                        />
                        <div className="flex items-center gap-2">
                            <span className="font-sans text-[19px] sm:text-[21px] font-black text-[#1c1917] tracking-tight">
                                ner
                            </span>
                            <div className="h-4 w-[1.5px] bg-[#1c1917]/25" />
                            <div className="flex flex-col text-[7.5px] font-extrabold tracking-[0.14em] uppercase text-[#1c1917] leading-none">
                                <span>NEW</span>
                                <span className="my-[1px]">ECO</span>
                                <span>ROSES</span>
                            </div>
                        </div>
                    </Link>

                    {/* Stepper Navigation (Login -> Address -> Payment) */}
                    <div className="flex items-center gap-3 sm:gap-6 md:gap-10 flex-1 justify-center max-w-[540px] mx-3">
                        {/* Step 1: Login */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div
                                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all shadow-2xs ${
                                    isVerified
                                        ? 'bg-[#16a34a] text-white'
                                        : 'bg-[#bfa81f] text-white'
                                }`}
                            >
                                {isVerified ? <Check size={14} className="stroke-[3]" /> : '?'}
                            </div>
                            <span
                                className={`text-[12px] sm:text-[13px] font-bold tracking-tight whitespace-nowrap ${
                                    isVerified ? 'text-[#16a34a]' : 'text-[#bfa81f]'
                                }`}
                            >
                                Login
                            </span>
                        </div>

                        {/* Connector 1 */}
                        <div className="h-[1.5px] w-8 sm:w-14 md:w-20 bg-black/[0.12] flex-shrink-0" />

                        {/* Step 2: Address */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 border border-black/[0.08] flex items-center justify-center text-[11px] sm:text-xs font-semibold text-gray-500">
                                <MapPin size={13} />
                            </div>
                            <span className="text-[12px] sm:text-[13px] font-semibold text-gray-500 hidden sm:inline">
                                Address
                            </span>
                        </div>

                        {/* Connector 2 */}
                        <div className="h-[1.5px] w-8 sm:w-14 md:w-20 bg-black/[0.12] flex-shrink-0" />

                        {/* Step 3: Payment */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 border border-black/[0.08] flex items-center justify-center text-[11px] sm:text-xs font-semibold text-gray-500">
                                <CreditCard size={13} />
                            </div>
                            <span className="text-[12px] sm:text-[13px] font-semibold text-gray-500 hidden sm:inline">
                                Payment
                            </span>
                        </div>
                    </div>

                    {/* Right support / Back link */}
                    <Link
                        href="/shop"
                        className="text-[12px] font-medium text-[#666] hover:text-[#111] transition-colors whitespace-nowrap hidden md:inline-flex items-center gap-1"
                    >
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </header>

            {/* -- MAIN CART CONTENT CONTAINER -- */}
            <main className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Cart Heading */}
                <div className="mb-5 flex items-baseline gap-2.5">
                    <h1 className="font-sans text-2xl sm:text-[26px] font-black text-[#111] tracking-tight">
                        Cart
                    </h1>
                    <span className="text-[#888] font-bold text-lg">•</span>
                    <span className="text-sm sm:text-base font-normal text-[#666]">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {/* Empty Cart State */}
                {items.length === 0 ? (
                    <div className="bg-white border border-black/[0.08] rounded-[20px] p-10 sm:p-16 text-center max-w-lg mx-auto shadow-2xs my-8">
                        <div className="w-16 h-16 bg-[#faf8f0] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#bfa81f]/20">
                            <ShoppingBag size={28} className="text-[#bfa81f]" />
                        </div>
                        <h2 className="font-sans text-xl sm:text-2xl font-black text-[#111] mb-2 tracking-tight">
                            Your cart is empty
                        </h2>
                        <p className="text-xs sm:text-sm text-[#666] max-w-xs mx-auto mb-6 font-medium">
                            Explore our handcrafted luxury bouquets, flowers &amp; celebratory hampers.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[12px] bg-[#bfa81f] hover:bg-[#a89216] text-white text-xs uppercase tracking-wider font-bold shadow-sm transition-all"
                        >
                            <span>Explore Collections</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    /* -- 2-Column Layout (Matches Reference Image 1) -- */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        
                        {/* -- LEFT COLUMN (7 COLS): Deliver Card + Product List + Occasion + Addon Shelf -- */}
                        <div className="lg:col-span-7 space-y-4">
                            
                            {/* 1. Deliver To Card */}
                            <div className="bg-white border border-black/[0.08] rounded-[16px] p-4 flex items-center justify-between shadow-2xs">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#f3f4e8] border border-[#bfa81f]/20 flex items-center justify-center flex-shrink-0 text-[#bfa81f]">
                                        <MapPin size={18} className="stroke-[2.3]" />
                                    </div>
                                    <div>
                                        <div className="text-[13.5px] font-semibold text-[#111] tracking-tight leading-snug">
                                            Deliver to: {deliveryPincode}
                                        </div>
                                        <div className="text-[12px] text-[#666] font-medium leading-tight">
                                            {deliveryArea}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsLocationModalOpen(true)}
                                    className="px-3.5 py-1.5 rounded-[8px] border border-black/[0.18] hover:border-black/[0.35] bg-white hover:bg-gray-50 text-[12px] font-medium text-[#111] transition-all cursor-pointer shadow-2xs"
                                >
                                    Change
                                </button>
                            </div>

                            {/* 2. Delivery Date Header + Product Rows */}
                            <div className="border border-black/[0.08] rounded-[16px] overflow-hidden shadow-2xs">
                                {/* Soft warm banner with 8:00 PM cutoff notice */}
                                <div className="bg-[#f9f7f2] px-4 py-3 flex items-center justify-between gap-3 border-b border-black/[0.06]">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-7 h-7 rounded-full bg-[#f1eedf] flex items-center justify-center flex-shrink-0 text-[#bfa81f]">
                                            <Calendar size={14} className="stroke-[2.4]" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-[13px] font-bold text-[#1a1a1a] tracking-tight">
                                                    {deliveryInfo.bannerText}
                                                </span>
                                                <span className="text-[11.5px] text-[#777] font-medium hidden md:inline">
                                                    (9:00 AM – 9:00 PM)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modern, Aesthetic Cutoff Pill */}
                                    <div className="flex-shrink-0">
                                        {deliveryInfo.isSameDay ? (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs">
                                                <Zap size={12} className="fill-emerald-600 text-emerald-600 flex-shrink-0" />
                                                <span className="text-[11.5px] font-bold tracking-tight whitespace-nowrap">
                                                    Same-Day Delivery
                                                </span>
                                                <span className="text-[11px] text-emerald-700/80 font-medium whitespace-nowrap hidden sm:inline">
                                                    · Order by 8:00 PM
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/90 shadow-2xs">
                                                <Clock size={12} className="text-amber-700 flex-shrink-0 stroke-[2.2]" />
                                                <span className="text-[11.5px] font-bold tracking-tight whitespace-nowrap">
                                                    Next-Day Delivery
                                                </span>
                                                <span className="text-[11px] text-amber-800/80 font-medium whitespace-nowrap hidden sm:inline">
                                                    · After 8:00 PM cutoff
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Items Container */}
                                <div className="bg-white divide-y divide-black/[0.06] p-4 space-y-4">
                                    {items.map((item) => {
                                        const price = Number(item.price) || 0;
                                        return (
                                            <div key={item.id} className="pt-3 first:pt-0 flex gap-4 items-start relative">
                                                {/* Thumbnail */}
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-[12px] overflow-hidden bg-gray-50 border border-black/[0.08] flex-shrink-0"
                                                >
                                                    <Image
                                                        src={item.image_url || '/images/placeholder.webp'}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                                        sizes="90px"
                                                    />
                                                </Link>

                                                {/* Title & Price & Qty */}
                                                <div className="flex-1 min-w-0 pr-6">
                                                    <Link
                                                        href={`/product/${item.slug}`}
                                                        className="font-sans text-[14.5px] sm:text-[15px] font-semibold text-[#111] hover:text-[#bfa81f] transition-colors leading-snug line-clamp-1"
                                                    >
                                                        {item.name}
                                                    </Link>

                                                    <div className="text-[15px] font-bold text-[#111] mt-1">
                                                        ?{price.toLocaleString('en-IN')}
                                                    </div>

                                                    {/* Dropdown Qty Selector (Matches "Qty 1 ?" in Image 1) */}
                                                    <div className="relative inline-block mt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setQtyDropdownOpenId(qtyDropdownOpenId === item.id ? null : item.id)}
                                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] border border-black/[0.18] hover:border-black/[0.3] bg-white text-[12px] font-medium text-[#111] cursor-pointer shadow-2xs"
                                                        >
                                                            <span>Qty {item.quantity}</span>
                                                            <ChevronDown size={12} className="stroke-[2.5]" />
                                                        </button>

                                                        {qtyDropdownOpenId === item.id && (
                                                            <div className="absolute left-0 top-full mt-1 w-24 bg-white border border-black/[0.12] rounded-[10px] shadow-lg py-1 z-30 max-h-48 overflow-y-auto">
                                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                                    <button
                                                                        key={num}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            updateQuantity(item.id, num);
                                                                            setQtyDropdownOpenId(null);
                                                                        }}
                                                                        className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                                                                            item.quantity === num
                                                                                ? 'bg-[#bfa81f] text-white'
                                                                                : 'text-[#111] hover:bg-gray-100'
                                                                        }`}
                                                                    >
                                                                        Qty {num}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Remove (X) Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="absolute top-0 right-0 p-1 text-gray-400 hover:text-black transition-colors cursor-pointer rounded-full"
                                                    title="Remove item"
                                                >
                                                    <X size={16} className="stroke-[2.2]" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. Occasion Checklist (Mandatory Selection) */}
                            <div
                                ref={occasionSectionRef}
                                className={`bg-white rounded-[16px] p-4 sm:p-5 shadow-2xs transition-all border ${
                                    occasionError
                                        ? 'border-rose-400 ring-2 ring-rose-200/60 bg-rose-50/[0.08]'
                                        : 'border-black/[0.08]'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#faf8f0] text-[#bfa81f] flex items-center justify-center flex-shrink-0 border border-[#bfa81f]/25">
                                            <Gift size={16} className="stroke-[2.3]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-sans text-[14.5px] sm:text-[15px] font-bold text-[#111] tracking-tight">
                                                    Select Occasion
                                                </h3>
                                                <span className="px-1.5 py-0.5 rounded-[4px] bg-rose-500 text-white text-[9.5px] font-bold uppercase tracking-wide">
                                                    Mandatory
                                                </span>
                                            </div>
                                            <p className="text-[11.5px] text-[#666] font-normal leading-tight">
                                                Helps us customize the arrangement, ribbon &amp; presentation
                                            </p>
                                        </div>
                                    </div>
                                    {selectedOccasion && (
                                        <span className="text-[11px] font-semibold text-[#16a34a] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-flex items-center gap-1">
                                            <Check size={12} className="stroke-[3]" /> Selected
                                        </span>
                                    )}
                                </div>

                                {occasionError && (
                                    <div className="mb-3 px-3 py-2 rounded-[8px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                                        <span>??</span>
                                        <span>Please select an occasion for your order before proceeding to checkout.</span>
                                    </div>
                                )}

                                {/* Occasion checklist options */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                                    {OCCASIONS.map((occ) => {
                                        const isSelected = selectedOccasion === occ.id;
                                        return (
                                            <button
                                                key={occ.id}
                                                type="button"
                                                onClick={() => handleSelectOccasion(occ.id)}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-[11px] text-left text-[12.5px] transition-all cursor-pointer border ${
                                                    isSelected
                                                        ? 'bg-[#bfa81f] text-white border-[#bfa81f] font-semibold shadow-xs'
                                                        : 'bg-[#fafafa] hover:bg-white text-[#333] border-black/[0.08] hover:border-[#bfa81f]/40 font-medium'
                                                }`}
                                            >
                                                <span className="text-base flex-shrink-0">{occ.emoji}</span>
                                                <span className="truncate flex-1">{occ.label}</span>
                                                <div
                                                    className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border ${
                                                        isSelected
                                                            ? 'bg-white text-[#bfa81f] border-white'
                                                            : 'border-black/[0.2] bg-white'
                                                    }`}
                                                >
                                                    {isSelected && <Check size={11} className="stroke-[3.5]" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Dynamic Product Suggestions based on selected occasion */}
                                {selectedOccasion && (
                                    <div className="mt-4 pt-3.5 border-t border-black/[0.06]">
                                        <div className="flex items-center gap-1.5 mb-2.5">
                                            <Sparkles size={14} className="text-[#bfa81f]" />
                                            <p className="text-[12px] font-semibold text-[#111]">
                                                Recommended add-ons for {OCCASIONS.find(o => o.id === selectedOccasion)?.title || 'this occasion'}:
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {(OCCASIONS.find(o => o.id === selectedOccasion)?.suggestionIds || [])
                                                .map(id => ADDON_ITEMS.find(a => a.id === id))
                                                .filter(Boolean)
                                                .map(addon => {
                                                    if (!addon) return null;
                                                    const inCart = items.some(i => i.id === addon.id);
                                                    return (
                                                        <div
                                                            key={addon.id}
                                                            className="flex items-center justify-between gap-2.5 p-2 rounded-[10px] bg-[#faf8f0]/80 border border-[#bfa81f]/20"
                                                        >
                                                            <div className="flex items-center gap-2.5 min-w-0">
                                                                <div className="relative w-10 h-10 rounded-[8px] overflow-hidden bg-white border border-black/[0.06] flex-shrink-0">
                                                                    <Image
                                                                        src={addon.image_url}
                                                                        alt={addon.name}
                                                                        fill
                                                                        className="object-cover"
                                                                        sizes="40px"
                                                                    />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-[12px] font-semibold text-[#111] truncate leading-snug">
                                                                        {addon.name}
                                                                    </p>
                                                                    <div className="flex items-center gap-1.5 text-[11px]">
                                                                        <span className="font-bold text-[#111]">?{addon.price}</span>
                                                                        {addon.originalPrice && (
                                                                            <span className="text-gray-400 line-through text-[10px]">
                                                                                ?{addon.originalPrice}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (inCart) {
                                                                        removeItem(addon.id);
                                                                    } else {
                                                                        addItem({
                                                                            id: addon.id,
                                                                            name: addon.name,
                                                                            slug: addon.id,
                                                                            price: addon.price,
                                                                            image_url: addon.image_url,
                                                                        });
                                                                    }
                                                                }}
                                                                className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold cursor-pointer transition-all flex-shrink-0 ${
                                                                    inCart
                                                                        ? 'bg-[#16a34a] text-white'
                                                                        : 'bg-[#bfa81f] hover:bg-[#a89216] text-white shadow-2xs'
                                                                }`}
                                                            >
                                                                {inCart ? '? Added' : '+ Add'}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 4. "Make It Extra Special!" Shelf (Reference Image 1) */}
                            <div className="bg-white border border-black/[0.08] rounded-[16px] p-4 shadow-2xs space-y-3.5">
                                {/* Accordion Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Gift size={18} className="text-[#bfa81f] stroke-[2.3]" />
                                        <h3 className="font-sans text-[15px] font-bold text-[#111] tracking-tight">
                                            Make It Extra Special!
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddonsExpanded(!isAddonsExpanded)}
                                        className="p-1 text-gray-500 hover:text-black cursor-pointer"
                                    >
                                        {isAddonsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                </div>

                                {isAddonsExpanded && (
                                    <>
                                        {/* Category Filter Tabs */}
                                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11.5px] font-bold select-none">
                                            {[
                                                { id: 'all', label: 'All' },
                                                { id: 'gourmet', label: 'Gourmet' },
                                                { id: 'accessories', label: 'Cake Accessories' },
                                                { id: 'cards', label: 'Greeting Cards' },
                                                { id: 'cakes', label: 'Cakes' },
                                                { id: 'plants', label: 'Plants' },
                                                { id: 'keepsakes', label: 'Keepsakes' },
                                            ].map((tab) => {
                                                const isActive = selectedAddonCategory === tab.id;
                                                return (
                                                    <button
                                                        key={tab.id}
                                                        type="button"
                                                        onClick={() => setSelectedAddonCategory(tab.id)}
                                                        className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                                                            isActive
                                                                ? 'bg-[#111] text-white shadow-2xs'
                                                                : 'bg-[#f5f5f5] hover:bg-[#eaeaea] text-[#666]'
                                                        }`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Horizontal Addons Row */}
                                        <div className="relative">
                                            <div
                                                ref={addonsScrollRef}
                                                className="flex items-start gap-3.5 overflow-x-auto no-scrollbar py-1"
                                            >
                                                {filteredAddons.map((addon) => {
                                                    const isAlreadyInCart = items.some(i => i.id === addon.id);
                                                    return (
                                                        <div
                                                            key={addon.id}
                                                            className="flex-shrink-0 w-[110px] sm:w-[125px] flex flex-col group select-none"
                                                        >
                                                            {/* Addon Image with Overlay '+' Button */}
                                                            <div className="relative w-full h-[110px] sm:h-[125px] rounded-[12px] overflow-hidden bg-gray-50 border border-black/[0.08]">
                                                                <Image
                                                                    src={addon.image_url}
                                                                    alt={addon.name}
                                                                    fill
                                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    sizes="125px"
                                                                />
                                                                {/* Plus Button in White Circle (Matches Image 1) */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addItem({
                                                                        id: addon.id,
                                                                        name: addon.name,
                                                                        slug: addon.id,
                                                                        price: addon.price,
                                                                        image_url: addon.image_url,
                                                                    })}
                                                                    className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer ${
                                                                        isAlreadyInCart
                                                                            ? 'bg-[#16a34a] text-white'
                                                                            : 'bg-white hover:bg-gray-100 text-[#111]'
                                                                    }`}
                                                                    title="Add to order"
                                                                >
                                                                    {isAlreadyInCart ? (
                                                                        <Check size={14} className="stroke-[3]" />
                                                                    ) : (
                                                                        <Plus size={15} className="stroke-[2.5]" />
                                                                    )}
                                                                </button>
                                                            </div>

                                                            {/* Name */}
                                                            <div className="mt-2 text-[12px] font-medium text-[#222] line-clamp-1 leading-snug">
                                                                {addon.name}
                                                            </div>

                                                            {/* Price */}
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="text-[13px] font-semibold text-[#111]">
                                                                    ?{addon.price}
                                                                </span>
                                                                {addon.originalPrice && (
                                                                    <span className="text-[11px] text-gray-400 line-through font-normal">
                                                                        ?{addon.originalPrice}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Right Scroll Arrow Button (Matches Image 1) */}
                                            <button
                                                type="button"
                                                onClick={scrollAddonsRight}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-[#111] shadow-md border border-black/[0.1] flex items-center justify-center hover:bg-gray-50 transition-transform active:scale-95 cursor-pointer z-10"
                                            >
                                                <ChevronRight size={16} className="stroke-[2.5]" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* -- RIGHT COLUMN (5 COLS): Message Card + Coupon + nerCash + Total Bill -- */}
                        <div className="lg:col-span-5 space-y-3.5">
                            
                            {/* 1. Add Message Card FREE (Reference Image 1) */}
                            <div className="bg-white border border-black/[0.08] rounded-[16px] overflow-hidden shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => setIsMessageCardOpen(!isMessageCardOpen)}
                                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#f3f4e8] text-[#bfa81f] flex items-center justify-center flex-shrink-0">
                                            <Heart size={16} className="stroke-[2.3]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[13.5px] font-semibold text-[#111] tracking-tight">
                                                    Add Message Card
                                                </span>
                                                <span className="px-2 py-0.5 rounded-[5px] bg-[#16a34a] text-white text-[10px] font-black tracking-wide uppercase">
                                                    FREE
                                                </span>
                                            </div>
                                            <p className="text-[11.5px] text-[#666] font-medium leading-tight">
                                                {messageSaved ? 'Card message added ?' : 'Make your gift more special'}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight
                                        size={17}
                                        className={`text-gray-400 transition-transform duration-200 ${
                                            isMessageCardOpen ? 'rotate-90' : ''
                                        }`}
                                    />
                                </button>

                                {isMessageCardOpen && (
                                    <div className="px-4 pb-4 pt-2 border-t border-black/[0.06] space-y-3 bg-[#faf9f6]/40">

                                        {/* Smart Suggestions — show when occasion is selected */}
                                        {selectedOccasion && MESSAGE_SUGGESTIONS[selectedOccasion] && (
                                            <div className="space-y-2">
                                                <p className="text-[11px] font-bold text-[#bfa81f] flex items-center gap-1.5">
                                                    <Sparkles size={12} />
                                                    Message suggestions for {OCCASIONS.find(o => o.id === selectedOccasion)?.label}:
                                                </p>
                                                {/* Tone selector */}
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {TONES.map(t => (
                                                        <button
                                                            key={t.id}
                                                            type="button"
                                                            onClick={() => setMessageTone(prev => prev === t.id ? '' : t.id)}
                                                            className={`px-2.5 py-1 rounded-[8px] border text-[11px] font-bold transition-all cursor-pointer ${
                                                                messageTone === t.id
                                                                    ? 'bg-[#111] text-white border-[#111]'
                                                                    : 'bg-white text-[#444] border-black/[0.12] hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {t.emoji} {t.label}
                                                        </button>
                                                    ))}
                                                </div>
                                                {/* Message chips */}
                                                {messageTone && MESSAGE_SUGGESTIONS[selectedOccasion]?.[messageTone as MessageTone] && (
                                                    <div className="space-y-1.5">
                                                        {MESSAGE_SUGGESTIONS[selectedOccasion][messageTone as MessageTone].map((msg, i) => (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                onClick={() => { setMessageCardText(msg); setMessageSaved(false); }}
                                                                className="w-full text-left px-3 py-2 rounded-[9px] border border-[#bfa81f]/30 bg-[#bfa81f]/5 hover:bg-[#bfa81f]/10 text-[11px] text-[#333] leading-relaxed transition-all cursor-pointer"
                                                            >
                                                                {msg}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="border-t border-black/[0.06]" />
                                            </div>
                                        )}

                                        <textarea
                                            rows={3}
                                            value={messageCardText}
                                            onChange={(e) => { setMessageCardText(e.target.value); setMessageSaved(false); }}
                                            placeholder="Write your heartfelt message here..."
                                            className="w-full text-xs font-medium p-3 rounded-[10px] border border-black/[0.15] bg-white focus:outline-none focus:border-[#bfa81f] placeholder:text-gray-400"
                                        />

                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={messageRecipient}
                                                onChange={(e) => { setMessageRecipient(e.target.value); setMessageSaved(false); }}
                                                placeholder="Recipient Name"
                                                className="w-full text-xs font-semibold p-2.5 rounded-[8px] border border-black/[0.15] bg-white focus:outline-none focus:border-[#bfa81f]"
                                            />
                                            <input
                                                type="text"
                                                value={messageSender}
                                                onChange={(e) => { setMessageSender(e.target.value); setMessageSaved(false); }}
                                                placeholder="Your Name (Sender)"
                                                className="w-full text-xs font-semibold p-2.5 rounded-[8px] border border-black/[0.15] bg-white focus:outline-none focus:border-[#bfa81f]"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleSaveMessageCard}
                                            className="w-full py-2 rounded-[8px] bg-[#bfa81f] hover:bg-[#a89216] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                                        >
                                            {messageSaved ? 'Card Saved ✓' : 'Save Message Card'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* 2. Apply Coupon (Reference Image 1) */}
                            <div className="bg-white border border-black/[0.08] rounded-[16px] overflow-hidden shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => setIsCouponOpen(!isCouponOpen)}
                                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#f3f4e8] text-[#bfa81f] flex items-center justify-center flex-shrink-0">
                                            <Tag size={16} className="stroke-[2.3]" />
                                        </div>
                                        <div>
                                            <div className="text-[13.5px] font-semibold text-[#111] tracking-tight">
                                                Apply Coupon
                                            </div>
                                            {appliedCoupon && (
                                                <p className="text-[11.5px] text-[#16a34a] font-bold leading-tight">
                                                    {appliedCoupon.code} applied (-?{discountAmount})
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight
                                        size={17}
                                        className={`text-gray-400 transition-transform duration-200 ${
                                            isCouponOpen ? 'rotate-90' : ''
                                        }`}
                                    />
                                </button>

                                {isCouponOpen && (
                                    <div className="px-4 pb-4 pt-1 border-t border-black/[0.06] space-y-3 bg-[#faf9f6]/40">
                                        {appliedCoupon ? (
                                            <div className="flex items-center justify-between p-2.5 rounded-[10px] bg-emerald-50 border border-emerald-200">
                                                <div>
                                                    <span className="text-xs font-semibold text-emerald-800 tracking-wide">
                                                        {appliedCoupon.code}
                                                    </span>
                                                    <p className="text-[11px] text-emerald-700 font-medium">
                                                        ?{discountAmount} saved on this order
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveCoupon}
                                                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={couponInput}
                                                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                        placeholder="Enter promo code"
                                                        className="flex-1 text-xs font-bold uppercase tracking-wider p-2.5 rounded-[8px] border border-black/[0.15] bg-white focus:outline-none focus:border-[#bfa81f]"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApplyCoupon()}
                                                        className="px-4 py-2.5 rounded-[8px] bg-[#bfa81f] hover:bg-[#a89216] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>

                                                {/* Quick Coupon Pill */}
                                                <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-white border border-dashed border-[#bfa81f]/40">
                                                    <div>
                                                        <span className="text-xs font-semibold text-[#111]">WELCOME10</span>
                                                        <p className="text-[10.5px] text-[#666]">10% off your luxury order</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleApplyCoupon('WELCOME10')}
                                                        className="text-xs font-bold text-[#bfa81f] hover:underline cursor-pointer"
                                                    >
                                                        APPLY
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        {couponError && (
                                            <p className="text-xs font-semibold text-rose-600">{couponError}</p>
                                        )}
                                        {couponSuccess && (
                                            <p className="text-xs font-semibold text-emerald-700">{couponSuccess}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 3. Total Bill Card (Reference Image 1) */}
                            <div className="bg-white border border-black/[0.08] rounded-[18px] p-5 shadow-2xs space-y-4">
                                {/* Header */}
                                <div
                                    onClick={() => setIsTotalBillOpen(!isTotalBillOpen)}
                                    className="flex items-center justify-between cursor-pointer select-none"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <FileText size={18} className="text-[#bfa81f] stroke-[2.3]" />
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-[15px] font-bold text-[#111] tracking-tight">
                                                    Total Bill
                                                </span>
                                                <span className="text-[17px] font-black text-[#111]">
                                                    ?{totalBill.toLocaleString('en-IN')}
                                                </span>
                                                <span className="text-xs text-gray-400 line-through font-semibold">
                                                    ?{estimatedMRP.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <p className="text-[10.5px] text-[#777] font-medium leading-none mt-0.5">
                                                Price inclusive of all taxes
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        size={18}
                                        className={`text-gray-400 transition-transform ${
                                            isTotalBillOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </div>

                                {/* Collapsible breakdown */}
                                {isTotalBillOpen && (
                                    <div className="pt-2 border-t border-black/[0.06] space-y-2 text-xs">
                                        <div className="flex justify-between text-[#666]">
                                            <span className="font-normal">Cart Subtotal</span>
                                            <span className="font-bold text-[#111]">?{subtotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-[#666]">
                                            <span className="font-normal">Delivery Charges</span>
                                            <span className="font-bold text-[#16a34a]">FREE</span>
                                        </div>
                                        <div className="flex justify-between text-[#666]">
                                            <span className="font-normal">Luxury Packaging</span>
                                            <span className="font-bold text-[#16a34a]">FREE</span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-emerald-700 font-bold">
                                                <span>Coupon Discount</span>
                                                <span>-?{discountAmount.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Savings Banner (Reference Image 1) */}
                                <div className="bg-[#fef9e7] border border-[#fef08a] rounded-[10px] p-2.5 flex items-center gap-2 text-[12px] font-medium text-[#854d0e]">
                                    <span>??</span>
                                    <span>
                                        You saved ?{(estimatedSavings + discountAmount).toLocaleString('en-IN')} on this order
                                    </span>
                                </div>

                                {/* BIG CTA BUTTON: Login/Signup or Proceed to Checkout */}
                                <button
                                    type="button"
                                    onClick={handleMainCtaClick}
                                    className="w-full h-[50px] rounded-[12px] bg-[#bfa81f] hover:bg-[#a89216] active:scale-[0.99] text-white font-bold text-[14px] uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>{isVerified ? 'Proceed to Checkout' : 'Login/Signup'}</span>
                                    <ArrowRight size={15} />
                                </button>

                                {/* Legal text below button (Matches Image 1) */}
                                <p className="text-[10px] text-[#777] text-center leading-relaxed select-none">
                                    By continuing you agree to NER&apos;s{' '}
                                    <span className="underline underline-offset-2">Terms &amp; Conditions</span>,{' '}
                                    <span className="underline underline-offset-2">Privacy Policy</span> &amp;{' '}
                                    <span className="underline underline-offset-2">Disclaimer</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* -- Slide-Over Login / Signup Drawer (Reference Images 2, 3, 4) -- */}
            <AuthDrawer
                isOpen={isAuthDrawerOpen}
                onClose={() => setIsAuthDrawerOpen(false)}
                onSuccess={handleAuthSuccess}
                initialEmail={verifiedUser?.email || ''}
            />

            {/* -- Delivery Location Modal -- */}
            <DeliveryLocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onLocationSet={(loc) => {
                    setDeliveryArea(loc);
                    const match = loc.match(/\b700\d{3}\b/);
                    if (match) setDeliveryPincode(match[0]);
                }}
            />
        </div>
    );
}
