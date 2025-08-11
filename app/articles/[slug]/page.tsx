// app/articles/[slug]/page.tsx

import { notFound } from "next/navigation"
import { getArticlePost } from "@/lib/articleLoader"
import ArticleWrapper from "../wrapper"
import TableOfContents from '@/components/advontier-website/articles-dynamic/TableOfContents'
import ServerMDXRenderer from '@/components/advontier-website/articles-dynamic/ServerMDXRenderer'
import { Container } from "@/components/advontier-website/Container"
import ClientTableOfContents from '@/components/advontier-website/articles-dynamic/ClientTableOfContents'

export default async function ArticleSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getArticlePost(slug)
  if (!post) return notFound()

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