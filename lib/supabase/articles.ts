import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface SupabaseArticleMeta {
  title: string
  date: string
  description: string
  author: {
    name: string
    role: string
    image: { src: string }
  }
}

export interface SupabaseArticle {
  slug: string
  filename: string
  meta: SupabaseArticleMeta
  content: string
  storageUrl?: string
}

/**
 * Get all MDX articles from Supabase Storage
 */
export async function getAllSupabaseArticles(): Promise<SupabaseArticle[]> {
  try {
    // List all files inside the 'research-articles' folder in the bucket
    const { data, error } = await supabase.storage
      .from('research-articles')
      .list('research-articles', { 
        limit: 100, 
        sortBy: { column: 'name', order: 'desc' }
      })

    if (error) {
      console.error('Error fetching articles from Supabase:', error)
      return []
    }

    // Only process .mdx files
    const mdxFiles = (data || []).filter(obj => obj.name.endsWith('.mdx'))

    const articles = await Promise.all(
      mdxFiles.map(async (file) => {
        try {
          // NOTE: file.name here is just '2025-08-03-daily-insight.mdx'
          const article = await fetchSupabaseArticleContent(file.name)
          return article
        } catch (error) {
          console.error(`Error fetching article ${file.name}:`, error)
          return null
        }
      })
    )

    return articles.filter((article): article is SupabaseArticle => article !== null)
  } catch (error) {
    console.error('Error in getAllSupabaseArticles:', error)
    return []
  }
}

/**
 * Fetch content of a specific article from Supabase Storage
 */
export async function fetchSupabaseArticleContent(filename: string): Promise<SupabaseArticle> {
  try {
    // THE KEY: use folder + filename for signed url and fetch
    const storagePath = `research-articles/${filename}`

    const { data: urlData, error: urlError } = await supabase.storage
      .from('research-articles')
      .createSignedUrl(storagePath, 60 * 60 * 24)

    if (urlError || !urlData?.signedUrl) {
      throw new Error(`Could not get signed URL for ${storagePath}: ${urlError?.message}`)
    }

    // Fetch the file content
    const response = await fetch(urlData.signedUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch article content: ${response.statusText}`)
    }

    const content = await response.text()
    const meta = parseMdxMetadata(content, filename)
    const slug = filename.replace(/\.mdx$/, '')

    return {
      slug,
      filename,
      meta,
      content,
      storageUrl: urlData.signedUrl
    }
  } catch (error) {
    console.error(`Error fetching article ${filename}:`, error)
    throw error
  }
}

/**
 * Parse MDX metadata from content
 */
function parseMdxMetadata(content: string, filename: string): SupabaseArticleMeta {
  try {
    // More robust: match with or without semicolon and ignore whitespace
    const articleMatch = content.match(/export const article = ({[\s\S]*?})\s*;?/)
    if (!articleMatch) {
      throw new Error('No article metadata found')
    }

    const metadataMatch = content.match(/export const metadata = ({[\s\S]*?})\s*;?/)
    const articleStr = articleMatch[1]
    const metadataStr = metadataMatch ? metadataMatch[1] : '{}'

    // Parse safely (assume trusted source, not user input)
    const article = eval(`(${articleStr})`) as any
    const metadata = metadataMatch ? eval(`(${metadataStr})`) as any : {}

    return {
      title: article.title || metadata.title || filename.replace(/\.mdx$/, ''),
      date: article.date || new Date().toISOString().split('T')[0],
      description: article.description || metadata.description || 'Daily industry insight article',
      author: {
        name: article.author?.name || 'Advontier AI Analyst',
        role: article.author?.role || 'Research Agent',
        image: article.author?.image || { src: '/images/team/ai-analyst.jpg' }
      }
    }
  } catch (error) {
    console.error('Error parsing MDX metadata:', error)
    // Return fallback metadata
    return {
      title: filename.replace(/\.mdx$/, '').replace(/-/g, ' '),
      date: new Date().toISOString().split('T')[0],
      description: 'Daily industry insight article',
      author: {
        name: 'Advontier AI Analyst',
        role: 'Research Agent',
        image: { src: '/images/team/ai-analyst.jpg' }
      }
    }
  }
}


/**
 * Get a specific article by slug
 */
export async function getSupabaseArticle(slug: string): Promise<SupabaseArticle | null> {
  try {
    const filename = `${slug}.mdx`
    return await fetchSupabaseArticleContent(filename)
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error)
    return null
  }
}

/**
 * Check if an article exists in Supabase Storage
 */
export async function articleExistsInSupabase(slug: string): Promise<boolean> {
  try {
    const filename = `${slug}.mdx`
    // Note: Use 'research-articles' as the path here as well!
    const { data, error } = await supabase.storage
      .from('research-articles')
      .list('research-articles', { search: filename })

    if (error) {
      console.error('Error checking article existence:', error)
      return false
    }

    return (data || []).some(file => file.name === filename)
  } catch (error) {
    console.error('Error in articleExistsInSupabase:', error)
    return false
  }
}
