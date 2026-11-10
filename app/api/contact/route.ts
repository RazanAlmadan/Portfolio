import { profile } from '@/data/profile';

// Receives the contact form and emails it to Razan through Resend (https://resend.com).
// Needs RESEND_API_KEY in the environment. CONTACT_TO_EMAIL (optional) overrides the destination.

const MAX = { name: 80, email: 120, message: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort limiter (per server instance): 5 messages per 10 minutes per IP.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  if (list.length >= 5) { hits.set(ip, list); return true; }
  list.push(now); hits.set(ip, list);
  if (hits.size > 500) hits.clear();
  return false;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();
const json = (body: unknown, status = 200) => Response.json(body, { status });

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try { data = await req.json(); } catch { return json({ ok: false, error: 'invalid' }, 400); }

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots learn nothing.
  if (typeof data.website === 'string' && data.website.trim()) return json({ ok: true });

  const name = oneLine(String(data.name ?? ''));
  const email = oneLine(String(data.email ?? ''));
  const message = String(data.message ?? '').trim();
  if (!name || name.length > MAX.name || !EMAIL_RE.test(email) || email.length > MAX.email || message.length < 10 || message.length > MAX.message) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  if (limited(ip)) return json({ ok: false, error: 'rate' }, 429);

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || profile.email;
  if (!key || !to) { console.error('Contact form: RESEND_API_KEY or destination email is missing'); return json({ ok: false, error: 'config' }, 500); }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><b>${esc(name)}</b> &lt;${esc(email)}&gt;</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
      }),
    });
    if (!res.ok) { console.error('Resend error', res.status, await res.text().catch(() => '')); return json({ ok: false, error: 'send' }, 502); }
    return json({ ok: true });
  } catch (err) {
    console.error('Resend request failed', err);
    return json({ ok: false, error: 'send' }, 502);
  }
}
