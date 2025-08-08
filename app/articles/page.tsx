// app/articles/page.tsx

import { getAllArticlePosts } from '@/lib/articleLoader'
import ArticleIndex from '@/components/advontier-website/articles/ArticleIndex'
import ArticleCards from '@/components/advontier-website/articles/ArticleCards'
import { RootLayout } from '@/components/advontier-website/RootLayout'
import { PageIntro } from '@/components/advontier-website/PageIntro'
import { Container } from '@/components/advontier-website/Container'

export const metadata = {
  title: 'Our Theses',
  description: 'Why we are committed to building a better accounting practice management system.',
}

export default async function ArticlePage() {
  const posts = await getAllArticlePosts()

  return (
    <RootLayout>
      <PageIntro
        eyebrow="Our Theses"
        title="Why we are committed to building a better accounting practice management system."
      >
        <p>
          Wee believe client and contractors deserve a better experience. Here are some of the reasons why we're committed to providing them just that.
        </p>
      </PageIntro>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <ArticleCards posts={posts} />
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <ArticleIndex posts={posts} />
            </div>
          </div>
        </div>
      </Container>
    </RootLayout>
  )
}
