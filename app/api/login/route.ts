import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const user = await findUserByEmail(String(email).toLowerCase());
    if (user) {
      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      const res = NextResponse.json({ redirectTo: '/admin' }, { status: 200 });
      res.cookies.set('role', String(user.role || 'ADMIN'), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
      res.cookies.set('userEmail', user.email, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
      return res;
    }

    // Fallback: allow clients to log in by email only (no password) if they exist in Clients table
    const client = await prisma.client.findFirst({ where: { email: String(email).toLowerCase() } });
    if (!client) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    const res = NextResponse.json({ redirectTo: '/admin' }, { status: 200 });
    res.cookies.set('role', 'CLIENT', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
    res.cookies.set('userEmail', client.email || '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}


