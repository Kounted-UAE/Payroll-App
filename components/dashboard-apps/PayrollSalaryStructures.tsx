
'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  History,
  Lock,
  Calendar,
  Building,
  Users
} from "lucide-react"
import Link from "next/link"
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const PayrollSalaryStructures = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [salaryStructures, setSalaryStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStructures() {
      setLoading(true);
      // Fetch salary structures and their items with pay types
      const { data: structures, error } = await supabase
        .from('payroll_salary_structures')
        .select(`*, payroll_salary_structure_items(*, payroll_pay_types(*)), payroll_objects_employees(full_name, job_title, employer_id), payroll_objects_employers(legal_name)`);
      if (!error && structures) setSalaryStructures(structures);
      setLoading(false);
    }
    fetchStructures();
  }, []);

  const filteredStructures = salaryStructures.filter(structure => {
    const employeeName = structure.payroll_objects_employees?.full_name || '';
    const jobTitle = structure.payroll_objects_employees?.job_title || '';
    const employer = structure.payroll_objects_employers?.legal_name || '';
    return (
      employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default"
      case "Expired": return "destructive"
      case "Pending": return "secondary"
      default: return "secondary"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Salary Structures</h1>
          <p className="text-muted-foreground">
            Manage employee salary components and allowances
          </p>
        </div>
        <Link href="/payroll/salary-structures/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Salary Structure
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee, job title, or employer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              Filter by Employer
            </Button>
            <Button variant="outline">
              Filter by Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Salary Structures List */}
      <div className="grid gap-6">
        {loading && <div>Loading...</div>}
        {!loading && filteredStructures.map((structure) => {
          const employee = structure.payroll_objects_employees;
          const employer = structure.payroll_objects_employers;
          const items = structure.payroll_salary_structure_items || [];
          const baseSalary = structure.base_salary || 0;
          const currency = structure.currency || 'AED';
          const allowances = items.filter(i => i.payroll_pay_types?.type === 'allowance');
          const deductions = items.filter(i => i.payroll_pay_types?.type === 'deduction');
          const totalAllowances = allowances.reduce((sum, i) => sum + (i.amount || 0), 0);
          const totalDeductions = deductions.reduce((sum, i) => sum + (i.amount || 0), 0);
          const grossSalary = baseSalary + totalAllowances;
          const netSalary = grossSalary - totalDeductions;
          return (
            <Card key={structure.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xs">{employee?.full_name}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-1">
                      <span>{employee?.job_title}</span>
                      <span>•</span>
                      <span>{employer?.legal_name}</span>
                      <span>•</span>
                      <span>Effective: {structure.effective_from}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(structure.status)}>
                      {structure.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Base Compensation
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Base Salary:</span>
                        <span className="text-xs font-bold text-blue-600">{currency} {baseSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Currency:</span>
                        <Badge variant="outline">{currency}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Allowances
                    </h4>
                    <div className="space-y-2">
                      {allowances.map(i => (
                        <div className="flex items-center justify-between" key={i.id}>
                          <span className="text-xs text-muted-foreground">{i.payroll_pay_types?.label}:</span>
                          <span className="text-xs font-medium">{currency} {i.amount?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Deductions
                    </h4>
                    <div className="space-y-2">
                      {deductions.map(i => (
                        <div className="flex items-center justify-between" key={i.id}>
                          <span className="text-xs text-muted-foreground">{i.payroll_pay_types?.label}:</span>
                          <span className="text-xs font-medium">{currency} {i.amount?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Total Allowances:</span>
                        <span className="text-xs font-medium text-primary">{currency} {totalAllowances.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Total Deductions:</span>
                        <span className="text-xs font-medium text-primary">{currency} {totalDeductions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Gross Salary:</span>
                        <span className="text-xs font-bold text-primary">{currency} {grossSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Net Salary:</span>
                        <span className="text-xs font-bold text-primary">{currency} {netSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">EOSB Policy:</span>
                        <span className="text-xs font-medium">{structure.eosb_accrual}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!loading && filteredStructures.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xs font-semibold mb-2">No salary structures found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first salary structure"}
            </p>
            <Link href="/payroll/salary-structures/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create First Structure
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PayrollSalaryStructures
