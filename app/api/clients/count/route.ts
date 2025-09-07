import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const total = await prisma.client.count();
  return NextResponse.json({ total });
}


