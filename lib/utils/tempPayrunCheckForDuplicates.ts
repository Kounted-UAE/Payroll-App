// lib/utils/tempPayrunCheckForDuplicates.ts
export type TempPayrunRow = Record<string, any>
export type RowWithIndex<T> = T & { __index: number }

function safeToString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase();
}

export function checkForTempPayrunDuplicates<T extends TempPayrunRow>(
  rows: T[],
  existing: T[],
  uniqueKeys: (keyof T)[]
): { duplicates: RowWithIndex<T>[]; unique: T[] } {
  const existingSet = new Set(
    existing.map(item =>
      uniqueKeys.map(k => safeToString(item[k])).join('|')
    )
  );

  const duplicates: RowWithIndex<T>[] = [];
  const unique: T[] = [];

  rows.forEach((row, idx) => {
    const signature = uniqueKeys.map(k => safeToString(row[k])).join('|');
    if (existingSet.has(signature)) {
      duplicates.push({ ...row, __index: idx + 2 });
    } else {
      unique.push(row);
    }
  });

  return { duplicates, unique };
}

