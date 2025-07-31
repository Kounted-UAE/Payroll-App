// components/admin/XeroSearchBar.tsx
'use client'

import { Input } from '@/components/ui/input'
import { useCallback } from 'react'

interface XeroSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function XeroSearchBar({ value, onChange }: XeroSearchBarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <div className="w-full sm:max-w-md">
      <Input
        placeholder="Search invoices or quotes..."
        value={value}
        onChange={handleChange}
        className="text-sm"
      />
    </div>
  )
}
