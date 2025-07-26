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

const supabase = getSupabaseClient()

// Employers Hooks
export function usePayrollEmployers() {
  const [employers, setEmployers] = useState<PayrollEmployer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployers = async () => {
    try {
      setLoading(true)
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
      const { data, error } = await supabase
        .from('payroll_payrun_records')
        .insert(payrun)
        .select()
        .single()

      if (error) throw error
      // Refetch to get the joined data
      await fetchPayruns()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payrun')
      throw err
    }
  }

  const updatePayrun = async (id: string, updates: Partial<PayrollPayrunRecord>) => {
    try {
      const { data, error } = await supabase
        .from('payroll_payrun_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      // Refetch to get the joined data
      await fetchPayruns()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payrun')
      throw err
    }
  }

  const closePayrun = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('payroll_payrun_records')
        .update({ 
          status: 'closed',
          processed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      // Refetch to get the joined data
      await fetchPayruns()
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
  const [salaryStructures, setSalaryStructures] = useState<PayrollSalaryStructure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSalaryStructures = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('payroll_salary_structures')
        .select(`
          *,
          payroll_objects_employees!inner(full_name, payroll_objects_employers!inner(legal_name))
        `)
        .order('effective_from', { ascending: false })

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
      const { data, error } = await supabase
        .from('payroll_salary_structures')
        .insert(structure)
        .select()
        .single()

      if (error) throw error
      setSalaryStructures(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create salary structure')
      throw err
    }
  }

  const updateSalaryStructure = async (id: string, updates: Partial<PayrollSalaryStructure>) => {
    try {
      const { data, error } = await supabase
        .from('payroll_salary_structures')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setSalaryStructures(prev => prev.map(s => s.id === id ? data : s))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update salary structure')
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
    refetch: fetchSalaryStructures
  }
}

// Expense Claims Hooks
export function usePayrollExpenseClaims(employeeId?: string) {
  const [expenseClaims, setExpenseClaims] = useState<PayrollExpenseClaim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenseClaims = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('payroll_expense_claims')
        .select(`
          *,
          payroll_objects_employees!inner(full_name, payroll_objects_employers!inner(legal_name))
        `)
        .order('claim_date', { ascending: false })

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
      const { data, error } = await supabase
        .from('payroll_expense_claims')
        .insert(claim)
        .select()
        .single()

      if (error) throw error
      setExpenseClaims(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense claim')
      throw err
    }
  }

  const approveExpenseClaim = async (id: string, approverId: string) => {
    try {
      const { data, error } = await supabase
        .from('payroll_expense_claims')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          approver_id: approverId
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setExpenseClaims(prev => prev.map(c => c.id === id ? data : c))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve expense claim')
      throw err
    }
  }

  const rejectExpenseClaim = async (id: string, approverId: string) => {
    try {
      const { data, error } = await supabase
        .from('payroll_expense_claims')
        .update({ 
          status: 'rejected',
          approved_at: new Date().toISOString(),
          approver_id: approverId
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setExpenseClaims(prev => prev.map(c => c.id === id ? data : c))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject expense claim')
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
      let query = supabase
        .from('payroll_payslip_records')
        .select(`
          *,
          payroll_objects_employees!inner(full_name, payroll_objects_employers!inner(legal_name)),
          payroll_payrun_items!inner(payroll_payrun_records!inner(payrun_name))
        `)
        .order('created_at', { ascending: false })

      if (payrunId) {
        query = query.eq('payroll_payrun_items.payrun_id', payrunId)
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
      setPayslips(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate payslip')
      throw err
    }
  }

  const sendPayslipEmail = async (id: string) => {
    try {
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
      setPayslips(prev => prev.map(p => p.id === id ? data : p))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send payslip email')
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
    refetch: fetchPayslips
  }
}

// Payroll Dashboard Stats Hook
export function usePayrollStats() {
  const [stats, setStats] = useState({
    totalEmployers: 0,
    totalEmployees: 0,
    activePayruns: 0,
    pendingExpenses: 0,
    monthlyPayroll: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Get counts
      const [employersCount, employeesCount, payrunsCount, expensesCount] = await Promise.all([
        supabase.from('payroll_objects_employers').select('*', { count: 'exact', head: true }),
        supabase.from('payroll_objects_employees').select('*', { count: 'exact', head: true }),
        supabase.from('payroll_payrun_records').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('payroll_expense_claims').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ])

      // Calculate monthly payroll (sum of all payrun items for current month)
      const currentMonth = new Date().toISOString().slice(0, 7)
      const { data: payrunItems } = await supabase
        .from('payroll_payrun_items')
        .select('gross_pay')
        .gte('created_at', `${currentMonth}-01`)
        .lt('created_at', `${currentMonth}-32`)

      const monthlyPayroll = payrunItems?.reduce((sum, item) => sum + (item.gross_pay || 0), 0) || 0

      setStats({
        totalEmployers: employersCount.count || 0,
        totalEmployees: employeesCount.count || 0,
        activePayruns: payrunsCount.count || 0,
        pendingExpenses: expensesCount.count || 0,
        monthlyPayroll
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payroll stats')
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