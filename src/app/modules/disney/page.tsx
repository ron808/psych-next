'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import StarField from '@/components/StarField';
import Nav from '@/components/Nav';
import InterleavedQuiz from '@/components/InterleavedQuiz';
import { FadeUp, WordReveal, InViewFade } from '@/components/motion';
import { calcDisneyMatches, getDisneyReason } from '@/lib/scoring';
import type { ModuleData, Player, PsychType } from '@/lib/types';
import { CrownIcon, SparkleIcon, StarIcon, ClockIcon, GridIcon, ArrowRight } from '@/lib/icons';
import disneyRaw from '@/data/disney.json';

const data = disneyRaw as unknown as ModuleData;
const ease = [0.22, 1, 0.36, 1] as const;
type Stage = 'intro' | 'quiz' | 'result';

/* ─── Animated % ring ─────────────────────────────────────────── */
function CountRing({ pct, color }: { pct: number; color: string }) {
  const count   = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v));
  const R = 56, circ = 2 * Math.PI * R;

  useEffect(() => {
    const ctrl = animate(count, pct, { duration: 1.6, ease: 'easeOut', delay: 0.3 });
    return ctrl.stop;
  }, [pct, count]);

  return (
    <div style={{ position: 'relative', width: 136, height: 136, flexShrink: 0 }}>
      <svg width={136} height={136} style={{ display: 'block' }}>
        {/* Track ring */}
        <circle cx={68} cy={68} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        {/* Progress ring — rotate from top, transformOrigin in px for SVG */}
        <motion.circle
          cx={68} cy={68} r={R}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '68px 68px' }}
        />
      </svg>
      {/* Centered number */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.65rem', color, lineHeight: 1, letterSpacing: '-1px' }}>
          <motion.span>{rounded}</motion.span>
          <span style={{ fontSize: '0.95rem' }}>%</span>
        </span>
        <span style={{ fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 3 }}>
          match
        </span>
      </div>
    </div>
  );
}

/* ─── Hero card (top match) ───────────────────────────────────── */
function HeroCard({ match, label, color, delay = 0 }: {
  match: { type: PsychType; pct: number };
  label: string;
  color: string;
  delay?: number;
}) {
  const { type, pct } = match;
  const reason = getDisneyReason(type, pct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease, delay }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 360, damping: 28 } }}
      style={{
        flex: '1', minWidth: 280,
        background: 'var(--card-bg)',
        border: `1px solid ${color}30`,
        borderRadius: 20,
        padding: '28px 28px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow in corner */}
      <div aria-hidden style={{
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160,
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        pointerEvents: 'none', borderRadius: '50%',
      }} />

      {/* Label badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 12px',
        background: `${color}14`, border: `1px solid ${color}35`,
        borderRadius: 99,
        fontSize: '0.68rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase' as const,
        color, marginBottom: 22,
      }}>
        <CrownIcon size={11} /> {label}
      </div>

      {/* Ring + name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <CountRing pct={pct} color={color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 700, color: 'var(--text)',
            lineHeight: 1.1, margin: 0,
          }}>
            {type.name}
          </h3>
          {type.movie && (
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem', textTransform: 'uppercase' as const,
              letterSpacing: '0.12em', color: 'var(--muted)',
              margin: '8px 0 0',
            }}>
              {type.movie}
            </p>
          )}
        </div>
      </div>

      {/* Tagline */}
      {type.tagline && (
        <p style={{
          fontFamily: 'var(--font-head)',
          fontStyle: 'italic', fontWeight: 400,
          fontSize: '0.92rem', color: 'var(--muted-2)',
          borderLeft: `3px solid ${color}`,
          paddingLeft: 14, marginBottom: 16, lineHeight: 1.55,
        }}>
          &ldquo;{type.tagline}&rdquo;
        </p>
      )}

      {/* Reason */}
      <p style={{ fontSize: '0.875rem', color: 'var(--muted-2)', lineHeight: 1.7, marginBottom: 20 }}>
        {reason}
      </p>

      {/* Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
        {type.power && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px',
            background: `${color}12`, border: `1px solid ${color}28`,
            borderRadius: 99, fontSize: '0.72rem', color, fontWeight: 600,
          }}>
            <SparkleIcon size={10} /> {type.power}
          </span>
        )}
        {type.sidekick && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 99, fontSize: '0.72rem', color: 'var(--muted-2)', fontWeight: 600,
          }}>
            <StarIcon size={10} /> {type.sidekick}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Pct bar (for deck cards) ────────────────────────────────── */
function PctBar({ pct, color }: { pct: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: inView ? `${pct}%` : '0%' }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
          style={{ height: '100%', background: color, borderRadius: 99 }}
        />
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 800, color, minWidth: 34, textAlign: 'right' as const }}>
        {pct}%
      </span>
    </div>
  );
}

