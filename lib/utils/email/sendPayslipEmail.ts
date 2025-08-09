import { getPayslipEmailTemplate } from './templates/payslipEmailHTML'

interface SendPayslipEmailParams {
  to: string
  subject: string
  employeeName: string
  pdfBlob: Blob
  employerName: string
  payPeriodFrom: string
  payPeriodTo: string
  language?: 'english' | 'arabic'
}

export async function sendPayslipEmail({ 
  to, 
  subject, 
  employeeName, 
  pdfBlob, 
  employerName, 
  payPeriodFrom, 
  payPeriodTo, 
  language = 'english' 
}: SendPayslipEmailParams): Promise<void> {
  // Generate the email HTML
  const emailHTML = getPayslipEmailTemplate({
    employee_name: employeeName,
    employer_name: employerName,
    period: `${new Date(payPeriodFrom).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    pay_period_from: payPeriodFrom,
    pay_period_to: payPeriodTo
  }, language)

  // For now, we'll simulate email sending
  // In production, this would integrate with Resend, SendGrid, or similar service
  console.log('Sending payslip email:', {
    to,
    subject,
    employeeName,
    employerName,
    payPeriodFrom,
    payPeriodTo,
    language,
    pdfSize: pdfBlob.size,
    emailHTMLLength: emailHTML.length
  })

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simulate success (in production, this would be an actual API call)
  /*
  const formData = new FormData()
  formData.append('to', to)
  formData.append('subject', subject)
  formData.append('html', emailHTML)
  formData.append('attachment', pdfBlob, `${employeeName}-payslip.pdf`)
  
  const response = await fetch('/api/send-email', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Failed to send email')
  }
  */

  // For now, just return successfully
  return Promise.resolve()
}

// Batch email sending function
export async function sendBatchPayslipEmails(
  emails: Array<{
    to: string
    subject: string
    employeeName: string
    pdfBlob: Blob
    employerName: string
    payPeriodFrom: string
    payPeriodTo: string
    language?: 'english' | 'arabic'
  }>
): Promise<Array<{ success: boolean; email: string; error?: string }>> {
  const results: Array<{ success: boolean; email: string; error?: string }> = []
  
  for (const emailData of emails) {
    try {
      await sendPayslipEmail(emailData)
      results.push({ success: true, email: emailData.to })
    } catch (error) {
      results.push({ 
        success: false, 
        email: emailData.to, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }
  
  return results
}

// Note: Keep PDF generation concerns separate; this module only sends emails