import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const store = await cookies();
    const role = store.get('role')?.value || null;
    return NextResponse.json({ role });
  } catch {
    return NextResponse.json({ role: null });
  }
}


