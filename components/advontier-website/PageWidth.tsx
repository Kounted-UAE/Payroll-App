import clsx from 'clsx'

type PageWidthProps = {
  children: React.ReactNode
  className?: string
}

export function PageWidth({ children, className }: PageWidthProps) {
  return (
    <div className={clsx('mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}
