// lib/articleLoader.ts

import { getAllSupabaseArticles, getSupabaseArticle, SupabaseArticle } from './supabase/articles'
import { serialize } from 'next-mdx-remote/serialize'

export interface ArticlePostAuthor {
  name: string
  role?: string
  image?: any
}

export interface ArticlePostMeta {
  title: string
  date: string
  description: string
  author?: ArticlePostAuthor
  [key: string]: any
}

export interface ArticlePost {
  slug: string
  meta: ArticlePostMeta
  Content: React.ComponentType<any>
  content?: string // Raw MDX content for rendering
}

export function getArticleSlugs(): string[] {
  // This will be populated from Supabase Storage
  return []
}

export async function getArticlePost(slug: string): Promise<ArticlePost | null> {
  try {
    const supabaseArticle = await getSupabaseArticle(slug)
    if (!supabaseArticle) {
      return null
    }

    // Convert Supabase article to ArticlePost format
    return {
      slug: supabaseArticle.slug,
      meta: {
        title: supabaseArticle.meta.title,
        date: supabaseArticle.meta.date,
        description: supabaseArticle.meta.description,
        author: {
          name: supabaseArticle.meta.author.name,
          role: supabaseArticle.meta.author.role,
          // Handle image properly - it could be a string or an object with src
          image: typeof supabaseArticle.meta.author.image === 'string' 
            ? supabaseArticle.meta.author.image 
            : supabaseArticle.meta.author.image?.src || '/team/ai-analyst.jpg'
        }
      },
      Content: () => null, // We'll handle rendering separately
      content: supabaseArticle.content
    }
  } catch (error) {
    console.error(`Error getting article post for ${slug}:`, error)
    return null
  }
}

export async function getAllArticlePosts(): Promise<ArticlePost[]> {
  try {
    const supabaseArticles = await getAllSupabaseArticles()
    
    return supabaseArticles
      .map(article => ({
        slug: article.slug,
        meta: {
          title: article.meta.title,
          date: article.meta.date,
          description: article.meta.description,
          author: {
            name: article.meta.author.name,
            role: article.meta.author.role,
            // Handle image properly - it could be a string or an object with src
            image: typeof article.meta.author.image === 'string' 
              ? article.meta.author.image 
              : article.meta.author.image?.src || '/team/ai-analyst.jpg'
          }
        },
        Content: () => null, // We'll handle rendering separately
        content: article.content
      }))
      .filter(post => !!post && !!post.slug && !!post.meta.date)
      .sort((a, b) => (b.meta.date || '').localeCompare(a.meta.date || ''))
  } catch (error) {
    console.error('Error getting all article posts:', error)
    return []
  }
}

