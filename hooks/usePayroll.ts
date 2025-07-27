// hooks/usePayroll.ts
'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/types/supabase'

type PayrollEmployee = Database['public']['Tables']['payroll_objects_employees']['Row']
type PayrollEmployer = Database['public']['Tables']['payroll_objects_employers']['Row']
type PayrollPayrunRecord = Database['public']['Tables']['payroll_payrun_records']['Row']
type PayrollPayrunItem = Database['public']['Tables']['payroll_payrun_items']['Row']
type PayrollPayslipRecord = Database['public']['Tables']['payroll_payslip_records']['Row']
type PayrollExpenseClaim = Database['public']['Tables']['payroll_expense_claims']['Row']
type PayrollSalaryStructure = Database['public']['Tables']['payroll_salary_structures']['Row']

// Extended types with joined data
type PayrollPayrunRecordWithEmployer = PayrollPayrunRecord & {
  payroll_objects_employers: Pick<PayrollEmployer, 'legal_name'> | null
}

type PayrollEmployeeWithEmployer = PayrollEmployee & {
  payroll_objects_employers: Pick<PayrollEmployer, 'legal_name'> | null
}

type PayrollSalaryStructureWithEmployee = PayrollSalaryStructure & {
  payroll_objects_employees: Pick<PayrollEmployee, 'full_name'> & {
    payroll_objects_employers: Pick<PayrollEmployer, 'legal_name'> | null
  } | null
}

type PayrollExpenseClaimWithEmployee = PayrollExpenseClaim & {
  payroll_objects_employees: Pick<PayrollEmployee, 'full_name'> & {
    payroll_objects_employers: Pick<PayrollEmployer, 'legal_name'> | null
  } | null
}

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
          payroll_objects_employers!inner(legal_name)
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

// Salary Structures Hooks
export function usePayrollSalaryStructures(employeeId?: string) {
  const [salaryStructures, setSalaryStructures] = useState<PayrollSalaryStructureWithEmployee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSalaryStructures = async () => {
    try {
      setLoading(true)
      const supabase = getClient()
      if (!supabase) return
      
      let query = supabase
        .from('payroll_salary_structures')
        .select(`
          *,
          payroll_objects_employees!inner(
            full_name,
            payroll_objects_employers!inner(legal_name)
          )
        `)
        .order('created_at', { ascending: false })

      if (employeeId) {
        query = query.eq('employee_id', employeeId)
      }

      const { data, error } = await query

      if (error) throw error
      setSalaryStructures(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch salary structures')
    } finally {
      setLoading(false)
    }
  }

  const createSalaryStructure = async (structure: Omit<PayrollSalaryStructure, 'id' | 'created_at'>) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_salary_structures')
        .insert(structure)
        .select()
        .single()

      if (error) throw error
      await fetchSalaryStructures() // Refetch to get the joined data
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create salary structure')
      throw err
    }
  }

  const updateSalaryStructure = async (id: string, updates: Partial<PayrollSalaryStructure>) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_salary_structures')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchSalaryStructures() // Refetch to get the joined data
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update salary structure')
      throw err
    }
  }

  const deleteSalaryStructure = async (id: string) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { error } = await supabase
        .from('payroll_salary_structures')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSalaryStructures(prev => prev.filter(structure => structure.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete salary structure')
      throw err
    }
  }

  useEffect(() => {
    fetchSalaryStructures()
  }, [employeeId])

  return {
    salaryStructures,
    loading,
    error,
    createSalaryStructure,
    updateSalaryStructure,
    deleteSalaryStructure,
    refetch: fetchSalaryStructures
  }
}

// Expense Claims Hooks
export function usePayrollExpenseClaims(employeeId?: string) {
  const [expenseClaims, setExpenseClaims] = useState<PayrollExpenseClaimWithEmployee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenseClaims = async () => {
    try {
      setLoading(true)
      const supabase = getClient()
      if (!supabase) return
      
      let query = supabase
        .from('payroll_expense_claims')
        .select(`
          *,
          payroll_objects_employees!inner(
            full_name,
            payroll_objects_employers!inner(legal_name)
          )
        `)
        .order('created_at', { ascending: false })

      if (employeeId) {
        query = query.eq('employee_id', employeeId)
      }

      const { data, error } = await query

      if (error) throw error
      setExpenseClaims(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expense claims')
    } finally {
      setLoading(false)
    }
  }

  const createExpenseClaim = async (claim: Omit<PayrollExpenseClaim, 'id' | 'created_at'>) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_expense_claims')
        .insert(claim)
        .select()
        .single()

      if (error) throw error
      await fetchExpenseClaims() // Refetch to get the joined data
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense claim')
      throw err
    }
  }

  const approveExpenseClaim = async (id: string, approverId: string) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_expense_claims')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: approverId
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchExpenseClaims() // Refetch to get the joined data
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve expense claim')
      throw err
    }
  }

  const rejectExpenseClaim = async (id: string, approverId: string) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_expense_claims')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejected_by: approverId
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchExpenseClaims() // Refetch to get the joined data
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject expense claim')
      throw err
    }
  }

  const deleteExpenseClaim = async (id: string) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { error } = await supabase
        .from('payroll_expense_claims')
        .delete()
        .eq('id', id)

      if (error) throw error
      setExpenseClaims(prev => prev.filter(claim => claim.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense claim')
      throw err
    }
  }

  useEffect(() => {
    fetchExpenseClaims()
  }, [employeeId])

  return {
    expenseClaims,
    loading,
    error,
    createExpenseClaim,
    approveExpenseClaim,
    rejectExpenseClaim,
    deleteExpenseClaim,
    refetch: fetchExpenseClaims
  }
}

