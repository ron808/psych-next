import type { Metadata } from 'next';
import Link from 'next/link';
import StarField from '@/components/StarField';
import Nav from '@/components/Nav';
import { ModuleIcon, ClockIcon, SparkleIcon, GridIcon, ArrowRight } from '@/lib/icons';
import { FadeUp, StaggerFade, FadeItem, WordReveal } from '@/components/motion';

export const metadata: Metadata = {
  title: 'PSYCH.SITE — Know Yourself',
  description: 'Five personality tests for mind, love, friendship, career, and your inner Disney character. Zero AI. Pure science. Results calculated locally — nothing stored.',
  openGraph: {
    title: 'PSYCH.SITE — Know Yourself',
    description: 'Five personality tests for mind, love, friendship, career, and your inner Disney character.',
    url: 'https://psych.site',
    siteName: 'PSYCH.SITE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSYCH.SITE — Know Yourself',
    description: 'Five personality tests. Zero AI. Pure science.',
  },
};

// ── Disney featured card (full-width, top) ────────────────────────────
const disneyModule = {
  href: '/modules/disney',
  kind: 'disney' as const,
  num: '05',
  badge: 'Solo',
  title: 'Disney',
  sub: 'Your Inner Character',
  desc: 'Ariel, Elsa, Simba, Moana — 24 iconic characters. 15 questions reveal which Disney soul lives inside you, with a full match breakdown by gender.',
  qs: '15', types: '24',
  cls: 'disney-card',
  color: 'var(--gold)',
  chars: ['Ariel', 'Elsa', 'Moana', 'Mulan', 'Simba', 'Aladdin', 'Belle', 'Flynn'],
};

// ── Regular 2×2 modules ───────────────────────────────────────────────
const modules = [
  {
    href: '/modules/mbti',
    kind: 'mbti' as const,
    num: '01',
    badge: 'Solo',
    title: 'MBTI+',
    sub: 'Personality Map',
    desc: '5 dimensions, 32 unique types. Archetypes, spirit animals, mythic gods, and the people who share your mind.',
    qs: '20', types: '32',
    cls: '',
    color: 'var(--accent)',
    codes: ['INFJA', 'ENTPO', 'ISTPA', 'ENFPO'],
  },
  {
    href: '/modules/love',
    kind: 'love' as const,
    num: '02',
    badge: 'Solo · Duet',
    title: 'Love',
    sub: 'Romantic Style',
    desc: 'Solo or with a partner. Questions interleave in real time — ends with a full compatibility report.',
    qs: '15', types: '8',
    cls: 'love-card',
    color: 'var(--pink)',
    codes: ['ALD', 'AGW', 'PLD', 'PGW'],
  },
  {
    href: '/modules/friendship',
    kind: 'friendship' as const,
    num: '03',
    badge: '2–5 Players',
    title: 'Friendship',
    sub: 'Group Dynamic',
    desc: 'Everyone answers together before the group moves on. Ends with a constellation map and chemistry score.',
    qs: '15', types: '8',
    cls: 'friend-card',
    color: 'var(--green)',
    codes: ['GAO', 'GHD', 'SAO', 'SHD'],
  },
  {
    href: '/modules/career',
    kind: 'career' as const,
    num: '04',
    badge: 'Solo',
    title: 'Career',
    sub: 'Work Identity',
    desc: 'Your career archetype with a year-by-year growth roadmap, ideal company type, and the traps to avoid.',
    qs: '15', types: '8',
    cls: 'career-card',
    color: 'var(--orange)',
    codes: ['BIS', 'VSE', 'VIS', 'BSE'],
  },
];

const stats = [
  { val: '5',   label: 'Modules' },
  { val: '64',  label: 'Types' },
  { val: '5',   label: 'Players Max' },
  { val: '0',   label: 'Data Stored' },
];

