// Link import removed: not used in this layout
import Image from "next/image";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminNav } from "./_components/AdminNav";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Protect admin: require role cookie set to ADMIN or CLIENT
  const store = await cookies();
  const role = store.get('role')?.value;
  const userEmail = store.get('userEmail')?.value?.toLowerCase() || '';
  if (role !== 'ADMIN' && role !== 'CLIENT' && role !== 'STAFF' && role !== 'MANAGER') {
    redirect('/login');
  }

  // Fetch avatar/name and user count for sidebar
  let avatarUrl: string | null = null;
  let displayName: string = 'Profile';
  let userCount = 0;
  try {
    userCount = await prisma.user.count();
  } catch {}
  if (userEmail) {
    try {
      const user = await prisma.user.findUnique({ where: { email: userEmail }, select: { name: true, imageUrl: true } });
      if (user) {
        displayName = user.name || displayName;
        avatarUrl = user.imageUrl || null;
      } else {
        const client = await prisma.client.findFirst({ where: { email: userEmail }, select: { name: true } });
        if (client) displayName = client.name || displayName;
      }
    } catch {}
  }
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-200 dark:bg-neutral-950">
      {/* Fixed sidebar — always 100vh, never scrolls */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-[240px] flex-col overflow-y-auto border-r border-neutral-700/80 bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-100">
        <div className="mb-6 w-full shrink-0 text-center">
          <Image src="/images/logo2.png" alt="Expert Media Solutions" width={160} height={48} className="inline-block w-[50%] pt-6" />
        </div>
        <div className="min-h-0 flex-1">
          <AdminNav role={role || undefined} userCount={userCount} />
        </div>
        <div className="shrink-0 border-t border-neutral-700/60 px-5 py-4 text-xs text-neutral-500">EMS Admin</div>
      </aside>

      {/* Main content — offset by sidebar width, independently scrollable */}
      <div className="ml-[240px] flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-700/80 bg-gradient-to-r from-neutral-900 to-neutral-900 px-6 py-3.5 text-white shadow-sm">
          <div className="text-base font-semibold tracking-tight">Dashboard</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full bg-white/5 py-1 pl-1 pr-3">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} width={32} height={32} className="rounded-full object-cover ring-2 ring-red-500/30" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-neutral-600 ring-2 ring-red-500/20" />
              )}
              <span className="hidden text-sm text-neutral-200 sm:inline-block">{displayName}</span>
            </div>
            <form action="/api/logout" method="post">
              <button
                type="submit"
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


