// app/articles/[slug]/page.tsx

import { notFound } from "next/navigation"
import { getArticlePost } from "@/lib/articleLoader"
import ArticleWrapper from "../wrapper"
import TableOfContents from '@/components/articles/TableOfContents'
import ServerMDXRenderer from '@/components/articles/ServerMDXRenderer'
import { RootLayout } from "@/components/advontier-ui/RootLayout"
import { Container } from "@/components/advontier-ui/Container"

export default async function ArticleSlugPage({ params }: { params: { slug: string } }) {
  const post = await getArticlePost(params.slug)
  if (!post) return notFound()

  return (
    <RootLayout>
      <Container as="article" className="mt-24 sm:mt-32 lg:mt-40">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <ArticleWrapper post={post}>
              {post.content && <ServerMDXRenderer content={post.content} />}
            </ArticleWrapper>
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <TableOfContents />
            </div>
          </div>
        </div>
      </Container>
    </RootLayout>
  )
}