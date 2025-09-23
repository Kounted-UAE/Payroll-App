// components/kounted/DashboardKPICards.tsx

import {
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/20/solid'
import { clsx } from 'clsx'

export interface KPI {
  kpi_id: number
  name: string
  stat: string
  previousStat?: string
  change: string
  changeType: 'increase' | 'decrease'
  icon?: React.ElementType
}

interface Props {
  kpis: KPI[]
  variant?: 'icon' | 'bordered'
}

export default function DashboardKPICards({ kpis, variant = 'bordered' }: Props) {
  const isIcon = variant === 'icon'

  return (
    <div className="px-6 py-0">
      <h3 className="text-xs font-semibold text-zinc-400 mb-4">Year-to-date: 2025 vs 2024 (For illustration purposes only)</h3>
      <dl
        className={clsx(
          'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3',
          !isIcon && 'divide-y divide-border overflow-hidden rounded-lg bg-card shadow-sm md:divide-x md:divide-y-0'
        )}
      >
        {kpis.map((item) => (
          <div
            key={item.kpi_id}
            className={clsx(
              'relative rounded-lg bg-card px-4 pt-5 pb-8 shadow-sm sm:px-6 sm:pt-6',
              !isIcon && 'px-4 py-5 sm:p-6 rounded-none shadow-none bg-transparent'
            )}
          >
            <dt>
              {isIcon && item.icon && (
                <div className="absolute rounded-md bg-primary p-3">
                  <item.icon aria-hidden="true" className="size-6 text-primary-foreground" />
                </div>
              )}
              <p
                className={clsx(
                  'ml-16 truncate text-xs font-medium',
                  isIcon ? 'text-zinc-400' : 'text-zinc-400'
                )}
              >
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-xs font-semibold text-foreground">{item.stat}</p>
              {item.previousStat && (
                <p className="ml-2 text-xs font-medium text-zinc-400">
                  from {item.previousStat}
                </p>
              )}
              <p
                className={clsx(
                  item.changeType === 'increase' ? 'text-primary' : 'text-destructive',
                  'ml-2 flex items-baseline text-xs font-semibold'
                )}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon aria-hidden="true" className="size-5 shrink-0 self-center text-primary" />
                ) : (
                  <ArrowDownIcon aria-hidden="true" className="size-5 shrink-0 self-center text-destructive" />
                )}
                <span className="sr-only">
                  {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                </span>
                {item.change}
              </p>
              {isIcon && (
                <div className="absolute inset-x-0 bottom-0 bg-zinc-100 px-4 py-4 sm:px-6">
                  <div className="text-xs">
                    <a href="#" className="font-medium text-primary hover:text-primary/80">
                      View all<span className="sr-only"> {item.name} stats</span>
                    </a>
                  </div>
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
