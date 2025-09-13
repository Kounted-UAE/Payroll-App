import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/advontier-website/Container'
import { FadeIn } from '@/components/advontier-website/FadeIn'
import { GridPattern } from '@/components/advontier-website/GridPattern'

export function TestimonialBody({ photo, alt, children, size = 200 }: { photo: string; alt: string; children: React.ReactNode; size?: number }) {
  return (
    <div className="flex items-start gap-8 md:gap-12">
      <div className="flex-shrink-0">
        <Image
          src={photo}
          alt={alt}
          width={size}
          height={size}
          className="rounded-full grayscale shadow-md object-cover border-2 border-white"
          unoptimized
          priority
        />
      </div>
      <div className="flex flex-col justify-center w-full p-2">{children}</div>
    </div>
  );
}

export function Testimonial({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={clsx(
        'relative isolate',
        className,
      )}
    >
      {/* Background grid: z-0 */}
      <GridPattern
        className="absolute inset-0 h-full w-full z-0 mask-[linear-gradient(to_top_right,white_30%,transparent_70%)] fill-neutral-100 stroke-neutral-950/10"
        yOffset={-270}
      />
      <Container>
        <FadeIn>
          {/* Content: z-10 */}
          <figure className="relative mx-auto max-w-4xl z-10">
            <div className="w-full">{children}</div>
          </figure>
        </FadeIn>
      </Container>
    </div>
  )
}

