import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const clients = await prisma.client.findMany({
    select: { id: true, name: true, email: true, industry: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, industry, notes } = await req.json();
    if (!name && !email) {
      return NextResponse.json({ message: 'Name or email required' }, { status: 400 });
    }
    const client = await prisma.client.create({
      data: { name: name || email, email: email || null, phone: phone || null, industry: industry || null, notes: notes || null },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Server error' }, { status: 500 });
  }
}


