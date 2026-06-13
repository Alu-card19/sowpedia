/**
 * API helper utilities for route handlers
 */

import { NextRequest, NextResponse } from 'next/server'
import { ZodError, ZodSchema } from 'zod'
import {
  AppError,
  ValidationError,
  logError,
} from './errors'

/**
 * Validates request body against a Zod schema
 */
export function validateRequestBody<T>(
  body: unknown,
  schema: ZodSchema
): { valid: true; data: T } | { valid: false; error: ValidationError } {
  try {
    const data = schema.parse(body)
    return { valid: true, data: data as T }
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ')
      return {
        valid: false,
        error: new ValidationError(messages),
      }
    }
    return {
      valid: false,
      error: new ValidationError('Invalid request body'),
    }
  }
}

/**
 * Parse JSON body with error handling
 */
export async function parseJsonBody(
  request: NextRequest
): Promise<unknown | null> {
  try {
    const text = await request.text()
    return text ? JSON.parse(text) : null
  } catch {
    throw new ValidationError('Invalid JSON in request body')
  }
}

/**
 * Parse FormData with error handling
 */
export async function parseFormData(
  request: NextRequest
): Promise<FormData | null> {
  try {
    return await request.formData()
  } catch {
    throw new ValidationError('Invalid form data in request')
  }
}

/**
 * Get query parameter safely
 */
export function getQueryParam(
  request: NextRequest,
  name: string,
  required = false
): string | null {
  const param = request.nextUrl.searchParams.get(name)
  if (required && !param) {
    throw new ValidationError(`Missing required query parameter: ${name}`)
  }
  return param
}

/**
 * Create standardized error response
 */
export function errorResponse(
  error: unknown,
  context?: string
): NextResponse {
  if (context) {
    logError(error, context)
  } else {
    logError(error)
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}

/**
 * Create standardized success response
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}

/**
 * Wrapper for API route handlers with error handling
 */
export async function withErrorHandling<T>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T>> {
  try {
    return await handler()
  } catch (error) {
    return errorResponse(error) as NextResponse<T>
  }
}

/**
 * Check content-type header
 */
export function getContentType(request: NextRequest): string {
  return request.headers.get('content-type') || ''
}

/**
 * Check if request is JSON
 */
export function isJsonRequest(request: NextRequest): boolean {
  return getContentType(request).includes('application/json')
}

/**
 * Check if request is FormData
 */
export function isFormDataRequest(request: NextRequest): boolean {
  return getContentType(request).includes('multipart/form-data')
}

/**
 * Get client IP address for rate limiting
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '0.0.0.0'
  )
}
