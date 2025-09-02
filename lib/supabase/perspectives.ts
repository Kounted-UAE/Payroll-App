import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/supabase'

export type PerspectiveMeta = {
  title: string
  date: string
  description: string
  author?: { name: string; role?: string; image?: string }
}

export type Perspective = {
  id: string
  slug: string
  title: string
  description: string | null
  content: string | null
  category: string | null
  subcategory: string | null
  collection: string | null
  tags: string[] | null
  visibility: string | null
  created_at: string | null
  updated_at: string | null
  author_name?: string | null
  author_role?: string | null
  author_image?: string | null
}

// Function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

export async function listPerspectives(): Promise<Perspective[]> {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
    .from('articles' as any)
    .select('*')
    .order('created_at', { ascending: false })
    if (error) {
      console.error('listPerspectives error', error)
      return []
    }
    return (data as unknown as Perspective[]) || []
  } catch (error) {
    console.error('listPerspectives error', error)
    return []
  }
}

export async function getPerspectiveBySlug(slug: string): Promise<Perspective | null> {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
    .from('articles' as any)
    .select('*')
    .eq('slug', slug)
    .single()
    if (error) {
      console.error('getPerspectiveBySlug error', error)
      return null
    }
    return (data as unknown as Perspective) || null
  } catch (error) {
    console.error('getPerspectiveBySlug error', error)
    return null
  }
}

export function toArticlePostShape(p: Perspective) {
  return {
    slug: p.slug,
    meta: {
      title: p.title,
      date: p.created_at || new Date().toISOString().slice(0, 10),
      description: p.description || '',
      author: p.author_name
        ? { name: p.author_name, role: p.author_role || undefined, image: p.author_image || undefined }
        : undefined,
    },
    Content: () => null,
    content: p.content || undefined,
  }
}

