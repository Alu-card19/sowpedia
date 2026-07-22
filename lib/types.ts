export interface Section {
  id: string;
  name: string;
  class_label?: string;
  order_index: number;
  created_at: string;
}

export interface Contestant {
  id: string;
  name: string;
  section: string;
  youtube_url?: string | null;
  picture_url?: string | null;
  score: number;
  position: number;
  created_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string | null;
  order_index: number;
  created_at: string;
}

export interface SpellingWord {
  id: string;
  word: string;
  section: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'champion';
  hint?: string | null;
  used: boolean;
  created_at: string;
}

export interface SpellingRoundState {
  selectedWord: SpellingWord | null;
  revealed: boolean;
  contestantName: string;
  usedWordIds: string[];
  activeSection: string;
  activeDifficulty: string;
}
