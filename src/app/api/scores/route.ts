/**
 * Swift Scholars Maths Olympiad — Scores API
 */

import { supabaseServer } from '@/lib/supabase'
import { UpdateScoreSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rateLimit'
import { NextRequest } from 'next/server'
import { checkAdminAuth } from '@/lib/auth'
import {
  validateRequestBody,
  parseJsonBody,
  withErrorHandling,
  successResponse,
} from '@/lib/apiHelpers'
import { NotFoundError, DatabaseError } from '@/lib/errors'
import { RATE_LIMITS } from '@/lib/constants'

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(request, RATE_LIMITS.UPDATE_SCORE)
  if (rateLimitResult.limited) {
    return rateLimitResult.response
  }

  return withErrorHandling(async () => {
    // Auth check
    checkAdminAuth(request)

    // Parse and validate
    const body = await parseJsonBody(request)
    const validation = validateRequestBody(body, UpdateScoreSchema)
    if (!validation.valid) throw validation.error

    const validatedData = validation.data as ReturnType<typeof UpdateScoreSchema.parse>

    const { data, error } = await supabaseServer
      .from('contestants')
      .update({ score: validatedData.score })
      .eq('id', validatedData.id)
      .select()

    if (error) throw new DatabaseError('Failed to update score')
    if (!data?.length) throw new NotFoundError('Contestant not found')

    return successResponse(data[0])
  })
}
