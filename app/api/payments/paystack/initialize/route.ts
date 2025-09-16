import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

type InitBody = {
  fileId: string
  amount: number
  email: string
  state: string
  institutionType: string
  institutionName: string | null
  address: string
}

export async function POST(req: NextRequest) {
  try {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || new URL('/', req.url).origin
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ message: 'PAYSTACK_SECRET_KEY not configured' }, { status: 500 })
    }

    const body = (await req.json()) as InitBody
    if (!body.email || !body.amount || !body.fileId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const amountKobo = Math.round(body.amount * 100)

    const metadata = {
      fileId: body.fileId,
      state: body.state,
      institutionType: body.institutionType,
      institutionName: body.institutionName,
      address: body.address,
    }

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        amount: amountKobo,
        callback_url: `${BASE_URL}/admin/analysis/checkout/success?fileId=${encodeURIComponent(body.fileId)}`,
        metadata,
      }),
    })

    type InitJson = {
      status: boolean
      message?: string
      data?: { authorization_url: string; reference: string }
    }
    const json = (await res.json()) as InitJson
    if (!res.ok || json.status !== true) {
      return NextResponse.json({ message: json.message || 'Failed to initialize payment' }, { status: 502 })
    }

    // Persist pending payment intent (best-effort; don't crash if table not yet created)
    try {
      await prisma.payment.create({
        data: {
          fileId: body.fileId,
          amount: amountKobo,
          reference: json.data.reference,
          status: 'PENDING',
          state: body.state,
          institutionType: body.institutionType,
          institutionName: body.institutionName,
          address: body.address,
        },
      })
    } catch {}

    return NextResponse.json({ authorizationUrl: json.data.authorization_url, reference: json.data.reference })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error'
    return NextResponse.json({ message }, { status: 500 })
  }
}
