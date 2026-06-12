import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export function rateLimit(
  request: NextRequest,
  options: {
    windowMs?: number // Time window in milliseconds (default: 60s)
    maxRequests?: number // Max requests per window (default: 100)
  } = {}
) {
  const windowMs = options.windowMs || 60 * 1000
  const maxRequests = options.maxRequests || 100

  // Get client IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const now = Date.now()
  const key = `${ip}:${request.nextUrl.pathname}`

  if (!store[key]) {
    store[key] = { count: 0, resetTime: now + windowMs }
  }

  const record = store[key]

  // Reset if window has passed
  if (now > record.resetTime) {
    record.count = 0
    record.resetTime = now + windowMs
  }

  record.count++

  if (record.count > maxRequests) {
    return {
      limited: true,
      response: NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
        },
        { status: 429 }
      ),
    }
  }

  return { limited: false }
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (now > store[key].resetTime + 5 * 60 * 1000) {
      delete store[key]
    }
  }
}, 5 * 60 * 1000)
