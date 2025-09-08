import Link from "next/link";
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

  // Fetch avatar/name for header
  let avatarUrl: string | null = null;
  let displayName: string = 'Profile';
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
    <div className="h-screen grid grid-cols-[240px_1fr] bg-gray-200">
      <aside className="border-r bg-gray-800 text-gray-50 pl-5">
        <div className="text-center w-full mb-6">
          <Image src="/images/logo2.png" alt="Expert Media Solutions" width={160} height={48} className=" w-[50%] pt-6 inline-block" />
        </div>
        <AdminNav role={role || undefined} />
        <div className="mt-6 text-xs text-gray-500">v1.0</div>
      </aside>
      <main className="gap-4">
        <div className="flex bg-gray-800 text-white p-6 items-center justify-between">
          <div className="text-lg font-semibold">Dashboard</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} width={32} height={32} className="rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600" />
              )}
              <span className="text-sm hidden sm:inline-block">{displayName}</span>
            </div>
            <form action="/api/logout" method="post">
              <button className="text-sm rounded-md border px-3 py-1">Logout</button>
            </form>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}


