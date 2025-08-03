// app/articles/page.tsx

import { getAllArticlePosts } from '@/lib/articleLoader'
import ArticleIndex from '@/components/articles/ArticleIndex'
import ArticleCards from '@/components/articles/ArticleCards'
import { RootLayout } from '@/components/advontier-ui/RootLayout'
import { PageIntro } from '@/components/advontier-ui/PageIntro'
import { Container } from '@/components/advontier-ui/Container'

export const metadata = {
  title: 'Articles',
  description: 'Daily insights and perspectives on UAE accounting, payroll, and compliance trends.',
}

export default async function ArticlePage() {
  const posts = await getAllArticlePosts()

  return (
    <RootLayout>
      <PageIntro
        eyebrow="Articles"
        title="Daily insights and perspectives on UAE accounting, payroll, and compliance trends."
      >
        <p>
          Discover the latest regulatory updates, market trends, and actionable insights for accounting firms and digital platforms in the UAE—delivered daily by our AI research system.
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
