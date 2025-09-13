import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', req.url), 303);
  res.cookies.set('role', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
  res.cookies.set('userEmail', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}


