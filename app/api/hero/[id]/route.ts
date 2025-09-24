import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'

export const runtime = 'nodejs'
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

// In blob storage, ids are not used; this route can be a no-op or support deletion if given a URL
export async function GET() {
  return new NextResponse('Not implemented', { status: 404 })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) return new NextResponse('Missing url', { status: 400 })
  try { await del(url, { token: BLOB_TOKEN }) } catch {}
  return NextResponse.json({ ok: true })
}



