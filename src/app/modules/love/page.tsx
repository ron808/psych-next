'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import Nav from '@/components/Nav';
import InterleavedQuiz from '@/components/InterleavedQuiz';
import ResultCard from '@/components/ResultCard';
import { FadeUp, StaggerFade, FadeItem, WordReveal } from '@/components/motion';
import { getTypeCode, findType } from '@/lib/scoring';
import type { ModuleData, Player, PsychType } from '@/lib/types';
import { HeartIcon, UserIcon, ClockIcon, SparkleIcon, GridIcon, ArrowRight } from '@/lib/icons';
import loveRaw from '@/data/love.json';

const data = loveRaw as unknown as ModuleData;
const ease = [0.22, 1, 0.36, 1] as const;
type Stage = 'mode-select' | 'name-input' | 'quiz' | 'result-solo' | 'result-duet';

function HeartRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '14px 0' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: i <= rating ? 1 : 0.18 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 440, damping: 20 }}
          style={{ color: i <= rating ? 'var(--pink)' : 'var(--muted)' }}
        >
          <HeartIcon size={22} />
        </motion.div>
      ))}
    </div>
  );
}

export default function LovePage() {
  const [stage, setStage] = useState<Stage>('mode-select');
  const [mode, setMode] = useState<'solo' | 'duet'>('solo');
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [results, setResults] = useState<PsychType[]>([]);

  function selectSolo() {
    setMode('solo');
    setPlayers([{ name: 'You', answers: {} }]);
    setStage('quiz');
  }

  function selectDuet() {
    setMode('duet');
    setStage('name-input');
  }

  function startDuet() {
    const p1 = name1.trim() || 'Player 1';
    const p2 = name2.trim() || 'Player 2';
    setPlayers([{ name: p1, answers: {} }, { name: p2, answers: {} }]);
    setStage('quiz');
  }

  function handleComplete(finishedPlayers: Player[]) {
    const typed = finishedPlayers.map(p => {
      const code = getTypeCode(data.questions, p.answers, data.scoring.dimensions);
      return { ...p, type: findType(code, data.types) };
    });
    setPlayers(typed);
    setResults(typed.map(p => p.type!));
    setStage(mode === 'solo' ? 'result-solo' : 'result-duet');
  }

  function getCompatRating(t1: PsychType, t2: PsychType): number {
    return t1.compatibility?.[t2.code]?.rating ?? t2.compatibility?.[t1.code]?.rating ?? 3;
  }
  function getCompatSummary(t1: PsychType, t2: PsychType): string {
    return t1.compatibility?.[t2.code]?.summary ?? t2.compatibility?.[t1.code]?.summary ?? 'A unique pairing with its own dynamic.';
  }

  return (
    <>
      <StarField />
      <div className="page page-content">
        <div className="container"><Nav kind="love" /></div>
        <main className="container">
          <AnimatePresence mode="wait">

            {stage === 'mode-select' && (
              <motion.div key="mode-select"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.2, ease } }}
              >
                <div className="content-wrap">
                  <div className="module-intro">
                    <FadeUp>
                      <div className="module-intro-icon love"><HeartIcon size={34} /></div>
                      <div className="hero-eyebrow" style={{ color: 'var(--pink)' }}>Love</div>
                    </FadeUp>
                    <WordReveal text="Your Romantic Personality" tag="h1" className="page-title" />
                    <FadeUp delay={0.2}>
                      <p className="module-intro-desc">
                        Discover your love type and how you connect with others — take it solo or play with a partner for a full compatibility report.
                      </p>
                    </FadeUp>
                    <FadeUp delay={0.3}>
                      <div className="feature-pills">
                        <span className="result-icon-pill"><HeartIcon size={13} /><span>Love Language</span></span>
                        <span className="result-icon-pill"><SparkleIcon size={13} /><span>8 Types</span></span>
                        <span className="result-icon-pill"><ClockIcon size={13} /><span>~4 Minutes</span></span>
                      </div>
                    </FadeUp>
                    <FadeUp delay={0.38}>
                      <div className="mode-selector">
                        <motion.button className="mode-card" onClick={selectSolo}
                          whileHover={{ y: -5, transition: { type: 'spring', stiffness: 400, damping: 26 } }}
                          whileTap={{ scale: 0.96 }}
                        >
                          <div className="mode-card-icon"><UserIcon size={26} /></div>
                          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)' }}>Solo</div>
                          <div style={{ fontSize: '.82rem', color: 'var(--muted-2)', lineHeight: 1.5 }}>Discover your love type</div>
                        </motion.button>
                        <motion.button className="mode-card" onClick={selectDuet}
                          whileHover={{ y: -5, transition: { type: 'spring', stiffness: 400, damping: 26 } }}
                          whileTap={{ scale: 0.96 }}
                        >
                          <div className="mode-card-icon"><HeartIcon size={26} /></div>
                          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)' }}>Duet</div>
                          <div style={{ fontSize: '.82rem', color: 'var(--muted-2)', lineHeight: 1.5 }}>Play with a partner</div>
                        </motion.button>
                      </div>
                    </FadeUp>
                    <FadeUp delay={0.5}>
                      <Link href="/types?module=love" className="btn btn-ghost" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <GridIcon size={14} /> Browse all Love types
                      </Link>
                    </FadeUp>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'name-input' && (
              <motion.div key="name-input"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.38, ease } }}
                exit={{ opacity: 0, x: -40, transition: { duration: 0.18, ease } }}
              >
                <div className="content-wrap">
                  <div className="player-setup-wrap">
                    <div className="player-setup-inner">
                      <StaggerFade delay={0.05}>
                        <FadeItem>
                          <div className="module-intro-icon love" style={{ margin: '0 auto 20px' }}><HeartIcon size={28} /></div>
                          <div className="player-setup-title">Who&apos;s Playing?</div>
                          <div className="player-setup-sub">Enter your names to personalize the experience.</div>
                        </FadeItem>
                        <FadeItem>
                          <div className="inputs-stack" style={{ marginBottom: 24 }}>
                            <div className="input-row">
                              <span className="input-badge">1</span>
                              <input
                                className="input-field love"
                                placeholder="First player"
                                value={name1}
                                onChange={e => setName1(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && startDuet()}
                              />
                            </div>
                            <div className="input-row">
                              <span className="input-badge">2</span>
                              <input
                                className="input-field love"
                                placeholder="Second player"
                                value={name2}
                                onChange={e => setName2(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && startDuet()}
                              />
                            </div>
                          </div>
                        </FadeItem>
                        <FadeItem>
                          <div className="cta-row">
                            <motion.button
                              className="btn btn-primary"
                              onClick={startDuet}
                              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                              style={{ background: 'linear-gradient(135deg,var(--pink),#e879a8)', boxShadow: '0 4px 18px rgba(244,114,182,0.3)' }}
                            >
                              Start Duet <ArrowRight size={15} />
                            </motion.button>
                            <button className="btn btn-ghost" onClick={() => setStage('mode-select')}>← Back</button>
                          </div>
                        </FadeItem>
                      </StaggerFade>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'quiz' && (
              <motion.div key="quiz"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.38, ease } }}
                exit={{ opacity: 0, x: -40, transition: { duration: 0.18, ease } }}
              >
                <div className="content-wrap">
                  <button className="quiz-back-btn" onClick={() => setStage('mode-select')}>← Back</button>
                  <InterleavedQuiz players={players} questions={data.questions} dimensions={data.scoring.dimensions} moduleKind="love" onComplete={handleComplete} />
                </div>
              </motion.div>
            )}

            {stage === 'result-solo' && results[0] && (
              <motion.div key="result-solo" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }} exit={{ opacity: 0 }}>
                <div className="content-wrap"><ResultCard type={results[0]} moduleKind="love" /></div>
              </motion.div>
            )}

            {stage === 'result-duet' && results[0] && results[1] && (
              <motion.div key="result-duet"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
                exit={{ opacity: 0 }}
              >
                <div className="content-wrap">
                  <div className="duet-results">
                    <FadeUp>
                      <div className="player-swap-banner">
                        <span>{players[0].name}</span>
                        <motion.div
                          animate={{ scale: [1, 1.25, 1] }}
                          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                          style={{ color: 'var(--pink)' }}
                        >
                          <HeartIcon size={20} />
                        </motion.div>
                        <span>{players[1].name}</span>
                      </div>
                    </FadeUp>

                    <FadeUp delay={0.15}>
                      <div className="duet-cards-row">
                        <div className="compact-result-card">
                          <div className="result-type-code">{results[0].code}</div>
                          <div className="result-type-name">{results[0].name}</div>
                          {results[0].tagline && <div className="result-tagline">"{results[0].tagline}"</div>}
                        </div>
                        <div className="duet-vs">vs</div>
                        <div className="compact-result-card">
                          <div className="result-type-code">{results[1].code}</div>
                          <div className="result-type-name">{results[1].name}</div>
                          {results[1].tagline && <div className="result-tagline">"{results[1].tagline}"</div>}
                        </div>
                      </div>
                    </FadeUp>

                    <FadeUp delay={0.3}>
                      <div style={{ textAlign: 'center', background: 'var(--card-bg)', border: '1px solid rgba(244,114,182,0.2)', borderRadius: 'var(--r)', padding: '28px 24px' }}>
                        <div style={{ fontSize: '.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 4 }}>Compatibility</div>
                        <HeartRating rating={getCompatRating(results[0], results[1])} />
                        <p style={{ color: 'var(--muted-2)', fontSize: '.9rem', maxWidth: 400, margin: '8px auto 0', lineHeight: 1.7 }}>
                          {getCompatSummary(results[0], results[1])}
                        </p>
                      </div>
                    </FadeUp>

                    <FadeUp delay={0.42}>
                      <div className="result-actions" style={{ background: 'transparent', border: 'none', padding: 0, justifyContent: 'center' }}>
                        <Link href="/types?module=love" className="btn btn-secondary" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                          <GridIcon size={14} /> Explore All Types
                        </Link>
                        <Link href="/" className="btn btn-ghost">Home</Link>
                      </div>
                    </FadeUp>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
