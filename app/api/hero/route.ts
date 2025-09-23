import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function GET() {
  const { blobs } = await list({ prefix: 'hero/' })
  const images = blobs
    .filter((b) => (b.contentType || '').startsWith('image/'))
    .map((b) => ({ url: b.url, size: b.size, uploadedAt: (b as any).uploadedAt ? new Date((b as any).uploadedAt).toISOString() : '' }))
  return NextResponse.json(images)
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return new NextResponse('No file provided', { status: 400 })
  }
  const key = `hero/${randomUUID()}__${file.name}`
  const uploaded = await put(key, file, { access: 'public', contentType: file.type || undefined })
  return NextResponse.json({ ok: true, url: uploaded.url })
}







