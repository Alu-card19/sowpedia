import { z } from 'zod'

// Common validators
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Contestant schemas
export const CreateContestantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  section: z.string().min(1, 'Section is required').max(50, 'Section must be less than 50 characters'),
  youtube_url: z.string().url('Invalid YouTube URL').optional().or(z.literal(null)),
})

export const UpdateContestantSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'Invalid contestant ID'),
  name: z.string().min(1).max(100).optional(),
  section: z.string().min(1).max(50).optional(),
  youtube_url: z.string().url('Invalid YouTube URL').optional().or(z.literal(null)),
  picture_url: z.string().url('Invalid picture URL').optional().or(z.literal(null)),
})

export const DeleteContestantSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'Invalid contestant ID'),
})

// Score schemas
export const UpdateScoreSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'Invalid contestant ID'),
  score: z.number().int('Score must be an integer').min(0, 'Score must be at least 0').max(1000, 'Score must be at most 1000'),
})

// Sponsor schemas
export const CreateSponsorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
})

export const UpdateSponsorSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'Invalid sponsor ID'),
  name: z.string().min(1).max(100).optional(),
  order_index: z.number().int('Order index must be an integer').min(0).optional(),
})

export const DeleteSponsorSchema = z.object({
  id: z.string().regex(UUID_REGEX, 'Invalid sponsor ID'),
})

// Types exported from schemas
export type CreateContestant = z.infer<typeof CreateContestantSchema>
export type UpdateContestant = z.infer<typeof UpdateContestantSchema>
export type UpdateScore = z.infer<typeof UpdateScoreSchema>
export type CreateSponsor = z.infer<typeof CreateSponsorSchema>
export type UpdateSponsor = z.infer<typeof UpdateSponsorSchema>
