// hooks/usePayrollDashboardStats.ts
'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

interface TrendData {
  change: number
  percentage: number
  description: string
  isPositive: boolean
}

interface DashboardStats {
  totalEmployers: {
    count: number
    trend: TrendData
  }
  totalEmployees: {
    count: number
    trend: TrendData
  }
  monthlyPayroll: {
    amount: number
    trend: TrendData
  }
  activePayruns: {
    count: number
    trend: TrendData
  }
}

// Helper function to get Supabase client
const getClient = () => {
  if (typeof window === 'undefined') {
    return null
  }
  return getSupabaseClient()
}

// Helper function to get start and end of current month
const getCurrentMonthRange = () => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  return {
    start: startOfMonth.toISOString(),
    end: endOfMonth.toISOString()
  }
}

// Helper function to get start and end of previous month
const getPreviousMonthRange = () => {
  const now = new Date()
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
  
  return {
    start: startOfPrevMonth.toISOString(),
    end: endOfPrevMonth.toISOString()
  }
}

// Helper function to calculate trend data
const calculateTrend = (currentCount: number, previousCount: number, type: 'count' | 'amount' = 'count'): TrendData => {
  if (previousCount === 0) {
    return {
      change: currentCount,
      percentage: currentCount > 0 ? 100 : 0,
      description: currentCount > 0 ? `+${currentCount} this month` : 'No change',
      isPositive: currentCount >= 0
    }
  }

  const change = currentCount - previousCount
  const percentage = (change / previousCount) * 100
  const isPositive = change >= 0

  const formatChange = type === 'amount' 
    ? `AED ${Math.abs(change).toLocaleString()}`
    : Math.abs(change).toString()

  const description = change === 0 
    ? 'No change this month'
    : `${isPositive ? '+' : '-'}${formatChange} vs last month ${isPositive ? `(+${percentage.toFixed(1)}%)` : `(${percentage.toFixed(1)}%)`}`

  return {
    change,
    percentage,
    description,
    isPositive
  }
}

export function usePayrollDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployers: {
      count: 0,
      trend: { change: 0, percentage: 0, description: 'Loading...', isPositive: true }
    },
    totalEmployees: {
      count: 0,
      trend: { change: 0, percentage: 0, description: 'Loading...', isPositive: true }
    },
    monthlyPayroll: {
      amount: 0,
      trend: { change: 0, percentage: 0, description: 'Loading...', isPositive: true }
    },
    activePayruns: {
      count: 0,
      trend: { change: 0, percentage: 0, description: 'Loading...', isPositive: true }
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const supabase = getClient()
      if (!supabase) return

      const currentMonth = getCurrentMonthRange()
      const previousMonth = getPreviousMonthRange()

      // Get total counts (all time)
      const [employersResult, employeesResult, payrunsResult] = await Promise.all([
        supabase.from('payroll_objects_employers').select('*', { count: 'exact', head: true }),
        supabase.from('payroll_objects_employees').select('*', { count: 'exact', head: true }),
        supabase.from('payroll_payrun_records').select('*', { count: 'exact', head: true }).eq('status', 'draft')
      ])

      if (employersResult.error) throw employersResult.error
      if (employeesResult.error) throw employeesResult.error
      if (payrunsResult.error) throw payrunsResult.error

      // Get historical counts for trend calculation
      const [
        currentMonthEmployers,
        previousMonthEmployers,
        currentMonthEmployees,
        previousMonthEmployees
      ] = await Promise.all([
        // Current month employers
        supabase
          .from('payroll_objects_employers')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', currentMonth.start)
          .lte('created_at', currentMonth.end),
        
        // Previous month employers
        supabase
          .from('payroll_objects_employers')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', previousMonth.start)
          .lte('created_at', previousMonth.end),
        
        // Current month employees
        supabase
          .from('payroll_objects_employees')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', currentMonth.start)
          .lte('created_at', currentMonth.end),
        
        // Previous month employees
        supabase
          .from('payroll_objects_employees')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', previousMonth.start)
          .lte('created_at', previousMonth.end)
      ])

      // Calculate monthly payroll (simplified - using current active salary structures)
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

      // Calculate trends
      const employersTrend = calculateTrend(
        currentMonthEmployers.count || 0,
        previousMonthEmployers.count || 0
      )

      const employeesTrend = calculateTrend(
        currentMonthEmployees.count || 0,
        previousMonthEmployees.count || 0
      )

      // For now, use placeholder trends for payroll and payruns as requested
      const payrollTrend = {
        change: 0,
        percentage: 0,
        description: 'Trend calculation pending',
        isPositive: true
      }

      const payrunsTrend = {
        change: 0,
        percentage: 0,
        description: 'Due this week',
        isPositive: true
      }

      setStats({
        totalEmployers: {
          count: employersResult.count || 0,
          trend: employersTrend
        },
        totalEmployees: {
          count: employeesResult.count || 0,
          trend: employeesTrend
        },
        monthlyPayroll: {
          amount: monthlyPayroll,
          trend: payrollTrend
        },
        activePayruns: {
          count: payrunsResult.count || 0,
          trend: payrunsTrend
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
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