// app/page.tsx

import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'


import { Container } from '@/components/advontier-ui/Container'
import { FadeIn, FadeInStagger } from '@/components/advontier-ui/FadeIn'
import { List, ListItem } from '@/components/advontier-ui/List'
import { SectionIntro } from '@/components/advontier-ui/SectionIntro'
import { StylizedImage } from '@/components/advontier-ui/StylizedImage'
import { Testimonial, TestimonialBody } from '@/components/advontier-ui/Testimonial'
import { type CaseStudy, type MDXEntry, loadCaseStudies } from '@/lib/mdx'
import { ContactSection } from '@/components/advontier-ui/ContactSection'
import { RootLayout } from '@/components/advontier-ui/RootLayout'
import { Blockquote } from '@/components/advontier-ui/Blockquote'
import { GridList, GridListItem } from '@/components/advontier-ui/GridList'
import { GridPattern } from '@/components/advontier-ui/GridPattern'
import { PageIntro } from '@/components/advontier-ui/PageIntro'
import { TagList, TagListItem } from '@/components/advontier-ui/TagList'
import imageMeeting from '@images/meeting.jpg'
import imageWhiteboard from '@images/whiteboard.jpg'


const imageLaptop = '/images/laptop.jpg'
const murrayPhoto = '/images/team/murray-baker.JPG'
const logoKountedDark = '/images/clients/kounted/logo-dark.webp'


const logoNext = 'https://simpleicons.org/icons/nextdotjs.svg';
const logoReact = 'https://simpleicons.org/icons/react.svg';
const logoSupabase = 'https://simpleicons.org/icons/supabase.svg';
const logoTailwind = 'https://simpleicons.org/icons/tailwindcss.svg';
const logoTypeScript = 'https://simpleicons.org/icons/typescript.svg';

const logoXero = 'https://simpleicons.org/icons/xero.svg';
const logoOpenAI = 'https://simpleicons.org/icons/openai.svg';
const logoResend = 'https://simpleicons.org/icons/resend.svg';

const coreTechLogos = [
  ['Next.js', logoNext],
  ['Supabase', logoSupabase],
  ['React', logoReact],
  ['Tailwind', logoTailwind],
  ['TypeScript', logoTypeScript],
];

const integrationLogos = [
  ['OpenAI', logoOpenAI],
  ['Resend', logoResend],
  ['Xero', logoXero],
];

