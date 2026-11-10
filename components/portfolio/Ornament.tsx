// Small decorative drawing for each project page header (purely visual, hidden from screen readers).
import type { ReactElement } from 'react';

const art: Record<string, ReactElement> = {
  sana: (
    <svg className="orn" viewBox="0 0 380 240" fill="none" aria-hidden="true"><path d="M60 230V110a110 110 0 0 1 220 0v120" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.4"/><g fill="currentColor"><path className="tw" d="M170 30l5 18 18 5-18 5-5 18-5-18-18-5 18-5z"/><path className="tw" d="M300 80l3 10 10 3-10 3-3 10-3-10-10-3 10-3z"/><path className="tw" d="M90 70l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/><circle className="tw" cx="250" cy="30" r="2"/><circle className="tw" cx="330" cy="150" r="2"/><circle className="tw" cx="40" cy="160" r="2"/><circle className="tw" cx="215" cy="150" r="2.5"/></g></svg>
  ),
  mergab: (
    <svg className="orn" viewBox="0 0 380 240" fill="none" aria-hidden="true"><g stroke="currentColor" strokeOpacity=".45" strokeWidth="1.3"><path d="M70 60L170 40L290 90L330 190L210 210L100 170Z"/><path d="M170 40L210 120L290 90M210 120L330 190M210 120L100 170M70 60L210 120" strokeDasharray="4 5"/></g><g fill="currentColor"><circle className="pu" cx="70" cy="60" r="5"/><circle className="pu" cx="170" cy="40" r="5"/><circle className="pu" cx="290" cy="90" r="5"/><circle className="pu" cx="330" cy="190" r="5"/><circle className="pu" cx="210" cy="210" r="5"/><circle className="pu" cx="100" cy="170" r="5"/><circle className="b pu" cx="210" cy="120" r="9"/></g></svg>
  ),
  tasmeemhub: (
    <svg className="orn" viewBox="0 0 380 240" fill="none" aria-hidden="true"><defs><linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f472b6"/><stop offset="1" stopColor="#34d6f0"/></linearGradient></defs><g stroke="url(#og)" strokeWidth="1.6"><rect x="70" y="40" width="150" height="110" rx="14"/><rect x="140" y="80" width="150" height="110" rx="14" strokeOpacity=".75"/><circle className="tw" cx="290" cy="60" r="26" strokeOpacity=".6"/><path className="tw" d="M50 200h90" strokeOpacity=".6"/></g></svg>
  ),
  "sahl-darbak": (
    <svg className="orn" viewBox="0 0 380 240" fill="none" aria-hidden="true"><path d="M30 200C110 200 120 90 200 110S300 60 340 50" stroke="currentColor" strokeOpacity=".6" strokeWidth="1.6" strokeDasharray="3 8" strokeLinecap="round"/><g fill="currentColor"><path className="pu" d="M340 24c-9 0-15 7-15 15 0 11 15 27 15 27s15-16 15-27c0-8-6-15-15-15zm0 21a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/><circle className="b tw" cx="30" cy="200" r="5"/></g><path className="b tw" d="M198 96l22 6-22 6 4-6z" fill="currentColor"/></svg>
  ),
  wastewise: (
    <svg className="orn" viewBox="0 0 380 240" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="pu"><path d="M90 70v-26h26M290 70v-26h-26M90 190v26h26M290 190v26h-26"/></g><path d="M190 80c-34 4-52 30-44 62 6 22 26 34 44 34 22 0 42-18 42-46 0-24-14-42-42-50z" stroke="currentColor" strokeOpacity=".55" strokeWidth="1.4"/><path d="M190 90c-4 28-4 52 0 80" stroke="currentColor" strokeOpacity=".55" strokeWidth="1.4"/><rect className="b" x="132" y="196" width="76" height="20" rx="4" fill="currentColor" fillOpacity=".85"/></svg>
  ),
};

export default function Ornament({ slug }: { slug: string }) {
  return art[slug] ?? null;
}
