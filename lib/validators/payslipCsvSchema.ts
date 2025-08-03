import { z } from 'zod'

export const payslipCsvSchema = z.object({
  employee_name: z.string(),
  employer: z.string(),
  pay_period: z.string(),
  gross_salary: z.number(),
  net_salary: z.number(),
  status: z.string(),
  language: z.string(),
})

export const PAYSLIP_CSV_TEMPLATE = [
  "employee_name",
  "employer",
  "pay_period",
  "gross_salary",
  "net_salary",
  "status",
  "language"
]

export const PAYSLIP_EXAMPLE_ROW = {
  employee_name: "Ali Hussain",
  employer: "Advontier Accounting",
  pay_period: "January 2024",
  gross_salary: 20000,
  net_salary: 18250,
  status: "Generated",
  language: "English"
}
