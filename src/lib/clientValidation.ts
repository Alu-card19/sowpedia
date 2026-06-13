/**
 * Client-side form validation utilities
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

/**
 * Validate contestant name
 */
export function validateName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Name is required' }
  }
  if (name.length > 100) {
    return { field: 'name', message: 'Name must be less than 100 characters' }
  }
  return null
}

/**
 * Validate section selection
 */
export function validateSection(section: string): ValidationError | null {
  if (!section || section.trim().length === 0) {
    return { field: 'section', message: 'Section is required' }
  }
  return null
}

/**
 * Validate YouTube URL (optional but must be valid if provided)
 */
export function validateYoutubeUrl(url: string): ValidationError | null {
  if (!url || url.trim().length === 0) {
    return null // Optional field
  }

  try {
    const urlObj = new URL(url)
    const isYouTube =
      urlObj.hostname === 'youtube.com' ||
      urlObj.hostname === 'www.youtube.com' ||
      urlObj.hostname === 'youtu.be'

    if (!isYouTube) {
      return { field: 'youtube_url', message: 'Must be a valid YouTube URL' }
    }

    return null
  } catch {
    return { field: 'youtube_url', message: 'Invalid URL format' }
  }
}

/**
 * Validate score input
 */
export function validateScore(score: number | string): ValidationError | null {
  const numScore = typeof score === 'string' ? parseInt(score) : score

  if (isNaN(numScore)) {
    return { field: 'score', message: 'Score must be a number' }
  }

  if (numScore < 0) {
    return { field: 'score', message: 'Score cannot be negative' }
  }

  if (numScore > 1000) {
    return { field: 'score', message: 'Score must be at most 1000' }
  }

  return null
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): ValidationError | null {
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB

  if (!file.type.startsWith('image/')) {
    return { field: 'file', message: 'File must be an image' }
  }

  if (file.size > MAX_SIZE) {
    return { field: 'file', message: 'File must be less than 5MB' }
  }

  return null
}

/**
 * Validate add contestant form
 */
export function validateAddContestantForm(
  name: string,
  section: string,
  youtubeUrl: string
): ValidationResult {
  const errors: ValidationError[] = []

  const nameError = validateName(name)
  if (nameError) errors.push(nameError)

  const sectionError = validateSection(section)
  if (sectionError) errors.push(sectionError)

  const youtubeError = validateYoutubeUrl(youtubeUrl)
  if (youtubeError) errors.push(youtubeError)

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate bulk add form
 */
export function validateBulkAddForm(
  names: string,
  section: string
): ValidationResult {
  const errors: ValidationError[] = []

  const trimmedNames = names.trim().split('\n').filter((n) => n.trim())

  if (trimmedNames.length === 0) {
    errors.push({
      field: 'names',
      message: 'Please enter at least one name',
    })
  }

  if (trimmedNames.length > 10) {
    errors.push({
      field: 'names',
      message: 'Maximum 10 names allowed per bulk add',
    })
  }

  // Validate each name
  trimmedNames.forEach((name, index) => {
    if (name.length > 100) {
      errors.push({
        field: 'names',
        message: `Name at line ${index + 1} is too long (max 100 characters)`,
      })
    }
  })

  const sectionError = validateSection(section)
  if (sectionError) errors.push(sectionError)

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Format validation errors for display
 */
export function formatErrors(errors: ValidationError[]): string {
  return errors.map((e) => `${e.field}: ${e.message}`).join('\n')
}
