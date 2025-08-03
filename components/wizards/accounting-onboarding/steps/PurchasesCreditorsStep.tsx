import React from 'react';
import FormSection from '@/components/forms/FormSection';
import { TextField, SelectField, TextareaField, RadioField, CheckboxField } from '@/components/forms/FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

const SUPPLIER_TYPES = [
  'Raw Materials', 'Finished Goods', 'Services', 'Utilities', 'Professional Services', 'Other'
];

export default function PurchasesCreditorsStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection title="Supplier Management">
        <div className="space-y-3">
          <h4 className="font-medium">Primary Supplier Types (check all that apply)</h4>
          {SUPPLIER_TYPES.map(type => (
            <CheckboxField
              key={type}
              label={type}
              name={`supplier-${type}`}
              checked={data.supplierTypes?.includes(type)}
              onChange={(_, checked) => {
                const current = data.supplierTypes || [];
                if (checked) {
                  onChange({ ...data, supplierTypes: [...current, type] });
                } else {
                  onChange({ ...data, supplierTypes: current.filter((s: string) => s !== type) });
                }
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Number of Active Suppliers"
            name="numberOfSuppliers"
            value={data.numberOfSuppliers}
            onChange={updateField}
            placeholder="50"
          />
          <TextField
            label="Largest Supplier (% of purchases)"
            name="largestSupplierPercentage"
            value={data.largestSupplierPercentage}
            onChange={updateField}
            placeholder="30%"
          />
        </div>

        <TextareaField
          label="Supplier Selection Criteria"
          name="supplierSelection"
          value={data.supplierSelection}
          onChange={updateField}
          placeholder="How are suppliers selected and evaluated?"
          rows={3}
        />

        <RadioField
          label="Supplier Onboarding Process"
          name="supplierOnboarding"
          value={data.supplierOnboarding}
          onChange={updateField}
          options={[
            { value: 'formal', label: 'Formal process with documentation' },
            { value: 'basic', label: 'Basic verification' },
            { value: 'informal', label: 'Informal process' }
          ]}
        />
      </FormSection>

      <FormSection title="Purchase Workflow">
        <RadioField
          label="Purchase Order System"
          name="purchaseOrderSystem"
          value={data.purchaseOrderSystem}
          onChange={updateField}
          options={[
            { value: 'electronic', label: 'Electronic PO system' },
            { value: 'manual', label: 'Manual/paper-based' },
            { value: 'hybrid', label: 'Combination of both' }
          ]}
        />

        <RadioField
          label="Purchase Approval Levels"
          name="purchaseApproval"
          value={data.purchaseApproval}
          onChange={updateField}
          options={[
            { value: 'single', label: 'Single approval' },
            { value: 'dual', label: 'Dual approval' },
            { value: 'tiered', label: 'Tiered by amount' }
          ]}
        />

        <div className="grid grid-cols-3 gap-4">
          <TextField
            label="Level 1 Approval Limit (AED)"
            name="level1ApprovalLimit"
            value={data.level1ApprovalLimit}
            onChange={updateField}
            placeholder="5000"
          />
          <TextField
            label="Level 2 Approval Limit (AED)"
            name="level2ApprovalLimit"
            value={data.level2ApprovalLimit}
            onChange={updateField}
            placeholder="25000"
          />
          <TextField
            label="Board Approval Required (AED)"
            name="boardApprovalLimit"
            value={data.boardApprovalLimit}
            onChange={updateField}
            placeholder="100000"
          />
        </div>

        <TextareaField
          label="Purchase Workflow Description"
          name="purchaseWorkflow"
          value={data.purchaseWorkflow}
          onChange={updateField}
          placeholder="Describe the complete purchase process from requisition to payment"
          rows={4}
        />
      </FormSection>

      <FormSection title="Invoice Processing & Three-Way Matching">
        <RadioField
          label="Three-Way Matching"
          name="threeWayMatching"
          value={data.threeWayMatching}
          onChange={updateField}
          options={[
            { value: 'always', label: 'Always required (PO, Receipt, Invoice)' },
            { value: 'above-threshold', label: 'Required above threshold' },
            { value: 'selective', label: 'Selective matching' },
            { value: 'never', label: 'Not implemented' }
          ]}
        />

        {data.threeWayMatching === 'above-threshold' && (
          <TextField
            label="Three-Way Matching Threshold (AED)"
            name="matchingThreshold"
            value={data.matchingThreshold}
            onChange={updateField}
            placeholder="1000"
          />
        )}

        <RadioField
          label="Invoice Receipt Method"
          name="invoiceReceiptMethod"
          value={data.invoiceReceiptMethod}
          onChange={updateField}
          options={[
            { value: 'electronic', label: 'Electronic (email/portal)' },
            { value: 'paper', label: 'Paper-based' },
            { value: 'mixed', label: 'Mixed methods' }
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Invoice Processing Time (days)"
            name="invoiceProcessingTime"
            value={data.invoiceProcessingTime}
            onChange={updateField}
            placeholder="5"
          />
          <SelectField
            label="Invoice Approval Workflow"
            name="invoiceApprovalWorkflow"
            value={data.invoiceApprovalWorkflow}
            onChange={updateField}
            options={['Single approval', 'Dual approval', 'Department head approval']}
          />
        </div>
      </FormSection>

      <FormSection title="Payment Process">
        <RadioField
          label="Primary Payment Method"
          name="primaryPaymentMethod"
          value={data.primaryPaymentMethod}
          onChange={updateField}
          options={[
            { value: 'eft', label: 'Electronic Fund Transfer (EFT)' },
            { value: 'cheque', label: 'Cheque' },
            { value: 'cash', label: 'Cash' },
            { value: 'mixed', label: 'Mixed methods' }
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Standard Payment Terms"
            name="standardPaymentTerms"
            value={data.standardPaymentTerms}
            onChange={updateField}
            placeholder="Net 30"
          />
          <TextField
            label="Average Payment Period (days)"
            name="averagePaymentPeriod"
            value={data.averagePaymentPeriod}
            onChange={updateField}
            placeholder="25"
          />
        </div>

        <RadioField
          label="Payment Authorization"
          name="paymentAuthorization"
          value={data.paymentAuthorization}
          onChange={updateField}
          options={[
            { value: 'single', label: 'Single signatory' },
            { value: 'dual', label: 'Dual signatory' },
            { value: 'tiered', label: 'Tiered by amount' }
          ]}
        />

        <TextField
          label="Dual Signatory Threshold (AED)"
          name="dualSignatoryThreshold"
          value={data.dualSignatoryThreshold}
          onChange={updateField}
          placeholder="10000"
        />
      </FormSection>

      <FormSection title="Credit Notes & Returns">
        <RadioField
          label="Supplier Credit Note Process"
          name="supplierCreditNoteProcess"
          value={data.supplierCreditNoteProcess}
          onChange={updateField}
          options={[
            { value: 'formal', label: 'Formal process with documentation' },
            { value: 'case-by-case', label: 'Case-by-case basis' },
            { value: 'informal', label: 'Informal handling' }
          ]}
        />

        <TextareaField
          label="Returns & Credits Policy"
          name="returnsCreditPolicy"
          value={data.returnsCreditPolicy}
          onChange={updateField}
          placeholder="Describe the process for handling returns and obtaining credits from suppliers"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Return Approval Authority"
            name="returnApprovalAuthority"
            value={data.returnApprovalAuthority}
            onChange={updateField}
            placeholder="Who can authorize returns?"
          />
          <TextField
            label="Credit Note Processing Time"
            name="creditNoteProcessingTime"
            value={data.creditNoteProcessingTime}
            onChange={updateField}
            placeholder="10 days"
          />
        </div>
      </FormSection>

      <FormSection title="Expense Management">
        <RadioField
          label="Employee Expense Reimbursement"
          name="expenseReimbursement"
          value={data.expenseReimbursement}
          onChange={updateField}
          options={[
            { value: 'formal-system', label: 'Formal expense management system' },
            { value: 'manual-process', label: 'Manual approval process' },
            { value: 'limited', label: 'Limited reimbursements' }
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Expense Approval Limit (AED)"
            name="expenseApprovalLimit"
            value={data.expenseApprovalLimit}
            onChange={updateField}
            placeholder="500"
          />
          <TextField
            label="Receipt Requirement Threshold"
            name="receiptRequirementThreshold"
            value={data.receiptRequirementThreshold}
            onChange={updateField}
            placeholder="50"
          />
        </div>

        <TextareaField
          label="Expense Categories"
          name="expenseCategories"
          value={data.expenseCategories}
          onChange={updateField}
          placeholder="List typical expense categories (travel, meals, office supplies, etc.)"
          rows={2}
        />
      </FormSection>
    </div>
  );
}