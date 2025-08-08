// app/perspectives/[slug]/page.tsx

import { notFound } from 'next/navigation'
import { Container } from '@/components/advontier-website/Container'
import ArticleWrapper from '@/app/articles/wrapper'
import ServerMDXRenderer from '@/components/advontier-website/articles/ServerMDXRenderer'
import ClientTableOfContents from '@/components/advontier-website/articles/ClientTableOfContents'
import { getPerspectiveBySlug, toArticlePostShape } from '@/lib/supabase/perspectives'

export default async function PerspectiveSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const row = await getPerspectiveBySlug(slug)
  if (!row) return notFound()
  const post = toArticlePostShape(row)

  return (
    <Container as="article" className="mt-24 sm:mt-32 lg:mt-40">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-3">
          <ArticleWrapper post={post}>
            {post.content && <ServerMDXRenderer content={post.content} />}
          </ArticleWrapper>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-8">
            <ClientTableOfContents />
          </div>
        </div>
      </div>
    </Container>
  )
}

