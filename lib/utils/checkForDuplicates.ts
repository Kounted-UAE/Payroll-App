// lib/utils/checkForDuplicates.ts

export type RowWithIndex<T> = T & { __index: number }

function safeToString(value: unknown): string {
  if (value === null || value === undefined) return ''
  return typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase()
}

export function checkForDuplicates<T extends Record<string, any>>(
  rows: T[],
  existing: T[],
  uniqueKeys: (keyof T)[]
): { duplicates: RowWithIndex<T>[]; unique: T[] } {
  const existingSet = new Set(
    existing.map(item => {
      const signature = uniqueKeys.map(k => {
        const value = item[k]
        // For employee deduplication: if employer_id is empty, exclude it from signature
        if (k === 'employer_id' && (value === null || value === undefined || value === '')) {
          return 'NO_EMPLOYER'
        }
        // For other fields, use normal handling
        if (value === null || value === undefined || value === '') {
          return 'EMPTY'
        }
        return safeToString(value)
      }).join('|')
      return signature
    })
  )

  const duplicates: RowWithIndex<T>[] = []
  const unique: T[] = []

  rows.forEach((row, idx) => {
    const signature = uniqueKeys.map(k => {
      const value = row[k]
      // For employee deduplication: if employer_id is empty, exclude it from signature
      if (k === 'employer_id' && (value === null || value === undefined || value === '')) {
        return 'NO_EMPLOYER'
      }
      // For other fields, use normal handling
      if (value === null || value === undefined || value === '') {
        return 'EMPTY'
      }
      return safeToString(value)
    }).join('|')
    
    if (existingSet.has(signature)) {
      duplicates.push({ ...row, __index: idx + 2 })
    } else {
      unique.push(row)
    }
  })

  return { duplicates, unique }
}
