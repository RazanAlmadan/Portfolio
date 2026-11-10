'use client';

import { useEffect, useRef } from 'react';
import { JOURNEY_HTML } from './markup';
import { startJourney } from './engine';

/**
 * The cinematic journey. All animation is imperative (refs/DOM + one rAF loop), never React state,
 * so scrolling never triggers React renders.
 */
export default function JourneyScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    // Always start from fresh markup (Strict Mode runs effects twice in dev).
    host.innerHTML = JOURNEY_HTML;
    // Let the gateway paint first, then build the 3D tree without blocking the first frame.
    const t = window.setTimeout(() => {
      if (!cancelled) stop = startJourney();
    }, 60);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      stop?.();
    };
  }, []);

  return <div ref={hostRef} className="journey-host" suppressHydrationWarning />;
}