/* ─── Deck card (top 2-5 matches) ─────────────────────────────── */
function DeckCard({ match, color, delay }: {
  match: { type: PsychType; pct: number };
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-60px 0px' });
  const reason = getDisneyReason(match.type, match.pct);

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.4, delay: inView ? delay : 0, ease }}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-2)',
        borderRadius: 14,
        padding: '18px 20px 16px 22px',
        marginBottom: 10,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent stripe */}
      <div aria-hidden style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 3, background: color, opacity: 0.55,
        borderRadius: '14px 0 0 14px',
      }} />

      {/* Name row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-head)', fontWeight: 700,
            fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.2,
          }}>
            {match.type.name}
          </div>
          {match.type.movie && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem', textTransform: 'uppercase' as const,
              letterSpacing: '0.1em', color: 'var(--muted)', marginTop: 3,
            }}>
              {match.type.movie}
            </div>
          )}
        </div>
        <span style={{
          flexShrink: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem', fontWeight: 800, color,
          background: `${color}12`,
          padding: '3px 10px', borderRadius: 99,
          border: `1px solid ${color}28`,
        }}>
          {match.pct}%
        </span>
      </div>

      <PctBar pct={match.pct} color={color} />

      {/* Reason — 2 lines max */}
      {reason && (
        <p style={{
          fontSize: '0.8rem', color: 'var(--muted)',
          lineHeight: 1.55, margin: '6px 0 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {reason}
        </p>
      )}
    </motion.div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default function DisneyPage() {
  const [stage, setStage] = useState<Stage>('intro');
  const [femaleMatches, setFemaleMatches] = useState<Array<{ type: PsychType; pct: number }>>([]);
  const [maleMatches,   setMaleMatches]   = useState<Array<{ type: PsychType; pct: number }>>([]);

  function handleComplete(players: Player[]) {
    const answers = players[0].answers;
    const all     = calcDisneyMatches(data.questions, answers, data.types);
    setFemaleMatches(all.filter(r => r.type.gender === 'female'));
    setMaleMatches(all.filter(r => r.type.gender === 'male'));
    setStage('result');
  }

  return (
    <>
      <StarField />
      <div className="page page-content">
        <div className="container"><Nav kind="disney" /></div>
        <main className="container">
          <AnimatePresence mode="wait">

            {/* ── INTRO ── */}
            {stage === 'intro' && (
              <motion.div key="intro"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.2, ease } }}
              >
                <div className="content-wrap">
                  <div className="module-intro">
                    <FadeUp>
                      <div className="module-intro-icon disney" style={{ position: 'relative' }}>
                        <CrownIcon size={34} />
                        {[
                          { size: 11, top: -6, right: -6, dur: 2.4, del: 0   },
                          { size:  8, bot: -4, left: -5, dur: 3.1, del: 0.9  },
                          { size:  9, top:  2, left: -9, dur: 2.8, del: 1.6  },
                        ].map((s, i) => (
                          <motion.span key={i}
                            style={{
                              position: 'absolute', color: 'var(--gold)', pointerEvents: 'none',
                              ...(s.top  !== undefined ? { top:    s.top  } : {}),
                              ...(s.bot  !== undefined ? { bottom: s.bot  } : {}),
                              ...(s.left !== undefined ? { left:   s.left } : {}),
                              ...(s.right!== undefined ? { right:  s.right} : {}),
                            }}
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.15, 0.7], rotate: [0, 18, 0] }}
                            transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.del }}
                          >
                            <StarIcon size={s.size} />
                          </motion.span>
                        ))}
                      </div>
                      <div className="hero-eyebrow" style={{ color: 'var(--gold)' }}>Disney</div>
                    </FadeUp>

                    <WordReveal text="Which Disney Character Are You?" tag="h1" className="page-title" />

                    <FadeUp delay={0.2}>
                      <p className="module-intro-desc">
                        15 questions. 24 characters. One soul match — and a full ranked list of every character you could be.
                      </p>
                    </FadeUp>

                    <FadeUp delay={0.3}>
                      <div className="feature-pills">
                        <span className="result-icon-pill"><SparkleIcon size={13} /><span>24 Characters</span></span>
                        <span className="result-icon-pill"><CrownIcon size={13} /><span>Male &amp; Female</span></span>
                        <span className="result-icon-pill"><ClockIcon size={13} /><span>~3 Minutes</span></span>
                      </div>
                    </FadeUp>

                    <FadeUp delay={0.4}>
                      <div className="cta-row">
                        <motion.button
                          className="btn btn-primary"
                          onClick={() => setStage('quiz')}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          style={{ background: 'linear-gradient(135deg,var(--gold),#f59e0b)', boxShadow: '0 4px 18px rgba(251,191,36,.35)', color: '#1a1200' }}
                        >
                          Discover Your Character <ArrowRight size={15} />
                        </motion.button>
                        <Link href="/types?module=disney" className="btn btn-ghost" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                          <GridIcon size={14} /> Browse Types
                        </Link>
                      </div>
                    </FadeUp>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── QUIZ ── */}
            {stage === 'quiz' && (
              <motion.div key="quiz"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.38, ease } }}
                exit={{ opacity: 0, x: -40, transition: { duration: 0.18, ease } }}
              >
                <div className="content-wrap">
                  <button className="quiz-back-btn" onClick={() => setStage('intro')}>← Back</button>
                  <InterleavedQuiz
                    players={[{ name: 'You', answers: {} }]}
                    questions={data.questions}
                    dimensions={data.scoring.dimensions}
                    moduleKind="disney"
                    onComplete={handleComplete}
                  />
                </div>
              </motion.div>
            )}

            {/* ── RESULT ── */}
            {stage === 'result' && (femaleMatches.length > 0 || maleMatches.length > 0) && (
              <motion.div key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.4 } }}
                exit={{ opacity: 0 }}
              >
                <div className="content-wrap">

                  {/* Header */}
                  <InViewFade>
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                        {[12, 18, 12].map((sz, i) => (
                          <motion.span key={i} style={{ color: 'var(--gold)' }}
                            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                          >
                            {i === 1 ? <CrownIcon size={sz} /> : <StarIcon size={sz} />}
                          </motion.span>
                        ))}
                      </div>
                      <div className="hero-eyebrow" style={{ color: 'var(--gold)', marginBottom: 8 }}>Your Matches</div>
                      <h2 style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 700, margin: 0,
                        background: 'linear-gradient(120deg, var(--text) 40%, var(--gold) 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                      }}>
                        Disney Found Your Soul
                      </h2>
                      <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: 10 }}>
                        Scored across {data.questions.length} questions · {data.types.length} characters ranked
                      </p>
                    </div>
                  </InViewFade>

                  {/* Hero row */}
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    {femaleMatches[0] && (
                      <HeroCard match={femaleMatches[0]} label="Top Female Match" color="var(--pink)" delay={0.1} />
                    )}
                    {maleMatches[0] && (
                      <HeroCard match={maleMatches[0]} label="Top Male Match" color="var(--accent)" delay={0.25} />
                    )}
                  </div>

                  {/* Deck row */}
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 52 }}>

                    {/* Female deck */}
                    {femaleMatches.length > 1 && (
                      <div style={{ flex: '1', minWidth: 260 }}>
                        <InViewFade>
                          <div style={{
                            fontSize: '0.7rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.14em',
                            color: 'var(--pink)', marginBottom: 16,
                            display: 'flex', alignItems: 'center', gap: 7,
                          }}>
                            <SparkleIcon size={11} /> More Female Matches
                          </div>
                        </InViewFade>
                        {femaleMatches.slice(1, 5).map((m, i) => (
                          <DeckCard key={m.type.code} match={m} color="var(--pink)" delay={i * 0.07} />
                        ))}
                      </div>
                    )}

                    {/* Male deck */}
                    {maleMatches.length > 1 && (
                      <div style={{ flex: '1', minWidth: 260 }}>
                        <InViewFade>
                          <div style={{
                            fontSize: '0.7rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.14em',
                            color: 'var(--accent)', marginBottom: 16,
                            display: 'flex', alignItems: 'center', gap: 7,
                          }}>
                            <StarIcon size={11} /> More Male Matches
                          </div>
                        </InViewFade>
                        {maleMatches.slice(1, 5).map((m, i) => (
                          <DeckCard key={m.type.code} match={m} color="var(--accent)" delay={i * 0.07} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <InViewFade>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 52, flexWrap: 'wrap' }}>
                      <motion.button className="btn btn-ghost" onClick={() => setStage('intro')}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                        ← Retake Quiz
                      </motion.button>
                      <Link href="/types?module=disney" className="btn btn-secondary"
                        style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <GridIcon size={14} /> Browse All Disney Types
                      </Link>
                    </div>
                  </InViewFade>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
