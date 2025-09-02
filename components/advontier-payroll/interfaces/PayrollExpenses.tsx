
'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Receipt, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  DollarSign,
  Building,
  Users
} from "lucide-react"
import Link from "next/link"
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  return createClient(supabaseUrl, supabaseKey)
}

const PayrollExpenses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expenseRuns, setExpenseRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpenseRuns() {
      setLoading(true);
      // Fetch expense runs with employer info
      const supabase = createSupabaseClient()
      const { data: runs, error } = await supabase
        .from('payroll_expense_runs')
        .select('*, payroll_objects_employers(legal_name)')
        .order('created_at', { ascending: false });
      if (!error && runs) setExpenseRuns(runs);
      setLoading(false);
    }
    fetchExpenseRuns();
  }, []);

  const filteredRuns = expenseRuns.filter(run => {
    const employer = run.payroll_objects_employers?.legal_name || '';
    return (
      run.run_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-lg text-zinc-600 font-bold">Expense Runs</h1>
          <p className="text-blue-400">
            Manage and process employee expense runs for payroll
          </p>
        </div>
        <Link href="/advontier/payroll/expenses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Start Expense Run
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
              <Input
                placeholder="Search by run number or employer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Runs List */}
      <div className="grid gap-6">
        {loading && <div>Loading...</div>}
        {!loading && filteredRuns.map(run => (
          <Card key={run.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xs">{run.run_number}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-1">
                    <span>{run.payroll_objects_employers?.legal_name}</span>
                    <span>•</span>
                    <span>Period: {run.period_start} to {run.period_end}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{run.status || 'Draft'}</Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-xs text-blue-200 uppercase tracking-wide">
                    Run Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-200">Run Number:</span>
                      <span className="text-xs font-bold text-primary">{run.run_number}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-200">Employer:</span>
                      <span className="text-xs font-medium">{run.payroll_objects_employers?.legal_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-200">Period:</span>
                      <span className="text-xs font-medium">{run.period_start} to {run.period_end}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-xs text-blue-200 uppercase tracking-wide">
                    Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-200">Status:</span>
                      <Badge variant="outline">{run.status || 'Draft'}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && filteredRuns.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Receipt className="h-12 w-12 text-blue-200 mx-auto mb-4" />
            <h3 className="text-xs font-semibold mb-2">No expense runs found</h3>
            <p className="text-blue-200 mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by starting your first expense run"}
            </p>
            <Link href="/advontier/payroll/expenses/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Start First Expense Run
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PayrollExpenses;
