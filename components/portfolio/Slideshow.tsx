'use client';

import { useEffect, useRef, useState } from 'react';
import type { Shot } from '@/data/projects';

/**
 * Card cover that cross-fades between a project's screenshots.
 * It only ticks while the card is on screen and the tab is visible, and stays still for reduced-motion users.
 * Only opacity changes, so it costs almost nothing to render.
 */
export default function Slideshow({ shots, name, order = 0 }: { shots: Shot[]; name: string; order?: number }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || shots.length < 2) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer = window.setTimeout(function tick() {
      if (!document.hidden) setCurrent((n) => (n + 1) % shots.length);
      timer = window.setTimeout(tick, 3400);
    }, 1400 + order * 650); // each card starts a little later, so they never move in lockstep
    return () => window.clearTimeout(timer);
  }, [visible, shots.length, order]);

  return (
    <div className="media" ref={box} role="img" aria-label={`${name} screenshots: ${shots[current].caption}`}>
      <div className="slides">
        {shots.map((s, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s.src} src={s.src} alt="" className={k === current ? 'on' : undefined} loading={k === 0 ? 'eager' : 'lazy'} decoding="async" width={1600} height={900} />
        ))}
      </div>
      {shots.length > 1 && (
        <div className="dots" aria-hidden="true">
          {shots.map((s, k) => <i key={s.src} className={k === current ? 'on' : undefined} />)}
        </div>
      )}
    </div>
  );
}
