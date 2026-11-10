import Link from 'next/link';
import { profile } from '@/data/profile';

export default function SiteNav() {
  return (
    <header className="pf-nav">
      <Link className="pf-brand" href="/#projects">{profile.name}</Link>
      <nav aria-label="Main navigation">
        <Link href="/#work">Projects</Link>
        <Link href="/#about">About</Link>
        <Link href="/#path">Experience</Link>
        <Link href="/#skills">Skills</Link>
        <Link href="/contact">Contact</Link>
        {/* On the home page the journey engine turns this into "scroll to top"; elsewhere it is a normal link. */}
        <a href="/" id="replay">Replay the journey ↑</a>
      </nav>
    </header>
  );
}
