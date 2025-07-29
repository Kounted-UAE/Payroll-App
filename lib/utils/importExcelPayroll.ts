import { getSupabaseClient } from '@/lib/supabase/client'
import { excelPayrollImportSchema } from '@/lib/validators/excelPayrollImportSchema'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from '@/lib/types/supabase'

type PayrollImportRow = Database['public']['Tables']['payroll_ingest_excelpayrollimport']['Insert']

export async function importExcelPayroll(parsedRows: unknown[], employerId: string) {
  const supabase = getSupabaseClient()
  const batchId = uuidv4()
  const validatedRows: Record<string, any>[] = []

  for (let i = 0; i < parsedRows.length; i++) {
    const row = parsedRows[i]
    const parsed = excelPayrollImportSchema.safeParse(row)

    if (!parsed.success) {
      const formattedErrors = parsed.error.flatten().fieldErrors
      const errorMessages = Object.entries(formattedErrors)
        .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
        .join('; ')
      console.error(`Row ${i + 1} validation failed: ${errorMessages}`)
      throw new Error(`Row ${i + 1} failed validation: ${errorMessages}`)
    }

    validatedRows.push({
      ...parsed.data,
      batch_id: batchId,
      employer_id: employerId,
    })
  }

  console.log('Attempting to insert payroll batch:', {
    batchId,
    employerId,
    rowCount: validatedRows.length,
    sampleRow: validatedRows[0]
  })
  
  const { error, data } = await supabase
    .from('payroll_ingest_excelpayrollimport')
    .insert(validatedRows)
    .select()
  
  if (error) {
    console.error('Error inserting payroll batch:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: JSON.stringify(error, null, 2)
    })
    throw new Error(`Failed to insert payroll batch: ${error.message || 'Unknown database error'}`)
  }
  
  console.log('Successfully inserted batch:', {
    batchId,
    insertedRows: data?.length,
    ids: data?.map((r: any) => r.id)
  })
  
  return batchId
}
