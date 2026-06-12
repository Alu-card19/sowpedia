import { supabaseServer } from '@/lib/supabase'
import { UpdateScoreSchema } from '@/lib/validation'
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

export async function POST(request: NextRequest) {
  // Rate limiting - 60 requests per minute per IP (scores update frequently)
  const rateLimitResult = rateLimit(request, {
    windowMs: 60 * 1000,
    maxRequests: 60,
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
    const validatedData = UpdateScoreSchema.parse(body)

    console.log('Updating score:', { id: validatedData.id, score: validatedData.score })

    const { data, error } = await supabaseServer
      .from('contestants')
      .update({ score: validatedData.score })
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

    console.log('Score updated successfully:', data[0])
    return NextResponse.json(data[0])
  } catch (error) {
    if (error instanceof ZodError) {
      return handleValidationError(error)
    }
    console.error('Error updating score:', error)
    let errorMessage = 'Unknown error'
    
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error)
    } else {
      errorMessage = String(error)
    }
    
    return NextResponse.json(
      { error: `Failed to update score: ${errorMessage}` },
      { status: 500 }
    )
  }
}
