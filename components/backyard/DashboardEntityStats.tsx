// components/backyard/DashboardEntityStats.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, BuildingOffice2Icon, BriefcaseIcon, CurrencyDollarIcon, DocumentDuplicateIcon } from "@heroicons/react/24/solid"

const iconsMap: Record<string, React.ElementType> = {
  Customers: UsersIcon,
  Individuals: BriefcaseIcon,
  Companies: BuildingOffice2Icon,
  Employers: UsersIcon,
  Employees: UsersIcon,
  Visas: DocumentDuplicateIcon,
  Licenses: DocumentDuplicateIcon,
  Retainers: CurrencyDollarIcon,
  Tax: CurrencyDollarIcon,
}

type Metric = {
  label: string
  count: number | string
  description?: string
  icon?: React.ElementType
  link?: string
}

type Props = {
  metrics: Metric[]
}

export default function DashboardEntityStats({ metrics }: Props) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground mb-4">Year-to-date: 2025 vs 2024 (For illustration purposes only)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
             
      {metrics.map((metric) => {
        const Icon = metric.icon || iconsMap[metric.label.split(' ')[0]] || UsersIcon
        return (
          <Card key={metric.label} className="relative overflow-hidden rounded-lg bg-white px-2 pt-2 pb-12 shadow-sm sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-brand-green p-2">
                <Icon className="h-3 w-3 text-white" aria-hidden="true" />
              </div>
              <p className="ml-12 truncate text-sm font-medium text-muted-foreground">
                {metric.label}
              </p>
            </dt>
            <dd className="ml-12 flex flex-col">
              <div className="text-2xl font-bold text-foreground">{metric.count}</div>
              {metric.description && (
                <div className="text-xs text-muted-foreground mt-1 mb-2">
                  {metric.description}
                </div>
              )}
            </dd>
            {metric.link && (
              <div className="absolute inset-x-0 bottom-0 bg-green-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href={metric.link} className="font-medium text-brand-green hover:text-brand-dark">
                    View all<span className="sr-only"> {metric.label}</span>
                  </a>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
    </div>
  )
}
