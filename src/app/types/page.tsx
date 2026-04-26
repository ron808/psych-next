'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import Nav from '@/components/Nav';
import { strVal } from '@/lib/scoring';
import type { PsychType, ModuleKind, ModuleData } from '@/lib/types';
import {
  PawIcon,
  HeartIcon,
  WorkIcon,
  UsersIcon,
  WavesIcon,
  ArrowRight,
  CloseIcon,
  CrownIcon,
  SparkleIcon,
} from '@/lib/icons';

import mbtiData from '@/data/mbti_plus.json';
import loveData from '@/data/love.json';
import friendData from '@/data/friendship.json';
import careerData from '@/data/career.json';
import disneyData from '@/data/disney.json';

// ─── Module map ───────────────────────────────────────────────────

const MODULE_MAP = {
  mbti:       { data: mbtiData as unknown as ModuleData,    label: 'MBTI+',      kind: 'mbti'       as ModuleKind, count: 32 },
  love:       { data: loveData as unknown as ModuleData,    label: 'Love',       kind: 'love'       as ModuleKind, count: 8  },
  friendship: { data: friendData as unknown as ModuleData,  label: 'Friendship', kind: 'friendship' as ModuleKind, count: 8  },
  career:     { data: careerData as unknown as ModuleData,  label: 'Career',     kind: 'career'     as ModuleKind, count: 8  },
  disney:     { data: disneyData as unknown as ModuleData,  label: 'Disney',     kind: 'disney'     as ModuleKind, count: 24 },
};

type TabKey = keyof typeof MODULE_MAP;

const ACCENT: Record<TabKey, string> = {
  mbti:       'var(--accent)',
  love:       'var(--pink)',
  friendship: 'var(--green)',
  career:     'var(--orange)',
  disney:     'var(--gold)',
};

// ─── Mini pill ────────────────────────────────────────────────────

function MiniPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="result-icon-pill" style={{ fontSize: '0.75rem', padding: '3px 10px', gap: 5 }}>
      {icon}
      <span>{label}</span>
    </span>
  );
}

// ─── Type Card ────────────────────────────────────────────────────

