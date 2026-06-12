import { supabaseServer } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sow2025'

function validateAdminPassword(request: NextRequest): boolean {
  const password = request.headers.get('x-admin-password')
  return password === ADMIN_PASSWORD
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
  if (!validateAdminPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const file = formData.get('file') as File

    if (!name || !file) {
      return NextResponse.json(
        { error: 'Name and file are required' },
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
          name,
          logo_url: publicUrl.publicUrl,
          order_index: nextOrder,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error creating sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to create sponsor' },
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
    const { id, name, order_index } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('sponsors')
      .update({
        ...(name && { name }),
        ...(order_index !== undefined && { order_index }),
      })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error updating sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to update sponsor' },
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

    // Get sponsor to find logo URL
    const { data: sponsor, error: fetchError } = await supabaseServer
      .from('sponsors')
      .select('logo_url')
      .eq('id', id)
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
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to delete sponsor' },
      { status: 500 }
    )
  }
}
