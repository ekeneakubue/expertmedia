import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

async function ensureDir() {
  try { await fs.mkdir(UPLOAD_DIR, { recursive: true }); } catch {}
}

export async function GET() {
  await ensureDir();
  const entries = await fs.readdir(UPLOAD_DIR).catch(() => [] as string[]);
  const files = await Promise.all(entries.map(async (name) => {
    const p = path.join(UPLOAD_DIR, name);
    const stat = await fs.stat(p);
    const [uuid, ...rest] = name.split('__');
    const display = rest.length > 0 ? rest.join('__') : name;
    return { id: uuid, name: display, size: stat.size, createdAt: stat.birthtime.toISOString() };
  }));
  return NextResponse.json(files);
}

export async function POST(req: NextRequest) {
  await ensureDir();
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return new NextResponse('No file provided', { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const id = randomUUID();
  const filename = `${id}__${file.name}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return NextResponse.json({ ok: true, id, name: file.name, size: buffer.length });
}


