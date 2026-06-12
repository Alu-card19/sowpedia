import { supabaseServer } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD 

function validateAdminPassword(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password')
  return password === ADMIN_PASSWORD
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
  if (!validateAdminPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, section, youtube_url } = body

    if (!name || !section) {
      return NextResponse.json(
        { error: 'Name and section are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('contestants')
      .insert([
        {
          name,
          section,
          youtube_url: youtube_url || null,
          picture_url: null,
          score: 0,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error creating contestant:', error)
    return NextResponse.json(
      { error: 'Failed to create contestant' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  if (!validateAdminPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, name, section, youtube_url, picture_url } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Build update object - only include fields that are provided
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (section !== undefined) updateData.section = section
    if (youtube_url !== undefined) updateData.youtube_url = youtube_url
    if (picture_url !== undefined) updateData.picture_url = picture_url

    console.log('Updating contestant with:', { id, updateData })

    const { data, error } = await supabaseServer
      .from('contestants')
      .update(updateData)
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

    return NextResponse.json(data[0])
  } catch (error) {
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

    const { error } = await supabaseServer
      .from('contestants')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contestant:', error)
    return NextResponse.json(
      { error: 'Failed to delete contestant' },
      { status: 500 }
    )
  }
}
