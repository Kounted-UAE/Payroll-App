import { z } from 'zod'

export const employeeCsvSchema = z.object({
  full_name: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  contact_number: z.string().optional(),
  emirates_id: z.string().optional(),
  passport_number: z.string().optional(),
  nationality: z.string().optional(),
  start_date: z.string().optional(),
  employer_id: z.string().optional(),
  iban: z.string().optional(),
  bank_name: z.string().optional(),
  status: z.string().optional(),
  created_at: z.string().optional()
})

export const EMPLOYEE_CSV_TEMPLATE = [
  "full_name",
  "first_name",
  "last_name",
  "email",
  "contact_number",
  "emirates_id",
  "passport_number",
  "nationality",
  "start_date",
  "employer_id",
  "iban",
  "bank_name",
  "status",
  "created_at"
]

export const EMPLOYEE_EXAMPLE_ROW = {
  full_name: "Ali Hussain",
  first_name: "Ali",
  last_name: "Hussain",
  email: "ali.hussain@example.com",
  contact_number: "+971501234567",
  emirates_id: "784-1990-1234567-8",
  passport_number: "A1234567",
  nationality: "UAE",
  start_date: "2023-01-01",
  employer_id: "UUID-HERE",
  iban: "AE070331234567890123456",
  bank_name: "Emirates NBD",
  status: "Active",
  created_at: "2024-01-01T00:00:00Z"
}
