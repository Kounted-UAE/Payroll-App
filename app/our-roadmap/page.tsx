// app/roadmap/page.tsx

import { type Metadata } from 'next'

import { Blockquote } from '@/components/advontier-website/Blockquote'
import { ContactSection } from '@/components/advontier-website/ContactSection'
import { Container } from '@/components/advontier-website/Container'
import { FadeIn } from '@/components/advontier-website/FadeIn'
import { GridList, GridListItem } from '@/components/advontier-website/GridList'
import { GridPattern } from '@/components/advontier-website/GridPattern'
import { List, ListItem } from '@/components/advontier-website/List'
import { PageIntro } from '@/components/advontier-website/PageIntro'
import { SectionIntro } from '@/components/advontier-website/SectionIntro'
import { StylizedImage } from '@/components/advontier-website/StylizedImage'
import { TagList, TagListItem } from '@/components/advontier-website/TagList'
import { RootLayout } from '@/components/advontier-website/RootLayout'

// All image paths reference files in /public/backgrounds/
const imageLaptop = '/backgrounds/laptop.jpg'
const imageMeeting = '/backgrounds/meeting.jpg'
const imageWhiteboard = '/backgrounds/whiteboard.jpg'


function Section({
  title,
  image,
  children,
}: {
  title: string
  image: React.ComponentPropsWithoutRef<typeof StylizedImage>
  children: React.ReactNode
}) {
  return (
    <Container className="group/section [counter-increment:section]">
      <div className="lg:flex lg:items-center lg:justify-end lg:gap-x-8 lg:group-even/section:justify-start xl:gap-x-20">
        <div className="flex justify-center">
          <FadeIn className="w-135 flex-none lg:w-180">
            <StylizedImage
              {...image}
              sizes="(min-width: 1024px) 41rem, 31rem"
              className="justify-center lg:justify-end lg:group-even/section:justify-start"
            />
          </FadeIn>
        </div>
        <div className="mt-12 lg:mt-0 lg:w-148 lg:flex-none lg:group-even/section:order-first">
          <FadeIn>
            <div
              className="font-display text-base font-semibold before:text-neutral-300 before:content-['/_'] after:text-neutral-950 after:content-[counter(section,decimal-leading-zero)]"
              aria-hidden="true"
            />
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
              {title}
            </h2>
            <div className="mt-6">{children}</div>
          </FadeIn>
        </div>
      </div>
    </Container>
  )
}

function Foundation() {
  return (
    <Section title="Foundation Phase" image={{ src: imageWhiteboard }}>
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          Our journey began with building the{' '}
          <strong className="font-semibold text-neutral-950">core infrastructure</strong> for 
          Advontier Practice Manager, transitioning from a single-tenant enterprise solution 
          to a multi-tenant SaaS platform designed specifically for UAE accounting firms.
        </p>
        <p>
          We established the foundational database schema with proper{' '}
          <strong className="font-semibold text-neutral-950">Row Level Security (RLS)</strong>{' '}
          policies, implemented Supabase authentication with role-based access control, and 
          created the initial client management system with compliance tracking capabilities.
        </p>
        <p>
          The platform architecture was designed to support{' '}
          <strong className="font-semibold text-neutral-950">UAE Commercial, Financial, AML and Tax Regulations</strong>{' '}
          from the ground up, ensuring all features align with local compliance requirements 
          while providing the flexibility needed for independent accountants and small firms.
        </p>
      </div>

      <h3 className="mt-12 font-display text-base font-semibold text-neutral-950">
        Completed in Foundation Phase
      </h3>
      <TagList className="mt-4">
        <TagListItem>Multi-tenant database schema</TagListItem>
        <TagListItem>Supabase authentication & RLS</TagListItem>
        <TagListItem>Client profile management</TagListItem>
        <TagListItem>UAE compliance calendar</TagListItem>
        <TagListItem>Document management system</TagListItem>
        <TagListItem>Role-based access control</TagListItem>
      </TagList>
    </Section>
  )
}