function TypeCard({
  type,
  tab,
  accent,
  onClick,
}: {
  type: PsychType;
  tab: TabKey;
  accent: string;
  onClick: () => void;
}) {
  const matches = type.good_matches ?? type.best_matches ?? type.best_with ?? [];

  return (
    <motion.div
      className="type-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      <div className="type-card-code" style={{ color: accent }}>{type.code}</div>
      <div className="type-card-name">{type.name}</div>
      {type.tagline && <div className="type-card-tagline">{type.tagline}</div>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tab === 'mbti'       && type.animal       && <MiniPill icon={<PawIcon size={14} />}   label={strVal(type.animal)} />}
        {tab === 'love'       && type.love_language && <MiniPill icon={<HeartIcon size={14} />} label={type.love_language} />}
        {tab === 'career'     && type.work_style    && <MiniPill icon={<WorkIcon size={14} />}  label={type.work_style} />}
        {tab === 'friendship' && (type.role_in_group ?? type.group_role) && (
          <MiniPill icon={<UsersIcon size={14} />} label={(type.role_in_group ?? type.group_role)!} />
        )}
        {tab === 'disney' && type.movie      && <MiniPill icon={<CrownIcon size={14} />}   label={type.movie} />}
        {tab === 'disney' && type.power      && <MiniPill icon={<SparkleIcon size={14} />} label={type.power} />}
      </div>

      {matches.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            best with
          </span>
          {matches.slice(0, 3).map(m => (
            <span key={m} className="compat-tag good" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>{m}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────

function TypeModal({
  type,
  tab,
  accent,
  onClose,
}: {
  type: PsychType | null;
  tab: TabKey;
  accent: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!type) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [type, onClose]);

  const matches = type ? (type.good_matches ?? type.best_matches ?? type.best_with ?? []) : [];

  return (
    <div
      className={`modal-overlay${type ? '' : ' hidden'}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <AnimatePresence>
        {type && (
          <motion.div
            className="modal"
            role="dialog"
            aria-modal
            aria-label={`${type.name} details`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="modal-header">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: accent, letterSpacing: '0.1em' }}>
                  {type.code}
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, marginTop: 4 }}>
                  {type.name}
                </div>
                {type.tagline && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: 4 }}>
                    {type.tagline}
                  </div>
                )}
              </div>
              <button className="modal-close" onClick={onClose} aria-label="Close">
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {type.description && (
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--muted-2)',
                  lineHeight: 1.7,
                  borderLeft: `3px solid ${accent}`,
                  paddingLeft: 14,
                }}>
                  {type.description}
                </p>
              )}

              {type.strengths && type.strengths.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 10 }}>
                    STRENGTHS
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {type.strengths.map(s => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matches.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 10 }}>
                    BEST MATCHES
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {matches.map(m => (
                      <span key={m} className="compat-tag good">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Module-specific extras */}
              {tab === 'career' && type.career_paths && type.career_paths.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 10 }}>
                    CAREER PATHS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {type.career_paths.map(p => (
                      <span key={p} style={{
                        fontSize: '0.8rem',
                        padding: '4px 12px',
                        borderRadius: 99,
                        background: 'rgba(251,146,60,0.1)',
                        color: 'var(--orange)',
                        border: '1px solid rgba(251,146,60,0.25)',
                      }}>{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'love' && (
                <>
                  {type.love_language && (
                    <div>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
                        LOVE LANGUAGE
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                        <HeartIcon size={14} />
                        {type.love_language}
                      </div>
                    </div>
                  )}
                  {type.growth_edge && (
                    <div>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
                        GROWTH EDGE
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                        <WavesIcon size={14} />
                        {type.growth_edge}
                      </div>
                    </div>
                  )}
                </>
              )}

              {tab === 'disney' && (
                <>
                  {type.movie && (
                    <div>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
                        FROM THE FILM
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                        <CrownIcon size={14} style={{ color: 'var(--gold)' }} />
                        {type.movie}
                      </div>
                    </div>
                  )}
                  {type.quote && (
                    <div>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
                        ICONIC QUOTE
                      </div>
                      <p style={{ fontSize: '0.875rem', fontFamily: 'var(--font-head)', fontStyle: 'italic', color: 'var(--muted-2)', lineHeight: 1.6 }}>
                        "{type.quote}"
                      </p>
                    </div>
                  )}
                  {type.sidekick && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-2)' }}>
                      <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>SIDEKICK  </span>
                      {type.sidekick}
                    </div>
                  )}
                </>
              )}

              {tab === 'friendship' && type.group_dynamic_note && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
                    GROUP DYNAMIC
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted-2)', lineHeight: 1.65 }}>
                    {type.group_dynamic_note}
                  </p>
                </div>
              )}

              {/* Take this test button */}
              <div style={{ marginTop: 4 }}>
                <Link
                  href={`/modules/${tab}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    borderRadius: 8,
                    background: accent,
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                  }}
                >
                  Take this test
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Inner page (uses useSearchParams) ───────────────────────────

function TypeGalleryInner() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('module') ?? 'mbti') as TabKey;
  const validInitial = initialTab in MODULE_MAP ? initialTab : 'mbti';

  const [tab, setTab] = useState<TabKey>(validInitial);
  const [filter, setFilter] = useState<string>('All');
  const [modalType, setModalType] = useState<PsychType | null>(null);

  const mod = MODULE_MAP[tab];
  const accent = ACCENT[tab];
  const dimensions = mod.data.scoring?.dimensions ?? [];

  // Collect unique pole letters for filter chips (deduplicated to avoid React key warnings)
  const poleLetters = [...new Set(dimensions.flatMap(d => [d.pole_a.letter, d.pole_b.letter]))];

  // Filter types
  const filteredTypes = mod.data.types.filter(t => {
    if (filter === 'All') return true;
    return t.code.includes(filter);
  });

  const handleTabChange = useCallback((next: TabKey) => {
    setTab(next);
    setFilter('All');
    setModalType(null);
  }, []);

  const handleCloseModal = useCallback(() => setModalType(null), []);

  // Scroll lock when modal is open
  useEffect(() => {
    if (modalType) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalType]);

  return (
    <>
      <StarField />
      <div className="page page-content">
        <div className="container"><Nav /></div>
        <main className="container">

          {/* Gallery Header */}
          <div className="gallery-header">
            <h1 className="gallery-title">
              Type Gallery
              <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.65em', marginLeft: 12, fontWeight: 400 }}>
                {mod.count} types
              </span>
            </h1>

            {/* Tab bar */}
            <div className="gallery-module-tabs">
              {(Object.keys(MODULE_MAP) as TabKey[]).map(key => {
                const m = MODULE_MAP[key];
                const isActive = tab === key;
                return (
                  <button
                    key={key}
                    className={`gallery-tab${isActive ? ` active ${key}` : ''}`}
                    onClick={() => handleTabChange(key)}
                  >
                    {m.label} <span style={{ opacity: 0.65, marginLeft: 4 }}>({m.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Filter chips */}
            {poleLetters.length > 0 && (
              <div className="filter-row">
                <button
                  className={`filter-chip${filter === 'All' ? ' active' : ''}`}
                  onClick={() => setFilter('All')}
                >
                  All
                </button>
                {poleLetters.map(letter => (
                  <button
                    key={letter}
                    className={`filter-chip${filter === letter ? ' active' : ''}`}
                    onClick={() => setFilter(letter === filter ? 'All' : letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Type grid — animated on tab switch */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              className="type-gallery-grid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {filteredTypes.map(type => (
                <TypeCard
                  key={type.code}
                  type={type}
                  tab={tab}
                  accent={accent}
                  onClick={() => setModalType(type)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

        </main>

        <footer style={{ borderTop: '1px solid var(--border)', textAlign: 'center', padding: 24, color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
          <Link href="/" style={{ color: 'var(--muted)' }}>← Back to home</Link>
        </footer>
      </div>

      {/* Modal */}
      <TypeModal
        type={modalType}
        tab={tab}
        accent={accent}
        onClose={handleCloseModal}
      />
    </>
  );
}

// ─── Page export (wraps inner in Suspense for useSearchParams) ────

export default function TypeGalleryPage() {
  return (
    <Suspense fallback={
      <div className="page page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
        <div className="loading-spinner"><div className="spinner" /></div>
      </div>
    }>
      <TypeGalleryInner />
    </Suspense>
  );
}
