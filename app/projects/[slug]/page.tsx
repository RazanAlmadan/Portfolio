import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import { cases } from '@/data/cases';
import SiteNav from '@/components/portfolio/SiteNav';
import Gallery from '@/components/portfolio/Gallery';
import Ornament from '@/components/portfolio/Ornament';
import { SoftLink } from '@/components/portfolio/Links';
import Ambient from '@/components/portfolio/Ambient';
import Reveal from '@/components/portfolio/Reveal';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: `${p.name} | Razan`, description: p.summary } : { title: 'Project not found' };
}

// `params` is request data: reading it must happen inside <Suspense> so navigation can show the page shell instantly.
export default function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<main id="main" className="pf case" aria-busy="true"><SiteNav /></main>}>
      <CaseStudyBody params={params} />
    </Suspense>
  );
}

async function CaseStudyBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  const c = cases[slug];
  if (i < 0 || !c) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const prev = projects[(i - 1 + projects.length) % projects.length];
  return (
    <main id="main" className="pf case" data-theme={p.slug}>
      <Ambient />
      <Reveal />
      <SiteNav />
      <Ornament slug={p.slug} />
      <Link className="case-back" href="/#work">← Back to projects</Link>
      <header className="case-head">
        <p className="pj-cat">{p.category}</p>
        <h1>{p.name}</h1>
        <p className="case-lead">{c.tagline} {p.summary}</p>
      </header>
      <Gallery shots={p.shots} video={p.video} name={p.name} />

      <div className="glance rv">
        {c.glance.map((g) => <div key={g.label}><small>{g.label}</small><b>{g.value}</b></div>)}
      </div>

      <section className="cs rv">
        <div className="trio">
          <div><h3>Overview</h3><p>{c.overview}</p></div>
          <div><h3>The problem</h3><p>{c.problem}</p></div>
          <div><h3>The approach</h3><p>{c.approach}</p></div>
        </div>
      </section>

      <section className="cs rv">
        <p className="cs-k">How it works</p>
        <h2>{c.flowTitle}</h2>
        <ol className="flow">{c.flow.map((s) => <li key={s}>{s}</li>)}</ol>
      </section>

      <section className="cs rv">
        <p className="cs-k">Features</p>
        <h2>{c.featuresTitle}</h2>
        <div className="groups">
          {c.features.map((g) => (
            <div key={g.title}><h3>{g.title}</h3><ul>{g.items.map((x) => <li key={x}>{x}</li>)}</ul></div>
          ))}
        </div>
      </section>

      {c.deep && c.deepTitle && (
        <section className="cs rv">
          <p className="cs-k">Under the hood</p>
          <h2>{c.deepTitle}</h2>
          <div className="deep">{c.deep.map((d) => <div key={d.title}><h3>{d.title}</h3><p>{d.text}</p></div>)}</div>
        </section>
      )}

      {c.result && (
        <section className="cs rv">
          <div className="result">
            <div><b>{c.result.value}</b><small>{c.result.label}</small></div>
            <p>{c.result.text}{c.result.note && <><br /><strong>{c.result.note}</strong></>}</p>
          </div>
        </section>
      )}

      <section className="cs rv">
        <div className="minebox">
          <p className="cs-k">My contribution</p>
          <h2>{c.mineTitle}</h2>
          <p className="lead">{c.mineLead}</p>
          <div className="mine">{c.mine.map((m) => <div key={m.title}><h3>{m.title}</h3><p>{m.text}</p></div>)}</div>
          {c.notMine && <p className="notmine">{c.notMine}</p>}
        </div>
      </section>

      <section className="cs rv">
        <p className="cs-k">Challenges</p>
        <h2>What was hard</h2>
        <div className="chal">{c.challenges.map((x) => <div key={x.title}><h3>{x.title}</h3><p>{x.text}</p></div>)}</div>
      </section>

      <section className="cs rv">
        <p className="cs-k">Takeaway</p>
        <h2>What I took from it</h2>
        <p className="learn">{c.learned}</p>
      </section>

      <section className="cs rv">
        <h2>Built with</h2>
        <div className="chips">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
        <div className="pj-links" style={{ marginTop: 22 }}>
          <SoftLink href={p.repository}>GitHub</SoftLink>
          <SoftLink href={p.demo}>Live site</SoftLink>
        </div>
      </section>

      <nav className="case-pager" aria-label="Project navigation">
        <Link className="cp-prev" href={`/projects/${prev.slug}`} rel="prev"><small>← Previous project</small><strong>{prev.name}</strong></Link>
        <Link className="cp-all" href="/#work">All projects</Link>
        <Link className="cp-next" href={`/projects/${next.slug}`} rel="next"><small>Next project →</small><strong>{next.name}</strong></Link>
      </nav>
    </main>
  );
}
