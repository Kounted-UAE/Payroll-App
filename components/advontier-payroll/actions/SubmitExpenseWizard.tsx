'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload,
  Receipt,
  DollarSign,
  CheckCircle,
  AlertCircle,
  FileText,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface ExpenseRunData {
  employer_id: string;
  run_number: string;
  period_start: string;
  period_end: string;
  selected_employee_ids: string[];
  employee_expenses: { [employeeId: string]: { amount: string; attachments: File[] } };
  confirmation: boolean;
}

const SubmitExpenseWizard = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ExpenseRunData>({
    employer_id: '',
    run_number: '',
    period_start: '',
    period_end: '',
    selected_employee_ids: [],
    employee_expenses: {},
    confirmation: false
  });
  const [employers, setEmployers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch employers on mount
  useEffect(() => {
    async function fetchEmployers() {
      const { data: emps } = await supabase.from('payroll_objects_employers').select('id, legal_name');
      if (emps) setEmployers(emps);
    }
    fetchEmployers();
  }, []);

  // Fetch employees when employer changes
  useEffect(() => {
    async function fetchEmployees() {
      if (!data.employer_id) return;
      const { data: emps } = await supabase
        .from('payroll_objects_employees')
        .select('id, full_name')
        .eq('employer_id', data.employer_id);
      if (emps) setEmployees(emps);
    }
    fetchEmployees();
  }, [data.employer_id]);

  // Generate unique run number when employer or period changes
  useEffect(() => {
    async function generateRunNumber() {
      if (!data.employer_id) return;
      // Example: EXP-2024-0001 (should be replaced with a backend sequence in production)
      const year = new Date().getFullYear();
      const { data: runs } = await supabase
        .from('payroll_expense_runs')
        .select('id')
        .eq('employer_id', data.employer_id)
        .like('run_number', `EXP-${year}-%`);
      const nextSeq = (runs?.length || 0) + 1;
      setData(d => ({ ...d, run_number: `EXP-${year}-${String(nextSeq).padStart(4, '0')}` }));
    }
    generateRunNumber();
  }, [data.employer_id, data.period_start, data.period_end]);

  const steps = [
    { id: 1, title: 'Expense Run Details', description: 'Select employer and period' },
    { id: 2, title: 'Select Employees', description: 'Choose employees for this run' },
    { id: 3, title: 'Enter Expenses', description: 'Enter totals and upload attachments' },
    { id: 4, title: 'Review & Submit', description: 'Final review and submit' }
  ];

  const handleEmployeeSelect = (id: string) => {
    setData(prev => {
      const selected = prev.selected_employee_ids.includes(id)
        ? prev.selected_employee_ids.filter(eid => eid !== id)
        : [...prev.selected_employee_ids, id];
      return { ...prev, selected_employee_ids: selected };
    });
  };

  const handleExpenseChange = (employeeId: string, value: string) => {
    setData(prev => ({
      ...prev,
      employee_expenses: {
        ...prev.employee_expenses,
        [employeeId]: {
          ...(prev.employee_expenses[employeeId] || { amount: '', attachments: [] }),
          amount: value
        }
      }
    }));
  };

  const handleAttachmentChange = (employeeId: string, files: FileList | null) => {
    if (!files) return;
    setData(prev => ({
      ...prev,
      employee_expenses: {
        ...prev.employee_expenses,
        [employeeId]: {
          ...(prev.employee_expenses[employeeId] || { amount: '', attachments: [] }),
          attachments: Array.from(files)
        }
      }
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.employer_id && data.period_start && data.period_end;
      case 2: return data.selected_employee_ids.length > 0;
      case 3: return data.selected_employee_ids.every(id => data.employee_expenses[id]?.amount);
      case 4: return data.confirmation;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit expense run
      // ... (implementation placeholder)
      router.push('/backyard/payroll/expenses');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-lg text-zinc-600 font-bold">Start Expense Run</h1>
          <p className="text-blue-400">
            Process and record employee expenses for a payroll period
          </p>
        </div>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${currentStep >= step.id ? "text-blue-500" : "text-blue-200"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep >= step.id ? "bg-blue-500 text-blue-500-foreground" : "bg-blue-100"}`}>{step.id}</div>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-xs text-blue-200">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-px w-20 mx-4 ${currentStep > step.id ? "bg-blue-500" : "bg-blue-100"}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <Label>Employer *</Label>
              <Select value={data.employer_id} onValueChange={v => setData(d => ({ ...d, employer_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select employer" /></SelectTrigger>
                <SelectContent>
                  {employers.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.legal_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>Expense Run Number</Label>
              <Input value={data.run_number} readOnly />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Period Start *</Label>
                  <Input type="date" value={data.period_start} onChange={e => setData(d => ({ ...d, period_start: e.target.value }))} />
                </div>
                <div>
                  <Label>Period End *</Label>
                  <Input type="date" value={data.period_end} onChange={e => setData(d => ({ ...d, period_end: e.target.value }))} />
                </div>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Label>Select Employees *</Label>
              <div className="grid grid-cols-2 gap-4">
                {employees.map(emp => (
                  <div key={emp.id} className={`border rounded p-2 flex items-center space-x-2 cursor-pointer ${data.selected_employee_ids.includes(emp.id) ? 'bg-blue-500/10 border-blue-500' : 'border-muted'}`}
                    onClick={() => handleEmployeeSelect(emp.id)}>
                    <Checkbox checked={data.selected_employee_ids.includes(emp.id)} />
                    <span>{emp.full_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Label>Enter Expenses & Attachments</Label>
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left">Employee</th>
                    <th className="text-left">Amount (AED)</th>
                    <th className="text-left">Attachments</th>
                  </tr>
                </thead>
                <tbody>
                  {data.selected_employee_ids.map(id => {
                    const emp = employees.find(e => e.id === id);
                    return (
                      <tr key={id}>
                        <td>{emp?.full_name}</td>
                        <td>
                          <Input
                            type="number"
                            value={data.employee_expenses[id]?.amount || ''}
                            onChange={e => handleExpenseChange(id, e.target.value)}
                            placeholder="0.00"
                          />
                        </td>
                        <td>
                          <Input
                            type="file"
                            accept=".pdf,.xls,.xlsx,image/*"
                            multiple
                            onChange={e => handleAttachmentChange(id, e.target.files)}
                          />
                          {data.employee_expenses[id]?.attachments?.length > 0 && (
                            <ul className="mt-1 space-y-1">
                              {data.employee_expenses[id].attachments.map((file, idx) => (
                                <li key={idx}>{file.name}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Label>Review & Submit</Label>
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left">Employee</th>
                    <th className="text-left">Amount (AED)</th>
                    <th className="text-left">Attachments</th>
                  </tr>
                </thead>
                <tbody>
                  {data.selected_employee_ids.map(id => {
                    const emp = employees.find(e => e.id === id);
                    return (
                      <tr key={id}>
                        <td>{emp?.full_name}</td>
                        <td>{data.employee_expenses[id]?.amount || '0.00'}</td>
                        <td>
                          {data.employee_expenses[id]?.attachments?.length > 0
                            ? data.employee_expenses[id].attachments.map((file, idx) => <span key={idx}>{file.name}{idx < data.employee_expenses[id].attachments.length - 1 ? ', ' : ''}</span>)
                            : 'None'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  checked={data.confirmation}
                  onCheckedChange={checked => setData(prev => ({ ...prev, confirmation: checked as boolean }))}
                />
                <Label>I confirm the above expense run details are correct and ready for submission</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>Previous</Button>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-blue-200">Step {currentStep} of {steps.length}</span>
        </div>
        <Button onClick={handleNext} disabled={!canProceed()}>
          {currentStep === 4 ? "Submit Expense Run" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default SubmitExpenseWizard;