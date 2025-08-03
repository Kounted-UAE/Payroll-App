import { Container } from '@/components/advontier-ui/Container'
import { FadeIn } from '@/components/advontier-ui/FadeIn'
import { MDXComponents } from '@/components/advontier-ui/MDXComponents'
import { PageLinks } from '@/components/advontier-ui/PageLinks'
import { RootLayout } from '@/components/advontier-ui/RootLayout'
import { formatDate } from '@/lib/formatDate'
import { type Article, type MDXEntry, loadArticles } from '@/lib/mdx'
import { TableOfContents } from '@/components/articles'

export default async function articlesArticleWrapper({
  article,
  children,
}: {
  article: MDXEntry<Article>
  children: React.ReactNode
}) {
  let allArticles = await loadArticles()
  let moreArticles = allArticles
    .filter(({ metadata }) => metadata !== article)
    .slice(0, 2)

  return (
    <RootLayout>
      <Container as="article" className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn>
          <header className="mx-auto flex max-w-5xl flex-col text-center">
            <h1 className="mt-6 font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-6xl">
              {article.title}
            </h1>
            <time
              dateTime={article.date}
              className="order-first text-sm text-neutral-950"
            >
              {formatDate(article.date)}
            </time>
            <p className="mt-6 text-sm font-semibold text-neutral-950">
              by {article.author.name}, {article.author.role}
            </p>
          </header>
        </FadeIn>

        <FadeIn>
          <div className="mt-24 sm:mt-32 lg:mt-40">
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
              {/* Table of Contents */}
              <div className="hidden lg:block">
                <TableOfContents />
              </div>

              {/* Article Content */}
              <div className="lg:col-span-3">
                <div className="mx-auto max-w-3xl">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>

      {moreArticles.length > 0 && (
        <PageLinks
          className="mt-24 sm:mt-32 lg:mt-40"
          title="Other research articles"
          pages={moreArticles}
        />
      )}
    
    </RootLayout>
  )
}
