'use client'

import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from 'react'

interface MDXRendererProps {
  content: string
  className?: string
}

export default function MDXRenderer({ content, className = '' }: MDXRendererProps) {
  const [mdxSource, setMdxSource] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function serializeContent() {
      try {
        const serialized = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
          },
        })
        setMdxSource(serialized)
      } catch (error) {
        console.error('Error serializing MDX:', error)
      } finally {
        setLoading(false)
      }
    }

    if (content) {
      serializeContent()
    }
  }, [content])

  if (loading) {
    return <div className={`animate-pulse ${className}`}>Loading...</div>
  }

  if (!mdxSource) {
    return <div className={className}>Error loading content</div>
  }

  return (
    <div className={`prose prose-neutral max-w-none ${className}`}>
      <MDXRemote {...mdxSource} />
    </div>
  )
} 