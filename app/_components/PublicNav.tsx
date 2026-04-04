'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HiBars3, HiShoppingBag, HiXMark } from 'react-icons/hi2';
import { useCart } from '@/app/_components/CartProvider';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  { href: '/team', label: 'Our Team' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contacts', label: 'Contact Us' },
] as const;

function CartNavLink() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const isActive = pathname === '/cart';

  const badge =
    itemCount > 0 ? (
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
        {itemCount > 99 ? '99+' : itemCount}
      </span>
    ) : null;

  if (isActive) {
    return (
      <span
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-500 text-white shadow-sm"
        aria-current="page"
        aria-label={itemCount ? `Cart, ${itemCount} items` : 'Cart'}
      >
        <HiShoppingBag className="h-6 w-6" aria-hidden />
        {badge}
      </span>
    );
  }

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
      aria-label={itemCount ? `Cart, ${itemCount} items` : 'Cart'}
    >
      <HiShoppingBag className="h-6 w-6" aria-hidden />
      {badge}
    </Link>
  );
}

export function PublicNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:py-5">
          <Link href="/" className="min-w-0 shrink leading-none">
            <Image
              src="/images/logo.png"
              alt="Expert Media Solutions"
              width={280}
              height={84}
              className="h-14 w-auto sm:h-16 md:h-[4.25rem] lg:h-[4.25rem]"
              priority
              quality={100}
            />
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-end gap-x-0.5 lg:flex xl:gap-x-1"
            aria-label="Main"
          >
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive = pathname === href;
              return isActive ? (
                <span
                  key={href}
                  className="whitespace-nowrap rounded-full bg-red-500 px-2.5 py-2 text-xs font-medium text-white shadow-sm sm:px-3 sm:text-sm xl:px-4"
                >
                  {label}
                </span>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="whitespace-nowrap rounded-full px-2.5 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-red-50 hover:text-red-600 sm:px-3 sm:text-sm xl:px-4"
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <CartNavLink />
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="public-nav-mobile"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <HiXMark className="h-6 w-6" aria-hidden /> : <HiBars3 className="h-6 w-6" aria-hidden />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div
            id="public-nav-mobile"
            className="max-h-[min(75vh,24rem)] overflow-y-auto overscroll-contain border-t border-neutral-200 bg-white lg:hidden"
          >
            <nav
              className="flex flex-col items-center gap-1 px-4 py-3 sm:gap-1.5 sm:px-6 sm:py-4"
              aria-label="Mobile"
            >
              {NAV_ITEMS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`w-full max-w-sm text-center rounded-xl px-4 py-3.5 text-base font-medium transition-colors sm:max-w-md sm:py-4 ${
                      isActive
                        ? 'bg-red-500 text-white'
                        : 'text-neutral-800 hover:bg-red-50 hover:text-red-600'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
    </>
  );
}
