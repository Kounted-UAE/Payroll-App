import { Metadata } from 'next'
import { RootLayout } from '@/components/advontier-website/layout/RootLayout'

export const metadata: Metadata = {
  title: 'Terms of Service | Advontier',
  description: 'Terms of Service and User Agreement for Advontier services',
}

export default function TermsOfServicePage() {
  const today = new Date().toLocaleDateString()

  return (
    <RootLayout>
      <div className="min-h-screen py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>

          <div className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-100/60 dark:border-blue-900/30 p-6 rounded-lg mb-10">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              <strong>Last Updated:</strong>{' '}
              <time dateTime={new Date().toISOString()}>{today}</time>
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              These Terms of Service (“Terms”) govern your use of Advontier’s services. By using our services, you agree
              to these terms.
            </p>
          </div>

          <article className="prose prose-lg prose-gray dark:prose-invert max-w-none [&>p]:mb-6 [&>ul]:mb-6 [&>ol]:mb-6 [&>li]:mb-2 [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:mt-8 [&>h3]:mb-4 leading-relaxed">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Advontier&apos;s services, you agree to be bound by these Terms of Service and our
              Privacy Policy. If you do not agree to these terms, you may not use our services.
            </p>

            <h2>2. Description of Services</h2>

            <h3>2.1 Core Services</h3>
            <p>Advontier provides the following services:</p>
            <ul>
              <li>Accounting and bookkeeping services</li>
              <li>Payroll processing and management</li>
              <li>Tax compliance and filing</li>
              <li>Financial reporting and analysis</li>
              <li>Client portal and document management</li>
              <li>Third-party integrations (Xero, banking systems)</li>
            </ul>

            <h3>2.2 Service Availability</h3>
            <p>We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance.</p>

            <h2>3. User Accounts and Registration</h2>

            <h3>3.1 Account Creation</h3>
            <p>To use our services, you must:</p>
            <ul>
              <li>Provide accurate and complete registration information</li>
              <li>Be at least 18 years of age</li>
              <li>Have the authority to enter into this agreement</li>
              <li>Maintain the security of your account credentials</li>
            </ul>

            <h3>3.2 Account Security</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Using strong passwords and enabling two-factor authentication when available</li>
            </ul>

            <h2>4. Data Protection and Privacy</h2>

            <h3>4.1 Data Processing</h3>
            <p>By using our services, you consent to the processing of your personal data as described in our Privacy Policy, including:</p>
            <ul>
              <li>Collection and storage of personal and financial information</li>
              <li>Processing for accounting and payroll purposes</li>
              <li>Sharing with authorized third-party service providers</li>
              <li>Compliance with South African laws and regulations</li>
            </ul>

            <h3>4.2 Data Subject Rights</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data (subject to legal obligations)</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent for non-essential processing</li>
            </ul>

            <h2>5. User Responsibilities and Prohibited Uses</h2>

            <h3>5.1 Acceptable Use</h3>
            <p>You agree to:</p>
            <ul>
              <li>Use the services only for lawful purposes</li>
              <li>Provide accurate and complete information</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Maintain the confidentiality of sensitive information</li>
            </ul>

            <h3>5.2 Prohibited Activities</h3>
            <p>You may not:</p>
            <ul>
              <li>Use the services for illegal activities or fraud</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Introduce viruses, malware, or harmful code</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Share access credentials with unauthorized persons</li>
              <li>Use the services to compete with our business</li>
            </ul>

            <h2>6. Payment Terms and Billing</h2>

            <h3>6.1 Fees and Charges</h3>
            <p>Service fees are as agreed in your service agreement. Payment terms include:</p>
            <ul>
              <li>Monthly or annual billing cycles as specified</li>
              <li>Automatic billing to your chosen payment method</li>
              <li>Late payment charges for overdue accounts</li>
              <li>No refunds for partial months of service</li>
            </ul>

            <h3>6.2 Payment Processing</h3>
            <p>We use secure third-party payment processors. By providing payment information, you authorize us to charge your payment method for applicable fees.</p>

            <h2>7. Intellectual Property Rights</h2>

            <h3>7.1 Our Rights</h3>
            <p>Advontier retains all rights to:</p>
            <ul>
              <li>Our software, systems, and technology</li>
              <li>Trademarks, service marks, and brand elements</li>
              <li>Proprietary methodologies and processes</li>
              <li>Documentation and training materials</li>
            </ul>

            <h3>7.2 Your Rights</h3>
            <p>You retain ownership of:</p>
            <ul>
              <li>Your business data and financial information</li>
              <li>Content you upload to our systems</li>
              <li>Your company&apos;s intellectual property</li>
            </ul>

            <h2>8. Third-Party Integrations</h2>

            <h3>8.1 Authorized Integrations</h3>
            <p>We integrate with third-party services including:</p>
            <ul>
              <li>Xero for accounting data synchronization</li>
              <li>Banking systems for transaction processing</li>
              <li>Email services for communications</li>
              <li>Government portals for compliance filing</li>
            </ul>

            <h3>8.2 Third-Party Terms</h3>
            <p>Use of integrated services is subject to their respective terms of service and privacy policies. We are not responsible for third-party service availability or security.</p>

            <h2>9. Limitation of Liability</h2>

            <h3>9.1 Service Limitations</h3>
            <p>Our liability is limited to:</p>
            <ul>
              <li>The amount paid for services in the preceding 12 months</li>
              <li>Direct damages only (no indirect or consequential damages)</li>
              <li>Issues directly caused by our negligence or breach</li>
            </ul>

            <h3>9.2 Excluded Damages</h3>
            <p>We are not liable for:</p>
            <ul>
              <li>Data loss due to user error or third-party failures</li>
              <li>Business interruption or lost profits</li>
              <li>Regulatory penalties due to late filing (unless caused by our error)</li>
              <li>Decisions made based on our reports or advice</li>
            </ul>

            <h2>10. Professional Standards and Compliance</h2>

            <h3>10.1 Regulatory Compliance</h3>
            <p>We maintain compliance with:</p>
            <ul>
              <li>South African Protection of Personal Information Act (POPIA)</li>
              <li>EU General Data Protection Regulation (GDPR)</li>
              <li>South African Labor Relations Act and Basic Conditions of Employment Act</li>
              <li>International accounting standards</li>
              <li>Professional accounting body regulations</li>
            </ul>

            <h3>10.2 Professional Obligations</h3>
            <p>Our professional obligations include:</p>
            <ul>
              <li>Maintaining client confidentiality</li>
              <li>Acting with professional competence and due care</li>
              <li>Avoiding conflicts of interest</li>
              <li>Providing accurate and timely services</li>
            </ul>

            <h2>11. Termination</h2>

            <h3>11.1 Termination by You</h3>
            <p>You may terminate your account by:</p>
            <ul>
              <li>Providing 30 days&apos; written notice</li>
              <li>Paying all outstanding fees</li>
              <li>Completing any pending compliance obligations</li>
            </ul>

            <h3>11.2 Termination by Us</h3>
            <p>We may terminate your account for:</p>
            <ul>
              <li>Material breach of these terms</li>
              <li>Non-payment of fees</li>
              <li>Violation of professional standards</li>
              <li>Illegal use of our services</li>
            </ul>

            <h3>11.3 Data Retention After Termination</h3>
            <p>After termination:</p>
            <ul>
              <li>We will provide data export within 30 days</li>
              <li>Data may be retained for legal compliance purposes</li>
              <li>Access to services will be discontinued</li>
              <li>Some data may be anonymized for analytical purposes</li>
            </ul>

            <h2>12. Indemnification</h2>
            <p>You agree to indemnify and hold us harmless from claims arising from:</p>
            <ul>
              <li>Your violation of these terms</li>
              <li>Your use of the services</li>
              <li>Inaccurate information you provide</li>
              <li>Your violation of applicable laws</li>
            </ul>

            <h2>13. Governing Law and Dispute Resolution</h2>

            <h3>13.1 Governing Law</h3>
            <p>These terms are governed by the laws of the Republic of South Africa.</p>

            <h3>13.2 Dispute Resolution</h3>
            <p>Disputes will be resolved through:</p>
            <ul>
              <li>Good faith negotiations first</li>
              <li>Mediation if negotiations fail</li>
              <li>Arbitration in Cape Town, South Africa if necessary</li>
              <li>South African courts as the final resort</li>
            </ul>

            <h2>14. Changes to Terms</h2>
            <p>We may update these terms periodically. Changes will be communicated through:</p>
            <ul>
              <li>Email notification to registered users</li>
              <li>Notice on our website</li>
              <li>In-app notifications</li>
            </ul>
            <p>Continued use of our services after changes constitutes acceptance of updated terms.</p>

            <h2>15. Contact Information</h2>

            <h3>15.1 General Inquiries</h3>
            <ul>
              <li><strong>Email:</strong> eben@advontier.com</li>
              <li><strong>Phone:</strong> +27 72 598 2032</li>
              <li><strong>Address:</strong> 3 Berg Street, Saldanha, Western Cape, South Africa, 7395</li>
            </ul>

            <h3>15.2 Legal Notices</h3>
            <ul>
              <li><strong>Email:</strong> eben@advontier.com</li>
              <li><strong>Subject Line:</strong> “Legal Notice - Terms of Service”</li>
            </ul>
          </article>

          <div className="not-prose bg-red-50 dark:bg-red-900/20 border border-red-100/60 dark:border-red-900/30 p-6 rounded-lg mt-10">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Important Legal Notice</h3>
            <p className="text-sm text-red-800 dark:text-red-200">
              These terms constitute a legally binding agreement. Please read them carefully and contact us if you have
              any questions before using our services. By using our services, you acknowledge that you have read,
              understood, and agree to be bound by these terms.
            </p>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}
