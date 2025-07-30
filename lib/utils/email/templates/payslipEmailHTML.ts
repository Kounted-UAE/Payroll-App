interface PayslipEmailData {
  employee_name: string
  employer_name: string
  period: string
  pay_period_from: string
  pay_period_to: string
}

export function getPayslipEmailHTML(data: PayslipEmailData): string {
  const { employee_name, employer_name, period, pay_period_from, pay_period_to } = data
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Payslip - ${period}</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            padding: 10px !important;
          }
          .header {
            text-align: center !important;
          }
          .content {
            padding: 20px 15px !important;
          }
          .footer {
            text-align: center !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
      
      <!-- Main Container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            
            <!-- Email Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td class="header" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">
                    Your Monthly Payslip
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px; font-weight: 300;">
                    ${period}
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content" style="padding: 40px 30px;">
                  
                  <!-- Greeting -->
                  <div style="margin-bottom: 30px;">
                    <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 600;">
                      Dear ${employee_name},
                    </h2>
                    <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      Please find attached your payslip for the period from <strong>${formatDate(pay_period_from)}</strong> to <strong>${formatDate(pay_period_to)}</strong> issued by <strong>${employer_name}</strong>.
                    </p>
                  </div>
                  
                  <!-- Key Information Box -->
                  <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                      📋 Payslip Details
                    </h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 5px 0; color: #374151; font-size: 14px;">
                          <strong>Employer:</strong> ${employer_name}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #374151; font-size: 14px;">
                          <strong>Pay Period:</strong> ${formatDate(pay_period_from)} - ${formatDate(pay_period_to)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #374151; font-size: 14px;">
                          <strong>Document:</strong> Payslip (PDF attached)
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Action Instructions -->
                  <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 16px; font-weight: 600;">
                      📎 What's Next?
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #047857; font-size: 14px;">
                      <li style="margin-bottom: 8px;">Review your payslip details in the attached PDF</li>
                      <li style="margin-bottom: 8px;">Verify all salary components and deductions</li>
                      <li style="margin-bottom: 8px;">Contact HR if you notice any discrepancies</li>
                      <li style="margin-bottom: 0;">Keep this document for your records</li>
                    </ul>
                  </div>
                  
                  <!-- Contact Information -->
                  <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 6px; padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px; font-weight: 600;">
                      💬 Need Help?
                    </h3>
                    <p style="margin: 0 0 10px 0; color: #78350f; font-size: 14px;">
                      If you have any questions about your payslip, please contact:
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 3px 0; color: #78350f; font-size: 14px;">
                          <strong>HR Department:</strong> hr@${employer_name.toLowerCase().replace(/\s+/g, '')}.ae
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; color: #78350f; font-size: 14px;">
                          <strong>Payroll Team:</strong> payroll@${employer_name.toLowerCase().replace(/\s+/g, '')}.ae
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; color: #78350f; font-size: 14px;">
                          <strong>Phone:</strong> +971 4 XXX XXXX
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer" style="background-color: #1f2937; padding: 30px; text-align: center;">
                  <div style="margin-bottom: 20px;">
                    <img src="https://via.placeholder.com/150x50/2563eb/ffffff?text=${employer_name.replace(/\s+/g, '+')}" 
                         alt="${employer_name}" 
                         style="max-width: 150px; height: auto;">
                  </div>
                  
                  <p style="margin: 0 0 15px 0; color: #d1d5db; font-size: 14px; line-height: 1.5;">
                    <strong>Confidentiality Notice:</strong><br>
                    This email and its attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed. 
                    If you have received this email in error, please notify the sender immediately and delete it from your system.
                  </p>
                  
                  <div style="border-top: 1px solid #374151; padding-top: 20px;">
                    <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px;">
                      <strong>${employer_name}</strong><br>
                      Dubai, United Arab Emirates
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      This is an automated message. Please do not reply to this email.
                    </p>
                  </div>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `
}

// Alternative template for Arabic (RTL) support
export function getPayslipEmailHTMLArabic(data: PayslipEmailData): string {
  const { employee_name, employer_name, period, pay_period_from, pay_period_to } = data
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>مسير الراتب - ${period}</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            padding: 10px !important;
          }
          .header {
            text-align: center !important;
          }
          .content {
            padding: 20px 15px !important;
          }
          .footer {
            text-align: center !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; line-height: 1.6; direction: rtl;">
      
      <!-- Main Container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            
            <!-- Email Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td class="header" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">
                    مسير الراتب الشهري
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px; font-weight: 300;">
                    ${period}
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content" style="padding: 40px 30px;">
                  
                  <!-- Greeting -->
                  <div style="margin-bottom: 30px;">
                    <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 600;">
                      عزيزي ${employee_name}،
                    </h2>
                    <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      يرجى الاطلاع على مسير الراتب المرفق للفترة من <strong>${formatDate(pay_period_from)}</strong> إلى <strong>${formatDate(pay_period_to)}</strong> الصادر من <strong>${employer_name}</strong>.
                    </p>
                  </div>
                  
                  <!-- Key Information Box -->
                  <div style="background-color: #f8fafc; border-right: 4px solid #2563eb; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                       تفاصيل مسير الراتب
                    </h3>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 5px 0; color: #374151; font-size: 14px;">
                          <strong>الشركة:</strong> ${employer_name}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #374151; font-size: 14px;">
                          <strong>فترة الراتب:</strong> ${formatDate(pay_period_from)} - ${formatDate(pay_period_to)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #374151; font-size: 14px;">
                          <strong>المستند:</strong> مسير الراتب (PDF مرفق)
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Contact Information -->
                  <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 6px; padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px; font-weight: 600;">
                      💬 هل تحتاج مساعدة؟
                    </h3>
                    <p style="margin: 0 0 10px 0; color: #78350f; font-size: 14px;">
                      إذا كان لديك أي أسئلة حول مسير الراتب، يرجى الاتصال بـ:
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 3px 0; color: #78350f; font-size: 14px;">
                          <strong>قسم الموارد البشرية:</strong> hr@${employer_name.toLowerCase().replace(/\s+/g, '')}.ae
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; color: #78350f; font-size: 14px;">
                          <strong>فريق الرواتب:</strong> payroll@${employer_name.toLowerCase().replace(/\s+/g, '')}.ae
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; color: #78350f; font-size: 14px;">
                          <strong>الهاتف:</strong> +971 4 XXX XXXX
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer" style="background-color: #1f2937; padding: 30px; text-align: center;">
                  <p style="margin: 0 0 15px 0; color: #d1d5db; font-size: 14px; line-height: 1.5;">
                    <strong>إشعار السرية:</strong><br>
                    هذا البريد الإلكتروني ومرفقاته سرية ومخصصة للاستخدام الحصري للفرد أو الكيان الذي تم توجيهها إليه.
                    إذا تلقيت هذا البريد الإلكتروني عن طريق الخطأ، يرجى إخطار المرسل فوراً وحذفه من نظامك.
                  </p>
                  
                  <div style="border-top: 1px solid #374151; padding-top: 20px;">
                    <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px;">
                      <strong>${employer_name}</strong><br>
                      دبي، الإمارات العربية المتحدة
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      هذه رسالة آلية. يرجى عدم الرد على هذا البريد الإلكتروني.
                    </p>
                  </div>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `
}

// Helper function to get the appropriate template based on language
export function getPayslipEmailTemplate(data: PayslipEmailData, language: 'english' | 'arabic' = 'english'): string {
  return language === 'arabic' ? getPayslipEmailHTMLArabic(data) : getPayslipEmailHTML(data)
}