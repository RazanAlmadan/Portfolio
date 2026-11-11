'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { profile } from '@/data/profile';

const LINKS = [
  { href: '/#work', label: 'Projects', id: 'work' },
  { href: '/#about', label: 'About', id: 'about' },
  { href: '/#path', label: 'Experience', id: 'path' },
  { href: '/#skills', label: 'Skills', id: 'skills' },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Auto-hide on small screens: slides away while reading downwards, returns on any scroll up. No React state, so scrolling never re-renders.
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    let last = scrollY, ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY, d = y - last;
        if (y < 80 || d < -6) el.classList.remove('hide');
        else if (d > 6) el.classList.add('hide');
        if (Math.abs(d) > 6) last = y;
        ticking = false;
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section being read (home page only).
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter((t): t is HTMLElement => !!t);
    if (!targets.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        el.querySelectorAll('nav a[data-sec]').forEach((a) => a.classList.toggle('on', a.getAttribute('data-sec') === e.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Close the mobile menu with Escape or a tap outside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onDown = (e: PointerEvent) => { if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false); };
    addEventListener('keydown', onKey);
    addEventListener('pointerdown', onDown);
    return () => { removeEventListener('keydown', onKey); removeEventListener('pointerdown', onDown); };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`pf-nav${open ? ' open' : ''}`} ref={navRef}>
      <Link className="pf-brand" href="/#projects" onClick={close}>{profile.name}</Link>
      <button type="button" className="pf-menu-btn" aria-expanded={open} aria-controls="pf-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav id="pf-menu" aria-label="Main navigation">
        {LINKS.map((l) => (
          <Link key={l.id} href={l.href} data-sec={l.id} onClick={close}>{l.label}</Link>
        ))}
        <Link className="pf-cta" href="/contact" onClick={close}>Contact</Link>
        {/* On the home page the journey engine turns this into "scroll to top"; elsewhere it is a normal link. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" id="replay" onClick={close}>Replay the journey ↑</a>
      </nav>
    </header>
  );
}
