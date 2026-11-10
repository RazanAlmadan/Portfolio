import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import SiteNav from '@/components/portfolio/SiteNav';
import Ambient from '@/components/portfolio/Ambient';
import ContactForm from '@/components/portfolio/ContactForm';
import CopyEmail from '@/components/portfolio/CopyEmail';

export const metadata: Metadata = {
  title: `Contact | ${profile.name}`,
  description: 'Send me a message. It goes straight to my inbox.',
};

export default function ContactPage() {
  return (
    <main id="main" className="pf contact-page">
      <Ambient />
      <SiteNav />
      <div className="ct-grid">
        <section>
          <p className="eyebrow">Contact</p>
          <h1>Let&apos;s build something <em>worth remembering.</em></h1>
          <p className="ct-lead">Have a project, a role, or just a question? Write to me here and the message lands straight in my inbox. I usually reply within a couple of days.</p>
          <div className="ct-direct">
            {profile.email && (
              <div className="ct-row"><div><small>Email</small><span>{profile.email}</span></div><CopyEmail email={profile.email} /></div>
            )}
            {profile.linkedinUrl && (
              <a className="ct-row" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><div><small>LinkedIn</small>{profile.linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\//, '')}</div><span aria-hidden="true">↗</span></a>
            )}
            {profile.githubUrl && (
              <a className="ct-row" href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><div><small>GitHub</small>{profile.githubUrl.replace(/^https?:\/\/github\.com\//, '')}</div><span aria-hidden="true">↗</span></a>
            )}
          </div>
        </section>
        <ContactForm email={profile.email} />
      </div>
    </main>
  );
}
