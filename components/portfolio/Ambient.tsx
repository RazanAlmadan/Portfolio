'use client';

import { useEffect, useRef } from 'react';
import { BUTTERFLY_SVG } from './butterflySvg';

// Fixed values (no Math.random) so server and client markup always match.
// Colours are taken from the tree: cyan, blue, violet, magenta.
const LEAVES = [
  { x: 6, s: 14, d: 26, dl: -4, sw: 90, a: '#5ee7ff', b: '#3a8dff' },
  { x: 14, s: 10, d: 31, dl: -19, sw: -70, a: '#8b5cff', b: '#4f46e5' },
  { x: 23, s: 16, d: 28, dl: -11, sw: 110, a: '#6a7bff', b: '#8b5cff' },
  { x: 33, s: 11, d: 34, dl: -26, sw: -90, a: '#3cc4dc', b: '#2b6fe0' },
  { x: 42, s: 13, d: 29, dl: -7, sw: 80, a: '#c46bff', b: '#7c5cff' },
  { x: 51, s: 9, d: 36, dl: -30, sw: -60, a: '#5ee7ff', b: '#6a7bff' },
  { x: 60, s: 15, d: 27, dl: -15, sw: 100, a: '#4f8bff', b: '#8b5cff' },
  { x: 68, s: 10, d: 33, dl: -22, sw: -100, a: '#ff7ad9', b: '#8b5cff' },
  { x: 76, s: 14, d: 30, dl: -2, sw: 70, a: '#3cc4dc', b: '#4f46e5' },
  { x: 84, s: 11, d: 35, dl: -28, sw: -80, a: '#8b5cff', b: '#3a8dff' },
  { x: 91, s: 13, d: 28, dl: -13, sw: 90, a: '#5ee7ff', b: '#c46bff' },
  { x: 97, s: 9, d: 32, dl: -9, sw: -50, a: '#6a7bff', b: '#3cc4dc' },
];

/**
 * Calm ambience for the portfolio part: tree-coloured leaves (pure CSS, GPU transforms) and the
 * butterfly companion. Everything pauses when the portfolio is off-screen or the tab is hidden.
 */
export default function Ambient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bfRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const bf = bfRef.current;
    const pf = document.querySelector('.pf');
    if (!root || !bf || !pf) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const weak = matchMedia('(pointer: coarse)').matches && (navigator.hardwareConcurrency || 8) <= 4;
    if (weak) root.classList.add('weak');

    let visible = false;
    let raf = 0;
    let x = innerWidth * 0.8, y = innerHeight * 0.62;
    let mx = x, my = y, lastMove = -1e9, lastT = performance.now(), frame = 0;
    let perchEl: Element | null = null, perchX = 0, perchY = 0;
    const seen = new Set<Element>();
    const heads = Array.from(pf.querySelectorAll('.pf-hero h2, .pf-h, .case-head h1'));

    const pickPerch = () => {
      let best: Element | null = null, top = Infinity;
      seen.forEach((el) => { const t = el.getBoundingClientRect().top; if (t < top) { top = t; best = el; } });
      perchEl = best;
    };
    const headIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      pickPerch();
    }, { rootMargin: '-18% 0px -52% 0px' });
    heads.forEach((h) => headIO.observe(h));

    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; lastMove = performance.now(); };
    if (finePointer) addEventListener('pointermove', onMove, { passive: true });

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now; frame++;
      const t = now / 1000;
      let tx: number, ty: number;
      if (finePointer && now - lastMove < 2600) { tx = mx + 64; ty = my + 38; }
      else if (perchEl) {
        if (frame % 8 === 0 || perchX === 0) {
          const r = perchEl.getBoundingClientRect();
          perchX = Math.min(innerWidth - 60, Math.max(60, r.left + Math.min(r.width, 720) + 46));
          perchY = r.top + Math.min(r.height * 0.25, 30);
        }
        tx = perchX; ty = perchY;
      } else { tx = innerWidth * 0.82; ty = innerHeight * 0.62; }
      if (innerWidth < 760 && !(finePointer && now - lastMove < 2600)) { tx = innerWidth - 40; ty = perchEl ? perchY : innerHeight * 0.3; }
      tx += Math.sin(t * 0.9) * 24; ty += Math.cos(t * 1.3) * 15;
      const k = 1 - Math.exp(-dt * 2.1);
      const vx = (tx - x) * k, vy = (ty - y) * k;
      x += vx; y += vy;
      const ang = Math.max(-20, Math.min(20, vx * 1.1));
      bf.style.transform = `translate3d(${(x - 30).toFixed(1)}px,${(y - 27).toFixed(1)}px,0) rotate(${ang.toFixed(1)}deg)`;
    };
    const start = () => { if (!raf && !reduced && visible && !document.hidden) { lastT = performance.now(); raf = requestAnimationFrame(tick); } };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    const pfIO = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      root.classList.toggle('on', visible);
      if (visible) start(); else stop();
    });
    pfIO.observe(pf);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stop(); pfIO.disconnect(); headIO.disconnect();
      removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const replay = () => {
    if (document.getElementById('stage')) window.scrollTo({ top: 0, behavior: 'smooth' });
    else window.location.assign('/');
  };

  return (
    <div className="amb" ref={rootRef}>
      <div className="leaves" aria-hidden="true">
        {LEAVES.map((l, i) => (
          <i
            key={i}
            className="lf"
            style={{ '--x': `${l.x}%`, '--s': `${l.s}px`, '--d': `${l.d}s`, '--dl': `${l.dl}s`, '--sw': `${l.sw}px`, '--c1': l.a, '--c2': l.b } as React.CSSProperties}
          />
        ))}
      </div>
      <button type="button" className="comp" ref={bfRef} onClick={replay} aria-label="Replay the journey" title="Replay the journey">
        <span className="comp-halo" />
        <span className="comp-svg" dangerouslySetInnerHTML={{ __html: BUTTERFLY_SVG }} />
      </button>
    </div>
  );
}
