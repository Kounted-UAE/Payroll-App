// lib/validators/tempPayrunSchema.ts

import { z } from 'zod'

export const tempPayrunSchema = z.object({
  employer_id: z.string().uuid().nullable(),
  employee_id: z.string().uuid().nullable(),
  payrun_code: z.string().min(1, 'Payrun code is required'),
  temp_payrun_date: z.string().date().optional().nullable(), // Accept ISO or nullable
  temp_paytype_name: z.string().min(1, 'Paytype name is required'),
  temp_paytype_group: z.string().optional().nullable(),
  amount: z.coerce.number().min(0, 'Amount must be at least 0'),
  currency: z.string().min(1).default('AED'),
  row_number: z.coerce.number().optional().nullable(),
  source_file_name: z.string().optional().nullable(),
  source_file_hash: z.string().optional().nullable(),
  created_by: z.string().uuid().optional().nullable(),
  created_at: z.string().optional().nullable()
})

export const TEMP_PAYRUN_TEMPLATE_HEADERS = [
  'employer_id',
  'employee_id',
  'payrun_code',
  'temp_payrun_date',
  'temp_paytype_name',
  'temp_paytype_group',
  'amount',
  'currency',
  'row_number',
  'source_file_name',
  'source_file_hash',
  'created_by',
  'created_at'
]

export const TEMP_PAYRUN_EXAMPLE_ROW = {
  employer_id: '00000000-0000-0000-0000-000000000000',
  employee_id: '00000000-0000-0000-0000-000000000000',
  payrun_code: 'PR-0031',
  temp_payrun_date: '2024-09-30',
  temp_paytype_name: 'Housing Allowance',
  temp_paytype_group: 'Allowances',
  amount: 2000.00,
  currency: 'AED',
  row_number: 42,
  source_file_name: 'august-payroll.csv',
  source_file_hash: 'abc123hashvalue',
  created_by: null,
  created_at: '2024-09-30T12:00:00Z'
}
