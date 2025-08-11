import { ContactSection } from '@/components/advontier-website/ContactSection'
import { Container } from '@/components/advontier-website/Container'
import { FadeIn } from '@/components/advontier-website/FadeIn'
import { GridPattern } from '@/components/advontier-website/GridPattern'
import { GrayscaleTransitionImage } from '@/components/advontier-website/GrayscaleTransitionImage'
import { MDXComponents } from '@/components/advontier-website/articles-static/MDXComponents'
import { PageIntro } from '@/components/advontier-website/PageIntro'
import { PageLinks } from '@/components/advontier-website/PageLinks'
import { RootLayout } from '@/components/advontier-website/layout/RootLayout'
import { type CaseStudy, type MDXEntry, loadCaseStudies } from '@/lib/mdx'

export default async function CaseStudyLayout({
  caseStudy,
  children,
}: {
  caseStudy: MDXEntry<CaseStudy>
  children: React.ReactNode
}) {
  let allCaseStudies = await loadCaseStudies()
  let moreCaseStudies = allCaseStudies
    .filter(({ metadata }) => metadata !== caseStudy)
    .slice(0, 2)

  return (
    <RootLayout>
      <article className="mt-24 sm:mt-32 lg:mt-40">
        <header className="relative">
          {/* Header background pattern */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <GridPattern
              className="h-full w-full mask-[linear-gradient(to_bottom_right,white_60%,transparent_70%)] fill-neutral-50 stroke-neutral-950/5"
              yOffset={-256}
            />
          </div>
          
          <PageIntro eyebrow="Case Study" title={caseStudy.title} centered>
            <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto">
              {caseStudy.description}
            </p>
          </PageIntro>

          <FadeIn>
            <div className="mt-24 border-t border-neutral-200 bg-white/80 backdrop-blur-sm sm:mt-32 lg:mt-40">
              <Container>
                <div className="mx-auto max-w-5xl">
                  <dl className="-mx-6 grid grid-cols-1 text-sm text-neutral-950 sm:mx-0 sm:grid-cols-3">
                    <div className="border-t border-neutral-200 px-6 py-6 first:border-t-0 sm:border-t-0 sm:border-l transition-colors hover:bg-neutral-50">
                      <dt className="font-semibold text-neutral-900">Client</dt>
                      <dd className="mt-1 font-medium">{caseStudy.client}</dd>
                    </div>
                    <div className="border-t border-neutral-200 px-6 py-6 first:border-t-0 sm:border-t-0 sm:border-l transition-colors hover:bg-neutral-50">
                      <dt className="font-semibold text-neutral-900">Year</dt>
                      <dd className="mt-1 font-medium">
                        <time dateTime={caseStudy.date.split('-')[0]}>
                          {caseStudy.date.split('-')[0]}
                        </time>
                      </dd>
                    </div>
                    <div className="border-t border-neutral-200 px-6 py-6 first:border-t-0 sm:border-t-0 sm:border-l transition-colors hover:bg-neutral-50">
                      <dt className="font-semibold text-neutral-900">Service</dt>
                      <dd className="mt-1 font-medium">{caseStudy.service}</dd>
                    </div>
                  </dl>
                </div>
              </Container>
            </div>

            <div className="border-y border-neutral-200 bg-neutral-100">
              <div className="mx-auto -my-px max-w-304 bg-neutral-200">
                <GrayscaleTransitionImage
                  {...caseStudy.image}
                  quality={90}
                  className="w-full"
                  sizes="(min-width: 1216px) 76rem, 100vw"
                  priority
                />
              </div>
            </div>
          </FadeIn>
        </header>

        <div className="relative">
          {/* Background grid pattern for content area */}
          <GridPattern
            className="absolute inset-0 -z-10 h-full w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-neutral-50 stroke-neutral-950/5"
            yOffset={64}
          />
          
          <Container className="relative mt-24 sm:mt-32 lg:mt-40">
            <FadeIn>
              <div className="mx-auto max-w-4xl">
                <MDXComponents.wrapper>{children}</MDXComponents.wrapper>
              </div>
            </FadeIn>
          </Container>
        </div>
      </article>

      {/* Enhanced navigation section with background pattern */}
      {moreCaseStudies.length > 0 && (
        <PageLinks
          className="mt-24 sm:mt-32 lg:mt-40"
          title="More case studies"
          intro="Explore our other client success stories and learn how we've helped businesses transform their operations."
          pages={moreCaseStudies}
        />
      )}

      {/* Contact section with additional spacing */}
      <ContactSection />
    </RootLayout>
  )
}
