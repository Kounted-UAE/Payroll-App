// components/articles/ArticleIndex.tsx

import Link from 'next/link'
import { formatDate } from '@/lib/formatDate'
import { ArticlePost } from '@/lib/articleLoader'

interface ArticleIndexProps {
  posts: ArticlePost[]
  currentSlug?: string
  basePath?: string
}

export default function ArticleIndex({ posts, currentSlug, basePath = '/articles' }: ArticleIndexProps) {
  return (
    <div className="lg:sticky lg:top-8">
      <h3 className="font-display text-sm font-semibold text-neutral-950 mb-4">
        Article Index
      </h3>
      <nav className="space-y-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`${basePath}/${post.slug}`}
            className={`block text-sm transition-colors hover:text-neutral-950 ${
              currentSlug === post.slug
                ? 'text-neutral-950 font-medium'
                : 'text-neutral-600'
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{post.meta.title}</span>
              <span className="text-xs text-neutral-500 mt-1">
                {formatDate(post.meta.date)}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}
