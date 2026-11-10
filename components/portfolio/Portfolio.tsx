import type { CSSProperties } from 'react';
import Link from 'next/link';
import { projects, type Project } from '@/data/projects';
import { profile, about, experience, skills } from '@/data/profile';
import SiteNav from './SiteNav';
import Media from './Media';
import Ambient from './Ambient';
import Reveal from './Reveal';
import { SoftLink } from './Links';

function ProjectCard({ p, featured, delay, order }: { p: Project; featured?: boolean; delay: number; order: number }) {
  const style = { '--d': `${delay}ms`, '--ac': p.orb[1] } as CSSProperties;
  return (
    <article className={`pj rv${featured ? ' feat' : ''}`} style={style}>
      <Media project={p} order={order} />
      <div className="pj-body">
        <p className="pj-cat">{p.category}</p>
        <h4><Link href={`/projects/${p.slug}`}>{p.name}</Link></h4>
        <p>{p.summary}</p>
        {p.stat && <p className="pj-stat"><b>{p.stat.value}</b> {p.stat.label}</p>}
        <ul>{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        <p className="pj-role"><b>My work:</b> {p.role}</p>
        <div className="chips">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
        <div className="pj-links">
          <SoftLink href={p.repository}>GitHub</SoftLink>
          <SoftLink href={p.demo}>Live site</SoftLink>
          <Link href={`/projects/${p.slug}`}>Details →</Link>
        </div>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const [first, ...rest] = projects;
  return (
    <div className="pf" id="projects">
      <Ambient />
      <Reveal />
      <SiteNav />

      <section className="pf-hero">
        <p className="eyebrow rv">{profile.role} · {profile.location}</p>
        <h2 className="rv" style={{ '--d': '80ms' } as CSSProperties}>I build software that turns meaningful ideas into real experiences.</h2>
        <p className="rv" style={{ '--d': '160ms' } as CSSProperties}>{profile.intro}</p>
      </section>

      <section className="pf-sec" id="work">
        <h3 className="pf-h rv">Selected work</h3>
        <ProjectCard p={first} featured delay={0} order={0} />
        <div className="pf-grid">
          {rest.map((p, i) => <ProjectCard key={p.slug} p={p} delay={(i % 2) * 120} order={i + 1} />)}
        </div>
      </section>

      <section className="pf-sec about" id="about">
        <div className="about-copy rv">
          <p className="eyebrow">About me</p>
          <h3 className="pf-h">{about.title}</h3>
          {about.paragraphs.map((t) => <p key={t}>{t}</p>)}
        </div>
        <dl className="about-facts rv" style={{ '--d': '140ms' } as CSSProperties}>
          {about.facts.map((f) => <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}
        </dl>
      </section>

      <section className="pf-sec" id="path">
        <h3 className="pf-h rv">Experience &amp; education</h3>
        <ol className="tl">
          {experience.map((x, i) => (
            <li key={x.title} className="rv" style={{ '--d': `${i * 80}ms` } as CSSProperties}><b>{x.title}</b><span>{x.meta}</span><p>{x.text}</p></li>
          ))}
        </ol>
      </section>

      <section className="pf-sec" id="skills">
        <h3 className="pf-h rv">Skills &amp; tools</h3>
        <div className="sk">
          {skills.map((g, gi) => (
            <div key={g.group} className="rv" style={{ '--d': `${(gi % 2) * 100}ms` } as CSSProperties}>
              <b>{g.group}</b>
              <div className="chips">
                {g.items.map((i) => <span key={i.label} {...(i.logo ? { 'data-logo': i.logo } : {})}>{i.label}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pf-sec pf-contact rv" id="contact">
        <h3 className="pf-h">Let&apos;s build something meaningful</h3>
        <p>Open to professional opportunities and to building real products.</p>
        <div className="pj-links big">
          <Link href="/contact">Send a message</Link>
          <SoftLink href={profile.githubUrl}>GitHub</SoftLink>
          <SoftLink href={profile.linkedinUrl}>LinkedIn</SoftLink>
        </div>
      </section>

      <footer className="pf-foot">© {profile.name} · Every branch tells a story. And mine is still growing.</footer>
    </div>
  );
}