// Payslips Hooks
export function usePayrollPayslips(payrunId?: string) {
  const [payslips, setPayslips] = useState<PayrollPayslipRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayslips = async () => {
    try {
      setLoading(true)
      const supabase = getClient()
      if (!supabase) return
      
      let query = supabase
        .from('payroll_payslip_records')
        .select('*')
        .order('created_at', { ascending: false })

      if (payrunId) {
        query = query.eq('payrun_id', payrunId)
      }

      const { data, error } = await query

      if (error) throw error
      setPayslips(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payslips')
    } finally {
      setLoading(false)
    }
  }

  const generatePayslip = async (employeeId: string, payrunItemId: string) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_payslip_records')
        .insert({
          employee_id: employeeId,
          payrun_item_id: payrunItemId,
          email_sent: false
        })
        .select()
        .single()

      if (error) throw error
      await fetchPayslips() // Refetch to get the updated data
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate payslip')
      throw err
    }
  }

  const sendPayslipEmail = async (id: string) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { data, error } = await supabase
        .from('payroll_payslip_records')
        .update({
          email_sent: true,
          email_sent_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchPayslips() // Refetch to get the updated data
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send payslip email')
      throw err
    }
  }

  const deletePayslip = async (id: string) => {
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase client not available')
      
      const { error } = await supabase
        .from('payroll_payslip_records')
        .delete()
        .eq('id', id)

      if (error) throw error
      setPayslips(prev => prev.filter(payslip => payslip.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete payslip')
      throw err
    }
  }

  useEffect(() => {
    fetchPayslips()
  }, [payrunId])

  return {
    payslips,
    loading,
    error,
    generatePayslip,
    sendPayslipEmail,
    deletePayslip,
    refetch: fetchPayslips
  }
}

// Stats Hook
export function usePayrollStats() {
  const [stats, setStats] = useState({
    totalEmployers: 0,
    totalEmployees: 0,
    activePayruns: 0,
    monthlyPayroll: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const supabase = getClient()
      if (!supabase) return
      
      // Fetch counts
      const [employersResult, employeesResult, payrunsResult] = await Promise.all([
        supabase.from('payroll_objects_employers').select('*', { count: 'exact', head: true }),
        supabase.from('payroll_objects_employees').select('*', { count: 'exact', head: true }),
        supabase.from('payroll_payrun_records').select('*', { count: 'exact', head: true }).eq('status', 'draft')
      ])

      if (employersResult.error) throw employersResult.error
      if (employeesResult.error) throw employeesResult.error
      if (payrunsResult.error) throw payrunsResult.error

      // Calculate monthly payroll (simplified - you might want to calculate this differently)
      const { data: salaryStructures } = await supabase
        .from('payroll_salary_structures')
        .select('base_salary, fixed_allowances, variable_allowances')

      const monthlyPayroll = salaryStructures?.reduce((total, structure) => {
        const base = structure.base_salary || 0
        
        // Parse fixed allowances from JSON
        const fixedAllowances = structure.fixed_allowances as Record<string, number> || {}
        const fixedTotal = Object.values(fixedAllowances).reduce((sum, amount) => sum + (amount || 0), 0)
        
        // Parse variable allowances from JSON
        const variableAllowances = structure.variable_allowances as Record<string, number> || {}
        const variableTotal = Object.values(variableAllowances).reduce((sum, amount) => sum + (amount || 0), 0)
        
        return total + base + fixedTotal + variableTotal
      }, 0) || 0

      setStats({
        totalEmployers: employersResult.count || 0,
        totalEmployees: employeesResult.count || 0,
        activePayruns: payrunsResult.count || 0,
        monthlyPayroll
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
} 