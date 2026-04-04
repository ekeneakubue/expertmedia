export type PaystackVerifyData = {
  status: 'success' | string;
  reference: string;
  amount: number;
  metadata?: Record<string, unknown> | null;
};

export type PaystackVerifyResponse = {
  status: boolean;
  message?: string;
  data?: PaystackVerifyData;
};

export async function verifyPaystackTransaction(reference: string, secret: string) {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: 'no-store',
  });
  const json = (await res.json()) as PaystackVerifyResponse;
  if (!res.ok || json.status !== true) {
    return { ok: false as const, message: json.message || 'Verification failed' };
  }
  return { ok: true as const, data: json.data };
}
