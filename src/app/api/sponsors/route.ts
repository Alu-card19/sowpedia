import { supabaseServer } from '@/lib/supabase'
import { CreateSponsorSchema, UpdateSponsorSchema, DeleteSponsorSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rateLimit'
import { NextRequest } from 'next/server'
import { checkAdminAuth } from '@/lib/auth'
import {
  validateRequestBody,
  parseJsonBody,
  parseFormData,
  getQueryParam,
  successResponse,
  withErrorHandling,
} from '@/lib/apiHelpers'
import { NotFoundError, DatabaseError, FileUploadError } from '@/lib/errors'
import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, RATE_LIMITS } from '@/lib/constants'

export async function GET() {
  return withErrorHandling(async () => {
    const { data, error } = await supabaseServer
      .from('sponsors')
      .select('*')
      .order('order_index')

    if (error) throw new DatabaseError('Failed to fetch sponsors')

    return successResponse(data)
  })
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(request, RATE_LIMITS.CREATE_SPONSOR)
  if (rateLimitResult.limited) {
    return rateLimitResult.response
  }

  return withErrorHandling(async () => {
    // Auth check
    checkAdminAuth(request)

    // Parse form data
    const formData = await parseFormData(request)
    if (!formData) throw new FileUploadError('No form data provided')

    const name = formData.get('name') as string
    const file = formData.get('file') as File

    // Validate name
    const validation = validateRequestBody({ name }, CreateSponsorSchema)
    if (!validation.valid) throw validation.error

    const validatedData = validation.data as ReturnType<typeof CreateSponsorSchema.parse>

    // Validate file
    if (!file) throw new FileUploadError('File is required')
    if (file.size > MAX_FILE_SIZE)
      throw new FileUploadError('File size must be less than 5MB')
    if (!ALLOWED_IMAGE_TYPES.includes(file.type))
      throw new FileUploadError('File must be an image (JPEG, PNG, WebP, or SVG)')

    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabaseServer.storage
      .from('sponsor-logos')
      .upload(fileName, file)

    if (uploadError) throw new FileUploadError('Failed to upload file')

    // Get public URL
    const { data: publicUrl } = supabaseServer.storage
      .from('sponsor-logos')
      .getPublicUrl(fileName)

    // Get highest order_index
    const { data: sponsors, error: fetchError } = await supabaseServer
      .from('sponsors')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)

    if (fetchError) throw new DatabaseError('Failed to fetch sponsors')

    const nextOrder = sponsors?.length ? sponsors[0].order_index + 1 : 0

    // Create sponsor record
    const { data, error } = await supabaseServer
      .from('sponsors')
      .insert([
        {
          name: validatedData.name,
          logo_url: publicUrl.publicUrl,
          order_index: nextOrder,
        },
      ])
      .select()

    if (error) throw new DatabaseError('Failed to create sponsor')
    if (!data?.length) throw new DatabaseError('Failed to create sponsor')

    return successResponse(data[0], 201)
  })
}

export async function PUT(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(request, RATE_LIMITS.UPDATE_SPONSOR)
  if (rateLimitResult.limited) {
    return rateLimitResult.response
  }

  return withErrorHandling(async () => {
    // Auth check
    checkAdminAuth(request)

    // Parse and validate
    const body = await parseJsonBody(request)
    const validation = validateRequestBody(body, UpdateSponsorSchema)
    if (!validation.valid) throw validation.error

    const validatedData = validation.data as ReturnType<typeof UpdateSponsorSchema.parse>

    const updateData: Record<string, unknown> = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.order_index !== undefined)
      updateData.order_index = validatedData.order_index

    const { data, error } = await supabaseServer
      .from('sponsors')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()

    if (error) throw new DatabaseError('Failed to update sponsor')
    if (!data?.length) throw new NotFoundError('Sponsor not found')

    return successResponse(data[0])
  })
}

export async function DELETE(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(request, RATE_LIMITS.DELETE_SPONSOR)
  if (rateLimitResult.limited) {
    return rateLimitResult.response
  }

  return withErrorHandling(async () => {
    // Auth check
    checkAdminAuth(request)

    // Get and validate ID
    const id = getQueryParam(request, 'id', true)
    const validation = validateRequestBody({ id }, DeleteSponsorSchema)
    if (!validation.valid) throw validation.error

    const validatedData = validation.data as ReturnType<typeof DeleteSponsorSchema.parse>

    // Get sponsor to find logo URL
    const { data: sponsor, error: fetchError } = await supabaseServer
      .from('sponsors')
      .select('logo_url')
      .eq('id', validatedData.id)
      .single()

    if (fetchError) throw new NotFoundError('Sponsor not found')

    // Delete logo from storage if it exists
    if (sponsor?.logo_url) {
      const fileName = sponsor.logo_url.split('/').pop()
      if (fileName) {
        await supabaseServer.storage.from('sponsor-logos').remove([fileName])
      }
    }

    // Delete sponsor record
    const { error } = await supabaseServer
      .from('sponsors')
      .delete()
      .eq('id', validatedData.id)

    if (error) throw new DatabaseError('Failed to delete sponsor')

    return successResponse({ success: true })
  })
}
