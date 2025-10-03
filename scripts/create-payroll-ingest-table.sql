-- SQL Script to create the payroll ingest table (excelpayrollimport)
-- This table stores payroll data imported from Excel/CSV files
-- Column order matches the CSV file for easy import

CREATE TABLE IF NOT EXISTS public.excelpayrollimport (
    -- Primary key - unique identifier for each payslip
    batch_id UUID PRIMARY KEY NOT NULL,
    
    -- Employee and employer identifiers
    employee_id UUID NOT NULL,
    employer_id UUID NOT NULL,
    
    -- Employer information
    employer_name TEXT NOT NULL,
    reviewer_email TEXT NOT NULL,
    
    -- Employee information
    employee_name TEXT NOT NULL,
    email_id TEXT,
    employee_mol TEXT,
    
    -- Bank details
    bank_name TEXT,
    iban TEXT,
    
    -- Pay period
    pay_period_from DATE NOT NULL,
    pay_period_to DATE NOT NULL,
    leave_without_pay_days NUMERIC DEFAULT 0,
    
    -- Currency
    currency TEXT DEFAULT 'AED',
    
    -- Salary components (in CSV column order)
    basic_salary NUMERIC(10, 2),
    housing_allowance NUMERIC(10, 2),
    transport_allowance NUMERIC(10, 2),
    education_allowance NUMERIC(10, 2),
    flight_allowance NUMERIC(10, 2),
    general_allowance NUMERIC(10, 2),
    gratuity_eosb NUMERIC(10, 2),
    other_allowance NUMERIC(10, 2),
    total_gross_salary NUMERIC(10, 2),
    
    -- Additional payments
    bonus NUMERIC(10, 2),
    overtime NUMERIC(10, 2),
    salary_in_arrears NUMERIC(10, 2),
    
    -- Deductions and reimbursements
    expenses_deductions NUMERIC(10, 2),
    other_reimbursements NUMERIC(10, 2),
    expense_reimbursements NUMERIC(10, 2),
    total_adjustments NUMERIC(10, 2),
    
    -- Net salary
    net_salary NUMERIC(10, 2),
    wps_fees NUMERIC(10, 2),
    total_to_transfer NUMERIC(10, 2),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Payslip information
    payslip_url TEXT,
    payslip_token UUID
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_excelpayrollimport_employer_id ON public.excelpayrollimport(employer_id);
CREATE INDEX IF NOT EXISTS idx_excelpayrollimport_employee_id ON public.excelpayrollimport(employee_id);
CREATE INDEX IF NOT EXISTS idx_excelpayrollimport_batch_id ON public.excelpayrollimport(batch_id);
CREATE INDEX IF NOT EXISTS idx_excelpayrollimport_pay_period ON public.excelpayrollimport(pay_period_from, pay_period_to);
CREATE INDEX IF NOT EXISTS idx_excelpayrollimport_created_at ON public.excelpayrollimport(created_at);
CREATE INDEX IF NOT EXISTS idx_excelpayrollimport_payslip_token ON public.excelpayrollimport(payslip_token);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_excelpayrollimport_email ON public.excelpayrollimport(email_id);
CREATE INDEX IF NOT EXISTS idx_excelpayrollimport_reviewer_email ON public.excelpayrollimport(reviewer_email);

-- Add comment to table
COMMENT ON TABLE public.excelpayrollimport IS 'Stores payroll data imported from Excel/CSV files for payslip generation';

-- Add comments to important columns
COMMENT ON COLUMN public.excelpayrollimport.employee_id IS 'UUID of the employee';
COMMENT ON COLUMN public.excelpayrollimport.employer_id IS 'UUID of the employer/company';
COMMENT ON COLUMN public.excelpayrollimport.batch_id IS 'UUID to group payslips generated in the same batch';
COMMENT ON COLUMN public.excelpayrollimport.payslip_token IS 'Unique token for accessing the payslip PDF';
COMMENT ON COLUMN public.excelpayrollimport.payslip_url IS 'URL to the generated payslip PDF in Supabase Storage';
COMMENT ON COLUMN public.excelpayrollimport.employee_mol IS 'Ministry of Labour ID for the employee';

-- Enable Row Level Security (RLS)
ALTER TABLE public.excelpayrollimport ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust these based on your authentication requirements)
-- Policy for authenticated users to read their own employer's data
CREATE POLICY "Users can view payroll data for their employer"
    ON public.excelpayrollimport
    FOR SELECT
    USING (
        auth.role() = 'authenticated' 
        -- Add additional conditions based on your auth setup
        -- Example: employer_id = auth.uid() OR reviewer_email = auth.email()
    );

-- Policy for authenticated users to insert payroll data
CREATE POLICY "Users can insert payroll data"
    ON public.excelpayrollimport
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated'
        -- Add additional conditions based on your auth setup
    );

-- Policy for authenticated users to update their employer's payroll data
CREATE POLICY "Users can update payroll data for their employer"
    ON public.excelpayrollimport
    FOR UPDATE
    USING (
        auth.role() = 'authenticated'
        -- Add additional conditions based on your auth setup
    );

-- Optional: Grant permissions to service role for backend operations
-- GRANT ALL ON public.excelpayrollimport TO service_role;

-- Optional: Create a view for easier querying of recent payslips
CREATE OR REPLACE VIEW public.recent_payslips AS
SELECT 
    employee_id,
    employer_id,
    employer_name,
    employee_name,
    email_id,
    pay_period_from,
    pay_period_to,
    total_gross_salary,
    net_salary,
    payslip_url,
    payslip_token,
    created_at,
    batch_id
FROM public.excelpayrollimport
ORDER BY created_at DESC;

-- Grant select permission on the view
GRANT SELECT ON public.recent_payslips TO authenticated;

-- Optional: Create a function to calculate totals by employer
CREATE OR REPLACE FUNCTION public.get_employer_payroll_summary(p_employer_id UUID, p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
    total_employees BIGINT,
    total_gross_salary NUMERIC,
    total_net_salary NUMERIC,
    total_to_transfer NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT employee_id) as total_employees,
        SUM(total_gross_salary) as total_gross_salary,
        SUM(net_salary) as total_net_salary,
        SUM(total_to_transfer) as total_to_transfer
    FROM public.excelpayrollimport
    WHERE employer_id = p_employer_id
        AND pay_period_from >= p_start_date
        AND pay_period_to <= p_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

