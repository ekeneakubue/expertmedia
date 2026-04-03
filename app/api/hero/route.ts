import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const images = await prisma.heroImage.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, url: true, size: true, createdAt: true, order: true },
    })
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
      return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase() || '.jpg'
    const filename = `${randomUUID()}${ext}`
    const heroDir = path.join(process.cwd(), 'public', 'hero')
    await fs.mkdir(heroDir, { recursive: true })
    const buf = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(path.join(heroDir, filename), buf)

    const url = `/hero/${filename}`
    const count = await prisma.heroImage.count()
    const image = await prisma.heroImage.create({
      data: { filename, url, size: file.size, order: count },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Upload failed'
    return NextResponse.json({ message }, { status: 500 })
  }
}
