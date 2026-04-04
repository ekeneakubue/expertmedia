'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/team', label: 'Our Team' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/products', label: 'Manage Products' },
  { href: '/admin/tickets', label: 'Tickets' },
  { href: '/admin/analysis', label: 'Data collection' },
  { href: '/admin/hero', label: 'Manage Hero' },
  { href: '/admin/settings', label: 'Settings' },
];

const staffLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/team', label: 'Our Team' },
  { href: '/admin/clients', label: 'Clients' },
  { href: '/admin/products', label: 'Manage Products' },
  { href: '/admin/tickets', label: 'Tickets' },
  { href: '/admin/analysis', label: 'Data collection' },
  { href: '/admin/hero', label: 'Manage Hero' },
  { href: '/admin/settings', label: 'Settings' },
];

const clientLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/tickets', label: 'Tickets' },
  { href: '/admin/analysis', label: 'Data collection' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminNav({ role: roleProp, userCount }: { role?: string; userCount?: number }) {
  const pathname = usePathname();

  const effectiveRole = roleProp || 'ADMIN';
  const roleLinks = effectiveRole === 'CLIENT' ? clientLinks : (effectiveRole === 'MANAGER' || effectiveRole === 'STAFF') ? staffLinks : adminLinks;

  return (
    <nav className="flex flex-col gap-1 text-sm mt-10">
      {roleLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              'rounded-tl-[15px] rounded-bl-[15px] pl-16 px-3 py-4 transition-colors ' +
              (isActive
                ? 'bg-gray-200 text-red-700 hover:text-red-700 dark:bg-red-900/40 dark:text-red-200'
                : 'hover:bg-gray-100 hover:text-red-700 dark:hover:bg-neutral-800')
            }
          >
            {link.label}
            {link.href === '/admin/users' && userCount !== undefined && userCount > 0 && (
              <span className="ml-2 inline-block text-xs rounded-full bg-red-500 text-white px-2 py-[1px] align-middle">{userCount}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}


