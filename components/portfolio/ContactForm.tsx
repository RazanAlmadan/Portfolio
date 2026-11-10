'use client';

import { useState } from 'react';
import { BUTTERFLY_SVG } from './butterflySvg';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Errors = { name?: boolean; email?: boolean; message?: boolean };

export default function ContactForm({ email }: { email?: string }) {
  const [vals, setVals] = useState({ name: '', email: '', message: '', website: '' });
  const [errs, setErrs] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'fail' | 'rate'>('idle');
  const [who, setWho] = useState('');

  const check = (v = vals): Errors => ({
    name: !v.name.trim(),
    email: !EMAIL_RE.test(v.email.trim()),
    message: v.message.trim().length < 10,
  });
  const set = (k: keyof typeof vals) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setVals({ ...vals, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    const er = check();
    setErrs(er);
    if (er.name || er.email || er.message) {
      (document.getElementById(er.name ? 'cf-name' : er.email ? 'cf-email' : 'cf-msg') as HTMLElement | null)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vals) });
      if (res.ok) { setWho(vals.name.trim()); setStatus('done'); setVals({ name: '', email: '', message: '', website: '' }); }
      else setStatus(res.status === 429 ? 'rate' : 'fail');
    } catch { setStatus('fail'); }
  }

  if (status === 'done') {
    return (
      <div className="cf-card cf-done" role="status">
        <span className="cf-bf" aria-hidden="true" dangerouslySetInnerHTML={{ __html: BUTTERFLY_SVG }} />
        <h2>Message sent.</h2>
        <p>Thank you, <b>{who}</b>. I got it and I&apos;ll reply to your email soon.</p>
        <button type="button" className="cf-ghost" onClick={() => setStatus('idle')}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="cf-card" onSubmit={submit} noValidate>
      <div className={`cf-f${errs.name ? ' bad' : ''}`}>
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" name="name" autoComplete="name" maxLength={80} value={vals.name} onChange={set('name')} onBlur={() => setErrs({ ...errs, name: check().name })} aria-invalid={!!errs.name} />
        <div className="cf-err">Please tell me your name.</div>
      </div>
      <div className={`cf-f${errs.email ? ' bad' : ''}`}>
        <label htmlFor="cf-email">Your email</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" maxLength={120} placeholder="so I can reply to you" value={vals.email} onChange={set('email')} onBlur={() => setErrs({ ...errs, email: check().email })} aria-invalid={!!errs.email} />
        <div className="cf-err">Please enter a valid email address.</div>
      </div>
      <div className={`cf-f${errs.message ? ' bad' : ''}`}>
        <label htmlFor="cf-msg">Message</label>
        <span className="cf-count">{vals.message.length} / 2000</span>
        <textarea id="cf-msg" name="message" maxLength={2000} placeholder="What would you like to talk about?" value={vals.message} onChange={set('message')} onBlur={() => setErrs({ ...errs, message: check().message })} aria-invalid={!!errs.message} />
        <div className="cf-err">Write at least a few words (10 characters).</div>
      </div>
      <div className="cf-hp" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={vals.website} onChange={set('website')} /></label>
      </div>
      <button className={`cf-send${status === 'sending' ? ' sending' : ''}`} type="submit" disabled={status === 'sending'}>
        <span className="cf-spin" /> {status === 'sending' ? 'Sending...' : 'Send message'}
      </button>
      {(status === 'fail' || status === 'rate') && (
        <div className="cf-fail" role="alert">
          {status === 'rate' ? 'Too many messages in a short time. Please try again in a few minutes.' : 'Something went wrong and your message was not sent. Please try again'}
          {email ? <>, or write to me directly at <a href={`mailto:${email}`}>{email}</a>.</> : '.'}
        </div>
      )}
      <p className="cf-note">Your message is sent privately to my email. I never share it.</p>
    </form>
  );
}
