// app/about/page.tsx

import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Border } from '@/components/advontier-ui/Border'
import { ContactSection } from '@/components/advontier-ui/ContactSection'
import { Container } from '@/components/advontier-ui/Container'
import { FadeIn } from '@/components/advontier-ui/FadeIn'
import { PageIntro } from '@/components/advontier-ui/PageIntro'
import { PageLinks } from '@/components/advontier-ui/PageLinks'
import { SectionIntro } from '@/components/advontier-ui/SectionIntro'
import { StatList, StatListItem } from '@/components/advontier-ui/StatList'
import { loadArticles } from '@/lib/mdx'
import { RootLayout } from '@/components/advontier-ui/RootLayout'

export const metadata: Metadata = {
  title: 'About Eben Johansen',
  description:
    "A once effective Financial Director at multi-national software developer, Albatros Golf Solutions, today Eben Johansen finds himself as COO of Kounted (UAE), and founder of accounting practice management- and client engagement platform, Advontier.",
}


function Profile() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <FadeIn>
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <Image
              src="/team/eben_johansen_01.jpg"
              alt="Eben Johansen"
              width={240}
              height={240}
              className="rounded-3xl object-cover grayscale border border-neutral-200"
              priority
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-neutral-950 mb-2">
              Eben Johansen
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                Founder, Advontier
              </span>
              <Link
                href="https://www.linkedin.com/in/ebenjohansen/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-xs font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.29h-3v-4.5c0-1.08-.02-2.48-1.51-2.48-1.51 0-1.74 1.18-1.74 2.4v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z" />
                </svg>
                LinkedIn
              </Link>
            </div>
            <div className="text-base text-neutral-700 bg-blue-200/20 p-4 rounded-lg space-y-2">
            
            <p>A career void of any straight lines. My journey includes valuable academic failures in the fields of Law, Accounting, and Business Administration. </p>
             <p>I founded Advontier (adventures in the digital frontier) because I’m driven by a restless need to find and fix problems at their source.</p>
            </div>
          </div>
        </div>
      </FadeIn>
    </Container>
  )
}


function Culture() {
  return (
    <div className="mt-24 rounded-4xl bg-neutral-950 py-24 sm:mt-32 lg:mt-40 lg:py-32">
      <SectionIntro
        eyebrow="Personal Philosophy"
        title="Solving problems at the root, not just treating symptoms."
        invert
      >
        <p>
          I believe the best solutions are those you only need to implement once. My work is driven by the desire to eliminate recurring headaches for business owners and teams—through creative, robust, and scalable systems.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Creativity</h3>
            <p className="mt-2 text-neutral-300">
              True value comes from building solutions that automate, streamline, or permanently resolve repetitive pain points.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Ownership</h3>
            <p className="mt-2 text-neutral-300">
              Every problem is personal—clients have my direct attention and benefit from my experience at every step.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Committed to Change</h3>
            <p className="mt-2 text-neutral-300">
              The landscape is always changing. Adapting to the challenge means constant adventures into accounting, software and automation.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default async function About() {
  let articlesArticles = (await loadArticles()).slice(0, 2)

  return (
    <RootLayout>
     <PageIntro
        eyebrow="About Us"
        title="Solutions through digital transformation."
      >
        <p className="text-neutral-700">
        <span className='font-bold'>The mission is simple: </span>Build a back-office platform that also serves as a two-sided marketplace—connecting accountants, clients, and centralized accounting resources for the modern profession.
        </p>
      </PageIntro>


      <Profile />

      <Container className="mt-16">
        <StatList>
          <StatListItem value="18+ years" label="Professional Experience" />
          <StatListItem value="20+" label="Organisations Supported" />
          <StatListItem value="1" label="Team of 1! Accountable for Everything." />
        </StatList>
      </Container>

      <Culture />

      <PageLinks
        className="mt-24 sm:mt-32 lg:mt-40"
        title="Insights & Articles"
        intro="Occasional perspectives on automation, creative problem-solving, and the future of professional services."
        pages={articlesArticles}
      />

      <ContactSection />
    </RootLayout>
  )
}
