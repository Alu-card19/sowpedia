import { supabaseServer } from '@/lib/supabase'
import { CreateContestantSchema, UpdateContestantSchema, DeleteContestantSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rateLimit'
import { NextRequest } from 'next/server'
import { checkAdminAuth } from '@/lib/auth'
import {
  validateRequestBody,
  parseJsonBody,
  getQueryParam,
  successResponse,
  withErrorHandling,
} from '@/lib/apiHelpers'
import { NotFoundError, DatabaseError } from '@/lib/errors'
import { RATE_LIMITS } from '@/lib/constants'

export async function GET() {
  return withErrorHandling(async () => {
    const { data, error } = await supabaseServer
      .from('contestants')
      .select('*')
      .order('section')
      .order('score', { ascending: false })

    if (error) throw new DatabaseError('Failed to fetch contestants')

    return successResponse(data)
  })
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(
    request,
    RATE_LIMITS.CREATE_CONTESTANT
  )
  if (rateLimitResult.limited) {
    return rateLimitResult.response
  }

  return withErrorHandling(async () => {
    // Auth check
    checkAdminAuth(request)

    // Parse and validate
    const body = await parseJsonBody(request)
    const validation = validateRequestBody(body, CreateContestantSchema)
    if (!validation.valid) throw validation.error

    const validatedData = validation.data as ReturnType<typeof CreateContestantSchema.parse>

    const { data, error } = await supabaseServer
      .from('contestants')
      .insert([
        {
          name: validatedData.name,
          section: validatedData.section,
          youtube_url: validatedData.youtube_url || null,
          picture_url: null,
          score: 0,
          position: 0,
        },
      ])
      .select()

    if (error) throw new DatabaseError('Failed to create contestant')
    if (!data?.length) throw new DatabaseError('Failed to create contestant')

    return successResponse(data[0], 201)
  })
}

export async function PUT(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(
    request,
    RATE_LIMITS.UPDATE_CONTESTANT
  )
  if (rateLimitResult.limited) {
    return rateLimitResult.response
  }

  return withErrorHandling(async () => {
    // Auth check
    checkAdminAuth(request)

    // Parse and validate
    const body = await parseJsonBody(request)
    const validation = validateRequestBody(body, UpdateContestantSchema)
    if (!validation.valid) throw validation.error

    const validatedData = validation.data as ReturnType<typeof UpdateContestantSchema.parse>

    // Build update object - only include provided fields
    const updateData: Record<string, unknown> = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.section !== undefined) updateData.section = validatedData.section
    if (validatedData.youtube_url !== undefined) updateData.youtube_url = validatedData.youtube_url
    if (validatedData.picture_url !== undefined) updateData.picture_url = validatedData.picture_url

    const { data, error } = await supabaseServer
      .from('contestants')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()

    if (error) throw new DatabaseError('Failed to update contestant')
    if (!data?.length) throw new NotFoundError('Contestant not found')

    return successResponse(data[0])
  })
}

export async function DELETE(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(
    request,
    RATE_LIMITS.DELETE_CONTESTANT
  )
  if (rateLimitResult.limited) {
    return rateLimitResult.response
  }

  return withErrorHandling(async () => {
    // Auth check
    checkAdminAuth(request)

    // Get and validate ID
    const id = getQueryParam(request, 'id', true)
    const validation = validateRequestBody({ id }, DeleteContestantSchema)
    if (!validation.valid) throw validation.error

    const validatedData = validation.data as ReturnType<typeof DeleteContestantSchema.parse>

    const { error } = await supabaseServer
      .from('contestants')
      .delete()
      .eq('id', validatedData.id)

    if (error) throw new DatabaseError('Failed to delete contestant')

    return successResponse({ success: true })
  })
}
