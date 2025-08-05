// hooks/usePayroll.ts
'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/supabase'

type PayrollEmployee = Database['public']['Tables']['payroll_objects_employees']['Row']
type PayrollEmployer = Database['public']['Tables']['payroll_objects_employers']['Row']
type PayrollPayrunRecord = Database['public']['Tables']['payroll_payrun_records']['Row']
// type PayrollPayrunItem = Database['public']['Tables']['payroll_payrun_items']['Row'] // TODO: Table doesn't exist
// type PayrollPayslipRecord = Database['public']['Tables']['payroll_payslip_records']['Row'] // TODO: Table doesn't exist
// type PayrollExpenseClaim = Database['public']['Tables']['payroll_expense_claims']['Row'] // TODO: Table doesn't exist
// type PayrollSalaryStructure = Database['public']['Tables']['payroll_salary_structures']['Row'] // TODO: Table doesn't exist

// Extended types with joined data
type PayrollPayrunRecordWithEmployer = PayrollPayrunRecord & {
  payroll_objects_employers: Pick<PayrollEmployer, 'legal_name'> | null
}

type PayrollEmployeeWithEmployer = PayrollEmployee & {
  payroll_objects_employers: Pick<PayrollEmployer, 'legal_name'> | null
}

// type PayrollSalaryStructureWithEmployee = PayrollSalaryStructure & {
//   payroll_objects_employees: Pick<PayrollEmployee, 'full_name'> & {
//     payroll_objects_employers: Pick<PayrollEmployer, 'legal_name'> | null
//   } | null
// }

// type PayrollExpenseClaimWithEmployee = PayrollExpenseClaim & {
//   payroll_objects_employees: Pick<PayrollEmployee, 'full_name'> & {
//     payroll_objects_employers: Pick<PayrollEmployer, 'legal_name'> | null
//   } | null
// }

// Helper function to get Supabase client
const getClient = () => {
  if (typeof window === 'undefined') {
    return null
  }
  return getSupabaseClient()
}

// Employers Hooks
export function usePayrollEmployers() {
  const [employers, setEmployers] = useState<PayrollEmployer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployers = async () => {
    try {
      setLoading(true)
      const supabase = getClient()
      if (!supabase) return
      
      const { data, error } = await supabase
        .from('payroll_objects_employers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmployers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employers')
    } finally {
      setLoading(false)
    }
  }

  const createEmployer = async (employer: Omit<PayrollEmployer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_objects_employers')
        .insert(employer)
        .select()
        .single()

      if (error) throw error
      setEmployers(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employer')
      throw err
    }
  }

  const updateEmployer = async (id: string, updates: Partial<PayrollEmployer>) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_objects_employers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setEmployers(prev => prev.map(emp => emp.id === id ? data : emp))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employer')
      throw err
    }
  }

  const deleteEmployer = async (id: string) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { error } = await supabase
        .from('payroll_objects_employers')
        .delete()
        .eq('id', id)

      if (error) throw error
      setEmployers(prev => prev.filter(emp => emp.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employer')
      throw err
    }
  }

  useEffect(() => {
    fetchEmployers()
  }, [])

  return {
    employers,
    loading,
    error,
    createEmployer,
    updateEmployer,
    deleteEmployer,
    refetch: fetchEmployers
  }
}

// Employees Hooks
export function usePayrollEmployees(employerId?: string) {
  const [employees, setEmployees] = useState<PayrollEmployeeWithEmployer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const supabase = getClient()
      if (!supabase) return
      
let query = supabase
  .from('payroll_objects_employees')
  .select(`
    *,
    payroll_objects_employers (
      id,
      legal_name
    )
  `)

        .order('created_at', { ascending: false })

      if (employerId) {
        query = query.eq('employer_id', employerId)
      }

      const { data, error } = await query

      if (error) throw error
      setEmployees(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }

  const createEmployee = async (employee: Omit<PayrollEmployee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_objects_employees')
        .insert(employee)
        .select()
        .single()

      if (error) throw error
      // Refetch to get the joined data
      await fetchEmployees()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee')
      throw err
    }
  }

  const updateEmployee = async (id: string, updates: Partial<PayrollEmployee>) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_objects_employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      // Refetch to get the joined data
      await fetchEmployees()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee')
      throw err
    }
  }

  const deleteEmployee = async (id: string) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { error } = await supabase
        .from('payroll_objects_employees')
        .delete()
        .eq('id', id)

      if (error) throw error
      setEmployees(prev => prev.filter(emp => emp.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee')
      throw err
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [employerId])

  return {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees
  }
}

// Payruns Hooks
export function usePayrollPayruns(employerId?: string) {
  const [payruns, setPayruns] = useState<PayrollPayrunRecordWithEmployer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayruns = async () => {
    try {
      setLoading(true)
      const supabase = getClient()
      if (!supabase) return
      
      let query = supabase
        .from('payroll_payrun_records')
        .select(`
          *,
          payroll_objects_employers!inner(legal_name)
        `)
        .order('created_at', { ascending: false })

      if (employerId) {
        query = query.eq('employer_id', employerId)
      }

      const { data, error } = await query

      if (error) throw error
      setPayruns(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payruns')
    } finally {
      setLoading(false)
    }
  }

  const createPayrun = async (payrun: Omit<PayrollPayrunRecord, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_payrun_records')
        .insert(payrun)
        .select()
        .single()

      if (error) throw error
      await fetchPayruns() // Refetch to get the joined data
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payrun')
      throw err
    }
  }

  const updatePayrun = async (id: string, updates: Partial<PayrollPayrunRecord>) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_payrun_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchPayruns() // Refetch to get the joined data
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payrun')
      throw err
    }
  }

  const closePayrun = async (id: string) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_payrun_records')
        .update({
          status: 'locked',
          processed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchPayruns() // Refetch to get the joined data
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close payrun')
      throw err
    }
  }

  useEffect(() => {
    fetchPayruns()
  }, [employerId])

  return {
    payruns,
    loading,
    error,
    createPayrun,
    updatePayrun,
    closePayrun,
    refetch: fetchPayruns
  }
}

// Salary Structures Hooks - TODO: payroll_salary_structures table doesn't exist
// export function usePayrollSalaryStructures(employeeId?: string) {
//   // Function disabled - table doesn't exist in current schema
// }

// Expense Claims Hooks - TODO: payroll_expense_claims table doesn't exist
// export function usePayrollExpenseClaims(employeeId?: string) {
//   // Function disabled - table doesn't exist in current schema
// }

// Payslips Hooks - TODO: payroll_payslip_records table doesn't exist
// export function usePayrollPayslips(payrunId?: string) {
//   // Function disabled - table doesn't exist in current schema
// } 