// lib/validators/excelPayrollImportSchema.ts

import { z } from 'zod'

export const excelPayrollImportSchema = z.object({
  employer_name: z.string().min(1),
  reviewer_email: z.string().email().optional().nullable(),

  employee_name: z.string().min(1),
  email_id: z.string().email().optional().nullable(),
  employee_mol: z.string().optional().nullable(),
  bank_name: z.string().optional().nullable(),
  iban: z.string().optional().nullable(),

  pay_period_from: z.string().nullable(), // Changed from z.coerce.date()
  pay_period_to: z.string().nullable(), // Changed from z.coerce.date()
  leave_without_pay_days: z.number().default(0), // Changed from z.coerce.number()
  currency: z.string().default('AED'),

  basic_salary: z.number().optional().nullable(), // Changed from z.coerce.number()
  housing_allowance: z.number().optional().nullable(),
  education_allowance: z.number().optional().nullable(),
  flight_allowance: z.number().optional().nullable(),
  general_allowance: z.number().optional().nullable(),
  gratuity_eosb: z.number().optional().nullable(),
  other_allowance: z.number().optional().nullable(),
  total_fixed_salary: z.number().optional().nullable(),

  bonus: z.number().optional().nullable(),
  overtime: z.number().optional().nullable(),
  salary_in_arrears: z.number().optional().nullable(),
  expenses_deductions: z.number().optional().nullable(),
  other_reimbursements: z.number().optional().nullable(),
  expense_reimbursements: z.number().optional().nullable(),
  total_variable_salary: z.number().optional().nullable(),

  total_salary: z.number().optional().nullable(),
  wps_fees: z.number().optional().nullable(),
  total_to_transfer: z.number().optional().nullable(),
})

export const EXCEL_PAYROLL_IMPORT_TEMPLATE = [
  'employer_name',
  'reviewer_email',
  'employee_name',
  'email_id',
  'employee_mol',
  'bank_name',
  'iban',
  'pay_period_from',
  'pay_period_to',
  'leave_without_pay_days',
  'currency',
  'basic_salary',
  'housing_allowance',
  'education_allowance',
  'flight_allowance',
  'general_allowance',
  'gratuity_eosb',
  'other_allowance',
  'total_fixed_salary',
  'bonus',
  'overtime',
  'salary_in_arrears',
  'expenses_deductions',
  'other_reimbursements',
  'expense_reimbursements',
  'total_variable_salary',
  'total_salary',
  'wps_fees',
  'total_to_transfer',
]
