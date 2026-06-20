import { supabaseServer } from '@/lib/supabase'
import { NextRequest } from 'next/server'
import {
  parseJsonBody,
  getQueryParam,
  successResponse,
  withErrorHandling,
} from '@/lib/apiHelpers'
import { DatabaseError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const section = getQueryParam(request, 'section')
    const difficulty = getQueryParam(request, 'difficulty')

    let query = supabaseServer.from('spelling_words').select('*')

    if (section) {
      query = query.eq('section', section)
    }

    if (difficulty && difficulty !== 'All') {
      query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query.order('word', { ascending: true })

    if (error) throw new DatabaseError('Failed to fetch spelling words')

    return successResponse(data)
  })
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    // Validate admin auth
    const adminPassword = request.headers.get('x-admin-password')
    if (adminPassword !== 'sow2025') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      })
    }

    const body = await parseJsonBody(request)
    const words = Array.isArray(body) ? body : body.words || []

    if (!Array.isArray(words) || words.length === 0) {
      throw new DatabaseError('Words array is required')
    }

    // Validate and insert words
    const validatedWords = words.map((w) => ({
      word: w.word?.trim(),
      section: w.section?.trim(),
      difficulty: w.difficulty?.trim() || null,
      hint: w.hint?.trim() || null,
      used: false,
    }))

    // Filter out invalid entries
    const validWords = validatedWords.filter(
      (w) => w.word && w.section && ['easy', 'moderate', 'hard', 'champion'].includes(w.difficulty)
    )

    if (validWords.length === 0) {
      throw new DatabaseError('No valid words to insert')
    }

    const { data, error } = await supabaseServer
      .from('spelling_words')
      .insert(validWords)
      .select()

    if (error) throw new DatabaseError('Failed to insert spelling words')

    return successResponse(data, 201)
  })
}

export async function DELETE(request: NextRequest) {
  return withErrorHandling(async () => {
    // Validate admin auth
    const adminPassword = request.headers.get('x-admin-password')
    if (adminPassword !== 'sow2025') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      })
    }

    const id = getQueryParam(request, 'id', true)

    const { error } = await supabaseServer
      .from('spelling_words')
      .delete()
      .eq('id', id)

    if (error) throw new DatabaseError('Failed to delete spelling word')

    return successResponse({ success: true })
  })
}
