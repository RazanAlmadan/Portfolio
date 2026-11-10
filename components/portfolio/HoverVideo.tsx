'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProjectVideo } from '@/data/projects';

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
  const [canHover, setCanHover] = useState(true);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setCanHover(matchMedia('(hover: hover)').matches);
    setReduce(matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

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
