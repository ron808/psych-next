import type { Question, Dimension, PsychType } from './types';

export function calcDimensionScore(
  questions: Question[],
  answers: Record<string, number>,
  dimensionId: string
): number {
  const qs = questions.filter(q => q.dimension === dimensionId);
  if (!qs.length) return 3;
  const scores = qs.map(q => {
    const raw = answers[q.id] ?? 3;
    return q.pole_a_direction ? raw : 6 - raw;
  });
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function getTypeCode(
  questions: Question[],
  answers: Record<string, number>,
  dimensions: Dimension[]
): string {
  return dimensions
    .map(dim => {
      const score = calcDimensionScore(questions, answers, dim.id);
      return score >= 3 ? dim.pole_a.letter : dim.pole_b.letter;
    })
    .join('');
}

export function findType(code: string, types: PsychType[]): PsychType {
  return types.find(t => t.code === code) ?? types[0];
}

export function calcChemistry(
  players: { type?: PsychType }[],
  compatMatrix: { types: [string, string]; rating: number }[]
): number {
  if (!compatMatrix.length || players.length < 2) return 70;
  const pairs: number[] = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const a = players[i].type?.code;
      const b = players[j].type?.code;
      const pair = compatMatrix.find(
        p => (p.types[0] === a && p.types[1] === b) || (p.types[0] === b && p.types[1] === a)
      );
      pairs.push(pair ? pair.rating : 3);
    }
  }
  const avg = pairs.reduce((a, b) => a + b, 0) / pairs.length;
  return Math.round((avg / 5) * 100);
}

/** Score every Disney character against the user's answers, return sorted by % desc */
export function calcDisneyMatches(
  questions: Question[],
  answers: Record<string, number>,
  characters: PsychType[]
): Array<{ type: PsychType; pct: number }> {
  return characters
    .filter(c => c.profile && c.profile.length > 0)
    .map(char => {
      const scores = questions.map((q, i) => {
        const expected = char.profile![i] ?? 3;
        const userAns  = answers[q.id] ?? 3;
        return 1 - Math.abs(userAns - expected) / 4;
      });
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { type: char, pct: Math.round(avg * 100) };
    })
    .sort((a, b) => b.pct - a.pct);
}

/** Pick the tier-specific reason for a disney match */
export function getDisneyReason(char: PsychType, pct: number): string {
  const r = char.reasons;
  if (!r) return char.description ?? '';
  if (pct >= 90) return r.perfect;
  if (pct >= 60) return r.high;
  if (pct >= 30) return r.mid;
  return r.low;
}

export function strVal(v: unknown): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && v !== null && 'name' in v) return String((v as { name: unknown }).name);
  return String(v);
}
