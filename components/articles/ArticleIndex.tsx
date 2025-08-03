import Link from 'next/link'
import { formatDate } from '@/lib/formatDate'
import { type Article, type MDXEntry } from '@/lib/mdx'

interface ArticleIndexProps {
  articles: MDXEntry<Article>[]
  currentArticleHref?: string
}

export default function ArticleIndex({ articles, currentArticleHref }: ArticleIndexProps) {
  return (
    <div className="lg:sticky lg:top-8">
      <h3 className="font-display text-sm font-semibold text-neutral-950 mb-4">
        Article Index
      </h3>
      <nav className="space-y-2">
        {articles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className={`block text-sm transition-colors hover:text-neutral-950 ${
              currentArticleHref === article.href
                ? 'text-neutral-950 font-medium'
                : 'text-neutral-600'
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{article.title}</span>
              <span className="text-xs text-neutral-500 mt-1">
                {formatDate(article.date)}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
} 