function LogoWall() {
  return (
    <div className="mt-12 rounded-r-4xl bg-neutral-950 py-12 sm:mt-24 sm:py-20 lg:mt-24">
      <Container>
        {/* Section for Core Technologies */}
        <FadeIn className="flex items-center gap-x-4">
          <h2 className="text-center font-display text-sm font-semibold tracking-wider text-white sm:text-left">
            Built on:
          </h2>
          <div className="h-px flex-auto bg-neutral-800" />
        </FadeIn>
        <FadeInStagger faster>
          <ul
            role="list"
            className="mt-4 grid grid-cols-4 gap-x-8 gap-y-10 lg:grid-cols-8"
          >
            {coreTechLogos.map(([name, logo]) => (
              <li key={name}>
                <FadeIn>
                  <Image
                    src={logo}
                    alt={name}
                    width={24}
                    height={12}
                    className="invert brightness-0"
                    unoptimized
                  />
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>

        {/* Section for Third-Party Integrations */}
        <FadeIn className="mt-12 flex items-center gap-x-8">
          {/* Added top margin mt-16 to create space before second heading */}
          <h2 className="text-center font-display text-sm font-semibold tracking-wider text-white sm:text-left">
            Integrates with:
          </h2>
          <div className="h-px flex-auto bg-neutral-800" />
        </FadeIn>
        <FadeInStagger faster>
          <ul
            role="list"
            className="mt-4 grid grid-cols-4 gap-x-8 gap-y-10 lg:grid-cols-8"
          >
            {integrationLogos.map(([name, logo]) => (
              <li key={name}>
                <FadeIn>
                  <Image
                    src={logo}
                    alt={name}
                    width={24}
                    height={12}
                    className="invert brightness-0"
                    unoptimized
                  />
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>
      </Container>
    </div>
  );
}



function Services() {
  return (
    <>
      <SectionIntro
        eyebrow="Services"
        title="We help accountants identify, explore and respond to new opportunities."
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
        Our platform and services are purpose-built to help accounting firms, independent advisors, and back-office teams manage work and resources centrally.
        </p>
        <p className="mt-4">
        From seamless client onboarding to payroll, compliance, and document workflows—Advontier accelerates service delivery, removes manual bottlenecks, and unlocks new revenue opportunities for firms of all sizes.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-135 flex-none lg:w-180">
              <StylizedImage
                src={imageLaptop}
                sizes="(min-width: 1024px) 41rem, 31rem"
                className="justify-center lg:justify-end"
              />
            </FadeIn>
          </div>
          <List className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-132 lg:pl-4">
            <ListItem title="Web development">
            We build high-impact, scalable web platforms—from marketing sites to secure client portals—designed to meet modern expectations and regulatory requirements.
            </ListItem>
            <ListItem title="Application development">
            Our in-house engineering team combines best-in-class open source technologies and deep regional expertise to deliver robust, cloud-native business applications.
            </ListItem>
            <ListItem title="E-commerce">
            Integrated payment and invoicing workflows streamline how you collect, reconcile, and report—whether billing clients directly or managing complex, multi-party transactions.
            </ListItem>
            <ListItem title="Custom content management">
            Advontier centralizes your knowledge base, client records, and compliance documentation in a secure, permissioned environment. No more siloed data, lost emails, or version chaos.
            </ListItem>
          </List>
        </div>
      </Container>
    </>
  )
}

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

function Discover() {
  return (
    <Section title="Discover" image={{ src: imageWhiteboard }}>
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          We start by understanding your firm’s unique goals, challenges, and regulatory environment.
          Through in-depth discovery workshops and detailed process mapping, we identify opportunities to streamline workflows, enhance compliance, and increase your team’s capacity—without increasing headcount.
        </p>
        <p>
          Our approach is hands-on and collaborative. We work closely with your partners and staff to map out every step of your current processes and highlight both strengths and bottlenecks. 
        </p>
        <p>
          Once discovery is complete, we deliver a comprehensive action plan—prioritized for business impact, technical feasibility, and regulatory confidence.
        </p>
      </div>

      <h3 className="mt-12 font-display text-base font-semibold text-neutral-950">
        Included in this phase
      </h3>
      <TagList className="mt-4">
        <TagListItem>Needs analysis & workflow mapping</TagListItem>
        <TagListItem>Feasibility studies</TagListItem>
        <TagListItem>Stakeholder & employee surveys</TagListItem>
        <TagListItem>Proofs-of-concept</TagListItem>
        <TagListItem>Compliance & risk assessment</TagListItem>
      </TagList>
    </Section>
  )
}

function Build() {
  return (
    <Section title="Build" image={{ src: imageLaptop, shape: 1 }}>
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          With requirements defined, we architect a tailored roadmap and begin iterative development. Each milestone is delivered with transparency, regular updates, and ongoing feedback.
        </p>
        <p>
          Our team leverages open standards, modular design, and best-in-class technologies to build solutions that scale and adapt as your business grows.
        </p>
        <p>
          We believe in partnership, not just delivery—so you’re always in the loop and empowered to make informed decisions throughout the build process.
        </p>
      </div>

      <Blockquote
        author={{ name: 'Debra Fiscal', role: 'CEO of Unseal' }}
        className="mt-12"
      >
        Advontier’s regular progress updates and open communication gave us total confidence throughout implementation.
      </Blockquote>
    </Section>
  )
}

function Deliver() {
  return (
    <Section title="Deliver" image={{ src: imageMeeting, shape: 2 }}>
      <div className="space-y-6 text-base text-neutral-600">
        <p>
          We deploy, test, and optimize your solution for real-world use. Every module is validated for regulatory compliance, security, and seamless integration with your existing systems.
        </p>
        <p>
          Our team provides comprehensive onboarding and live training for your staff, ensuring a smooth transition and rapid adoption.
        </p>
        <p>
          Advontier remains your partner post-launch—with ongoing support, transparent maintenance, and a continuous improvement roadmap designed to help your business stay ahead.
        </p>
      </div>

      <h3 className="mt-12 font-display text-base font-semibold text-neutral-950">
        Included in this phase
      </h3>
      <List className="mt-8">
        <ListItem title="Testing">
          Comprehensive system and user acceptance testing (UAT) to ensure quality and reliability.
        </ListItem>
        <ListItem title="Infrastructure">
          Secure, scalable deployment—leveraging the latest cloud technologies and best practices.
        </ListItem>
        <ListItem title="Support">
          Ongoing technical support and continuous improvement to maximize value and uptime.
        </ListItem>
      </List>
    </Section>
  )
}


function Values() {
  return (
    <div className="relative mt-24 pt-24 sm:mt-32 sm:pt-32 lg:mt-40 lg:pt-40">
      <div className="absolute inset-x-0 top-0 -z-10 h-[884px] overflow-hidden rounded-t-4xl bg-linear-to-b from-neutral-50">
        <GridPattern
          className="absolute inset-0 h-full w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-neutral-100 stroke-neutral-950/5"
          yOffset={-270}
        />
      </div>

      <SectionIntro
        eyebrow="Our values"
        title="Built for trust, driven by innovation"
      >
        <p>
          At Advontier, our values shape every partnership and every line of code. 
          We believe in building tools that empower accounting firms and professionals to excel—through reliability, transparency, and continuous progress.
        </p>
      </SectionIntro>

      <Container className="mt-24">
        <GridList>
          <GridListItem title="Meticulous">
            Every workflow is crafted with attention to detail—from data integrity to regulatory compliance—so you can trust your platform every day.
          </GridListItem>
          <GridListItem title="Efficient">
            We help firms do more with less. Advontier automates routine work and streamlines collaboration, freeing your team to focus on high-value client service.
          </GridListItem>
          <GridListItem title="Adaptable">
            Our platform evolves with your business and the UAE’s regulatory landscape. We quickly respond to changing needs and emerging best practices.
          </GridListItem>
          <GridListItem title="Transparent">
            We communicate openly, provide clear roadmaps, and deliver on promises—ensuring you’re always informed and in control.
          </GridListItem>
          <GridListItem title="Loyal">
            We’re committed to building enduring partnerships. Our team supports your growth from day one, providing guidance, support, and proactive improvements.
          </GridListItem>
          <GridListItem title="Innovative">
            Advontier invests in new technologies and AI to solve real problems for firms in the UAE—helping you stay ahead, securely and confidently.
          </GridListItem>
        </GridList>
      </Container>
    </div>
  )
}


export const metadata: Metadata = {
  description:
    'We are a digital transformation studio working at the intersection of accounting and technology.',
}

export default async function Home() {
  let caseStudies = (await loadCaseStudies()).slice(0, 3)

  return (
    <RootLayout>
      <Container className="mt-20 sm:mt-24 md:mt-32">
        <FadeIn className="max-w-3xl font-display">
          <h1 className="font-display text-xl font-medium tracking-tight text-balance sm:text-7xl">
            Designed for Accountants in the UAE
          </h1>
          <p className="mt-6 text-md text-neutral-600">
          Empowering firms and independents to grow, adapt, and deliver better client outcomes—without the legacy overhead.
          </p>
        </FadeIn>
      </Container>
      <LogoWall />
      <Services />
      <PageIntro eyebrow="Our process" title="How we work">
        <p>
        We turn your requirements into actionable roadmaps and tangible solutions.
        Our team works iteratively—keeping you informed every step of the way—using modular design and open standards to ensure rapid delivery and future-proof architecture.
        </p>
      </PageIntro>

      <div className="mt-24 space-y-24 [counter-reset:section] sm:mt-32 sm:space-y-32 lg:mt-40 lg:space-y-40">
        <Discover />
        <Build />
        <Deliver />
      </div>

      <Values />
      <Testimonial className="mt-24 sm:mt-32 lg:mt-40">
        <TestimonialBody photo={murrayPhoto} alt="Murray Baker – CEO of Kounted" >
          <blockquote className="font-display text-4xl sm:text-3xl md:text-4xl font-medium tracking-tight text-neutral-950">
            <p>
              Partnering with <span className="text-zinc-900">advontier</span><span className="text-blue-500">.</span> has been great for my physical and mental wellbeing.
            </p>
            <p className="mt-4 text-neutral-600 text-base">
              Murray Baker, aspiring Olympic triathlete and CEO of Kounted Accounting and Management Solutions.
            </p>
            <Image src={logoKountedDark} alt="Kounted logo" width={240} height={480} unoptimized className="mt-4" />
          </blockquote>
        </TestimonialBody>
      </Testimonial>      
    </RootLayout>
  )
}
