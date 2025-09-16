'use client';

import { useMemo, useState } from 'react';

type Props = {
  fileId: string;
  amount: number;
};

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT (Abuja)'
];

const INSTITUTION_TYPES = [
  { value: 'UNIVERSITY', label: 'University' },
  { value: 'COLLEGE_OF_EDUCATION', label: 'College of Education' },
  { value: 'POLYTECHNIC', label: 'Polytechnic' },
];

export default function LocationForm({ fileId, amount }: Props) {
  const [email, setEmail] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canPay = useMemo(() => email && selectedState && institutionType && addressLine, [email, selectedState, institutionType, addressLine]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPay || loading) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch('/api/payments/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileId,
            amount,
            email,
            state: selectedState,
            institutionType,
            institutionName: institutionName || null,
            address: addressLine,
          }),
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => ({} as { message?: string }));
          setError(payload.message || 'Could not initialize payment');
          setLoading(false);
          return;
        }
        const { authorizationUrl } = await res.json();
        window.location.href = authorizationUrl;
      } catch (_err) {
        setError('Network error');
        setLoading(false);
      }
    })();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 border rounded-md p-4 bg-white dark:bg-neutral-900">
        <form onSubmit={onSubmit} className="grid gap-3 text-sm">
          <div className="grid gap-1">
            <label className="font-medium">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
          <div className="grid gap-1">
            <label className="font-medium">Select State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              required
              className="border rounded px-3 py-2"
            >
              <option value="">Choose a state</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-1">
            <label className="font-medium">Institution Type</label>
            <select
              value={institutionType}
              onChange={(e) => setInstitutionType(e.target.value)}
              required
              className="border rounded px-3 py-2"
            >
              <option value="">Select type</option>
              {INSTITUTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-1">
            <label className="font-medium">Institution Name (optional)</label>
            <input
              type="text"
              placeholder="e.g., University of Lagos"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="grid gap-1">
            <label className="font-medium">Address</label>
            <input
              type="text"
              placeholder="Street address, campus, etc."
              required
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!canPay || loading}
              className="rounded-md bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2"
            >
              {loading ? 'Redirecting…' : `Pay ₦${amount.toLocaleString()}`}
            </button>
            <a href="/admin/analysis" className="rounded-md border px-4 py-2 text-center">Back</a>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
        </form>
      </div>

      <div className="border rounded-md p-4 bg-white dark:bg-neutral-900 h-fit">
        <div className="text-sm font-medium mb-3">Summary</div>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Processing amount</span>
            <span className="font-semibold">₦{amount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>State</span>
            <span className="font-medium">{selectedState || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Institution type</span>
            <span className="font-medium">{INSTITUTION_TYPES.find(t => t.value === institutionType)?.label || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Institution name</span>
            <span className="font-medium truncate max-w-[200px]">{institutionName || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Address</span>
            <span className="font-medium truncate max-w-[200px]">{addressLine || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


