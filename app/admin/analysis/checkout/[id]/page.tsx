import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import LocationForm from './LocationForm';

export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

async function fileExists(id: string) {
  const entries = await fs.readdir(UPLOAD_DIR).catch(() => [] as string[]);
  return entries.some((e) => e.startsWith(id + '__') || e === id);
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await fileExists(id);
  if (!ok) notFound();

  // Demo value; replace with real pricing source if needed
  const processingAmount = 25000; // in NGN (example)

  return (
    <div className="space-y-6 overflow-y-scroll px-8 py-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <LocationForm fileId={id} amount={processingAmount} />
    </div>
  );
}


