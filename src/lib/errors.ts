/**
 * Custom error classes and error handling utilities
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code = 'VALIDATION_ERROR') {
    super(message, 400, code)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Unauthorized', code = 'AUTH_ERROR') {
    super(message, 401, code)
    this.name = 'AuthenticationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, 404, code)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests', code = 'RATE_LIMIT') {
    super(message, 429, code)
    this.name = 'RateLimitError'
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', code = 'DATABASE_ERROR') {
    super(message, 500, code)
    this.name = 'DatabaseError'
  }
}

export class FileUploadError extends AppError {
  constructor(message: string, code = 'FILE_UPLOAD_ERROR') {
    super(message, 400, code)
    this.name = 'FileUploadError'
  }
}

/**
 * Error message mapping for user-friendly display
 */
export const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Invalid input provided',
  AUTH_ERROR: 'Authentication failed - please check your password',
  NOT_FOUND: 'Resource not found',
  RATE_LIMIT: 'Too many requests - please wait before trying again',
  DATABASE_ERROR: 'Database operation failed - please try again',
  FILE_UPLOAD_ERROR: 'File upload failed - check file size and type',
  NETWORK_ERROR: 'Network error - please check your connection',
  UNKNOWN_ERROR: 'An unexpected error occurred',
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AppError) {
    return ERROR_MESSAGES[error.code || 'UNKNOWN_ERROR'] || error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Log error for debugging (can be extended with external logging service)
 */
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString()
  const contextStr = context ? ` [${context}]` : ''
  
  if (error instanceof Error) {
    console.error(`${timestamp}${contextStr} ${error.name}: ${error.message}`, error.stack)
  } else {
    console.error(`${timestamp}${contextStr} Unknown error:`, error)
  }
}
