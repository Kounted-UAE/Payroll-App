// lib/validators/employeeCsvSchema.ts

import { z } from 'zod';

export const employeeCsvSchema = z.object({
  full_name: z.string(),
  emirates_id: z.string().optional(),
  passport_number: z.string().optional(),
  start_date: z.string(),
  job_title: z.string().optional(),
  employer_id: z.string().optional(), // or transform by name
});

export const EMPLOYEE_CSV_TEMPLATE = [
  "full_name",
  "emirates_id",
  "passport_number",
  "start_date",
  "job_title",
  "employer_id"
];

export const EMPLOYEE_EXAMPLE_ROW = {
  full_name: "Ali Hussain",
  emirates_id: "784-1990-1234567-8",
  passport_number: "A1234567",
  start_date: "2023-01-01",
  job_title: "Accountant",
  employer_id: "UUID-HERE"
}; 