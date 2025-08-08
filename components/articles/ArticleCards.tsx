// components/articles/ArticleCards.tsx

import Image from 'next/image'
import Link from 'next/link'
import { Border } from '@/components/advontier-ui/Border'
import { Button } from '@/components/advontier-ui/Button'
import { FadeIn } from '@/components/advontier-ui/FadeIn'
import { formatDate } from '@/lib/formatDate'
import { ArticlePost } from '@/lib/articleLoader'

interface ArticleCardsProps {
  posts: ArticlePost[]
  basePath?: string
}

export default function ArticleCards({ posts, basePath = '/articles' }: ArticleCardsProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">No articles found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-24 lg:space-y-32">
      {posts.map(post => (
        <FadeIn key={post.slug}>
          <article>
            <Border className="pt-16">
              <div className="relative lg:-mx-4 lg:flex lg:justify-end">
                <div className="pt-10 lg:w-2/3 lg:flex-none lg:px-4 lg:pt-0">
                  <h2 className="font-display text-2xl font-semibold text-neutral-950">
                    <Link href={`${basePath}/${post.slug}`}>{post.meta.title}</Link>
                  </h2>
                  <dl className="lg:absolute lg:top-0 lg:left-0 lg:w-1/3 lg:px-4">
                    <dt className="sr-only">Published</dt>
                    <dd className="absolute top-0 left-0 text-sm text-neutral-950 lg:static">
                      <time dateTime={post.meta.date}>
                        {formatDate(post.meta.date)}
                      </time>
                    </dd>
                    {post.meta.author && (
                      <>
                        <dt className="sr-only">Author</dt>
                        <dd className="mt-6 flex gap-x-4">
                          {post.meta.author.image && (
                            <div className="flex-none overflow-hidden rounded-xl bg-neutral-100">
                              <Image
                                alt={post.meta.author.name}
                                src={post.meta.author.image}
                                width={48}
                                height={48}
                                className="h-12 w-12 object-cover grayscale"
                              />
                            </div>
                          )}
                          <div className="text-sm text-neutral-950">
                            <div className="font-semibold">{post.meta.author.name}</div>
                            {post.meta.author.role && <div>{post.meta.author.role}</div>}
                          </div>
                        </dd>
                      </>
                    )}
                  </dl>
                  <p className="mt-6 max-w-2xl text-base text-neutral-600">
                    {post.meta.description}
                  </p>
                  <Button
                    href={`${basePath}/${post.slug}`}
                    aria-label={`Read more: ${post.meta.title}`}
                    className="mt-8"
                  >
                    Read more
                  </Button>
                </div>
              </div>
            </Border>
          </article>
        </FadeIn>
      ))}
    </div>
  )
}
