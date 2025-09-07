'use client';

import { useState } from 'react';
import Link from 'next/link';

type NavLink = { href: string; label: string };

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        aria-label="Open menu"
        className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm"
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-2 z-20 bg-red-400 h-screen dark:bg-neutral-950">
          <nav className="flex flex-col pt-8 text-center">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-4 border-b border-b-amber-50 text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}


