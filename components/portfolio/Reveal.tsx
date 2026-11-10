'use client';

import { useEffect } from 'react';

/** Fades sections in once as they enter the viewport. Content is never hidden before this runs (no-JS safe). */
export default function Reveal() {
  useEffect(() => {
    const pf = document.querySelector('.pf');
    if (!pf) return;
    const els = Array.from(pf.querySelectorAll<HTMLElement>('.rv'));
    const finish = (el: HTMLElement) => { el.classList.add('in'); window.setTimeout(() => el.classList.add('done'), 1100); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach((el) => { el.classList.add('in', 'done'); }); return; }
    els.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * 0.92 && r.bottom > 0) finish(el); });
    pf.classList.add('rv-on');
    const io = new IntersectionObserver((entries, o) => {
      entries.forEach((e) => { if (e.isIntersecting) { finish(e.target as HTMLElement); o.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach((el) => { if (!el.classList.contains('in')) io.observe(el); });
    return () => { io.disconnect(); pf.classList.remove('rv-on'); };
  }, []);
  return null;
}
