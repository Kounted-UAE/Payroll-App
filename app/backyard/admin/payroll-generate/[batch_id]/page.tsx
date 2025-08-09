// app/backyard/admin/payroll-generate/[batch_id]/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { PayslipWizard } from '@/components/advontier-payroll/interfaces/PayslipWizard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface BatchData {
  batch_id: string
  employer_name: string
  pay_period_from: string
  pay_period_to: string
  total_employees: number
  total_salary: number
  currency: string
}

export default function PayslipGenerationPage() {
  const params = useParams()
  const router = useRouter()
  const [batchData, setBatchData] = useState<BatchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const batchId = params.batch_id as string

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const supabase = getSupabaseClient()
        
        // Fetch all rows for this batch
        const { data: rows, error: fetchError } = await supabase
          .from('payroll_ingest_excelpayrollimport')
          .select('*')
          .eq('batch_id', batchId)

        if (fetchError) {
          throw fetchError
        }

        if (!rows || rows.length === 0) {
          throw new Error('No data found for this batch')
        }

        // Aggregate batch data
        const firstRow = rows[0]
        const batchData: BatchData = {
          batch_id: batchId,
          employer_name: firstRow.employer_name || 'Unknown Employer',
          pay_period_from: firstRow.pay_period_from || '',
          pay_period_to: firstRow.pay_period_to || '',
          total_employees: rows.length,
          total_salary: rows.reduce((sum, row) => sum + (row.net_salary || 0), 0),
          currency: firstRow.currency || 'AED'
        }

        setBatchData(batchData)
      } catch (err) {
        console.error('Error fetching batch data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load batch data')
        toast({
          title: 'Error',
          description: 'Failed to load batch data',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (batchId) {
      fetchBatchData()
    }
  }, [batchId])

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading batch data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !batchData) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-lg text-zinc-600 font-bold">Payslip Generation</h1>
            <p className="text-blue-400">
              Generate payslips from imported payroll data
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/backyard/admin/temp-excelpayrun-import')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batches
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || 'Batch not found'}</p>
              <Button onClick={() => router.push('/backyard/admin/temp-excelpayrun-import')}>
                Return to Batches
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-lg text-zinc-600 font-bold">Generate Payslips</h1>
          <p className="text-blue-400">
            Create and distribute employee payslips from batch: {batchId}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/backyard/admin/temp-excelpayrun-import')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Batches
        </Button>
      </div>

      <PayslipWizard batchData={batchData} />
    </div>
  )
}
