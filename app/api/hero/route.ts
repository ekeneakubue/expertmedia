import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import path from 'path'
import { randomUUID } from 'crypto'
import { saveUploadedFile } from '@/lib/server-media'

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
    const diskFileName = `${randomUUID()}${ext}`
    const { url, filename } = await saveUploadedFile(file, 'hero', diskFileName)

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
