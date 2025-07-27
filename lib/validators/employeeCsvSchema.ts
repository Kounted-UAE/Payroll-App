//lib/validators/employeeCsvSchema.ts
// CSV Schema for Employee Import
// This schema defines the structure of the CSV file for importing employees.
// It includes all the fields required for payroll processing and employee management.


import { z } from 'zod';

export const employeeCsvSchema = z.object({
  full_name: z.string().optional(), // Will be constructed in transform
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  emirates_id: z.string().optional(),
  passport_number: z.string().optional(),
  nationality: z.string().optional(),
  job_title: z.string().optional(),
  start_date: z.string().optional(), // Will be converted in transform - REQUIRED by DB
  contract_type: z.string().optional(),
  employer_id: z.string().optional(),
  bank_name: z.string().optional(),
  routing_code: z.string().optional(),
  account_number: z.string().optional(),
  iban: z.string().optional(),
  base_salary: z.coerce.number().optional(),
  housing_allowance: z.coerce.number().optional(),
  transport_allowance: z.coerce.number().optional(),
  food_allowance: z.coerce.number().optional(),
  currency: z.string().optional(),
  status: z.string().optional(),
  created_at: z.string().optional()
});



export const EMPLOYEE_CSV_TEMPLATE = [
  "full_name",
  "first_name",
  "last_name",
  "email",
  "emirates_id",
  "passport_number",
  "nationality",
  "job_title",
  "start_date",
  "contract_type",
  "employer_id",
  "bank_name",
  "routing_code",
  "account_number",
  "iban",
  "base_salary",
  "housing_allowance",
  "transport_allowance",
  "food_allowance",
  "currency",
  "status",
  "created_at"
];

export const EMPLOYEE_EXAMPLE_ROW = {
  full_name: "Ali Hussain",
  first_name: "Ali",
  last_name: "Hussain",
  email: "ali.hussain@example.com",
  emirates_id: "784-1990-1234567-8",
  passport_number: "A1234567",
  nationality: "UAE",
  job_title: "Accountant",
  start_date: "2023-01-01",
  contract_type: "Full-Time",
  employer_id: "UUID-HERE",
  bank_name: "Emirates NBD",
  routing_code: "EBILAEAD",
  account_number: "1234567890",
  iban: "AE070331234567890123456",
  base_salary: 12000,
  housing_allowance: 3000,
  transport_allowance: 1000,
  food_allowance: 500,
  currency: "AED",
  status: "Active",
  created_at: "2024-01-01T00:00:00Z"
};
