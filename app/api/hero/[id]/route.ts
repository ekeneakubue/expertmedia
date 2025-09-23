import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const HERO_DIR = path.join(process.cwd(), 'uploads', 'hero')

// filePath helper removed (unused)

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entries = await fs.readdir(HERO_DIR).catch(() => [] as string[])
  const name = entries.find((e) => e.startsWith(id + '__'))
  if (!name) return new NextResponse('Not found', { status: 404 })
  const p = path.join(HERO_DIR, name)
  const data = await fs.readFile(p)
  const ext = path.extname(name).toLowerCase()
  const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  // Convert Node.js Buffer to a web-compatible body type
  const bytes = new Uint8Array(data)
  return new NextResponse(bytes, { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=3600' } })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entries = await fs.readdir(HERO_DIR).catch(() => [] as string[])
  const name = entries.find((e) => e.startsWith(id + '__'))
  if (!name) return new NextResponse('Not found', { status: 404 })
  const p = path.join(HERO_DIR, name)
  try { await fs.unlink(p) } catch {}
  return NextResponse.json({ ok: true })
}



