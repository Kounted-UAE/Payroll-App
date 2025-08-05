// components/admin/XeroTabTableInvoices.tsx
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

interface Invoice {
  id: string
  invoice_number: string | null
  contact_name: string | null
  email_address: string | null
  issue_date: string | null
  due_date: string | null
  currency: string | null
  subtotal: number | null
  tax_amount: number | null
  total: number | null
  status: string | null
  type: string | null
  synced_at: string | null
}

interface XeroTabTableInvoicesProps {
  search: string
}

const columns: (keyof Invoice)[] = [
  'invoice_number',
  'contact_name',
  'issue_date',
  'due_date',
  'currency',
  'total',
  'status',
]

export default function XeroTabTableInvoices({ search }: XeroTabTableInvoicesProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [sortKey, setSortKey] = useState<keyof Invoice>('invoice_number')
  const [sortAsc, setSortAsc] = useState(true)

  const { data } = useQuery<{ invoices: Invoice[] }>({
    queryKey: ['xero_invoices'],
    queryFn: async () => {
      const res = await fetch('/api/xero/invoices')
      return res.json()
    },
  })

  const invoices: Invoice[] = data?.invoices || []

  const filtered = invoices
    .filter((inv) =>
      search.trim() === ''
        ? true
        : (inv.invoice_number || '').toLowerCase().includes(search.toLowerCase()) ||
          (inv.contact_name || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      return sortAsc
        ? String(aVal ?? '').localeCompare(String(bVal ?? ''))
        : String(bVal ?? '').localeCompare(String(aVal ?? ''))
    })

  return (
    <div className="border rounded-md overflow-x-auto bg-zinc-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={Object.keys(selected).length === filtered.length}
                onCheckedChange={(v) => {
                  const all = v ? Object.fromEntries(filtered.map((r) => [r.id, true])) : {}
                  setSelected(all)
                }}
              />
            </TableHead>
            {columns.map((key) => (
              <TableHead
                key={key}
                onClick={() => {
                  if (sortKey === key) setSortAsc(!sortAsc)
                  else {
                    setSortKey(key)
                    setSortAsc(true)
                  }
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1 capitalize">
                  {key.replace(/_/g, ' ')} <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>
                <Checkbox
                  checked={!!selected[inv.id]}
                  onCheckedChange={(v) =>
                    setSelected((prev) => ({ ...prev, [inv.id]: !!v }))
                  }
                />
              </TableCell>
              <TableCell>{inv.invoice_number}</TableCell>
              <TableCell>{inv.contact_name}</TableCell>
              <TableCell>{inv.issue_date}</TableCell>
              <TableCell>{inv.due_date}</TableCell>
              <TableCell>{inv.currency}</TableCell>
              <TableCell>{inv.total?.toFixed(2)}</TableCell>
              <TableCell>{inv.status}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
