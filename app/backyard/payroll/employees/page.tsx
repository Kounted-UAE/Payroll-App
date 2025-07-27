'use client'
import PayrollEmployees from '@/components/dashboard-apps/PayrollEmployees';
import { BulkImportExportDialog } from '@/components/bulk/BulkImportExportDialog';
import { employeeCsvSchema, EMPLOYEE_CSV_TEMPLATE, EMPLOYEE_EXAMPLE_ROW } from '@/lib/validators/employeeCsvSchema';
import { useState } from 'react';

export default function EmployeesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <div className="flex justify-end mb-4">
        <BulkImportExportDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          objectName="Employee"
          tableName="payroll_objects_employees"
          schema={employeeCsvSchema}
          templateHeaders={EMPLOYEE_CSV_TEMPLATE}
          exampleRow={EMPLOYEE_EXAMPLE_ROW}
        />
        <button className="btn btn-outline" onClick={() => setDialogOpen(true)}>
          Bulk Import/Export
        </button>
      </div>
      <PayrollEmployees />
    </>
  );
} 