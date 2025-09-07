'use client';

import AddUser from './AddUser';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function AddUserModal({ open, onClose, onCreated }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-900 rounded-md p-5 w-full max-w-xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Add user</h2>
          <button onClick={onClose} className="text-sm rounded-md border px-2 py-1">Close</button>
        </div>
        <AddUser onCreated={() => { onCreated?.(); onClose(); }} />
      </div>
    </div>
  );
}


