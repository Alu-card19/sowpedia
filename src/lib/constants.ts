/**
 * Application constants
 */

// Section colors for visual identification
export const SECTION_COLORS: Record<string, string> = {
  'Section A': '#FFD700', // Gold
  'Section B': '#00E5FF', // Cyan
  'Section C': '#00E676', // Green
  'Section D': '#FF6B9D', // Pink
  'Section E': '#FFB300', // Amber
  'Section F': '#7B68EE', // Medium Purple
  'Section G': '#FF7043', // Deep Orange
  'Section H': '#4DD0E1', // Cyan Light
}

// File upload constraints
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]

// Admin authentication
export const ADMIN_PASSWORD_KEY = 'adminAuth'
export const ADMIN_SESSION_KEY = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sow2025'

// Rate limiting configuration
export const RATE_LIMITS = {
  // Contestants API
  GET_CONTESTANTS: { windowMs: 60 * 1000, maxRequests: 100 },
  CREATE_CONTESTANT: { windowMs: 60 * 1000, maxRequests: 20 },
  UPDATE_CONTESTANT: { windowMs: 60 * 1000, maxRequests: 30 },
  DELETE_CONTESTANT: { windowMs: 60 * 1000, maxRequests: 10 },
  
  // Scores API
  UPDATE_SCORE: { windowMs: 60 * 1000, maxRequests: 60 }, // Frequent updates
  
  // Sponsors API
  GET_SPONSORS: { windowMs: 60 * 1000, maxRequests: 100 },
  CREATE_SPONSOR: { windowMs: 60 * 1000, maxRequests: 10 },
  UPDATE_SPONSOR: { windowMs: 60 * 1000, maxRequests: 20 },
  DELETE_SPONSOR: { windowMs: 60 * 1000, maxRequests: 10 },
}

// UI Constants
export const MODAL_Z_INDEX = 1000
export const TOAST_DURATION = 3000
export const ANIMATION_DURATION = 300
export const SCORE_ANIMATION_DURATION = 1000

// Validation constraints
export const VALIDATION = {
  NAME_MIN: 1,
  NAME_MAX: 100,
  SECTION_MIN: 1,
  SECTION_MAX: 50,
  SCORE_MIN: 0,
  SCORE_MAX: 1000,
}
