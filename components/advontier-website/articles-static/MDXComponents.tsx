// components/advontier-website/MDXComponents.tsx

import clsx from 'clsx'

import { Blockquote } from '@/components/advontier-website/Blockquote'
import { Border } from '@/components/advontier-website/Border'
import { GrayscaleTransitionImage } from '@/components/advontier-website/GrayscaleTransitionImage'
import { StatList, StatListItem } from '@/components/advontier-website/StatList'
import { TagList, TagListItem } from '@/components/advontier-website/TagList'

// Helper function to generate slug from text
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const MDXComponents = {
  h1: function H1({
    className,
    children,
    searchParams,
    params,
    ...props
  }: React.ComponentPropsWithoutRef<'h1'> & { searchParams?: any; params?: any }) {
    const slug = typeof children === 'string' ? generateSlug(children) : ''
    return (
      <h1
        id={slug}
        className={clsx('font-display text-4xl font-bold tracking-tight text-neutral-950 [text-wrap:balance]', className)}
        {...props}
      >
        {children}
      </h1>
    )
  },
  h2: function H2({
    className,
    children,
    searchParams,
    params,
    ...props
  }: React.ComponentPropsWithoutRef<'h2'> & { searchParams?: any; params?: any }) {
    const slug = typeof children === 'string' ? generateSlug(children) : ''
    return (
      <h2
        id={slug}
        className={clsx('font-display text-2xl font-bold tracking-tight text-neutral-950 [text-wrap:balance]', className)}
        {...props}
      >
        {children}
      </h2>
    )
  },
  Blockquote({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof Blockquote>) {
    return <Blockquote className={clsx('my-32', className)} {...props} />
  },
  img: function Img({
    className,
    searchParams,
    params,
    ...props
  }: React.ComponentPropsWithoutRef<typeof GrayscaleTransitionImage> & { searchParams?: any; params?: any }) {
    return (
      <div
        className={clsx(
          'group isolate my-10 overflow-hidden rounded-4xl bg-neutral-100 max-sm:-mx-6',
          className,
        )}
      >
        <GrayscaleTransitionImage
          {...props}
          sizes="(min-width: 768px) 42rem, 100vw"
          className="aspect-16/10 w-full object-cover"
        />
      </div>
    )
  },
  StatList({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof StatList>) {
    return (
      <StatList className={clsx('my-32 max-w-none!', className)} {...props} />
    )
  },
  StatListItem,
  table: function Table({
    className,
    searchParams,
    params,
    ...props
  }: React.ComponentPropsWithoutRef<'table'> & { searchParams?: any; params?: any }) {
    return (
      <div
        className={clsx(
          'my-10 max-sm:-mx-6 max-sm:flex max-sm:overflow-x-auto',
          className,
        )}
      >
        <div className="max-sm:min-w-full max-sm:flex-none max-sm:px-6">
          <table {...props} />
        </div>
      </div>
    )
  },
  TagList({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<typeof TagList>) {
    return <TagList className={clsx('my-6', className)} {...props} />
  },
  TagListItem,
  TopTip({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) {
    return (
      <Border position="left" className={clsx('my-10 pl-8', className)}>
        <p className="font-display text-sm font-bold tracking-widest text-neutral-950 uppercase">
          Top tip
        </p>
        <div className="mt-4">{children}</div>
      </Border>
    )
  },
  Typography({ className, searchParams, params, ...props }: React.ComponentPropsWithoutRef<'div'> & { searchParams?: any; params?: any }) {
    return <div className={clsx('typography', className)} {...props} />
  },
  wrapper({ className, searchParams, params, ...props }: React.ComponentPropsWithoutRef<'div'> & { searchParams?: any; params?: any }) {
    return (
      <div
        className={clsx(
          '*:mx-auto *:max-w-3xl [&>:first-child]:mt-0! [&>:last-child]:mb-0!',
          className,
        )}
        {...props}
      />
    )
  },
}
