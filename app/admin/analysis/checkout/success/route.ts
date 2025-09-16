import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

type PaystackVerifyData = {
  status: 'success' | string
  reference: string
  amount: number
  metadata?: { fileId?: string } | null
}

type PaystackVerifyResponse = {
  status: boolean
  message?: string
  data?: PaystackVerifyData
}

async function verifyPaystack(reference: string, secret: string) {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: 'no-store',
  })
  const json = (await res.json()) as PaystackVerifyResponse
  if (!res.ok || json.status !== true) return { ok: false as const, message: json.message || 'Verification failed' }
  return { ok: true as const, data: json.data }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  let fileId = url.searchParams.get('fileId') || undefined
  const reference = url.searchParams.get('reference') || url.searchParams.get('trxref') || undefined
  const secret = process.env.PAYSTACK_SECRET_KEY || ''

  if (reference && secret) {
    const v = await verifyPaystack(reference, secret)
    if (v.ok && v.data?.status === 'success') {
      try { await prisma.payment.update({ where: { reference }, data: { status: 'SUCCESS' } }) } catch {}
      if (!fileId) {
        const meta = v.data?.metadata
        if (meta?.fileId) fileId = String(meta.fileId)
      }
      // Best-effort: mark local upload metadata as paid
      if (fileId) {
        try {
          const uploadDir = path.join(process.cwd(), 'uploads')
          const metaPath = path.join(uploadDir, `${fileId}.json`)
          let metaObj: Record<string, unknown> = {}
          try {
            const existing = await fs.readFile(metaPath, 'utf8')
            metaObj = JSON.parse(existing)
          } catch {}
          metaObj.paid = true
          await fs.writeFile(metaPath, JSON.stringify(metaObj))
        } catch {}
      }
    } else {
      try { await prisma.payment.update({ where: { reference }, data: { status: 'FAILED' } }) } catch {}
    }
  }

  const q = new URLSearchParams()
  q.set('paid', '1')
  if (fileId) q.set('fileId', fileId)
  return NextResponse.redirect(new URL(`/admin/analysis?${q.toString()}`, req.url))
}



