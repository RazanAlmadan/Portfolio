'use client';

import { useEffect, useRef } from 'react';
import { chapters } from '@/data/journey';
import { cinematicTiming } from '@/data/cinematic';
import Butterfly from './Butterfly';
import JourneyTree from './JourneyTree';
import PortalVisual from './PortalVisual';
import './cinematic.css';

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Shot = { at: number; x: number; y: number; zoom: number; flyX: number; flyY: number; angle: number };

// One scroll timeline for the camera AND butterfly. No 3D render loop, no scroll-jacking.
const shots: Shot[] = [
  { at: 0,    x: .50, y: .50, zoom: 1,    flyX: .78, flyY: .31, angle: -12 },
  { at: .10,  x: .50, y: .50, zoom: 1,    flyX: .78, flyY: .42, angle: 8 },
  { at: .18,  x: .50, y: .50, zoom: 1,    flyX: .75, flyY: .57, angle: -9 },
  { at: .235, x: .50, y: .50, zoom: 1,    flyX: .58, flyY: .50, angle: -16 },
  { at: .30,  x: .43,  y: .51,  zoom: 1.42, flyX: .39, flyY: .45, angle: 8 },
  { at: .40,  x: .39,  y: .52,  zoom: 1.53, flyX: .35, flyY: .47, angle: -14 },
  { at: .51,  x: .63,  y: .49,  zoom: 1.52, flyX: .58, flyY: .43, angle: 11 },
  { at: .62,  x: .40,  y: .48,  zoom: 1.49, flyX: .35, flyY: .42, angle: -10 },
  { at: .73,  x: .61,  y: .45,  zoom: 1.40, flyX: .56, flyY: .38, angle: 7 },
  { at: .85,  x: .50,  y: .50,  zoom: .74,  flyX: .54, flyY: .26, angle: -7 },
  { at: .96,  x: .50,  y: .50,  zoom: .74,  flyX: .56, flyY: .19, angle: 4 },
  { at: 1,    x: .50,  y: .50,  zoom: .74,  flyX: .60, flyY: .16, angle: 0 },
];

const chapterWindows = [
  { open: .255, close: .347, center: .30 },
  { open: .358, close: .453, center: .40 },
  { open: .463, close: .563, center: .51 },
  { open: .574, close: .676, center: .62 },
  { open: .685, close: .796, center: .73 },
];

function sceneAt(progress: number): Shot {
  const last = shots[shots.length - 1];
  if (progress >= last.at) return last;
  for (let i = 1; i < shots.length; i++) {
    if (progress <= shots[i].at) {
      const a = shots[i - 1];
      const b = shots[i];
      const t = smooth(a.at, b.at, progress);
      return {
        at: progress,
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        zoom: lerp(a.zoom, b.zoom, t),
        flyX: lerp(a.flyX, b.flyX, t),
        flyY: lerp(a.flyY, b.flyY, t) - Math.sin(t * Math.PI) * .018,
        angle: lerp(a.angle, b.angle, t),
      };
    }
  }
  return last;
}