export default function Home() {
  return (
    <>
      <StarField />
      <div className="page page-content">
        <div className="container"><Nav /></div>

        {/* ── Hero ── */}
        <header className="home-hero">
          <div className="container home-hero-inner">
            <div className="home-hero-content">
              <FadeUp delay={0.05}>
                <div className="hero-eyebrow">Personality Science, Reimagined</div>
              </FadeUp>
              <div className="home-hero-title-wrap">
                <WordReveal text="Know" tag="h1" className="home-h1" />
                <WordReveal text="Yourself." tag="h1" className="home-h1 home-h1-grad" />
              </div>
              <FadeUp delay={0.4}>
                <p className="home-hero-sub">
                  Five dimensions of the human experience —&nbsp;
                  <span className="splash">mind, love,</span>&nbsp;
                  <span className="splash splash-green">friendship,</span> career,
                  and your inner&nbsp;<span className="splash splash-gold">Disney soul.</span>
                  &nbsp;Zero AI. Pure science.
                </p>
              </FadeUp>
              <FadeUp delay={0.55}>
                <div className="home-hero-cta">
                  <Link href="/modules/disney" className="btn btn-primary home-btn-hero home-btn-disney">
                    Find Your Character <ArrowRight size={16} />
                  </Link>
                  <Link href="/types" className="btn btn-ghost" style={{ display: 'inline-flex', gap: 7, alignItems: 'center' }}>
                    <GridIcon size={14} /> Browse all types
                  </Link>
                </div>
              </FadeUp>
            </div>

            {/* Decorative floating type codes */}
            <div className="home-deco" aria-hidden>
              <div className="home-deco-ring">
                {['INFJA','ENTPO','ISTPA','ENFPO','ALD','PGW','GAO','SHD','BIS','VSE','VIS','BSE'].map((code, i) => (
                  <div
                    key={code}
                    className="home-deco-code"
                    style={{ animationDelay: `${i * 0.4}s`, opacity: 0.12 + (i % 4) * 0.05 }}
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ── Stats strip ── */}
        <div className="container">
          <FadeUp delay={0.65}>
            <div className="home-stats">
              {stats.map(s => (
                <div key={s.label} className="home-stat">
                  <span className="home-stat-val">{s.val}</span>
                  <span className="home-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* ── Module cards ── */}
        <main className="container">

          {/* Disney featured full-width card */}
          <FadeUp delay={0.1}>
            <Link href={disneyModule.href} className="disney-featured-card module-card disney-card">
              {/* Left content */}
              <div className="disney-feat-left">
                <div className="home-card-top" style={{ marginBottom: 0 }}>
                  <span className="home-card-num">{disneyModule.num}</span>
                  <span className="module-card-badge">{disneyModule.badge}</span>
                </div>
                <div className="module-card-icon home-module-icon disney-feat-icon">
                  <ModuleIcon kind={disneyModule.kind} size={30} />
                </div>
                <div>
                  <div className="home-card-title disney-feat-title">{disneyModule.title}</div>
                  <div className="home-card-sub">{disneyModule.sub}</div>
                </div>
                <p className="home-card-desc">{disneyModule.desc}</p>
                <div className="module-card-meta">
                  <span><ClockIcon size={12} />{disneyModule.qs} questions</span>
                  <span><SparkleIcon size={12} />{disneyModule.types} characters</span>
                </div>
                <div className="home-card-cta">
                  Begin <ArrowRight size={14} />
                </div>
              </div>

              {/* Right decorative */}
              <div className="disney-feat-right" aria-hidden>
                <div className="disney-feat-crown">
                  <ModuleIcon kind="disney" size={140} />
                </div>
                <div className="disney-feat-chars">
                  {disneyModule.chars.map((name) => (
                    <span key={name} className="disney-feat-char">{name}</span>
                  ))}
                </div>
              </div>
            </Link>
          </FadeUp>

          {/* 2×2 regular modules */}
          <StaggerFade className="modules-grid home-modules-grid" delay={0.15}>
            {modules.map(m => (
              <FadeItem key={m.href}>
                <Link href={m.href} className={`module-card home-module-card ${m.cls}`}>
                  <div className="home-card-top">
                    <span className="home-card-num">{m.num}</span>
                    <span className="module-card-badge">{m.badge}</span>
                  </div>
                  <div className="home-card-icon-row">
                    <div className="module-card-icon home-module-icon">
                      <ModuleIcon kind={m.kind} size={26} />
                    </div>
                    <div className="home-card-deco-codes" aria-hidden>
                      {m.codes.map(c => <span key={c} className="home-card-deco-code">{c}</span>)}
                    </div>
                  </div>
                  <div>
                    <div className="home-card-title">{m.title}</div>
                    <div className="home-card-sub">{m.sub}</div>
                  </div>
                  <p className="home-card-desc">{m.desc}</p>
                  <div className="module-card-meta">
                    <span><ClockIcon size={12} />{m.qs} questions</span>
                    <span><SparkleIcon size={12} />{m.types} types</span>
                  </div>
                  <div className="home-card-cta">
                    Begin <ArrowRight size={14} />
                  </div>
                </Link>
              </FadeItem>
            ))}
          </StaggerFade>
        </main>

        <footer className="home-footer">
          <div className="container home-footer-inner">
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>PSYCH.SITE</span>
            <span>All results calculated locally. No data stored.</span>
            <Link href="/types">Browse all types →</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
