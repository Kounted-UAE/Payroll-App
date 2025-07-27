// lib/validators/employerCsvSchema.ts

import { z } from 'zod';

export const employerCsvSchema = z.object({
  legal_name: z.string().min(1),
  trade_license: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  mohre_id: z.string().optional(),
  bank_code: z.string().optional(),
  bank_name: z.string().optional(),
  routing_number: z.string().optional(),
});

export const EMPLOYER_CSV_TEMPLATE = [
  "legal_name",
  "trade_license",
  "address",
  "email",
  "phone",
  "website",
  "mohre_id",
  "bank_code",
  "bank_name",
  "routing_number"
];

export const EMPLOYER_EXAMPLE_ROW = {
  legal_name: "Kounted Accounting Services Ltd",
  trade_license: "123456",
  address: "Dubai, UAE",
  email: "info@kounted.ae",
  phone: "+971501234567",
  website: "https://kounted.ae",
  mohre_id: "MOHRE123",
  bank_code: "EBILAEAD",
  bank_name: "Emirates NBD",
  routing_number: "123456789"
}; 