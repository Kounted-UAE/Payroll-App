// lib/types/supabase.ts
// This file should be generated using the extract-supabase-types.ts script
// For now, providing a basic type definition to fix compilation errors

export type Database = {
  public: {
    Tables: {
      payroll_objects_employers: {
        Row: any
        Insert: any
        Update: any
      }
      payroll_objects_employees: {
        Row: any
        Insert: any
        Update: any
      }
      payroll_payrun_records: {
        Row: any
        Insert: any
        Update: any
      }
      public_user_profiles: {
        Row: any
        Insert: any
        Update: any
      }
      public_user_roles: {
        Row: any
        Insert: any
        Update: any
      }
      [key: string]: any
    }
    Views: {
      [key: string]: any
    }
    Functions: {
      [key: string]: any
    }
    Enums: {
      [key: string]: any
    }
  }
}
