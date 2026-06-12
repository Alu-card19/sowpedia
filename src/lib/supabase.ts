import { createClient, SupabaseClient } from '@supabase/supabase-js'

function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set')
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

function getSupabaseServerClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Lazy-loaded clients - neither initialises until first call
let supabaseInstance: SupabaseClient | null = null
let supabaseServerInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = getSupabaseClient()
  }
  return supabaseInstance
}

export function getSupabaseServer(): SupabaseClient {
  if (!supabaseServerInstance) {
    supabaseServerInstance = getSupabaseServerClient()
  }
  return supabaseServerInstance
}

// Backwards compatibility exports - use getters to defer initialization
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    const client = getSupabase()
    return (client as unknown as Record<string | symbol, unknown>)[prop]
  }
})

export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    const client = getSupabaseServer()
    return (client as unknown as Record<string | symbol, unknown>)[prop]
  }
})
