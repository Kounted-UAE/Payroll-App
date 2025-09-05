'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import type { PayslipRow } from './PayslipFiltersAndTable'

interface Props {
  rows: PayslipRow[]
  selected: Set<string>
  onBack: () => void
  onDone: () => void
}

export default function PayslipGenerateFlow({ rows, selected, onBack, onDone }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const handleGenerate = async () => {
    const batchIds = rows.filter(r => selected.has(r.batch_id)).map(r => r.batch_id)
    if (batchIds.length === 0) return
    setIsLoading(true)
    setLog([])
    try {
      const res = await fetch('/api/admin/payslips/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchIds }),
      })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      const successes = (json.results || []).filter((r: any) => r.ok).length
      const failures = (json.results || []).filter((r: any) => !r.ok)
      setLog((json.results || []).map((r: any) => `${r.batch_id}: ${r.ok ? 'OK' : 'FAIL ' + (r.message || '')}`))
      toast({ title: 'Generation complete', description: `${successes} succeeded, ${failures.length} failed` })
      onDone()
    } catch (e: any) {
      toast({ title: 'Generation failed', description: e.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-cyan-600 text-sm">Generate payslips for <strong>{selected.size}</strong> selected employees.</p>
      <div className="flex gap-2">
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating…' : 'Generate Now'}
        </Button>
        <Button variant="ghost" onClick={onBack} disabled={isLoading}>Back</Button>
      </div>
      {log.length > 0 && (
        <div className="text-xs bg-slate-50 text-slate-700 p-3 rounded border">
          {log.map((l, i) => (<div key={i}>{l}</div>))}
        </div>
      )}
    </div>
  )
}


