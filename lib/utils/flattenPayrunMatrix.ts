// lib/utils/flattenPayrunMatrix.ts


export type FlattenedPayrunRow = {
    employer_id: string
    employee_id: string
    temp_paytype_name: string
    payrun_code: string
    temp_payrun_date: string
    amount: number
    currency: string
    row_number: number
  }
  
  export function flattenPayrunMatrix(
    rawRows: Record<string, any>[],
    sourceFileName?: string
  ): FlattenedPayrunRow[] {
    const flattened: FlattenedPayrunRow[] = []
  
    const payrunColumns = Object.keys(rawRows[0] || {}).filter(col =>
      /^PR-\d+\s*\(.+\)$/.test(col)
    )
  
    for (let i = 0; i < rawRows.length; i++) {
      const base = rawRows[i]
      const { Employer, Employee, ['Paytype Item']: PaytypeItem } = base
  
      if (!Employer || !Employee || !PaytypeItem) continue
  
      for (const col of payrunColumns) {
        const amount = parseFloat(base[col])
        if (!amount || isNaN(amount)) continue
  
        const match = col.match(/^PR-(\d+)\s*\(([^)]+)\)$/)
        if (!match) continue
  
        const [, code, dateStr] = match
        const dateParsed = new Date(dateStr)
        const payrunDate = isNaN(dateParsed.getTime()) ? null : dateParsed.toISOString().split('T')[0]
  
        flattened.push({
          employer_id: Employer,
          employee_id: Employee,
          temp_paytype_name: PaytypeItem.trim(),
          payrun_code: `PR-${code}`,
          temp_payrun_date: payrunDate || null,
          amount,
          currency: 'AED',
          row_number: i + 2 // matches CSV visual row
        })
      }
    }
  
    return flattened
  }
  