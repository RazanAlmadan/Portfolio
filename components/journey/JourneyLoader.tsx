'use client';

import dynamic from 'next/dynamic';

// Three.js is only needed by the journey: keep it out of the initial bundle and out of SSR.
const JourneyScene = dynamic(() => import('./JourneyScene'), {
  ssr: false,
  loading: () => <div className="journey-skeleton" aria-hidden="true"><span>Loading the journey…</span></div>,
});

export default function JourneyLoader() {
  return <JourneyScene />;
}
