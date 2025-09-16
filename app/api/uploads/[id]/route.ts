import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const entries = await fs.readdir(UPLOAD_DIR).catch(() => [] as string[]);
  const file = entries.find((e) => e.startsWith(id + '__') || e === id);
  if (!file) return new NextResponse('Not found', { status: 404 });
  const data = await fs.readFile(path.join(UPLOAD_DIR, file));
  const name = file.includes('__') ? file.split('__').slice(1).join('__') : file;
  // Build a Blob from a Uint8Array (BodyInit-compatible)
  const uint8 = new Uint8Array(data);
  const blob = new Blob([uint8]);
  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(name)}"`,
    },
  });
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const entries = await fs.readdir(UPLOAD_DIR).catch(() => [] as string[]);
  const file = entries.find((e) => e.startsWith(id + '__') || e === id);
  if (!file) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  try {
    await fs.unlink(path.join(UPLOAD_DIR, file));
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}


