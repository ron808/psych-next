'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { PsychType, ModuleKind, ArchetypeObj } from '@/lib/types';
import { strVal } from '@/lib/scoring';
import { ShareIcon, CheckIcon, CloseIcon, PawIcon, ZapIcon, SparkleIcon, WavesIcon, HeartIcon, UsersIcon, WorkIcon, DramaIcon, GridIcon, CrownIcon, StarIcon } from '@/lib/icons';
import { InViewFade, FadeUp, ScaleIn } from './motion';

/* ── helpers ────────────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const;

function TraitList({ items, kind }: { items: string[]; kind: 'strength' | 'weakness' }) {
  return (
    <div className="traits-grid">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="trait-item"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.35, ease }}
        >
          <span className={`trait-dot ${kind}`} />
          <span>{item}</span>
        </motion.div>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="result-section-title">{children}</div>;
}

function IconPills({ type, moduleKind }: { type: PsychType; moduleKind: ModuleKind }) {
  const pills: React.ReactNode[] = [];
  if (moduleKind === 'mbti') {
    const a = strVal(type.animal), g = strVal(type.greek_god), s = strVal(type.star), e = strVal(type.element);
    if (a) pills.push(<span key="a" className="result-icon-pill"><PawIcon size={13}/><span>{a}</span></span>);
    if (g) pills.push(<span key="g" className="result-icon-pill"><ZapIcon size={13}/><span>{g}</span></span>);
    if (s) pills.push(<span key="s" className="result-icon-pill"><SparkleIcon size={13}/><span>{s}</span></span>);
    if (e) pills.push(<span key="e" className="result-icon-pill"><WavesIcon size={13}/><span>{e}</span></span>);
  } else if (moduleKind === 'love') {
    const l = strVal(type.love_language), a = strVal(type.famous_archetype);
    if (l) pills.push(<span key="l" className="result-icon-pill"><HeartIcon size={13}/><span>{l}</span></span>);
    if (a) pills.push(<span key="a" className="result-icon-pill"><DramaIcon size={13}/><span>{a}</span></span>);
  } else if (moduleKind === 'friendship') {
    const r = strVal(type.role_in_group ?? type.group_role);
    if (r) pills.push(<span key="r" className="result-icon-pill"><UsersIcon size={13}/><span>{r}</span></span>);
  } else if (moduleKind === 'disney') {
    const m = type.movie, p = type.power, s = type.sidekick;
    if (m) pills.push(<span key="m" className="result-icon-pill"><CrownIcon size={13}/><span>{m}</span></span>);
    if (p) pills.push(<span key="p" className="result-icon-pill"><SparkleIcon size={13}/><span>{p}</span></span>);
    if (s) pills.push(<span key="s" className="result-icon-pill"><StarIcon size={13}/><span>{s}</span></span>);
  } else if (moduleKind === 'career') {
    const w = strVal(type.work_style);
    if (w) pills.push(<span key="w" className="result-icon-pill"><WorkIcon size={13}/><span>{w}</span></span>);
  }
  return pills.length ? <motion.div className="result-icons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }}>{pills}</motion.div> : null;
}

function ModuleExtra({ type, moduleKind }: { type: PsychType; moduleKind: ModuleKind }) {
  if (moduleKind === 'mbti') {
    const archetypes = [type.animal, type.greek_god, type.star]
      .filter((v): v is ArchetypeObj => typeof v === 'object' && !!v?.reason);
    const thrive = Array.isArray(type.thrives_when) ? type.thrives_when : [];
    const struggle = Array.isArray(type.struggles_when) ? type.struggles_when : [];
    const famous = type.famous_people ?? [];
    return (
      <>
        {archetypes.length > 0 && <InViewFade><div><SectionTitle>Your Archetypes</SectionTitle><div className="archetype-list">{archetypes.map((a, i) => <div key={i} className="archetype-row"><span className="archetype-label">{a.name}</span><span className="archetype-reason">{a.reason}</span></div>)}</div></div></InViewFade>}
        {thrive.length   > 0 && <InViewFade><div><SectionTitle>You Thrive When</SectionTitle><TraitList items={thrive} kind="strength" /></div></InViewFade>}
        {struggle.length > 0 && <InViewFade><div><SectionTitle>You Struggle When</SectionTitle><TraitList items={struggle} kind="weakness" /></div></InViewFade>}
        {famous.length   > 0 && <InViewFade><div><SectionTitle>Famous {type.name}s</SectionTitle><div className="famous-list">{famous.map(f => <span key={f} className="famous-tag">{f}</span>)}</div></div></InViewFade>}
      </>
    );
  }
  if (moduleKind === 'career') {
    const paths = type.career_paths ?? [], rm = type.growth_roadmap ?? {};
    const thrive = Array.isArray(type.thrives_when) ? type.thrives_when : [];
    const struggle = Array.isArray(type.struggles_when) ? type.struggles_when : [];
    return (
      <>
        {paths.length > 0 && <InViewFade><div><SectionTitle>Career Paths</SectionTitle><div className="career-paths-list">{paths.map(p => <span key={p} className="career-path-tag">{p}</span>)}</div></div></InViewFade>}
        {(rm.year_1_3 || rm.year_3_7 || rm.year_7_plus) && <InViewFade><div><SectionTitle>Growth Roadmap</SectionTitle><div className="roadmap-grid">{rm.year_1_3 && <div className="roadmap-phase"><div className="roadmap-phase-label">Year 1–3</div><div className="roadmap-phase-text">{rm.year_1_3}</div></div>}{rm.year_3_7 && <div className="roadmap-phase"><div className="roadmap-phase-label">Year 3–7</div><div className="roadmap-phase-text">{rm.year_3_7}</div></div>}{rm.year_7_plus && <div className="roadmap-phase"><div className="roadmap-phase-label">Year 7+</div><div className="roadmap-phase-text">{rm.year_7_plus}</div></div>}</div>{(rm.key_skill_to_develop ?? rm.key_skill) && <p style={{ marginTop:12, fontSize:'.85rem', color:'var(--muted-2)' }}><strong style={{ color:'var(--orange)' }}>Key Skill:</strong> {rm.key_skill_to_develop ?? rm.key_skill}</p>}{rm.trap_to_avoid && <p style={{ marginTop:6, fontSize:'.85rem', color:'var(--muted-2)' }}><strong style={{ color:'var(--pink)' }}>Trap to Avoid:</strong> {rm.trap_to_avoid}</p>}</div></InViewFade>}
        {thrive.length   > 0 && <InViewFade><div><SectionTitle>You Thrive When</SectionTitle><TraitList items={thrive} kind="strength" /></div></InViewFade>}
        {struggle.length > 0 && <InViewFade><div><SectionTitle>You Struggle When</SectionTitle><TraitList items={struggle} kind="weakness" /></div></InViewFade>}
        {type.ideal_company_type && <InViewFade><div><SectionTitle>Ideal Company Type</SectionTitle><p className="module-extra-text">{type.ideal_company_type}</p></div></InViewFade>}
      </>
    );
  }
  if (moduleKind === 'love') {
    const raw = type.needs_in_partner, rawFlags = type.red_flags, growth = type.growth_edge ?? type.growth;
    return (
      <>
        {type.love_style && <InViewFade><div><SectionTitle>Love Style</SectionTitle><p className="module-extra-text">{type.love_style}</p></div></InViewFade>}
        {raw && <InViewFade><div><SectionTitle>Needs in a Partner</SectionTitle>{Array.isArray(raw) ? <TraitList items={raw} kind="strength" /> : <p className="module-extra-text">{raw}</p>}</div></InViewFade>}
        {rawFlags && <InViewFade><div><SectionTitle>Watch Out For</SectionTitle>{Array.isArray(rawFlags) ? <TraitList items={rawFlags} kind="weakness" /> : <p className="module-extra-text">{rawFlags}</p>}</div></InViewFade>}
        {growth && <InViewFade><div><SectionTitle>Growth Edge</SectionTitle><p className="module-extra-text">{growth}</p></div></InViewFade>}
      </>
    );
  }
  if (moduleKind === 'friendship') {
    const note = type.group_dynamic_note, quote = type.quote;
    return (
      <>
        {note  && <InViewFade><div><SectionTitle>In a Group</SectionTitle><p className="module-extra-text">{note}</p></div></InViewFade>}
        {quote && <InViewFade><p style={{ fontFamily:'var(--font-head)', fontStyle:'italic', fontWeight:400, color:'var(--muted-2)', fontSize:'1rem', borderLeft:'3px solid var(--green)', paddingLeft:16, lineHeight:1.6 }}>"{quote}"</p></InViewFade>}
      </>
    );
  }
  if (moduleKind === 'disney') {
    const thrive = Array.isArray(type.thrives_when) ? type.thrives_when : [];
    const struggle = Array.isArray(type.struggles_when) ? type.struggles_when : [];
    const famous = type.famous_people ?? [];
    return (
      <>
        {type.quote && <InViewFade><p style={{ fontFamily:'var(--font-head)', fontStyle:'italic', fontWeight:400, color:'var(--muted-2)', fontSize:'1.05rem', borderLeft:'3px solid var(--gold)', paddingLeft:16, lineHeight:1.6 }}>"{type.quote}"</p></InViewFade>}
        {thrive.length   > 0 && <InViewFade><div><SectionTitle>You Thrive When</SectionTitle><TraitList items={thrive} kind="strength" /></div></InViewFade>}
        {struggle.length > 0 && <InViewFade><div><SectionTitle>You Struggle When</SectionTitle><TraitList items={struggle} kind="weakness" /></div></InViewFade>}
        {famous.length   > 0 && <InViewFade><div><SectionTitle>Real-World Counterparts</SectionTitle><div className="famous-list">{famous.map(f => <span key={f} className="famous-tag">{f}</span>)}</div></div></InViewFade>}
      </>
    );
  }
  return null;
}

/* ── Main ───────────────────────────────────────────────────── */
export default function ResultCard({ type, moduleKind }: { type: PsychType; moduleKind: ModuleKind }) {
  const [copied, setCopied] = useState(false);

  const weaknesses = (() => {
    if (moduleKind === 'love') return Array.isArray(type.challenges) ? type.challenges : [];
    if (moduleKind === 'friendship') return Array.isArray(type.watch_out_for) ? (type.watch_out_for as string[]) : (Array.isArray(type.challenges) ? type.challenges : []);
    return Array.isArray(type.weaknesses) ? type.weaknesses : [];
  })();
  const weakLabel = moduleKind === 'love' || moduleKind === 'friendship' ? 'Challenges' : 'Weaknesses';
  const good  = (type.good_matches ?? type.best_matches ?? type.best_with ?? []) as string[];
  const watch = (moduleKind !== 'love' ? (type.friction_with ?? type.difficult_with ?? []) : []) as string[];

  function share() {
    const text = `I got ${type.code} — ${type.name} on PSYCH.SITE\n"${type.tagline ?? ''}"\n\nDiscover yours at psych.site`;
    navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => prompt('Copy your result:', text));
  }

  return (
    <ScaleIn>
      <div className="result-card">
        {/* Header */}
        <FadeUp>
          <div className="result-card-header">
            <motion.div
              className="result-type-code"
              initial={{ opacity: 0, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, letterSpacing: '0.15em' }}
              transition={{ duration: 0.7, ease }}
            >
              {type.code}
            </motion.div>
            <motion.div
              className="result-type-name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease }}
            >
              {type.name}
            </motion.div>
            {type.tagline && (
              <motion.div
                className="result-tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{ fontFamily: 'var(--font-head)', fontStyle: 'italic', fontWeight: 400 }}
              >
                "{type.tagline}"
              </motion.div>
            )}
            <IconPills type={type} moduleKind={moduleKind} />
          </div>
        </FadeUp>

        {/* Body */}
        <div className="result-card-body">
          {type.description && <InViewFade><p className="result-description">{type.description}</p></InViewFade>}
          {(type.strengths?.length ?? 0) > 0 && <InViewFade><div><SectionTitle>Strengths</SectionTitle><TraitList items={type.strengths!} kind="strength" /></div></InViewFade>}
          {weaknesses.length > 0 && <InViewFade><div><SectionTitle>{weakLabel}</SectionTitle><TraitList items={weaknesses} kind="weakness" /></div></InViewFade>}
          {(good.length > 0 || watch.length > 0) && (
            <InViewFade>
              <div>
                <SectionTitle>Compatibility</SectionTitle>
                <div className="compat-grid">
                  {good.map(c  => <span key={c} className="compat-tag good"><CheckIcon size={11} />{c}</span>)}
                  {watch.map(c => <span key={c} className="compat-tag watch"><CloseIcon size={11} />{c}</span>)}
                </div>
              </div>
            </InViewFade>
          )}
          <ModuleExtra type={type} moduleKind={moduleKind} />
        </div>

        {/* Actions */}
        <div className="result-actions">
          <motion.button
            className="btn btn-secondary"
            onClick={share}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {copied ? <><CheckIcon size={16} /> Copied!</> : <><ShareIcon size={16} /> Share Result</>}
          </motion.button>
          <Link href={`/types?module=${moduleKind}`} className="btn btn-secondary" style={{ display:'inline-flex', gap:6, alignItems:'center' }}>
            <GridIcon size={15} /> Browse {moduleKind === 'mbti' ? 'MBTI+' : moduleKind.charAt(0).toUpperCase() + moduleKind.slice(1)} types
          </Link>
          <Link href="/" className="btn btn-ghost">Home</Link>
        </div>
      </div>
    </ScaleIn>
  );
}
