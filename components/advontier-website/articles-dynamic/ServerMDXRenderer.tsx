// components/articles/ServerMDXRenderer.tsx

import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

interface ServerMDXRendererProps {
  content: string
  className?: string
}

export default async function ServerMDXRenderer({ content, className = '' }: ServerMDXRendererProps) {
  try {
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    })

    return (
      <div className={`prose prose-neutral max-w-none ${className}`}>
        <MDXRemote {...mdxSource} />
      </div>
    )
  } catch (error) {
    console.error('Error serializing MDX:', error)
    return (
      <div className={`${className} p-4 bg-red-50 border border-red-200 rounded`}>
        <p className="text-red-800">Error loading article content.</p>
      </div>
    )
  }
} 