import { supabaseServer } from '@/lib/supabase'
import { NextRequest } from 'next/server'
import {
  parseJsonBody,
  getQueryParam,
  successResponse,
  withErrorHandling,
} from '@/lib/apiHelpers'
import { DatabaseError, AppError } from '@/lib/errors'

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
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const body = await parseJsonBody(request)
    
    // Type guard: extract words array from body
    let words: unknown[] = []
    if (Array.isArray(body)) {
      words = body
    } else if (body && typeof body === 'object' && 'words' in body && Array.isArray((body as { words?: unknown }).words)) {
      words = (body as { words: unknown[] }).words
    }

    if (!Array.isArray(words) || words.length === 0) {
      throw new DatabaseError('Words array is required')
    }

    // Validate and insert words
    const validatedWords = words.map((w) => {
      if (typeof w !== 'object' || w === null) {
        return null
      }
      const word = w as Record<string, unknown>
      return {
        word: typeof word.word === 'string' ? word.word.trim() : '',
        section: typeof word.section === 'string' ? word.section.trim() : '',
        difficulty: typeof word.difficulty === 'string' ? word.difficulty.trim() : null,
        hint: typeof word.hint === 'string' ? word.hint.trim() : null,
        used: false,
      }
    }).filter((w): w is Exclude<typeof w, null> => w !== null)

    // Filter out invalid entries
    const validWords = validatedWords.filter(
      (w) => w.word && w.section && ['easy', 'moderate', 'hard', 'champion'].includes(w.difficulty || '')
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
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
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
