'use client';

import { useEffect, useRef, useState } from 'react';
import type { ProjectVideo, Shot } from '@/data/projects';

/**
 * Project-page gallery: big view, thumbnails, arrow keys, click-to-enlarge.
 * Advances by itself every few seconds, but pauses on hover or focus, while enlarged,
 * off-screen, in a background tab, and for reduced-motion users. A video-only project shows a normal player.
 */
export default function Gallery({ shots = [], video, name }: { shots?: Shot[]; video?: ProjectVideo; name: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [zoom, setZoom] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const n = shots.length;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (n < 2 || paused || zoom || !visible) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => { if (!document.hidden) setI((x) => (x + 1) % n); }, 4200);
    return () => window.clearInterval(t);
  }, [n, paused, zoom, visible, i]); // `i` restarts the timer after a manual change

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoom(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoom]);

  if (!n && video) {
    return (
      <div className="gal" ref={root}>
        <div className="gal-main" style={{ cursor: 'default' }}>
          <video src={video.src} poster={video.poster} controls muted loop playsInline preload="metadata" aria-label={`${name} walkthrough video`} />
        </div>
        <p className="gal-cap">{video.caption}</p>
      </div>
    );
  }
  if (!n) return null;

  const go = (k: number) => setI((k + n) % n);
  return (
    <div
      className="gal"
      ref={root}
      tabIndex={0}
      aria-label={`${name} screenshot gallery`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); }}
    >
      <button type="button" className="gal-main" onClick={() => setZoom(true)} aria-label="Enlarge screenshot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shots[i].src} alt={shots[i].caption} decoding="async" />
      </button>
      <p className="gal-cap" aria-live="off">{shots[i].caption}</p>
      {n > 1 && (
        <div className="gal-thumbs">
          {shots.map((s, k) => (
            <button type="button" key={s.src} onClick={() => go(k)} aria-label={s.caption} aria-current={k === i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
      {zoom && (
        <div className="lb on" role="dialog" aria-modal="true" aria-label="Enlarged screenshot" onClick={() => setZoom(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shots[i].src} alt={shots[i].caption} />
        </div>
      )}
    </div>
  );
}
