/**
 * Client-side API utilities for common fetch operations
 * Reduces code duplication across components
 */

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sow2025'

console.log('[clientApi] Admin password loaded:', ADMIN_PASSWORD)

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

/**
 * Get standard API headers with admin password
 */
function getHeaders(headers?: Record<string, string>): Record<string, string> {
  return {
    'x-admin-password': ADMIN_PASSWORD,
    ...headers,
  }
}

/**
 * Generic JSON fetch with error handling
 */
async function fetchJson<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const headers = getHeaders(options.headers)
  console.log('[fetchJson] Request:', { url, method: options.method, headers: { 'x-admin-password': '***' } })
  
  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    console.error('[fetchJson] Error response:', { status: response.status, error })
    throw new Error(error.error || response.statusText)
  }

  const data = await response.json()
  console.log('[fetchJson] Success:', { url, data })
  return data
}

/**
 * GET request
 */
export async function apiGet<T>(url: string): Promise<T> {
  return fetchJson<T>(url, { method: 'GET' })
}

/**
 * POST request
 */
export async function apiPost<T>(
  url: string,
  body: unknown
): Promise<T> {
  return fetchJson<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * PUT request
 */
export async function apiPut<T>(
  url: string,
  body: unknown
): Promise<T> {
  return fetchJson<T>(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * DELETE request
 */
export async function apiDelete<T>(url: string): Promise<T> {
  return fetchJson<T>(url, { method: 'DELETE' })
}

/**
 * POST with FormData (for file uploads)
 */
export async function apiPostFormData<T>(
  url: string,
  formData: FormData
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || response.statusText)
  }

  return response.json()
}

/**
 * Raw fetch for advanced use cases (like upload progress tracking)
 */
export async function apiRawFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: getHeaders(options.headers),
  })
}
