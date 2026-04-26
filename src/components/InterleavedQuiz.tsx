'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question, Dimension, ModuleKind, Player, PoleEnd } from '@/lib/types';

interface Props {
  players: Player[];
  questions: Question[];
  dimensions: Dimension[];
  moduleKind: ModuleKind;
  onComplete: (players: Player[]) => void;
}

const ACCENT: Record<ModuleKind, string> = {
  mbti: 'var(--accent)', love: 'var(--pink)', friendship: 'var(--green)', career: 'var(--orange)', disney: 'var(--gold)',
};
const BTN: Record<ModuleKind, string> = {
  mbti: '', love: 'love-btn', friendship: 'friend-btn', career: 'career-btn', disney: 'disney-btn',
};
const FILL: Record<ModuleKind, string> = {
  mbti: '', love: 'love', friendship: 'friendship', career: 'career', disney: 'disney',
};

const ease = [0.22, 1, 0.36, 1] as const;

/* Pole tooltip label — shows letter + name + agree/disagree, hover reveals description */
function PoleLabel({ pole, align, side }: { pole: PoleEnd; align: 'left' | 'right'; side: 'agree' | 'disagree' }) {
  const tip = pole.description ? `${pole.name}: ${pole.description}` : pole.name;
  return (
    <span
      className={`pole-label pole-label-${align}`}
      data-tooltip={tip}
      aria-label={tip}
    >
      <span className="pole-letter">{pole.letter}</span>
      <span className="pole-name">{pole.name}</span>
      <span className="pole-agree">{side === 'disagree' ? 'Strongly Disagree' : 'Strongly Agree'}</span>
    </span>
  );
}

export default function InterleavedQuiz({ players: init, questions, dimensions, moduleKind, onComplete }: Props) {
  const [players, setPlayers] = useState<Player[]>(init);
  const [qi, setQi] = useState(0);
  const [pi, setPi] = useState(0);
  const [locked, setLocked] = useState(false);

  const q = questions[qi];
  const player = players[pi];
  const total = questions.length;
  const isMulti = players.length > 1;
  const accent = ACCENT[moduleKind];
  const btnCls = BTN[moduleKind];
  const fillCls = FILL[moduleKind];

  /* Find the dimension this question belongs to */
  const dim = dimensions.find(d => d.id === q.dimension);

  const select = useCallback((val: number) => {
    if (locked) return;
    setLocked(true);

    const updated = players.map((p, i) =>
      i === pi ? { ...p, answers: { ...p.answers, [q.id]: val } } : p
    );
    setPlayers(updated);

    setTimeout(() => {
      const nextPi = pi + 1;
      if (nextPi < players.length) {
        setPi(nextPi);
        setLocked(false);
      } else {
        const nextQi = qi + 1;
        if (nextQi >= total) {
          onComplete(updated);
        } else {
          setQi(nextQi);
          setPi(0);
          setLocked(false);
        }
      }
    }, 300);
  }, [locked, players, pi, q, qi, total, onComplete]);

  const pct = Math.round((qi / total) * 100);

  return (
    <div>
      {/* Progress */}
      <div className="progress-container">
        <div className="progress-info">
          <span className="q-count">{qi + 1} / {total}</span>
          {isMulti && (
            <motion.span
              key={`${qi}-${pi}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
              style={{ color: accent, fontSize: '.8rem', fontWeight: 600, fontFamily: 'var(--font-body)' }}
            >
              {player.name}
            </motion.span>
          )}
          {/* Dimension indicator */}
          {dim && (
            <AnimatePresence mode="wait">
              <motion.span
                key={dim.id}
                className="dimension-indicator"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.3, ease }}
              >
                {dim.pole_a.letter}
                <span className="dimension-indicator-sep">·</span>
                {dim.pole_b.letter}
              </motion.span>
            </AnimatePresence>
          )}
        </div>
        <div className="progress-track">
          <motion.div
            className={`progress-fill ${fillCls}`}
            initial={false}
            animate={{ width: pct + '%' }}
            transition={{ duration: 0.5, ease }}
          />
        </div>
      </div>

      {/* Player turn indicator */}
      <AnimatePresence mode="wait">
        {isMulti && (
          <motion.div
            key={`banner-${qi}-${pi}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease }}
            className="friendship-progress-bar"
            style={{ marginTop: 12, borderColor: `color-mix(in srgb, ${accent} 30%, transparent)` }}
          >
            <div>
              <div className="current-player-label">Now answering</div>
              <div className="current-player-name" style={{ color: accent }}>{player.name}</div>
            </div>
            <div className="player-dots">
              {players.map((_, i) => (
                <div
                  key={i}
                  className={`player-dot ${i < pi ? 'done' : ''} ${i === pi ? 'active' : ''}`}
                  style={i === pi ? { background: accent, borderColor: accent, boxShadow: `0 0 8px ${accent}80` } : {}}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question */}
      <section className="question-stage" style={{ overflow: 'visible', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${qi}-${pi}`}
            initial={{ opacity: 0, x: 60, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -60, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            style={{ width: '100%' }}
          >
            {/* Dimension badge — keyed by dimension id so it only animates when dimension changes */}
            {dim && (
              <motion.div
                key={dim.id}
                className="dimension-badge"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease }}
              >
                <span className="dimension-badge-label">Measuring</span>
                <span
                  className="dimension-badge-pole"
                  data-tooltip={dim.pole_a.description ? `${dim.pole_a.name}: ${dim.pole_a.description}` : dim.pole_a.name}
                >
                  {dim.pole_a.name}
                </span>
                <span className="dimension-badge-vs">vs</span>
                <span
                  className="dimension-badge-pole"
                  data-tooltip={dim.pole_b.description ? `${dim.pole_b.name}: ${dim.pole_b.description}` : dim.pole_b.name}
                >
                  {dim.pole_b.name}
                </span>
              </motion.div>
            )}

            <div className="question-num">Question {qi + 1} of {total}</div>
            <div className="question-text">{q.text}</div>
            <div className="scale-container">
              {/* Pole labels: left = disagree side, right = agree side.
                  pole_a_direction true  → agree (5) maps to pole_a → pole_a on RIGHT
                  pole_a_direction false → agree (5) maps to pole_b → pole_b on RIGHT */}
              <div className="scale-poles">
                {dim ? (
                  <PoleLabel
                    pole={q.pole_a_direction ? dim.pole_b : dim.pole_a}
                    align="left"
                    side="disagree"
                  />
                ) : (
                  <span className="pole-label pole-label-left"><span className="pole-name">Strongly Disagree</span></span>
                )}
                {dim ? (
                  <PoleLabel
                    pole={q.pole_a_direction ? dim.pole_a : dim.pole_b}
                    align="right"
                    side="agree"
                  />
                ) : (
                  <span className="pole-label pole-label-right"><span className="pole-name">Strongly Agree</span></span>
                )}
              </div>
              <div className="scale-buttons" role="radiogroup">
                {[1, 2, 3, 4, 5].map(v => (
                  <motion.button
                    key={v}
                    className={`scale-btn ${btnCls} ${player.answers[q.id] === v ? 'selected' : ''}`}
                    onClick={() => select(v)}
                    aria-checked={player.answers[q.id] === v}
                    role="radio"
                    aria-label={String(v)}
                    whileHover={{ boxShadow: `0 0 0 3px color-mix(in srgb, ${accent} 20%, transparent)` }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.12 }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: v * 0.05, duration: 0.3, ease } }}
                  >
                    {v}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
