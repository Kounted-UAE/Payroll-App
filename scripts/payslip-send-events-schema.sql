-- Create table to log payslip email send events
create table if not exists public.payroll_payslip_send_events (
  id uuid not null default gen_random_uuid(),
  batch_id uuid not null,
  recipients text not null,
  status text not null check (status in ('sent','failed')),
  error_message text null,
  created_at timestamptz not null default now(),
  constraint payroll_payslip_send_events_pkey primary key (id)
);

create index if not exists idx_payslip_send_events_batch_id
  on public.payroll_payslip_send_events (batch_id);

-- Optional: enable RLS (service role bypasses it)
alter table public.payroll_payslip_send_events enable row level security;


