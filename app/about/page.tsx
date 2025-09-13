// app/about/page.tsx

import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ContactSection } from '@/components/advontier-website/ContactSection'
import { Container } from '@/components/advontier-website/Container'
import { FadeIn, FadeInStagger } from '@/components/advontier-website/FadeIn'
import { SectionIntro } from '@/components/advontier-website/SectionIntro'
import { PageWidth } from '@/components/advontier-website/PageWidth'

import { TagList, TagListItem } from '@/components/advontier-website/TagList'
import { StatList, StatListItem } from '@/components/advontier-website/StatList'
import { RootLayout } from '@/components/advontier-website/layout/RootLayout'

export const metadata: Metadata = {
  title: 'About Eben Johansen',
  description:
    'Former Financial Director of multi-national software developer Albatros Golf Solutions, Eben Johansen is now an Operations and Digital Transformation specialist and the founder of Advontier—building a back-office platform and two-sided marketplace for modern professional services.',
}

function Hero() {
  return (
    <PageWidth className="sm:mt-4 lg:mt-8 p-8 md:p-12">
      <h1 className="font-display text-4xl md:text-7xl font-medium tracking-tight text-neutral-950">
        Solutions through digital transformation.
      </h1>
      <p className="mt-6 text-md text-neutral-600">
        Build a back-office platform that also serves as a two-sided marketplace—connecting accountants, clients, and
        centralized accounting resources for the modern profession.
      </p>
    </PageWidth>
  )
}

function Profile() {
  return (
    <PageWidth className="mt-8 sm:mt-12 lg:mt-20 p-8 md:p-12 text-neutral-950">

     
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
            <h2 className="font-display text-3xl font-bold text-neutral-950 mb-2 text-balance">
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
              <p className="text-pretty">
                A career void of any straight lines. I learned through false starts in Law, Accounting, and Business
                Administration, then compounded those lessons in finance leadership and software operations. I founded Advontier (adventures in the digital frontier) because I’m driven
                by a restless need to find and fix problems at their source.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
      <FadeIn className="text-neutral-950 py-4 md:py-8 mt-12 rounded-4xl bg-blue-200/20">
        <SectionIntro
          title="Solving problems at the root, not just treating symptoms."
          className="text-neutral-950"
        >
          <p className="text-pretty max-w-auto text-neutral-950">
            I believe the best solutions are those you only need to implement once. My work is driven by the desire to
            eliminate recurring headaches for business owners and teams—through creative, robust, and scalable systems.
          </p>
        </SectionIntro>

        <Container className="mt-12 text-neutral-950">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold ">Creativity</h3>
              <p className="mt-2 text-neutral-700 text-pretty">
                True value comes from building solutions that automate, streamline, or permanently resolve repetitive pain
                points.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold ">Ownership</h3>
              <p className="mt-2 text-neutral-700 text-pretty">
                Every problem is personal—clients have my direct attention and benefit from my experience at every step.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold ">Committed to Change</h3>
              <p className="mt-2 text-neutral-700 text-pretty">
                The landscape is always changing. Adapting to the challenge means constant adventures into accounting,
                software and automation.
              </p>
            </div>
          </div>
        </Container>
      </FadeIn>

    </PageWidth>
  )
}

