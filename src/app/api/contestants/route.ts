import { supabaseServer } from '@/lib/supabase'
import { CreateContestantSchema, UpdateContestantSchema, DeleteContestantSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rateLimit'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD 

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
      .from('contestants')
      .select('*')
      .order('section')
      .order('score', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching contestants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contestants' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    const validatedData = CreateContestantSchema.parse(body)

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

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error)
    }
    console.error('Error creating contestant:', error)
    return NextResponse.json(
      { error: 'Failed to create contestant' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  // Rate limiting - 30 requests per minute per IP
  const rateLimitResult = rateLimit(request, {
    windowMs: 60 * 1000,
    maxRequests: 30,
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
    const validatedData = UpdateContestantSchema.parse(body)

    // Build update object - only include fields that are provided
    const updateData: Record<string, unknown> = {}
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.section !== undefined) updateData.section = validatedData.section
    if (validatedData.youtube_url !== undefined) updateData.youtube_url = validatedData.youtube_url
    if (validatedData.picture_url !== undefined) updateData.picture_url = validatedData.picture_url

    console.log('Updating contestant with:', { id: validatedData.id, updateData })

    const { data, error } = await supabaseServer
      .from('contestants')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.error('No data returned from update')
      return NextResponse.json(
        { error: 'Contestant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data[0])
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error)
    }
    console.error('Error updating contestant:', error)
    let errorMessage = 'Unknown error'
    
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error)
    } else {
      errorMessage = String(error)
    }
    
    return NextResponse.json(
      { error: `Failed to update contestant: ${errorMessage}` },
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
    const validatedData = DeleteContestantSchema.parse({ id })

    const { error } = await supabaseServer
      .from('contestants')
      .delete()
      .eq('id', validatedData.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error)
    }
    console.error('Error deleting contestant:', error)
    return NextResponse.json(
      { error: 'Failed to delete contestant' },
      { status: 500 }
    )
  }
}
