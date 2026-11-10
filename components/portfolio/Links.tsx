// A link that stays visible but dimmed until its URL is provided.
export function SoftLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return <span className="is-todo" aria-disabled="true">{children}</span>;
  const external = /^https?:/.test(href);
  return <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
}
