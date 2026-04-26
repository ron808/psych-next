'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import Nav from '@/components/Nav';
import InterleavedQuiz from '@/components/InterleavedQuiz';
import ResultCard from '@/components/ResultCard';
import { FadeUp, StaggerFade, FadeItem, WordReveal, InViewFade } from '@/components/motion';
import { getTypeCode, findType, calcChemistry } from '@/lib/scoring';
import type { ModuleData, Player, PsychType } from '@/lib/types';
import { UsersIcon, ClockIcon, SparkleIcon, GridIcon, ArrowRight } from '@/lib/icons';
import friendshipRaw from '@/data/friendship.json';

const data = friendshipRaw as unknown as ModuleData;
const ease = [0.22, 1, 0.36, 1] as const;

// compatibility_matrix in JSON is { note, pairs: [...] } — extract the pairs array
const rawCompat = data.group_report?.compatibility_matrix as unknown as
  { pairs?: { types: [string, string]; rating: number }[] } | { types: [string, string]; rating: number }[] | undefined;
const compatMatrix: { types: [string, string]; rating: number }[] =
  Array.isArray(rawCompat) ? rawCompat : ((rawCompat as { pairs?: { types: [string, string]; rating: number }[] })?.pairs ?? []);

type Stage = 'setup' | 'quiz' | 'results';
const PLAYER_COLORS = ['var(--green)', 'var(--pink)', 'var(--orange)', 'var(--accent)', '#6af'];

function SectionBlock({ title, children, alwaysOpen, open, onToggle }: {
  title: string; children: React.ReactNode; alwaysOpen?: boolean; open?: boolean; onToggle?: () => void;
}) {
  return (
    <div className={`group-section${alwaysOpen ? ' always-open' : ''}`}>
      <div className="group-section-header" onClick={alwaysOpen ? undefined : onToggle} style={alwaysOpen ? undefined : { cursor: 'pointer' }}>
        <div className="group-section-title">{title}</div>
        {!alwaysOpen && <div className="group-section-toggle">{open ? '−' : '+'}</div>}
      </div>
      <div className={`group-section-body${open || alwaysOpen ? ' open' : ''}`}>
        <div className="group-section-content">{children}</div>
      </div>
    </div>
  );
}

