import { supabaseServer } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD 

function validateAdminPassword(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password')
  return password === ADMIN_PASSWORD
}

export async function POST(request: NextRequest) {
  if (!validateAdminPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, score } = body

    if (!id || score === undefined) {
      return NextResponse.json(
        { error: 'ID and score are required' },
        { status: 400 }
      )
    }

    console.log('Updating score:', { id, score })

    const { data, error } = await supabaseServer
      .from('contestants')
      .update({ score })
      .eq('id', id)
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
