/**
 * Authentication utilities and helpers
 */

import { NextRequest } from 'next/server'
import { ADMIN_SESSION_KEY } from './constants'
import { AuthenticationError, logError } from './errors'

/**
 * Validate admin password from request headers
 */
export function validateAdminPassword(request: NextRequest): boolean {
  try {
    const password = request.headers.get('x-admin-password')
    const isValid = password === ADMIN_SESSION_KEY

    if (!isValid) {
      logError('Invalid admin password attempt', 'AUTH')
    }

    return isValid
  } catch (error) {
    logError(error, 'AUTH_VALIDATION')
    return false
  }
}

/**
 * Check admin authentication and return error response if not authenticated
 */
export function checkAdminAuth(request: NextRequest): boolean {
  if (!validateAdminPassword(request)) {
    throw new AuthenticationError()
  }
  return true
}

/**
 * Verify admin password in browser context
 */
export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_SESSION_KEY
}

/**
 * Store admin auth in session storage (browser only)
 */
export function setAdminAuth(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('adminAuth', 'true')
  }
}

/**
 * Check if user is authenticated in browser context
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('adminAuth') === 'true'
  }
  return false
}

/**
 * Clear admin auth from session storage
 */
export function clearAdminAuth(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('adminAuth')
  }
}
