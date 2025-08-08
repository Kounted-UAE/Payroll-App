// app/perspectives/page.tsx

import { RootLayout } from '@/components/advontier-website/layout/RootLayout'
import { PageIntro } from '@/components/advontier-website/PageIntro'
import { Container } from '@/components/advontier-website/Container'
import ArticleCards from '@/components/advontier-website/articles/ArticleCards'
import ArticleIndex from '@/components/advontier-website/articles/ArticleIndex'
import { listPerspectives, toArticlePostShape } from '@/lib/supabase/perspectives'

export const metadata = {
  title: 'Perspectives',
  description: 'Research notes and perspectives stored in Supabase tables.'
}

export default async function PerspectivesPage() {
  const rows = await listPerspectives()
  const posts = rows.map(toArticlePostShape)

  return (
    <RootLayout>
      <PageIntro
        eyebrow="Perspectives"
        title="Research notes and perspectives"
      >
        <p>
          Curated analyses, stored in Supabase and rendered as MDX.
        </p>
      </PageIntro>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <ArticleCards posts={posts} basePath="/perspectives" />
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <ArticleIndex posts={posts} basePath="/perspectives" />
            </div>
          </div>
        </div>
      </Container>
    </RootLayout>
  )
}

