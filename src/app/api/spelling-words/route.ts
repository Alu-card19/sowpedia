import { supabaseServer } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import {
  parseJsonBody,
  getQueryParam,
  successResponse,
  withErrorHandling,
} from '@/lib/apiHelpers'
import { DatabaseError, AppError } from '@/lib/errors'
import { SpellingWord } from '@/lib/types'
import { createClient } from '@supabase/supabase-js'

/**
 * Get admin client for write/delete operations
 */
function getAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Fetch all spelling words with pagination to bypass 1000 row limit
 */
async function fetchAllSpellingWords(filters?: {
  section?: string
  difficulty?: string
}): Promise<SpellingWord[]> {
  const PAGE_SIZE = 1000
  let allWords: SpellingWord[] = []
  let from = 0
  let hasMore = true

  while (hasMore) {
    let query = supabaseServer
      .from('spelling_words')
      .select('*')
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (filters?.section && filters.section !== 'All') {
      query = query.eq('section', filters.section)
    }

    if (filters?.difficulty && filters.difficulty !== 'All') {
      query = query.eq('difficulty', filters.difficulty)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) break

    allWords = [...allWords, ...(data as SpellingWord[])]
    from += PAGE_SIZE
    hasMore = data.length === PAGE_SIZE
  }

  return allWords
}

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const section = getQueryParam(request, 'section')
    const difficulty = getQueryParam(request, 'difficulty')

    const data = await fetchAllSpellingWords({ section: section || undefined, difficulty: difficulty || undefined })

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
  try {
    // Validate admin password
    const adminPassword = request.headers.get('x-admin-password')
    const expectedPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
      process.env.ADMIN_PASSWORD ||
      'sow2025'

    if (adminPassword !== expectedPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const section = searchParams.get('section')
    const deleteAll = searchParams.get('all') === 'true'

    const adminClient = getAdminClient()

    if (deleteAll && section) {
      const { error, count } = await adminClient
        .from('spelling_words')
        .delete({ count: 'exact' })
        .eq('section', section)

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: `Deleted all words for ${section}`,
        count,
      })
    }

    if (deleteAll && !section) {
      const { error, count } = await adminClient
        .from('spelling_words')
        .delete({ count: 'exact' })
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: 'All spelling words deleted',
        count,
      })
    }

    if (id) {
      const { error } = await adminClient
        .from('spelling_words')
        .delete()
        .eq('id', id)

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'No valid delete target specified' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Spelling words delete error:', error)
    const message =
      error instanceof Error ? error.message : JSON.stringify(error)
    return NextResponse.json(
      { error: `Delete failed: ${message}` },
      { status: 500 }
    )
  }
}
