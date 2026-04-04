'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine } from '@/lib/cart-types';
import { CART_STORAGE_KEY } from '@/lib/cart-storage';

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  addItem: (line: Omit<CartLine, 'qty'> & { qty?: number }) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function parseStored(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

function isCartLine(x: unknown): x is CartLine {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.productId === 'string' &&
    typeof o.name === 'string' &&
    typeof o.priceKobo === 'number' &&
    typeof o.imageUrl === 'string' &&
    typeof o.qty === 'number' &&
    o.qty >= 1 &&
    Number.isFinite(o.priceKobo)
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(parseStored(typeof window !== 'undefined' ? localStorage.getItem(CART_STORAGE_KEY) : null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    if (items.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((line: Omit<CartLine, 'qty'> & { qty?: number }) => {
    const qty = line.qty && line.qty > 0 ? Math.floor(line.qty) : 1;
    setItems((prev) => {
      const i = prev.findIndex((x) => x.productId === line.productId);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [
        ...prev,
        {
          productId: line.productId,
          name: line.name,
          priceKobo: line.priceKobo,
          imageUrl: line.imageUrl,
          qty,
        },
      ];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    const q = Math.max(0, Math.floor(qty));
    setItems((prev) => {
      if (q === 0) return prev.filter((x) => x.productId !== productId);
      const i = prev.findIndex((x) => x.productId === productId);
      if (i < 0) return prev;
      const next = [...prev];
      next[i] = { ...next[i], qty: q };
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((s, x) => s + x.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, itemCount, addItem, setQty, removeItem, clear }),
    [items, itemCount, addItem, setQty, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
