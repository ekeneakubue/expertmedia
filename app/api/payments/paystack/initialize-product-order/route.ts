import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

type LineItem = {
  productId: string;
  name: string;
  qty: number;
  priceKobo: number;
};

type InitBody = {
  email: string;
  amountKobo: number;
  phone: string;
  deliveryAddress: string;
  lineItems: LineItem[];
};

export async function POST(req: NextRequest) {
  try {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    const rawBase =
      process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || new URL('/', req.url).origin.replace(/\/$/, '');
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ message: 'PAYSTACK_SECRET_KEY not configured' }, { status: 500 });
    }

    const body = (await req.json()) as InitBody;
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const phone = String(body.phone || '').trim();
    const deliveryAddress = String(body.deliveryAddress || '').trim();
    const lineItems = Array.isArray(body.lineItems) ? body.lineItems : [];
    const expectedKobo = lineItems.reduce((sum, l) => {
      const qty = Math.max(0, Math.floor(Number(l.qty)));
      const unit = Math.round(Number(l.priceKobo));
      return sum + (Number.isFinite(unit) && Number.isFinite(qty) ? unit * qty : 0);
    }, 0);
    const amountKobo = Math.round(Number(body.amountKobo));

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Valid email is required for payment' }, { status: 400 });
    }
    if (!phone || !deliveryAddress) {
      return NextResponse.json({ message: 'Phone and delivery address are required' }, { status: 400 });
    }
    if (!Number.isFinite(amountKobo) || amountKobo < 100) {
      return NextResponse.json({ message: 'Invalid payment amount' }, { status: 400 });
    }
    if (lineItems.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }
    if (expectedKobo !== amountKobo) {
      return NextResponse.json({ message: 'Cart total does not match line items' }, { status: 400 });
    }

    const orderId = `shop-${randomUUID()}`;
    const itemsSummary = lineItems
      .map((l) => `${l.name} ×${l.qty}`)
      .join('; ')
      .slice(0, 450);

    const metadata: Record<string, string> = {
      kind: 'product_order',
      orderId,
      phone,
    };

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        currency: 'NGN',
        callback_url: `${rawBase}/checkout/success`,
        metadata,
      }),
    });

    type InitJson = {
      status: boolean;
      message?: string;
      data?: { authorization_url: string; reference: string };
    };
    const json = (await res.json()) as InitJson;
    if (!res.ok || json.status !== true || !json.data) {
      return NextResponse.json({ message: json.message || 'Failed to initialize payment' }, { status: 502 });
    }

    try {
      await prisma.payment.create({
        data: {
          fileId: orderId,
          amount: amountKobo,
          reference: json.data.reference,
          status: 'PENDING',
          state: phone,
          institutionType: 'PRODUCT_ORDER',
          institutionName: itemsSummary,
          address: deliveryAddress,
        },
      });
    } catch {
      // best-effort
    }

    const authorizationUrl = json.data.authorization_url;
    return NextResponse.json({
      authorizationUrl,
      /** Alias for clients expecting Paystack snake_case */
      authorization_url: authorizationUrl,
      reference: json.data.reference,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
