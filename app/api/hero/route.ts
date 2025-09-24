import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'hero/', token: BLOB_TOKEN })
    const images = blobs
      .filter((b) => /\.(png|jpe?g|webp|gif|avif)$/i.test(b.pathname))
      .map((b) => ({ url: b.url, size: b.size }))
      .filter((i) => !!i.url)
    return NextResponse.json(images)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to list hero images'
    return NextResponse.json({ message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return new NextResponse('No file provided', { status: 400 })
    }
    const key = `hero/${randomUUID()}__${file.name}`
    const uploaded = await put(key, file, { access: 'public', contentType: file.type || undefined, token: BLOB_TOKEN })
    return NextResponse.json({ ok: true, url: uploaded.url })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Upload failed'
    return NextResponse.json({ message }, { status: 500 })
  }
}







