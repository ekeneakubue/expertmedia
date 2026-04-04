'use client';

import { useLayoutEffect } from 'react';
import { useCart } from '@/app/_components/CartProvider';
import { clearCartBrowserStorage } from '@/lib/cart-storage';

/**
 * Runs before CartProvider's hydration useEffect (layout vs passive) so we wipe
 * localStorage first, then sync React state — avoids the cart reappearing after pay.
 */
export function ClearCartOnSuccess() {
  const { clear } = useCart();

  useLayoutEffect(() => {
    clearCartBrowserStorage();
    clear();
  }, [clear]);

  return null;
}
