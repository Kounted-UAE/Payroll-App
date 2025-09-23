import Link from 'next/link'
import clsx from 'clsx'

type ButtonProps = {
  invert?: boolean
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
)

export function Button({
  invert = false,
  className,
  children,
  ...props
}: ButtonProps) {
  className = clsx(
    className,
    'inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition',
    invert
      ? 'bg-gradient-to-br from-white to-neutral-200 text-neutral-950 hover:from-neutral-100 hover:to-neutral-300'
      : 'bg-gradient-to-br from-zinc-500 to-zinc-400 text-white hover:from-zinc-600 hover:to-zinc-700',
  )

  let inner = <span className="relative top-px">{children}</span>

  if (typeof props.href === 'undefined') {
    return (
      <button className={className} {...(props as any)}>
        {inner}
      </button>
    )
  }

  return (
    <Link className={className} {...(props as any)}>
      {inner}
    </Link>
  )
}
