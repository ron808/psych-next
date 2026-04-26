'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import Nav from '@/components/Nav';
import InterleavedQuiz from '@/components/InterleavedQuiz';
import ResultCard from '@/components/ResultCard';
import { FadeUp, WordReveal } from '@/components/motion';
import { getTypeCode, findType } from '@/lib/scoring';
import type { ModuleData, Player, PsychType } from '@/lib/types';
import { RocketIcon, ClockIcon, SparkleIcon, GridIcon, ArrowRight } from '@/lib/icons';
import careerRaw from '@/data/career.json';

const data = careerRaw as unknown as ModuleData;
const ease = [0.22, 1, 0.36, 1] as const;
type Stage = 'intro' | 'quiz' | 'result';

export default function CareerPage() {
  const [stage, setStage] = useState<Stage>('intro');
  const [result, setResult] = useState<PsychType | null>(null);

  function handleComplete(players: Player[]) {
    const p = players[0];
    const code = getTypeCode(data.questions, p.answers, data.scoring.dimensions);
    setResult(findType(code, data.types));
    setStage('result');
  }

  return (
    <>
      <StarField />
      <div className="page page-content">
        <div className="container"><Nav kind="career" /></div>
        <main className="container">
          <AnimatePresence mode="wait">
            {stage === 'intro' && (
              <motion.div key="intro"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.2, ease } }}
              >
                <div className="content-wrap">
                  <div className="module-intro">
                    <FadeUp>
                      <div className="module-intro-icon career"><RocketIcon size={34} /></div>
                      <div className="hero-eyebrow" style={{ color: 'var(--orange)' }}>Career</div>
                    </FadeUp>
                    <WordReveal text="Your Career Personality" tag="h1" className="page-title" />
                    <FadeUp delay={0.2}>
                      <p className="module-intro-desc">
                        15 questions reveal one of 8 career types — with specific job paths, a year-by-year growth roadmap, ideal company type, and the traps to avoid.
                      </p>
                    </FadeUp>
                    <FadeUp delay={0.3}>
                      <div className="feature-pills">
                        <span className="result-icon-pill"><RocketIcon size={13} /><span>3 Dimensions</span></span>
                        <span className="result-icon-pill"><SparkleIcon size={13} /><span>8 Types</span></span>
                        <span className="result-icon-pill"><ClockIcon size={13} /><span>~3 Minutes</span></span>
                      </div>
                    </FadeUp>
                    <FadeUp delay={0.4}>
                      <div className="cta-row">
                        <motion.button
                          className="btn btn-primary"
                          onClick={() => setStage('quiz')}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          style={{ background: 'linear-gradient(135deg,var(--orange),#e8810a)', boxShadow: '0 4px 18px rgba(251,146,60,0.3)' }}
                        >
                          Begin Test <ArrowRight size={15} />
                        </motion.button>
                        <Link href="/types?module=career" className="btn btn-ghost" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                          <GridIcon size={14} /> Browse Types
                        </Link>
                      </div>
                    </FadeUp>
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
                  <button className="quiz-back-btn" onClick={() => setStage('intro')}>← Back</button>
                  <InterleavedQuiz
                    players={[{ name: 'You', answers: {} }]}
                    questions={data.questions}
                    dimensions={data.scoring.dimensions}
                    moduleKind="career"
                    onComplete={handleComplete}
                  />
                </div>
              </motion.div>
            )}

            {stage === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }} exit={{ opacity: 0 }}>
                <div className="content-wrap">
                  <button className="quiz-back-btn" onClick={() => setStage('intro')}>← Retake test</button>
                  <ResultCard type={result} moduleKind="career" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
