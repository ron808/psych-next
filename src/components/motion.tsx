'use client';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { useRef } from 'react';

/* ── Easing ─────────────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const;

/* ── Shared variants ─────────────────────────────────────────── */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease } },
};

export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const slideInVariants: Variants = {
  hidden: { opacity: 0, x: 56 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 380, damping: 36 } },
  exit:   { opacity: 0, x: -56, transition: { duration: 0.22, ease } },
};

/* ── FadeUp — fade in upward on mount ───────────────────────── */
export function FadeUp({
  children, delay = 0, className, style,
}: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={{ duration: 0.55, delay, ease }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── StaggerFade — staggers children's fadeUp ───────────────── */
export function StaggerFade({
  children, className, delay = 0,
}: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ ...staggerVariants, visible: { ...staggerVariants.visible as object, transition: { staggerChildren: 0.09, delayChildren: delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── FadeItem — use inside StaggerFade ──────────────────────── */
export function FadeItem({
  children, className, style,
}: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <motion.div variants={fadeUpVariants} className={className} style={style}>
      {children}
    </motion.div>
  );
}

/* ── InViewFade — animate when scrolled into view ───────────── */
export function InViewFade({
  children, className, style,
}: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUpVariants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── AnimCard — hover spring lift ────────────────────────────── */
export function AnimCard({
  children, className, style, onClick,
}: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 420, damping: 28 } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/* ── WordReveal — hero heading word-by-word blur reveal ─────── */
export function WordReveal({
  text, className, tag = 'span',
}: {
  text: string; className?: string; tag?: 'span' | 'h1' | 'h2';
}) {
  const words = text.split(' ');
  const Tag = tag;
  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
        style={{ display: 'inline' }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease } },
            }}
            style={{ display: 'inline-block', marginRight: '0.28em' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ── SlideQuestion — animated quiz question wrapper ─────────── */
export function SlideQuestion({
  children, id,
}: {
  children: React.ReactNode; id: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0, x: 60, filter: 'blur(4px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 360, damping: 34 } }}
        exit={{ opacity: 0, x: -60, filter: 'blur(4px)', transition: { duration: 0.2, ease } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ── ScaleIn — scale in from small ──────────────────────────── */
export function ScaleIn({
  children, delay = 0, className,
}: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.45, delay, ease } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── AnimPresence re-export ──────────────────────────────────── */
export { AnimatePresence };
