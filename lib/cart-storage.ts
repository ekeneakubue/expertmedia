/** Must match CartProvider — single source of truth for localStorage cart persistence. */
export const CART_STORAGE_KEY = 'ems-cart-v1';

export function clearCartBrowserStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}
