export interface PoleEnd {
  letter: string;
  name: string;
  description?: string;
}

export interface Dimension {
  id: string;
  label?: string;
  pole_a: PoleEnd;
  pole_b: PoleEnd;
}

export interface Question {
  id: string;
  text: string;
  dimension: string;
  pole_a_direction: boolean;
}

export interface ArchetypeObj {
  name: string;
  reason?: string;
}

export interface GrowthRoadmap {
  year_1_3?: string;
  year_3_7?: string;
  year_7_plus?: string;
  key_skill_to_develop?: string;
  key_skill?: string;
  trap_to_avoid?: string;
}

export interface CompatEntry {
  rating: number;
  summary: string;
}

export interface CompatPair {
  types: [string, string];
  rating: number;
  summary?: string;
}

export type StrOrObj = string | ArchetypeObj;

export interface PsychType {
  code: string;
  name: string;
  tagline?: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  challenges?: string[];
  watch_out_for?: string[] | string;
  good_matches?: string[];
  best_matches?: string[];
  best_with?: string[];
  friction_with?: string[];
  difficult_with?: string[];
  // MBTI
  animal?: StrOrObj;
  greek_god?: StrOrObj;
  star?: StrOrObj;
  element?: StrOrObj;
  thrives_when?: string[];
  struggles_when?: string[];
  famous_people?: string[];
  // Love
  love_language?: string;
  famous_archetype?: string;
  needs_in_partner?: string | string[];
  red_flags?: string | string[];
  growth_edge?: string;
  growth?: string;
  love_style?: string;
  compatibility?: Record<string, CompatEntry>;
  // Friendship
  role_in_group?: string;
  group_role?: string;
  group_dynamic_note?: string;
  quote?: string;
  friendship_dynamic?: string;
  // Career
  work_style?: string;
  career_paths?: string[];
  growth_roadmap?: GrowthRoadmap;
  ideal_company_type?: string;
  career_quote?: string;
  // Disney (profile-matching)
  movie?: string;
  power?: string;
  sidekick?: string;
  gender?: 'male' | 'female';
  /** 15 expected answer values (1-5) — one per question, in order */
  profile?: number[];
  /** Tier-specific reasons shown based on match % */
  reasons?: {
    perfect: string;  // 90-100%
    high: string;     // 60-89%
    mid: string;      // 30-59%
    low: string;      // 10-29%
  };
}

export interface ModuleData {
  questions: Question[];
  scoring: { dimensions: Dimension[] };
  types: PsychType[];
  group_report?: { compatibility_matrix?: CompatPair[] };
  compatibility_matrix?: CompatPair[];
}

export type ModuleKind = 'mbti' | 'love' | 'friendship' | 'career' | 'disney';

export interface Player {
  name: string;
  answers: Record<string, number>;
  type?: PsychType;
}
