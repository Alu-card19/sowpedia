import { supabaseServer } from '@/lib/supabase'
import { CreateSponsorSchema, UpdateSponsorSchema, DeleteSponsorSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rateLimit'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sow2025'

function validateAdminPassword(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password')
  return password === ADMIN_PASSWORD
}

function handleValidationError(error: ZodError<unknown>) {
  const messages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ')
  return NextResponse.json({ error: `Validation error: ${messages}` }, { status: 400 })
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('sponsors')
      .select('*')
      .order('order_index')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting - 10 requests per minute per IP
  const rateLimitResult = rateLimit(request, {
    windowMs: 60 * 1000,
    maxRequests: 10,
  })
  if (rateLimitResult.limited) {
    return rateLimitResult.response
  }

  if (!validateAdminPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const file = formData.get('file') as File

    // Validate input
    const validatedData = CreateSponsorSchema.parse({ name })

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const maxFileSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File must be an image (JPEG, PNG, WebP, or SVG)' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabaseServer.storage
      .from('sponsor-logos')
      .upload(fileName, file)

    if (uploadError) throw uploadError

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

    if (fetchError) throw fetchError

    const nextOrder = sponsors && sponsors.length > 0 ? sponsors[0].order_index + 1 : 0

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

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error)
    }
    console.error('Error creating sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to create sponsor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  // Rate limiting - 20 requests per minute per IP
  const rateLimitResult = rateLimit(request, {
    windowMs: 60 * 1000,
    maxRequests: 20,
  })
  if (rateLimitResult.limited) {
    return rateLimitResult.response
  }

  if (!validateAdminPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = UpdateSponsorSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.order_index !== undefined) updateData.order_index = validatedData.order_index

    const { data, error } = await supabaseServer
      .from('sponsors')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error)
    }
    console.error('Error updating sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to update sponsor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Rate limiting - 10 requests per minute per IP
  const rateLimitResult = rateLimit(request, {
    windowMs: 60 * 1000,
    maxRequests: 10,
  })
  if (rateLimitResult.limited) {
    return rateLimitResult.response
  }

  if (!validateAdminPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Validate ID
    const validatedData = DeleteSponsorSchema.parse({ id })

    // Get sponsor to find logo URL
    const { data: sponsor, error: fetchError } = await supabaseServer
      .from('sponsors')
      .select('logo_url')
      .eq('id', validatedData.id)
      .single()

    if (fetchError) throw fetchError

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

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error)
    }
    console.error('Error deleting sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to delete sponsor' },
      { status: 500 }
    )
  }
}