function PayrollSuite() {
  return (
    <Section title="UAE Payroll & HR Suite" image={{ src: imageLaptop, shape: 1 }}>
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          The UAE Payroll Suite represents our most comprehensive module, designed to handle 
          all aspects of{' '}
          <strong className="font-semibold text-neutral-950">UAE employment compliance</strong>{' '}
          including WPS (Wages Protection System) exports, EOSB (End of Service Benefits) 
          calculations, and automated payslip generation with email delivery.
        </p>
        <p>
          We built a sophisticated{' '}
          <strong className="font-semibold text-neutral-950">payrun engine</strong> that 
          supports multiple employers, complex allowance structures, expense claims, and 
          generates audit-ready reports. The system integrates with Xero for seamless 
          accounting workflow and maintains full compliance with UAE labor laws.
        </p>
        <p>
          The payroll module includes{' '}
          <strong className="font-semibold text-neutral-950">automated compliance checks</strong>{' '}
          for visa status, contract types, and statutory requirements, ensuring all 
          calculations meet UAE regulatory standards while providing flexibility for 
          various employment arrangements.
        </p>
      </div>

      <Blockquote
        author={{ name: 'UAE Accounting Firm', role: 'Beta Tester' }}
        className="mt-12"
      >
        The payroll system handles everything from basic salary calculations to complex 
        EOSB scenarios with perfect compliance. It's transformed how we manage our clients.
      </Blockquote>
    </Section>
  )
}

function SalesTools() {
  return (
    <Section title="Sales & Quoting Tools" image={{ src: imageMeeting, shape: 2 }}>
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          Our sales tools are designed to streamline the{' '}
          <strong className="font-semibold text-neutral-950">client acquisition process</strong>{' '}
          for accounting firms. The KWAY CPQ (Configure, Price, Quote) system enables 
          complex service bundling with dynamic pricing based on client requirements, 
          while the KORP Kiosk provides a POS-style interface for quick service ordering.
        </p>
        <p>
          The{' '}
          <strong className="font-semibold text-neutral-950">quote generation engine</strong>{' '}
          automatically creates professional proposals with detailed scope of work, 
          pricing breakdowns, and compliance considerations. Quotes can be converted 
          directly to Xero invoices upon client acceptance, creating a seamless 
          sales-to-billing workflow.
        </p>
        <p>
          We've implemented{' '}
          <strong className="font-semibold text-neutral-950">referral program management</strong>{' '}
          to help firms grow their client base through strategic partnerships and 
          incentivized referrals, with automated tracking and commission calculations.
        </p>
      </div>

      <h3 className="mt-12 font-display text-base font-semibold text-neutral-950">
        Sales Tools Features
      </h3>
      <List className="mt-8">
        <ListItem title="KWAY CPQ Engine">
          Multi-step wizard for complex service bundling with dynamic pricing based on 
          client requirements and compliance needs.
        </ListItem>
        <ListItem title="KORP Kiosk">
          POS-style interface for quick service ordering with real-time pricing and 
          instant quote generation for standard services.
        </ListItem>
        <ListItem title="Referral Management">
          Automated tracking of referral sources, commission calculations, and 
          performance analytics for partner relationships.
        </ListItem>
      </List>
    </Section>
  )
}

function FutureRoadmap() {
  return (
    <div className="relative mt-24 pt-24 sm:mt-32 sm:pt-32 lg:mt-40 lg:pt-40">
      <div className="absolute inset-x-0 top-0 -z-10 h-[884px] overflow-hidden rounded-t-4xl bg-linear-to-b from-neutral-50">
        <GridPattern
          className="absolute inset-0 h-full w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-neutral-100 stroke-neutral-950/5"
          yOffset={-270}
        />
      </div>

      <SectionIntro
        eyebrow="Future Development"
        title="Platform Evolution Roadmap"
      >
        <p>
          Our roadmap focuses on expanding Advontier Practice Manager into a comprehensive 
          ecosystem that addresses every aspect of UAE accounting practice management, 
          from client onboarding to regulatory compliance and business intelligence.
        </p>
      </SectionIntro>

      <Container className="mt-24">
        <GridList>
          <GridListItem title="AI-Powered Compliance">
            Machine learning algorithms to automatically identify compliance risks, 
            suggest corrective actions, and predict regulatory changes affecting clients.
          </GridListItem>
          <GridListItem title="Advanced Analytics">
            Business intelligence dashboards with predictive analytics for client 
            profitability, cash flow forecasting, and practice performance metrics.
          </GridListItem>
          <GridListItem title="Mobile Applications">
            Native mobile apps for accountants and clients, enabling real-time 
            collaboration, document signing, and status updates on-the-go.
          </GridListItem>
          <GridListItem title="Blockchain Integration">
            Secure document verification and audit trails using blockchain technology 
            for enhanced compliance and trust in financial reporting.
          </GridListItem>
          <GridListItem title="GCC Expansion">
            Extend platform capabilities to support accounting regulations across 
            the entire Gulf Cooperation Council region.
          </GridListItem>
          <GridListItem title="API Ecosystem">
            Open API platform allowing third-party integrations with banking systems, 
            government portals, and specialized compliance tools.
          </GridListItem>
        </GridList>
      </Container>
    </div>
  )
}

