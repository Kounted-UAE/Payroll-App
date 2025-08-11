import { Metadata } from 'next'
import { RootLayout } from '@/components/advontier-website/layout/RootLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy | Advontier',
  description: 'Privacy Policy and Data Protection Notice for Advontier services',
}

export default function PrivacyPolicyPage() {
  return (
    <RootLayout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This Privacy Policy explains how Advontier ("we," "us," or "our") collects, uses, 
              and protects your personal information when you use our services.
            </p>
          </div>

          <h2>1. Information We Collect</h2>
          
          <h3>1.1 Personal Information</h3>
          <p>We collect the following types of personal information:</p>
          <ul>
            <li><strong>Identity Information:</strong> Name, email address, phone number, job title</li>
            <li><strong>Financial Information:</strong> Bank account details, IBAN, salary information, payroll data</li>
            <li><strong>Government Identification:</strong> Emirates ID numbers, passport numbers, trade license details</li>
            <li><strong>Employment Information:</strong> Employee records, employer details, payroll information</li>
            <li><strong>Business Information:</strong> Company details, financial records, accounting data</li>
            <li><strong>Technical Information:</strong> IP address, browser type, device information, usage data</li>
          </ul>

          <h3>1.2 How We Collect Information</h3>
          <ul>
            <li>Directly from you when you register or use our services</li>
            <li>From third-party integrations (Xero, email services)</li>
            <li>Automatically through cookies and tracking technologies</li>
            <li>From file uploads and document submissions</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          
          <h3>2.1 Primary Purposes</h3>
          <ul>
            <li>Providing accounting and payroll services</li>
            <li>Processing payments and generating payslips</li>
            <li>Managing client relationships and communications</li>
            <li>Compliance with UAE labor laws and regulations</li>
            <li>Financial reporting and analysis</li>
          </ul>

          <h3>2.2 Legal Basis for Processing</h3>
          <ul>
            <li><strong>Contract Performance:</strong> Processing necessary for service delivery</li>
            <li><strong>Legal Obligation:</strong> Compliance with UAE laws and regulations</li>
            <li><strong>Legitimate Interest:</strong> Business operations and service improvement</li>
            <li><strong>Consent:</strong> Marketing communications and non-essential cookies</li>
          </ul>

          <h2>3. Information Sharing and Disclosure</h2>
          
          <h3>3.1 Third-Party Services</h3>
          <p>We share information with trusted third-party service providers:</p>
          <ul>
            <li><strong>Xero:</strong> For accounting and financial data synchronization</li>
            <li><strong>Resend:</strong> For email communications and notifications</li>
            <li><strong>Supabase:</strong> For database hosting and authentication</li>
            <li><strong>OpenAI:</strong> For AI-powered features (anonymized data only)</li>
          </ul>

          <h3>3.2 Legal Requirements</h3>
          <p>We may disclose information when required by:</p>
          <ul>
            <li>UAE government authorities and regulators</li>
            <li>Court orders or legal proceedings</li>
            <li>Law enforcement agencies</li>
            <li>Professional regulatory bodies</li>
          </ul>

          <h2>4. Data Security</h2>
          
          <h3>4.1 Security Measures</h3>
          <ul>
            <li>End-to-end encryption for data transmission</li>
            <li>Secure hosting infrastructure with Supabase</li>
            <li>Regular security audits and assessments</li>
            <li>Access controls and authentication systems</li>
            <li>Employee training on data protection</li>
          </ul>

          <h3>4.2 Data Retention</h3>
          <p>We retain personal information for:</p>
          <ul>
            <li><strong>Employee Records:</strong> 7 years after employment termination</li>
            <li><strong>Financial Records:</strong> 7 years as required by UAE law</li>
            <li><strong>Client Data:</strong> Duration of business relationship plus 3 years</li>
            <li><strong>Marketing Data:</strong> Until consent is withdrawn</li>
          </ul>

          <h2>5. Your Rights Under GDPR</h2>
          
          <p>As a data subject, you have the following rights:</p>
          
          <h3>5.1 Right to Access</h3>
          <p>Request a copy of all personal information we hold about you.</p>
          
          <h3>5.2 Right to Rectification</h3>
          <p>Request correction of inaccurate or incomplete personal information.</p>
          
          <h3>5.3 Right to Erasure ("Right to be Forgotten")</h3>
          <p>Request deletion of your personal information, subject to legal obligations.</p>
          
          <h3>5.4 Right to Data Portability</h3>
          <p>Request your data in a structured, machine-readable format.</p>
          
          <h3>5.5 Right to Restrict Processing</h3>
          <p>Request limitation of how we process your personal information.</p>
          
          <h3>5.6 Right to Object</h3>
          <p>Object to processing based on legitimate interests or direct marketing.</p>

          <h2>6. Cookies and Tracking</h2>
          
          <h3>6.1 Cookie Usage</h3>
          <p>We use the following types of cookies:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for website functionality</li>
            <li><strong>Performance Cookies:</strong> Help us improve website performance</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
          </ul>

          <h3>6.2 Cookie Management</h3>
          <p>You can manage your cookie preferences through our cookie consent banner or your browser settings.</p>

          <h2>7. International Data Transfers</h2>
          
          <p>We may transfer your personal information outside the UAE to:</p>
          <ul>
            <li>European Economic Area (EEA) for cloud services</li>
            <li>United States for third-party integrations</li>
            <li>Other jurisdictions as necessary for service delivery</li>
          </ul>
          
          <p>All transfers are protected by appropriate safeguards including:</p>
          <ul>
            <li>Standard Contractual Clauses (SCCs)</li>
            <li>Adequacy decisions by data protection authorities</li>
            <li>Binding Corporate Rules where applicable</li>
          </ul>

          <h2>8. Children's Privacy</h2>
          
          <p>Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.</p>

          <h2>9. Updates to This Policy</h2>
          
          <p>We may update this Privacy Policy periodically. Material changes will be communicated through:</p>
          <ul>
            <li>Email notifications to registered users</li>
            <li>Prominent notices on our website</li>
            <li>In-app notifications</li>
          </ul>

          <h2>10. Contact Information</h2>
          
          <h3>10.1 Data Protection Officer</h3>
          <p>For privacy-related inquiries, contact our Data Protection Officer:</p>
          <ul>
            <li><strong>Email:</strong> privacy@advontier.com</li>
            <li><strong>Phone:</strong> +971 XX XXX XXXX</li>
            <li><strong>Address:</strong> [Company Address], UAE</li>
          </ul>

          <h3>10.2 Exercising Your Rights</h3>
          <p>To exercise your data protection rights, please contact us at:</p>
          <ul>
            <li><strong>Email:</strong> dataprotection@advontier.com</li>
            <li><strong>Subject Line:</strong> "Data Subject Rights Request"</li>
          </ul>

          <h3>10.3 Complaints</h3>
          <p>If you believe we have not handled your personal information properly, you may lodge a complaint with:</p>
          <ul>
            <li>UAE Data Protection Authority</li>
            <li>Your local data protection regulator</li>
            <li>European Data Protection Board (for EU residents)</li>
          </ul>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mt-8">
            <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">Important Notice</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This Privacy Policy is part of our terms of service. By using our services, 
              you acknowledge that you have read, understood, and agree to this Privacy Policy.
            </p>
          </div>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}