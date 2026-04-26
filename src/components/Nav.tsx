'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GridIcon } from '@/lib/icons';
import type { ModuleKind } from '@/lib/types';

type NavKind = ModuleKind | 'types';

const LINKS: { kind: ModuleKind; label: string; href: string }[] = [
  { kind: 'mbti',       label: 'MBTI+',      href: '/modules/mbti' },
  { kind: 'love',       label: 'Love',        href: '/modules/love' },
  { kind: 'friendship', label: 'Friendship',  href: '/modules/friendship' },
  { kind: 'career',     label: 'Career',      href: '/modules/career' },
  { kind: 'disney',     label: 'Disney',      href: '/modules/disney' },
];

export default function Nav({ kind }: { kind?: NavKind }) {
  const pathname = usePathname();
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">PSYCH.SITE</Link>
      <div className="nav-links">
        {LINKS.map(l => (
          <Link
            key={l.kind}
            href={l.href}
            className={`nav-link ${l.kind} ${kind === l.kind || pathname === l.href ? 'active ' + l.kind : ''}`}
          >
            {l.label}
          </Link>
        ))}
        <div className="nav-divider" />
        <Link
          href="/types"
          className={`nav-link ${kind === 'types' || pathname === '/types' ? 'active' : ''}`}
        >
          All Types
        </Link>
      </div>
      <Link href="/types" className="nav-cta">
        <GridIcon size={13} /> Browse Types
      </Link>
    </nav>
  );
}
