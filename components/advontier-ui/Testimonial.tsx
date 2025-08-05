import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/advontier-ui/Container'
import { FadeIn } from '@/components/advontier-ui/FadeIn'
import { GridPattern } from '@/components/advontier-ui/GridPattern'

export function TestimonialBody({ photo, alt, children }) {
  return (
    <div className="flex items-start gap-10 md:gap-14">
      <div className="flex-shrink-0">
        <Image
          src={photo}
          alt={alt}
          width={360}
          height={360}
          className="rounded-full shadow-md object-cover border-2 border-white"
          unoptimized
          priority
        />
      </div>
      <div className="flex flex-col justify-center w-full">{children}</div>
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
        'relative isolate py-16 sm:py-28 md:py-32',
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
          <figure className="relative mx-auto max-w-4xl rounded-xl z-10">
            <div className="w-full">{children}</div>
          </figure>
        </FadeIn>
      </Container>
    </div>
  )
}

