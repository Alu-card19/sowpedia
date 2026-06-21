export type Section = {
  id: string
  name: string
  order_index: number
}

export type Contestant = {
  id: string
  name: string
  section: string
  youtube_url?: string | null
  picture_url?: string | null
  score: number
  position: number
  created_at: string
}

export type Sponsor = {
  id: string
  name: string
  logo_url?: string | null
  order_index: number
}

export type SpellingWord = {
  id: string
  word: string
  section: string
  difficulty?: 'easy' | 'moderate' | 'hard' | 'champion' | null
  hint?: string | null
  used?: boolean
  created_at: string
}

export type SpellingRoundState = {
  selectedWord: SpellingWord | null
  revealed: boolean
  contestantName: string
  usedWordIds: string[]
  activeSection: string
  activeDifficulty: string
}
