import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="pf case">
      <p className="eyebrow">404</p>
      <h1 className="nf-title">This branch hasn&apos;t grown yet.</h1>
      <Link className="case-back" href="/">Return to my world ↗</Link>
    </main>
  );
}
