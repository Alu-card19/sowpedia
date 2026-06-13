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
  console.log('[scores API] === NEW REQUEST ===')
  
  // Rate limiting
  const rateLimitResult = rateLimit(request, RATE_LIMITS.UPDATE_SCORE)
  if (rateLimitResult.limited) {
    console.log('[scores API] Rate limited')
    return rateLimitResult.response
  }

  return withErrorHandling(async () => {
    try {
      console.log('[scores API] Received POST request')
      
      // Auth check
      const authHeader = request.headers.get('x-admin-password')
      console.log('[scores API] Auth header present:', !!authHeader)
      console.log('[scores API] Auth header value:', authHeader)
      checkAdminAuth(request)
      console.log('[scores API] Auth check passed')

      // Parse and validate
      const body = await parseJsonBody(request)
      console.log('[scores API] Request body:', JSON.stringify(body))
      
      const validation = validateRequestBody(body, UpdateScoreSchema)
      console.log('[scores API] Validation result:', validation)
      
      if (!validation.valid) {
        console.log('[scores API] Validation failed:', validation.error)
        throw validation.error
      }

      const validatedData = validation.data as ReturnType<typeof UpdateScoreSchema.parse>
      console.log('[scores API] Validated data:', JSON.stringify(validatedData))

      const { data, error } = await supabaseServer
        .from('contestants')
        .update({ score: validatedData.score })
        .eq('id', validatedData.id)
        .select()

      console.log('[scores API] Supabase response:', { data, error })

      if (error) {
        console.error('[scores API] Database error:', error)
        throw new DatabaseError(`Failed to update score: ${error.message}`)
      }
      if (!data?.length) {
        console.log('[scores API] Contestant not found:', validatedData.id)
        throw new NotFoundError('Contestant not found')
      }

      console.log('[scores API] Score updated successfully:', data[0])
      return successResponse(data[0])
    } catch (err) {
      console.error('[scores API] Handler error:', err)
      throw err
    }
  })
}
