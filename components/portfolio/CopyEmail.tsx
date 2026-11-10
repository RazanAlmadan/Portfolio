'use client';

import { useState } from 'react';

export default function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(email); } catch { /* clipboard blocked: the address is still visible to copy by hand */ }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }
  return (
    <button type="button" onClick={copy} aria-live="polite">{done ? 'Copied' : 'Copy'}</button>
  );
}
