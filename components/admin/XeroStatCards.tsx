// components/admin/XeroStatCards.tsx

'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'

export default function XeroStatCards() {
  const { data } = useQuery({
    queryKey: ['xero_stats'],
    queryFn: async () => {
      const res = await fetch('/api/xero/stats', { credentials: 'include' })
      return res.json()
    },
  })

  const stats = [
    {
      label: 'Connected Clients',
      value: data?.connected_clients ?? '—',
      description: data?.connected_clients_delta
        ? `+${data.connected_clients_delta} this week`
        : '',
    },
    {
      label: 'Total Invoices',
      value: data?.total_invoices ?? '—',
      description: data?.invoice_delta
        ? `+${data.invoice_delta} synced`
        : '',
    },
    {
      label: 'Last Connected',
      value: data?.last_connected
        ? formatDistanceToNow(new Date(data.last_connected), { addSuffix: true })
        : '—',
      description: 'OAuth connection status',
    },
    {
      label: 'Last Sync',
      value: data?.last_synced
        ? formatDistanceToNow(new Date(data.last_synced), { addSuffix: true })
        : '—',
      description: 'Invoices and quotes updated',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-green-600 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
