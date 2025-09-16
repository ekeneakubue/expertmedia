import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

async function ensureDir() {
  try { await fs.mkdir(UPLOAD_DIR, { recursive: true }); } catch {}
}

export async function GET(req: NextRequest) {
  await ensureDir();
  const cookieStore = await cookies();
  const role = cookieStore.get('role')?.value || '';
  const userEmail = cookieStore.get('userEmail')?.value?.toLowerCase() || '';
  const url = new URL(req.url);
  const tab = url.searchParams.get('tab') || '';
  const entries = await fs.readdir(UPLOAD_DIR).catch(() => [] as string[]);
  type UploadListing = {
    id: string
    name: string
    size: number
    createdAt: string
    paid: boolean
    clientName?: string
    email?: string
  }
  const files = await Promise.all(entries.map(async (name): Promise<UploadListing> => {
    const p = path.join(UPLOAD_DIR, name);
    const stat = await fs.stat(p);
    const [uuid, ...rest] = name.split('__');
    const display = rest.length > 0 ? rest.join('__') : name;
    let paid = false;
    let clientName: string | undefined;
    let metaEmail: string | undefined;
    // read optional metadata file alongside upload
    try {
      const metaRaw = await fs.readFile(path.join(UPLOAD_DIR, `${uuid}.json`), 'utf8');
      const meta = JSON.parse(metaRaw) as { clientName?: string; email?: string };
      clientName = meta.clientName || undefined;
      metaEmail = meta.email || undefined;
    } catch {}
    try {
      const payment = await prisma.payment.findFirst({ where: { fileId: uuid, status: 'SUCCESS' }, select: { id: true } });
      paid = !!payment;
    } catch {}
    return { id: uuid, name: display, size: stat.size, createdAt: stat.birthtime.toISOString(), paid, clientName, email: metaEmail } as const;
  }));
  const visible = role === 'ADMIN'
    ? (tab === 'unpaid' ? files.filter((f) => !f.paid) : files.filter((f) => !!f.paid))
    : files.filter((f) => (f.email || '').toLowerCase() === userEmail && userEmail);
  const sanitized = visible.map(({ email, ...rest }) => rest);
  return NextResponse.json(sanitized);
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
  // best-effort: store uploader metadata to associate client name
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('userEmail')?.value?.toLowerCase() || '';
    let clientName: string | undefined;
    if (userEmail) {
      try {
        const user = await prisma.user.findUnique({ where: { email: userEmail }, select: { name: true } });
        if (user?.name) clientName = user.name;
        if (!clientName) {
          const client = await prisma.client.findFirst({ where: { email: userEmail }, select: { name: true } });
          if (client?.name) clientName = client.name;
        }
      } catch {}
    }
    const meta = { clientName: clientName || undefined, email: userEmail || undefined };
    await fs.writeFile(path.join(UPLOAD_DIR, `${id}.json`), JSON.stringify(meta));
  } catch {}
  return NextResponse.json({ ok: true, id, name: file.name, size: buffer.length });
}


