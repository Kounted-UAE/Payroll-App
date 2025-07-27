// components/backyard/DashboardKPICards.tsx

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
  stats: KPI[]
  variant?: 'icon' | 'bordered'
}

export default function DashboardKPICards({ stats, variant = 'bordered' }: Props) {
  const isIcon = variant === 'icon'

  return (
    <div className="px-6 py-0">
      <h3 className="text-xs font-semibold text-muted-foreground mb-4">Year-to-date: 2025 vs 2024 (For illustration purposes only)</h3>
      <dl
        className={clsx(
          'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3',
          !isIcon && 'divide-y divide-border overflow-hidden rounded-lg bg-white shadow-sm md:divide-x md:divide-y-0'
        )}
      >
        {stats.map((item) => (
          <div
            key={item.kpi_id}
            className={clsx(
              'relative rounded-lg bg-white px-4 pt-5 pb-8 shadow-sm sm:px-6 sm:pt-6',
              !isIcon && 'px-4 py-5 sm:p-6 rounded-none shadow-none bg-transparent'
            )}
          >
            <dt>
              {isIcon && item.icon && (
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <item.icon aria-hidden="true" className="size-6 text-white" />
                </div>
              )}
              <p
                className={clsx(
                  'ml-16 truncate text-xs font-medium',
                  isIcon ? 'text-gray-500' : 'text-muted-foreground'
                )}
              >
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-xs font-semibold text-foreground">{item.stat}</p>
              {item.previousStat && (
                <p className="ml-2 text-xs font-medium text-muted-foreground">
                  from {item.previousStat}
                </p>
              )}
              <p
                className={clsx(
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                  'ml-2 flex items-baseline text-xs font-semibold'
                )}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon aria-hidden="true" className="size-5 shrink-0 self-center text-green-500" />
                ) : (
                  <ArrowDownIcon aria-hidden="true" className="size-5 shrink-0 self-center text-red-500" />
                )}
                <span className="sr-only">
                  {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                </span>
                {item.change}
              </p>
              {isIcon && (
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-xs">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
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
