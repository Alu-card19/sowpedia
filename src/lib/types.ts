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
