'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ProjectVideo } from '@/data/projects';

/** Reads a CSS media query without setting state inside an effect (server value is used until the page is in the browser). */
function useMedia(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    (notify) => {
      const m = matchMedia(query);
      m.addEventListener('change', notify);
      return () => m.removeEventListener('change', notify);
    },
    () => matchMedia(query).matches,
    () => serverValue,
  );
}

/**
 * Card video: a still poster that plays while the mouse is over it.
 * On touch screens it plays while at least 60% visible and a tap pauses it.
 * The file is not downloaded until it is first played (preload="none").
 * Reduced-motion users get normal controls and nothing autoplays.
 */
export default function HoverVideo({ video, name }: { video: ProjectVideo; name: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const canHover = useMedia('(hover: hover)', true);
  const reduce = useMedia('(prefers-reduced-motion: reduce)', false);

  const play = () => { vid.current?.play().then(() => setPlaying(true)).catch(() => {}); };
  const pause = () => { vid.current?.pause(); setPlaying(false); };

  useEffect(() => {
    if (canHover || reduce || !wrap.current) return;
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio > 0.6 ? play() : pause()), { threshold: [0, 0.6, 1] });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, [canHover, reduce]);

  const hover = canHover && !reduce;
  return (
    <div
      ref={wrap}
      className={`media${playing ? ' playing' : ''}`}
      onMouseEnter={hover ? play : undefined}
      onMouseLeave={hover ? pause : undefined}
      onFocus={hover ? play : undefined}
      onBlur={hover ? pause : undefined}
      onClick={!canHover && !reduce ? () => (vid.current?.paused ? play() : pause()) : undefined}
    >
      <video ref={vid} src={video.src} poster={video.poster} muted loop playsInline preload="none" controls={reduce} aria-label={`${name} walkthrough video`} tabIndex={hover ? 0 : undefined} />
      {!reduce && <small className="vhint">{canHover ? '▶ Hover to preview' : 'Tap to pause'}</small>}
    </div>
  );
}
