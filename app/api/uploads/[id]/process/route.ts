import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const entries = await fs.readdir(UPLOAD_DIR).catch(() => [] as string[]);
    const file = entries.find((e) => e.startsWith(id + '__') || e === id);
    if (!file) return NextResponse.json({ message: 'File not found' }, { status: 404 });

    // Placeholder: simulate processing work
    // In a real implementation, parse the file and persist results.
    await new Promise((r) => setTimeout(r, 800));

    return NextResponse.json({ ok: true, id, processed: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}


