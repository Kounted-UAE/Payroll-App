import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { to, name, url, batch_id } = await req.json()

  if (!to || !name || !url) {
    return new NextResponse('Missing required fields', { status: 400 })
  }

  console.log('📧 Sending to:', to)
console.log('👤 Name:', name)
console.log('📄 PDF:', url)


  const subject = `Your latest payslip is now available`
  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #111;">
    <h2 style="font-size: 18px; font-weight: 600;">Hi ${name},</h2>
    <p style="font-size: 14px; line-height: 1.5; margin: 16px 0;">
      Your latest payslip is now ready to view. Please click the button below to securely access and download your payslip.
    </p>

    <a href="${url}" target="_blank" style="
      display: inline-block;
      background-color: #0d9488;
      color: white;
      text-decoration: none;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 14px;
      margin: 20px 0;
    ">
      View Payslip
    </a>

    <p style="font-size: 13px; color: #555;">
      If you have any questions, please reach out to your payroll administrator at <a href="mailto:payroll@kounted.ae">payroll@kounted.ae</a>.
    </p>

    <p style="font-size: 12px; color: #888; margin-top: 32px;">
      Do not reply directly to this email.
    </p>
  </div>
  `

  try {
    const result = await resend.emails.send({
      from: 'Kounted Payroll <payroll@resend.kounted.ae>',
      replyTo: 'Kounted Payroll <payroll@kounted.ae>',
      to,
      subject,
      html,
    })

    // Log send event (best-effort)
    try {
      const urlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL
      const keyEnv = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (urlEnv && keyEnv && batch_id) {
        const supabase = createClient(urlEnv, keyEnv)
        await supabase
          .from('payroll_payslip_send_events')
          .insert({
            batch_id,
            recipients: Array.isArray(to) ? to.join(', ') : String(to),
            status: 'sent',
            error_message: null,
          })
      }
    } catch (e) {
      console.warn('⚠️ Failed to log send event', e)
    }

    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    console.error('❌ Email send failed:', err)
    // Log failure event (best-effort)
    try {
      const urlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL
      const keyEnv = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (urlEnv && keyEnv && batch_id) {
        const supabase = createClient(urlEnv, keyEnv)
        await supabase
          .from('payroll_payslip_send_events')
          .insert({
            batch_id,
            recipients: Array.isArray(to) ? to.join(', ') : String(to),
            status: 'failed',
            error_message: err?.message || 'Unknown error',
          })
      }
    } catch (e) {
      console.warn('⚠️ Failed to log send failure event', e)
    }

    return new NextResponse('Email send failed', { status: 500 })
  }
}
