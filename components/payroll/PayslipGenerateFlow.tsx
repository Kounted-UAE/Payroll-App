'use client'

import { useState } from 'react'
import { Button } from '@/components/react-ui/button'
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
  const [progress, setProgress] = useState<{ current: number; total: number; status: string } | null>(null)
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({ success: 0, failed: 0, errors: [] })

  const handleGenerate = async () => {
    const batchIds = rows.filter(r => selected.has(r.batch_id)).map(r => r.batch_id)
    if (batchIds.length === 0) return
    
    setIsLoading(true)
    setProgress({ current: 0, total: batchIds.length, status: 'Starting generation...' })
    setResults({ success: 0, failed: 0, errors: [] })
    
    try {
      // Split into chunks of 50 to avoid header size limits
      const CHUNK_SIZE = 50
      const chunks: string[][] = []
      for (let i = 0; i < batchIds.length; i += CHUNK_SIZE) {
        chunks.push(batchIds.slice(i, i + CHUNK_SIZE))
      }
      
      console.log(`Processing ${batchIds.length} payslips in ${chunks.length} chunks`)
      
      let totalSuccess = 0
      let totalFailed = 0
      const allErrors: string[] = []
      let processedCount = 0
      
      // Process chunks sequentially to avoid overwhelming the server
      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex]
        
        setProgress({ 
          current: processedCount, 
          total: batchIds.length, 
          status: `Processing chunk ${chunkIndex + 1} of ${chunks.length}...` 
        })
        
        try {
          const res = await fetch('/api/admin/payslips/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ batchIds: chunk }),
          })
          
          if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`Chunk ${chunkIndex + 1} failed: ${errorText}`)
          }
          
          const json = await res.json()
          const successes = (json.results || []).filter((r: any) => r.ok)
          const failures = (json.results || []).filter((r: any) => !r.ok)
          
          totalSuccess += successes.length
          totalFailed += failures.length
          processedCount += chunk.length
          
          // Collect error messages
          failures.forEach((r: any) => {
            allErrors.push(`${r.batch_id.substring(0, 8)}...: ${r.message || 'Unknown error'}`)
          })
          
          setProgress({ 
            current: processedCount, 
            total: batchIds.length, 
            status: `Processed ${processedCount} of ${batchIds.length}...` 
          })
          
          // Update results after each chunk
          setResults({
            success: totalSuccess,
            failed: totalFailed,
            errors: allErrors
          })
          
        } catch (chunkError: any) {
          console.error(`Error processing chunk ${chunkIndex + 1}:`, chunkError)
          allErrors.push(`Chunk ${chunkIndex + 1}: ${chunkError.message}`)
          totalFailed += chunk.length
          processedCount += chunk.length
        }
      }
      
      setProgress({ current: batchIds.length, total: batchIds.length, status: 'Complete!' })
      
      setResults({
        success: totalSuccess,
        failed: totalFailed,
        errors: allErrors
      })
      
      toast({ 
        title: 'Generation complete', 
        description: `${totalSuccess} succeeded, ${totalFailed} failed`,
        variant: totalFailed > 0 ? 'destructive' : 'default',
        duration: 10000
      })
      
      if (totalFailed === 0) {
        setTimeout(() => onDone(), 2000)
      }
    } catch (e: any) {
      setProgress(null)
      toast({ title: 'Generation failed', description: e.message, variant: 'destructive' })
      setResults({ success: 0, failed: batchIds.length, errors: [e.message] })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-cyan-600 text-sm">Generate payslips for <strong>{selected.size}</strong> selected employees.</p>
      
      <div className="flex gap-2">
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating…
            </>
          ) : (
            'Generate Now'
          )}
        </Button>
        <Button variant="ghost" onClick={onBack} disabled={isLoading}>Back</Button>
      </div>

      {/* Progress indicator */}
      {progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">
              {progress.status}
            </span>
            <span className="text-sm text-blue-700">
              {progress.current} / {progress.total}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-blue-600">
            This may take several minutes for large batches. Please keep this page open.
          </p>
        </div>
      )}

      {/* Results summary */}
      {(results.success > 0 || results.failed > 0) && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {results.success > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="text-2xl font-bold text-green-700">{results.success}</div>
                <div className="text-xs text-green-600">Successfully Generated</div>
              </div>
            )}
            {results.failed > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="text-2xl font-bold text-red-700">{results.failed}</div>
                <div className="text-xs text-red-600">Failed</div>
              </div>
            )}
          </div>

          {/* Error log */}
          {results.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm font-semibold text-red-900 mb-2">Errors:</p>
              <div className="text-xs text-red-800 space-y-1 max-h-40 overflow-y-auto">
                {results.errors.map((err, idx) => (
                  <div key={idx} className="font-mono">{err}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


