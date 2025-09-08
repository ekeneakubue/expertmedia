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
  const blob = new Blob([data]);
  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(name)}"`,
    },
  });
}


