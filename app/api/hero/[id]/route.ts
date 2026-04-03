import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const image = await prisma.heroImage.findUnique({ where: { id } })
    if (!image) return NextResponse.json({ message: 'Not found' }, { status: 404 })

    // Remove file from disk
    try {
      const filePath = path.join(process.cwd(), 'public', 'hero', image.filename)
      await fs.unlink(filePath)
    } catch {}

    await prisma.heroImage.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Delete failed'
    return NextResponse.json({ message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const { order } = await req.json()
    const image = await prisma.heroImage.update({ where: { id }, data: { order } })
    return NextResponse.json(image)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Update failed'
    return NextResponse.json({ message }, { status: 500 })
  }
}