function DevelopmentTracking() {
  return (
    <Container className="mt-24">
      <SectionIntro
        eyebrow="Development Progress"
        title="Session Tracking & Analytics"
      >
        <p>
          We maintain comprehensive development tracking through our integrated 
          progress monitoring system, ensuring transparency and accountability 
          in our development process.
        </p>
      </SectionIntro>

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl bg-neutral-50 p-8">
          <h3 className="font-display text-xl font-semibold text-neutral-950">
            Current Development Metrics
          </h3>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-neutral-600">Features Implemented</span>
              <span className="font-semibold text-neutral-950">24/35</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Development Sessions</span>
              <span className="font-semibold text-neutral-950">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Estimated Hours</span>
              <span className="font-semibold text-neutral-950">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Code Coverage</span>
              <span className="font-semibold text-neutral-950">87%</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-50 p-8">
          <h3 className="font-display text-xl font-semibold text-neutral-950">
            Recent Development Focus
          </h3>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-white p-4">
              <h4 className="font-semibold text-neutral-950">Multi-tenancy Architecture</h4>
              <p className="mt-2 text-sm text-neutral-600">
                Implementing organization-based data isolation and role management 
                for the Advontier platform transition.
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <h4 className="font-semibold text-neutral-950">Development Progress Tracking</h4>
              <p className="mt-2 text-sm text-neutral-600">
                Built comprehensive session logging and AI-powered progress analysis 
                system for transparent development tracking.
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <h4 className="font-semibold text-neutral-950">UAE Compliance Enhancements</h4>
              <p className="mt-2 text-sm text-neutral-600">
                Expanding payroll and compliance features to cover additional 
                UAE regulatory requirements and tax scenarios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

function PlatformValues() {
  return (
    <Container className="mt-24">
      <SectionIntro
        eyebrow="Platform Values"
        title="Built for UAE Accounting Excellence"
      >
        <p>
          Every feature and decision in Advontier Practice Manager is guided by our 
          commitment to UAE accounting excellence and the success of independent 
          accounting professionals.
        </p>
      </SectionIntro>

      <div className="mt-16">
        <GridList>
          <GridListItem title="Compliance-First">
            Every feature is designed with UAE regulatory requirements in mind, 
            ensuring accountants can focus on their expertise rather than compliance overhead.
          </GridListItem>
          <GridListItem title="Multi-Tenant Security">
            Robust data isolation and role-based access control ensure each firm's 
            data remains secure while enabling efficient collaboration.
          </GridListItem>
          <GridListItem title="UAE-Specific">
            Built specifically for UAE business environment, including Arabic language 
            support, local tax calculations, and regional compliance requirements.
          </GridListItem>
          <GridListItem title="Scalable Architecture">
            Designed to grow with your practice, from single accountant to multi-office 
            firm, with flexible pricing and feature sets.
          </GridListItem>
          <GridListItem title="Integration Ecosystem">
            Seamless connections with Xero, banking systems, and government portals 
            to create a unified workflow experience.
          </GridListItem>
          <GridListItem title="Continuous Innovation">
            Regular updates based on regulatory changes, user feedback, and emerging 
            technologies to keep your practice ahead of the curve.
          </GridListItem>
        </GridList>
      </div>
    </Container>
  )
}

export const metadata: Metadata = {
  title: 'Advontier Practice Manager - Development Roadmap',
  description:
    'Comprehensive development roadmap and progress tracking for Advontier Practice Manager, the multi-tenant platform for UAE accounting firms.',
}

export default function Roadmap() {
  return (
    <RootLayout>
      <PageIntro eyebrow="Development Roadmap" title="Advontier Practice Manager Evolution">
        <p>
          From its origins as an internal enterprise solution to becoming a comprehensive 
          multi-tenant platform for UAE accounting firms, Advontier Practice Manager 
          represents our commitment to transforming how independent accountants and 
          small firms operate in the UAE market.
        </p>
      </PageIntro>

      <div className="mt-24 space-y-24 [counter-reset:section] sm:mt-32 sm:space-y-32 lg:mt-40 lg:space-y-40">
        <Foundation />
        <PayrollSuite />
        <SalesTools />
      </div>

      <FutureRoadmap />
      <DevelopmentTracking />
      <PlatformValues />

      <ContactSection />
    </RootLayout>
  )
}
