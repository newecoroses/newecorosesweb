'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

/* ── Types ──────────────────────────────────────────────────────────────── */
export interface CartItem {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    price: number | null;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
}

const STORAGE_KEY = 'ner_cart';

const CartContext = createContext<CartContextType | null>(null);

/* ── Hook ───────────────────────────────────────────────────────────────── */
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within <CartProvider>');
    return ctx;
}

/* ── Provider ───────────────────────────────────────────────────────────── */
export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setItems(JSON.parse(stored));
        } catch {}
        setHydrated(true);
    }, []);

    // Persist to localStorage on change (after hydration)
    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {}
    }, [items, hydrated]);

    const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity < 1) {
            setItems(prev => prev.filter(i => i.id !== id));
            return;
        }
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
    const toggleDrawer = useCallback(() => setIsDrawerOpen(p => !p), []);

    return (
        <CartContext.Provider value={{
            items, addItem, removeItem, updateQuantity, clearCart,
            itemCount, isDrawerOpen, openDrawer, closeDrawer, toggleDrawer,
        }}>
            {children}
        </CartContext.Provider>
    );
}