export default function Journey() {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const art = artRef.current;
    const guide = guideRef.current;
    if (!root || !frame || !art || !guide) return;

    const media = window.matchMedia('(min-width: 801px) and (prefers-reduced-motion: no-preference)');
    let raf = 0;
    let enhanced = false;
    let lastActive = -2;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.cin-chapter'));
    const markers = Array.from(root.querySelectorAll<HTMLElement>('.cin-tree-marker'));
    const sectionLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-journey-target]'));

    const update = () => {
      raf = 0;
      if (!enhanced) return;
      const sectionTop = root.getBoundingClientRect().top;
      const range = Math.max(1, root.offsetHeight - window.innerHeight);
      const p = clamp(-sectionTop / range);
      const shot = sceneAt(p);
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      const artWidth = art.offsetWidth;
      const artHeight = art.offsetHeight;

      // Camera pans relative to the point of interest on the tree illustration.
      // The image is never enlarged beyond ~1.53x: no runaway GPU layers.
      const x = (shot.x - .5) * width - (p >= .245 && p < .82 ? (currentPoint(p)[0] - .5) * artWidth * shot.zoom : 0);
      const y = (shot.y - .5) * height - (p >= .245 && p < .82 ? (currentPoint(p)[1] - .5) * artHeight * shot.zoom : 0);
      art.style.setProperty('--camera-x', `${x.toFixed(1)}px`);
      art.style.setProperty('--camera-y', `${y.toFixed(1)}px`);
      art.style.setProperty('--camera-scale', shot.zoom.toFixed(3));

      // A single guide flies throughout the hero and tree scene.
      // During chapters it follows the focused branch in screen coordinates.
      guide.style.left = `${(shot.flyX * 100).toFixed(2)}%`;
      guide.style.top = `${(shot.flyY * 100).toFixed(2)}%`;
      guide.style.setProperty('--fly-angle', `${shot.angle.toFixed(1)}deg`);
      guide.style.opacity = `${1 - smooth(.973, 1, p)}`;

      const gatewayOpacity = 1 - smooth(.12, .225, p);
      const worldOpacity = smooth(.175, .255, p) * (1 - smooth(.955, 1, p));
      root.style.setProperty('--gateway-opacity', gatewayOpacity.toFixed(3));
      root.style.setProperty('--world-opacity', worldOpacity.toFixed(3));
      root.style.setProperty('--gateway-scale', (1 + smooth(.06, .21, p) * .42).toFixed(3));
      root.style.setProperty('--scene-flash', (smooth(.19, .213, p) * (1 - smooth(.213, .248, p)) * .38).toFixed(3));
      root.style.setProperty('--journey-progress', p.toFixed(4));
      root.style.setProperty('--ending-opacity', (smooth(.82, .88, p) * (1 - smooth(.96, 1, p))).toFixed(3));
      const entering = p < .22;
      const gateway = root.querySelector<HTMLElement>('.cin-gateway');
      if (gateway) gateway.style.pointerEvents = entering ? 'auto' : 'none';

      let active = -1;
      chapterWindows.forEach((windowTime, i) => {
        const entrance = smooth(windowTime.open, windowTime.open + .017, p);
        const departure = 1 - smooth(windowTime.close - .016, windowTime.close, p);
        const opacity = entrance * departure;
        cards[i].style.opacity = opacity.toFixed(3);
        cards[i].style.transform = `translate3d(0, ${(1 - entrance) * 17 - (1 - departure) * 12}px, 0)`;
        if (opacity > .55) active = i;
      });
      if (active !== lastActive) {
        cards.forEach((card, i) => card.setAttribute('aria-hidden', String(i !== active)));
        markers.forEach((marker, i) => marker.classList.toggle('is-lit', i === active));
        lastActive = active;
      }
    };

    function currentPoint(p: number): readonly [number, number] {
      // Move the camera toward the current story chapter without huge translations.
      const centers = chapterWindows.map(c => c.center);
      for (let i = 0; i < centers.length - 1; i++) {
        if (p <= centers[i + 1]) {
          const t = smooth(centers[i], centers[i + 1], p);
          const from = cinematicTiming.chapters[i].point;
          const to = cinematicTiming.chapters[i + 1].point;
          return [lerp(from[0], to[0], t), lerp(from[1], to[1], t)] as const;
        }
      }
      return cinematicTiming.chapters[cinematicTiming.chapters.length - 1].point;
    }

    const request = () => { if (enhanced && !raf) raf = requestAnimationFrame(update); };
    const jump = (event: MouseEvent) => {
      const link = event.currentTarget as HTMLAnchorElement;
      const target = Number(link.dataset.journeyTarget);
      if (!Number.isFinite(target)) return;
      event.preventDefault();
      const y = window.scrollY + root.getBoundingClientRect().top + target * (root.offsetHeight - window.innerHeight);
      window.scrollTo({ top: y, behavior: 'smooth' });
    };

    function configure() {
      enhanced = media.matches;
      root.classList.toggle('is-cinematic', enhanced);
      root.style.removeProperty('--world-opacity');
      root.style.removeProperty('--gateway-opacity');
      if (enhanced) {
        sectionLinks.forEach(a => a.addEventListener('click', jump));
        request();
      } else {
        sectionLinks.forEach(a => a.removeEventListener('click', jump));
        cards.forEach(card => { card.style.removeProperty('opacity'); card.style.removeProperty('transform'); card.removeAttribute('aria-hidden'); });
        markers.forEach(marker => marker.classList.remove('is-lit'));
        lastActive = -2;
        guide.style.removeProperty('left');
        guide.style.removeProperty('top');
        guide.style.removeProperty('opacity');
        art.style.removeProperty('--camera-x');
        art.style.removeProperty('--camera-y');
        art.style.removeProperty('--camera-scale');
      }
    }

    configure();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
    media.addEventListener('change', configure);
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      media.removeEventListener('change', configure);
      sectionLinks.forEach(a => a.removeEventListener('click', jump));
      cancelAnimationFrame(raf);
      root.classList.remove('is-cinematic');
    };
  }, []);

  return (
    <section className="cinematic" id="journey" ref={rootRef} aria-label="Enter My World: the journey">
      <div className="cin-frame" ref={frameRef}>
        <div className="cin-ambient" aria-hidden="true" />
        <div className="cin-stars" aria-hidden="true">
          {Array.from({ length: 32 }, (_, i) => <i key={i} style={{ left: `${(i * 37.37 + 11) % 100}%`, top: `${(i * 19.93 + 7) % 100}%`, opacity: .23 + (i % 4) * .17, width: i % 6 === 0 ? 3 : 2, height: i % 6 === 0 ? 3 : 2 }} />)}
        </div>

        <div className="cin-world">
          <div className="cin-world-aura" aria-hidden="true" />
          <div className="cin-tree-camera" ref={artRef}><JourneyTree /></div>
          <span className="cin-world-label">THE TREE OF MY JOURNEY</span>
        </div>

        <div className="cin-gateway">
          <div className="cin-hero-content">
            <p className="hero-label">WELCOME TO MY WORLD</p>
            <h1 className="hero-title">Hi, I&apos;m <span>Razan.</span></h1>
            <h2 className="hero-role">Full Stack Developer</h2>
            <p className="hero-description">Building intelligent digital experiences through software, AI, and creativity.</p>
            <div className="hero-actions">
              <a className="button" href="#story-roots" data-journey-target="0.30">Enter my world <span aria-hidden="true">↓</span></a>
              <a className="text-link" href="#projects">Skip Journey ↗</a>
            </div>
            <p className="hero-chapter">✦ A JOURNEY THROUGH MY STORY</p>
          </div>
          <div className="cin-gateway-portal"><PortalVisual showButterfly={false} /></div>
        </div>

        <div className="cin-transit-flash" aria-hidden="true" />
        <div className="cin-guide" ref={guideRef} aria-label="A glowing butterfly guides the journey"><Butterfly /><span className="cin-guide-trail" /></div>
        <div className="cin-chapter-layer">
          {chapters.map((chapter, index) => (
            <article key={chapter.id} id={chapter.id} className={`cin-chapter ${index % 2 ? 'cin-chapter--right' : 'cin-chapter--left'}`}>
              <p className="eyebrow">CHAPTER 0{index + 1} / {chapter.label}</p>
              <h2>{chapter.title}</h2>
              <p className="cin-lead">{chapter.text}</p>
              <p className="cin-detail">{chapter.detail}</p>
              <div className="tags">{chapter.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            </article>
          ))}
        </div>
        <div className="cin-ending"><p className="eyebrow">THE JOURNEY CONTINUES</p><h2>Still growing.<br/>Still creating.</h2><a href="#projects" className="text-link">Explore the projects ↓</a></div>
        <div className="cin-vignette" aria-hidden="true" />
        <div className="cin-hud"><span className="cin-hud-left">✦ A JOURNEY THROUGH MY STORY</span><a href="#projects">Skip Journey ↗</a><span className="cin-hud-right">SCROLL TO FOLLOW THE BUTTERFLY</span></div>
        <div className="cin-progress" aria-hidden="true"><span /></div>
      </div>
      {/* Normal-flow accessible narrative on mobile, reduced motion, and without JavaScript. */}
      <div className="cin-static-story">
        <div className="cin-static-art"><JourneyTree /><p>ROOTS · ENGINEERING · INTELLIGENCE · INNOVATION · GROWTH</p></div>
        {chapters.map((chapter, index) => (
          <article key={chapter.id} className="cin-static-chapter" id={`story-${chapter.id}`}>
            <p className="eyebrow">CHAPTER 0{index + 1} / {chapter.label}</p>
            <h2>{chapter.title}</h2>
            <p>{chapter.text}</p><p>{chapter.detail}</p>
            <div className="tags">{chapter.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          </article>
        ))}
        <a href="#projects" className="button cin-static-projects">Explore projects ↓</a>
      </div>
    </section>
  );
}