export function ResumeSection() {
  return (
    <PageWidth className="mt-2 sm:mt-4 lg:mt-6 p-8 md:p-12">
      <FadeIn>
        {/* Essay-style narrative */}
        <div className="prose prose-neutral max-w-none text-neutral-800">
          <h3 className="mb-3 text-xl font-semibold">Expertise: where finance, software, and operations intersect</h3>
          <p className="text-pretty leading-relaxed">
            I grew up on the finance side—controls, reporting, and audit—and matured inside software companies where
            product lifecycles, delivery pipelines, and SLAs shape how value is created and protected. That blend turned
            into a specialty: translating business objectives into operating models, data flows, and automated workflows
            that teams can actually run. My default approach is conservative in governance and bold in implementation:
            secure authentication, robust data models, clear RLS, observable integrations, and repeatable deployment.
          </p>
          <p className="text-pretty leading-relaxed">
            Technically, I work across the modern TypeScript stack (Next.js, Tailwind, ShadCN, Node), Supabase (Auth,
            Postgres, Storage, Functions), workflow tooling (Teamwork Desk/Projects, Resend), and finance platforms
            (Xero). Domain focus includes UAE compliance (ADGM/DIFC, CIT, WPS), payroll, CPQ/quoting, KYC/AML onboarding,
            and client data repositories—areas where accuracy, auditability, and experience design need to coexist.
          </p>

          <h3 className="mt-10 mb-3 text-xl font-semibold">Advontier’s thesis: a back-office that doubles as a marketplace</h3>
          <p className="text-pretty leading-relaxed">
            Advontier builds a unified back-office for professional services that also behaves like a two-sided
            marketplace. On one side, providers (accountants, compliance teams) need structured workflows, SOPs, secure
            data, and automation. On the other, clients need clarity, status visibility, and simple digital intake. The
            platform connects both—streamlining intake to delivery to billing—so firms can scale without losing control,
            and clients get a measurable, consistent experience.
          </p>
          <p className="text-pretty leading-relaxed">
            Practically, this looks like authenticated client portals, matrix-based pricing (CPQ), guided onboarding
            (KYC/AML), integrated document handling, payroll engines with WPS exports, and analytics surfaces. Everything
            anchors on a single source of truth in Postgres with role-aware access and auditable events, integrated to
            tools that teams already use.
          </p>

          <h3 className="mt-10 mb-3 text-xl font-semibold">Who we serve: Firms and Advisors with regulated workloads</h3>
          <p className="text-pretty leading-relaxed">
            The target users are professional services firms or finance functions that carry regulated obligations
            and cross-system complexity, but still needs speed. If you run compliance-heavy workflows (CIT/FTA, ADGM/DIFC
            filings, payroll/WPS, KYC/AML), you need software patterns that are safe by default and optimized for
            throughput. That’s where Advontier fits: we implement a compact, modern platform with clear ownership and
            measurable outcomes.
          </p>

          <h3 className="mt-10 mb-3 text-xl font-semibold">Why my CV aligns with this value proposition</h3>
          <p className="text-pretty leading-relaxed">
            My earlier roles (Audit Senior at PKF, finance leadership at Albatros Software, contractor at NBC Sports Next)
            taught me how to keep numbers trustworthy while shipping product and operating at scale. Since 2023, I’ve been
            applying that to UAE contexts—designing operating models, implementing Supabase-backed apps, wiring
            integrations, and codifying SOPs—culminating in a transformation remit at Kounted. The throughline is simple:
            establish controls, define flows, then automate and measure.
          </p>

          {/* Compact highlights to maintain scanability */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-blue-200/20 p-4">
              <h4 className="text-sm font-semibold text-neutral-900">Core Capabilities</h4>
              <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 leading-relaxed">
                <li>Process re-engineering, SOPs, change management</li>
                <li>Finance leadership: controls, reporting, audit/tax</li>
                <li>Operating-model &amp; service-catalogue design</li>
                <li>AI/automation, portals, and workflow tooling</li>
                <li>Data modeling, dashboards, performance management</li>
              </ul>
            </div>
            <div className="rounded-lg bg-blue-200/20 p-4">
              <h4 className="text-sm font-semibold text-neutral-900">Platform &amp; Stack</h4>
              <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 leading-relaxed">
                <li>Supabase (Auth, Postgres, Storage, Edge Functions)</li>
                <li>Xero, Teamwork Desk/Projects, Resend</li>
                <li>RLS, auditing, secure file handling</li>
                <li>Next.js, Tailwind, ShadCN, Node</li>
              </ul>
            </div>
            <div className="rounded-lg bg-blue-200/20 p-4">
              <h4 className="text-sm font-semibold text-neutral-900">Engagement Modes</h4>
              <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 leading-relaxed">
                <li>Audit &amp; Roadmap (2–4 weeks)</li>
                <li>Build &amp; Integrate (6–12 weeks)</li>
                <li>Operate &amp; Improve (ongoing)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link href="/docs/Eben_Jacob_Johansen_-_Director_of_Finance Resume_2023.pdf" download className="inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800">
              Download CV (PDF)
            </Link>
          </div>
        </div>
      </FadeIn>
    </PageWidth>
  )
}

export default function About() {
  return (
    <RootLayout>
      <Profile />
      <PageWidth className="p-4 md:p-8">
        <StatList>
          <StatListItem value="18+ years" label="Professional Experience" />
          <StatListItem value="20+" label="Organisations Supported" />
          <StatListItem value="1" label="Team of 1! Accountable for Everything." />
        </StatList>
      </PageWidth>
      <ResumeSection />
      <div id="contact" />
      <ContactSection />
    </RootLayout>
  )
}
