'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { chapters } from '@/data/journey';
import { cinematicTiming as timing } from '@/data/cinematic';
import JourneyTree from './JourneyTree';
import Butterfly from './Butterfly';
import PortalVisual from './PortalVisual';
import './cinematic.css';

export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const frame = element.querySelector<HTMLElement>('.cinema-frame')!;
      const geometry = element.querySelector<HTMLElement>('.world-geometry')!;
      const guide = element.querySelector<HTMLElement>('.world-guide')!;
      const cards = gsap.utils.toArray<HTMLElement>('.cinema-chapter', element);
      const branches = gsap.utils.toArray<SVGGElement>('.branch-energy', element);
      const localLinks = gsap.utils.toArray<HTMLAnchorElement>('[data-story-link]', element);
      element.classList.add('is-enhanced');

      // The virtual camera transforms the entire world, including the butterfly and light map.
      const focus = (index: number) => {
        const c = timing.chapters[index];
        const narrow = frame.clientWidth < 700;
        const targetX = narrow ? 0.50 : c.side === 'right' ? 0.33 : 0.67;
        return {
          x: () => (targetX - .5) * frame.clientWidth - (c.point[0] - .5) * geometry.offsetWidth * c.zoom,
          y: () => ((narrow ? .35 : .52) - .5) * frame.clientHeight - (c.point[1] - .5) * geometry.offsetHeight * c.zoom,
          scale: c.zoom,
        };
      };
      // GSAP evaluates function-based plugin vars again on refresh; its declaration omits object-returning callbacks.
      const flight = (from: readonly number[], to: readonly number[]) => (() => ({
        path: [
          { x: from[0] * geometry.offsetWidth, y: from[1] * geometry.offsetHeight },
          { x: (from[0] + (to[0] - from[0]) * .32 + .07) * geometry.offsetWidth, y: (from[1] + (to[1] - from[1]) * .35 - .04) * geometry.offsetHeight },
          { x: (to[0] - .025) * geometry.offsetWidth, y: (to[1] + .035) * geometry.offsetHeight },
          { x: to[0] * geometry.offsetWidth, y: to[1] * geometry.offsetHeight },
        ],
        curviness: 1.3,
      })) as unknown as NonNullable<gsap.TweenVars['motionPath']>;

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: element, start: 'top top', end: 'bottom bottom', scrub: .65,
          invalidateOnRefresh: true,
        },
      });
      timeline.set('.world-reveal, .cinema-chapter, .world-ending, .portal-flash', { autoAlpha: 0 }, 0);
      timeline.set('.world-guide', { xPercent: -50, yPercent: -50, x: () => geometry.offsetWidth * .82, y: () => geometry.offsetHeight * .46 }, 0);
      timeline.set('.world-camera', { x: 0, y: 0, scale: 1 }, 0);
      timeline.set('.branch-energy', { opacity: 0 }, 0);
      timeline.set('.branch-trace', { strokeDasharray: 1, strokeDashoffset: 1 }, 0);
      timeline.to('.gateway-copy', { autoAlpha: 0, y: -45, duration: .8 }, .55);
      timeline.to('.gateway-visual', { scale: 7, x: () => -frame.clientWidth * .23, duration: 1.9 }, .55);
      timeline.to('.world-guide', { motionPath: flight([.82, .46], [.73, .53]), scale: .55, duration: 1.4 }, .35);
      timeline.to('.portal-flash', { autoAlpha: 1, duration: .55 }, 1.6);
      timeline.to('.gateway-scene', { autoAlpha: 0, duration: .5 }, 2.05);
      timeline.to('.world-reveal', { autoAlpha: 1, duration: .9 }, 2.05);
      timeline.to('.portal-flash', { autoAlpha: 0, duration: 1 }, 2.3);
      timeline.to('.far-nebula', { xPercent: -8, yPercent: 12, scale: 1.35, duration: timing.duration, ease: 'none' }, 0);
      timeline.to('.near-mist', { xPercent: 15, yPercent: -14, duration: timing.duration, ease: 'none' }, 0);
      timeline.to('.foreground-boughs', { scale: 1.5, yPercent: 24, duration: timing.duration, ease: 'none' }, 0);

      timing.chapters.forEach((chapter, index) => {
        const start = index === 0 ? timing.worldEntry : timing.chapters[index - 1].departure + .1;
        timeline.addLabel(chapters[index].id, chapter.arrival);
        timeline.to('.world-camera', { ...focus(index), duration: chapter.arrival - start }, start);
        timeline.to(guide, {
          motionPath: flight(index === 0 ? [.73, .53] : timing.chapters[index - 1].point, chapter.point),
          scale: .72 / chapter.zoom, rotation: index % 2 ? -12 : 12,
          duration: chapter.arrival - start,
        }, start);
        timeline.to(branches[index], { opacity: 1, duration: .45 }, chapter.arrival - .1);
        timeline.to(branches[index].querySelector('.branch-trace'), { strokeDashoffset: 0, duration: .7 }, chapter.arrival - .2);
        timeline.fromTo(cards[index], { autoAlpha: 0, y: 28, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .45 }, chapter.arrival + .1);
        timeline.to(cards[index], { autoAlpha: 0, y: -20, duration: .35 }, chapter.departure);
        timeline.to(branches[index], { opacity: .38, duration: .6 }, chapter.departure);
      });
      timeline.to('.world-camera', { x: 0, y: 0, scale: () => Math.min(1, frame.clientHeight * .88 / geometry.offsetHeight), duration: 2 }, timing.pullback);
      timeline.to('.world-guide', { scale: .8, rotation: 0, duration: 1.8 }, timing.pullback);
      timeline.to('.world-ending', { autoAlpha: 1, y: 0, duration: .8 }, 18.9);
      timeline.to('.exit-shade', { opacity: 1, duration: 1.2 }, 19.8);
      timeline.to('.world-ending', { autoAlpha: 0, duration: .5 }, 20.5);
      timeline.to('.cinema-progress-fill', { scaleX: 1, duration: timing.duration, ease: 'none' }, 0);

      // Native links remain valid without JS; enhanced links seek to a reading hold.
      const seek = (event: MouseEvent) => {
        const link = event.currentTarget as HTMLAnchorElement;
        const label = link.dataset.storyLink!;
        const trigger = timeline.scrollTrigger;
        if (!trigger) return;
        event.preventDefault();
        const time = timeline.labels[label] ?? timing.worldEntry;
        window.scrollTo({ top: trigger.start + (time + .65) / timing.duration * (trigger.end - trigger.start), behavior: 'instant' });
      };
      localLinks.forEach(link => link.addEventListener('click', seek));
      const enter = element.querySelector<HTMLAnchorElement>('.enter-world');
      const enterWorld = (event: MouseEvent) => {
        event.preventDefault();
        const trigger = timeline.scrollTrigger!;
        window.scrollTo({ top: trigger.start + 1.35 / timing.duration * (trigger.end - trigger.start), behavior: 'smooth' });
      };
      enter?.addEventListener('click', enterWorld);
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh, { once: true });
      ScrollTrigger.refresh();
      return () => {
        localLinks.forEach(link => link.removeEventListener('click', seek));
        enter?.removeEventListener('click', enterWorld);
        window.removeEventListener('load', refresh);
        element.classList.remove('is-enhanced');
      };
    }, element);
    return () => media.revert();
  }, []);

  return (
    <section ref={root} className="cinematic" id="journey" aria-label="Enter my world — a cinematic journey">
      <div className="cinema-frame">
        <div className="far-nebula" aria-hidden="true" />
        <div className="scene-stars" aria-hidden="true">{Array.from({ length: 55 }, (_, i) => <i key={i} style={{ left: `${(i * 37.7) % 100}%`, top: `${(i * 23.3) % 100}%`, opacity: .2 + i % 4 * .15, width: i % 5 === 0 ? 3 : 1, height: i % 5 === 0 ? 3 : 1 }} />)}</div>
        <div className="world-camera">
          <div className="world-geometry">
            <div className="world-reveal"><JourneyTree /></div>
            <div className="world-guide" aria-hidden="true"><div className="guide-trail"/><Butterfly /></div>
          </div>
        </div>
        <div className="gateway-scene">
          <div className="gateway-copy">
            <p className="hero-label">WELCOME TO MY WORLD</p>
            <h1 className="hero-title">Hi, I&apos;m <span>Razan.</span></h1>
            <h2 className="hero-role">Full Stack Developer</h2>
            <p className="hero-description">Building intelligent digital experiences through software, AI, and creativity.</p>
            <div className="hero-actions"><a className="button enter-world" href="#roots">Enter my world ↓</a><a className="text-link" href="#projects">Skip Journey ↗</a></div>
            <p className="hero-chapter">✦ A JOURNEY THROUGH MY STORY</p>
          </div>
          <div className="gateway-visual"><PortalVisual showButterfly={false}/></div>
        </div>
        <div className="portal-flash" aria-hidden="true" />
        <div className="world-reveal near-mist" aria-hidden="true" />
        <svg className="world-reveal foreground-boughs" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M-80 1050Q180 730 30 480Q-45 320 55 70M-10 670Q200 570 260 420M1680 1100Q1440 750 1570 480Q1670 220 1530 -80M1560 570Q1380 520 1310 290" fill="none" stroke="#080c19" strokeWidth="48"/><path d="M0 990Q150 710 25 490M1610 990Q1490 750 1570 480" fill="none" stroke="#4f4572" strokeWidth="2"/></svg>
        <div className="scene-vignette" aria-hidden="true"/>
        <div className="cinema-captions">{chapters.map((chapter, index) => <article className={`cinema-chapter caption-${timing.chapters[index].side}`} id={chapter.id} key={chapter.id}>
          <p className="eyebrow">CHAPTER 0{index + 1} / {chapter.label}</p>
          <h2>{chapter.title}</h2>
          <p className="cinema-lead">{chapter.text}</p>
          <p>{chapter.detail}</p>
          <div className="tags">{chapter.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </article>)}</div>
        <div className="world-ending"><p className="eyebrow">A WORLD OF POSSIBILITIES</p><h2>One journey.<br/>Always growing.</h2><a className="text-link" href="#projects">Discover the work ↓</a></div>
        <div className="exit-shade" aria-hidden="true"/>
        <div className="cinema-hud"><a href="#projects">Skip Journey ↗</a><span>SCROLL TO FOLLOW THE BUTTERFLY</span><span className="hud-mark" aria-hidden="true">✦</span></div>
        <nav className="chapter-compass" aria-label="Journey chapters">{chapters.map((chapter, i) => <a key={chapter.id} href={`#${chapter.id}`} data-story-link={chapter.id} aria-label={`Chapter ${i + 1}: ${chapter.label}`}><span>0{i + 1}</span><i/></a>)}</nav>
        <div className="cinema-progress" aria-hidden="true"><div className="cinema-progress-fill"/></div>
      </div>
    </section>
  );
}



