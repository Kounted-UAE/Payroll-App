// lib/validators/payrunCsvSchema.ts

import { z } from 'zod';

export const payrunCsvSchema = z.object({
  payrun_name: z.string(),
  employer_id: z.string(),
  pay_period_start: z.string(),
  pay_period_end: z.string(),
  payment_date: z.string().optional(),
  status: z.string().optional(),
  // Add more fields as needed
});

export const PAYRUN_CSV_TEMPLATE = [
  "payrun_name",
  "employer_id",
  "pay_period_start",
  "pay_period_end",
  "payment_date",
  "status"
];

export const PAYRUN_EXAMPLE_ROW = {
  payrun_name: "January 2024 Payroll",
  employer_id: "UUID-HERE",
  pay_period_start: "2024-01-01",
  pay_period_end: "2024-01-31",
  payment_date: "2024-02-01",
  status: "draft"
}; 