export default function FriendshipPage() {
  const [stage, setStage] = useState<Stage>('setup');
  const [playerCount, setPlayerCount] = useState(3);
  const [names, setNames] = useState<string[]>(['', '', '', '', '']);
  const [players, setPlayers] = useState<Player[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  function toggleSection(key: string) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function startQuiz() {
    setPlayers(Array.from({ length: playerCount }, (_, i) => ({
      name: names[i].trim() || `Player ${i + 1}`,
      answers: {},
    })));
    setStage('quiz');
  }

  function handleComplete(finishedPlayers: Player[]) {
    const typed = finishedPlayers.map(p => {
      const code = getTypeCode(data.questions, p.answers, data.scoring.dimensions);
      return { ...p, type: findType(code, data.types) };
    });
    setPlayers(typed);
    setStage('results');
  }

  const chemistry = players.length >= 2 ? calcChemistry(players, compatMatrix) : 0;
  const allStrengths = players.flatMap(p => p.type?.strengths ?? []);
  const allChallenges = players.flatMap(p => {
    const w = p.type?.watch_out_for;
    if (Array.isArray(w)) return w as string[];
    if (typeof w === 'string') return [w];
    return p.type?.challenges ?? [];
  });
  const typeCodes = players.map(p => p.type?.code ?? '');
  const dims = data.scoring.dimensions;
  const missingPoles: string[] = [];
  dims.forEach((dim, i) => {
    if (!typeCodes.some(c => c[i] === dim.pole_a.letter)) missingPoles.push(dim.pole_a.name ?? dim.pole_a.letter);
    if (!typeCodes.some(c => c[i] === dim.pole_b.letter)) missingPoles.push(dim.pole_b.name ?? dim.pole_b.letter);
  });

  return (
    <>
      <StarField />
      <div className="page page-content">
        <div className="container"><Nav kind="friendship" /></div>
        <main className="container">
          <AnimatePresence mode="wait">

            {stage === 'setup' && (
              <motion.div key="setup"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.2, ease } }}
              >
                <div className="content-wrap">
                  <div className="player-setup-wrap">
                    <div className="player-setup-inner">
                      <StaggerFade delay={0.05}>
                        <FadeItem>
                          <div className="module-intro-icon friendship" style={{ margin: '0 auto 20px' }}><UsersIcon size={32} /></div>
                          <div className="hero-eyebrow" style={{ color: 'var(--green)' }}>Friendship</div>
                          <div className="player-setup-title">Group Personality Test</div>
                          <div className="player-setup-sub">
                            Everyone answers each question before the group moves on — keeping it fair and revealing.
                          </div>
                        </FadeItem>
                        <FadeItem>
                          <div className="player-count-row">
                            <div className="player-count-label">How many players?</div>
                            <div className="player-count-selector">
                              {[2, 3, 4, 5].map(n => (
                                <motion.button
                                  key={n}
                                  className={`player-count-btn${playerCount === n ? ' active' : ''}`}
                                  onClick={() => setPlayerCount(n)}
                                  whileHover={{ scale: 1.06 }}
                                  whileTap={{ scale: 0.94 }}
                                >
                                  {n}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </FadeItem>
                        <FadeItem>
                          <div className="inputs-stack" style={{ marginBottom: 28 }}>
                            {Array.from({ length: playerCount }, (_, i) => (
                              <div className="input-row" key={i}>
                                <span className="input-badge">{i + 1}</span>
                                <input
                                  className="input-field friendship"
                                  placeholder={`Player ${i + 1}`}
                                  value={names[i]}
                                  onChange={e => {
                                    const updated = [...names];
                                    updated[i] = e.target.value;
                                    setNames(updated);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </FadeItem>
                        <FadeItem>
                          <div className="cta-row">
                            <motion.button
                              className="btn btn-primary"
                              onClick={startQuiz}
                              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                              style={{ background: 'linear-gradient(135deg,var(--green),#20b87e)', boxShadow: '0 4px 18px rgba(52,211,153,0.3)', color: '#0a1a12' }}
                            >
                              <UsersIcon size={15} /> Start <ArrowRight size={15} />
                            </motion.button>
                            <Link href="/types?module=friendship" className="btn btn-ghost" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                              <GridIcon size={14} /> Browse Types
                            </Link>
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
                  <button className="quiz-back-btn" onClick={() => setStage('setup')}>← Back</button>
                  <InterleavedQuiz players={players} questions={data.questions} dimensions={data.scoring.dimensions} moduleKind="friendship" onComplete={handleComplete} />
                </div>
              </motion.div>
            )}

            {stage === 'results' && (
              <motion.div key="results"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
                exit={{ opacity: 0 }}
              >
                <div className="content-wrap">
                  <InViewFade>
                    <div className="constellation-view">
                      <div className="constellation-title">Your Group Constellation</div>
                      <div className="constellation-sub">{players.length} personalities, one dynamic</div>
                      <div className="constellation-nodes">
                        {players.map((p, i) => (
                          <motion.div
                            key={i}
                            className="constellation-node"
                            style={{ borderColor: PLAYER_COLORS[i] }}
                            initial={{ opacity: 0, scale: 0.65 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, type: 'spring', stiffness: 380, damping: 28 }}
                          >
                            <div className="constellation-node-code" style={{ color: PLAYER_COLORS[i] }}>{p.type?.code ?? '??'}</div>
                            <div className="constellation-node-name">{p.name}</div>
                            <div className="constellation-node-type">{p.type?.name ?? ''}</div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.div
                        className="chemistry-score-display"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.45, type: 'spring', stiffness: 300, damping: 24 }}
                      >
                        <div className="chemistry-score-num">{chemistry}%</div>
                        <div className="chemistry-score-label">Group Chemistry</div>
                      </motion.div>
                    </div>
                  </InViewFade>

                  <InViewFade>
                    <div className="group-report" style={{ marginTop: 28 }}>
                      <SectionBlock title="Group Overview" alwaysOpen>
                        <div className="player-names-list">
                          {players.map((p, i) => (
                            <div key={i} className="trait-item">
                              <span className="trait-dot strength" style={{ background: PLAYER_COLORS[i] }} />
                              <span><strong style={{ color: PLAYER_COLORS[i] }}>{p.name}</strong>{p.type && <> — {p.type.code} · {p.type.name}</>}</span>
                            </div>
                          ))}
                        </div>
                      </SectionBlock>
                      {allStrengths.length > 0 && (
                        <SectionBlock title="What Makes Your Group Exceptional" open={!!openSections['strengths']} onToggle={() => toggleSection('strengths')}>
                          <div className="traits-grid">
                            {[...new Set(allStrengths)].slice(0, 10).map((s, i) => (
                              <div key={i} className="trait-item"><span className="trait-dot strength" /><span>{s}</span></div>
                            ))}
                          </div>
                        </SectionBlock>
                      )}
                      {allChallenges.length > 0 && (
                        <SectionBlock title="Where You Might Clash" open={!!openSections['challenges']} onToggle={() => toggleSection('challenges')}>
                          <div className="traits-grid">
                            {[...new Set(allChallenges)].slice(0, 10).map((c, i) => (
                              <div key={i} className="trait-item"><span className="trait-dot weakness" /><span>{c}</span></div>
                            ))}
                          </div>
                        </SectionBlock>
                      )}
                      <SectionBlock title="Each Person's Role" open={!!openSections['roles']} onToggle={() => toggleSection('roles')}>
                        {players.map((p, i) => (
                          <div key={i} style={{ marginBottom: 12 }}>
                            <div style={{ fontWeight: 700, color: PLAYER_COLORS[i], marginBottom: 2 }}>{p.name}</div>
                            <div style={{ color: 'var(--muted)', fontSize: '.875rem' }}>{p.type?.role_in_group ?? p.type?.group_role ?? p.type?.name ?? '—'}</div>
                          </div>
                        ))}
                      </SectionBlock>
                      {missingPoles.length > 0 && (
                        <SectionBlock title="What Your Group Could Use More Of" open={!!openSections['missing']} onToggle={() => toggleSection('missing')}>
                          <div className="compat-grid">
                            {missingPoles.map((pole, i) => <span key={i} className="compat-tag watch">{pole}</span>)}
                          </div>
                        </SectionBlock>
                      )}
                    </div>
                  </InViewFade>

                  <InViewFade>
                    <div style={{ marginTop: 40 }}>
                      <div className="result-section-title" style={{ marginBottom: 20 }}>Individual Results</div>
                      {players.map((p, i) =>
                        p.type ? (
                          <div key={i} style={{ marginBottom: 32 }}>
                            <div style={{ fontWeight: 700, color: PLAYER_COLORS[i], marginBottom: 10, fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: 'var(--font-mono)' }}>
                              {p.name}
                            </div>
                            <ResultCard type={p.type} moduleKind="friendship" />
                          </div>
                        ) : null
                      )}
                    </div>
                  </InViewFade>

                  <InViewFade>
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                      <Link href="/types?module=friendship" className="btn btn-ghost" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <GridIcon size={14} /> Browse all Friendship types
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
