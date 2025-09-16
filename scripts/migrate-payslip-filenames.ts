/**
 * Migration script to update existing payslip URLs to use the new naming format
 * This script can be run to update existing payslips in the database
 */

import { createClient } from '@supabase/supabase-js'
import { generatePayslipFilename } from '../lib/utils/pdf/payslipNaming'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migratePayslipFilenames() {
  console.log('Starting payslip filename migration...')
  
  try {
    // Get all payslips that have tokens but might be using old URL format
    const { data: payslips, error } = await supabase
      .from('payroll_ingest_excelpayrollimport')
      .select('batch_id, employee_name, payslip_token, payslip_url')
      .not('payslip_token', 'is', null)
      .not('payslip_url', 'is', null)

    if (error) {
      console.error('Error fetching payslips:', error)
      return
    }

    console.log(`Found ${payslips?.length || 0} payslips to check`)

    let updated = 0
    let skipped = 0

    for (const payslip of payslips || []) {
      if (!payslip.payslip_token || !payslip.employee_name) {
        console.log(`Skipping ${payslip.batch_id}: missing token or name`)
        skipped++
        continue
      }

      // Check if the URL already uses the new format
      const currentFilename = payslip.payslip_url.split('/').pop() || ''
      const expectedFilename = generatePayslipFilename(payslip.employee_name, payslip.payslip_token)
      
      if (currentFilename === expectedFilename) {
        console.log(`Skipping ${payslip.batch_id}: already using new format`)
        skipped++
        continue
      }

      // Generate new URL with the new filename format
      const baseUrl = payslip.payslip_url.substring(0, payslip.payslip_url.lastIndexOf('/'))
      const newUrl = `${baseUrl}/${expectedFilename}`

      // Update the payslip URL in the database
      const { error: updateError } = await supabase
        .from('payroll_ingest_excelpayrollimport')
        .update({ payslip_url: newUrl })
        .eq('batch_id', payslip.batch_id)

      if (updateError) {
        console.error(`Error updating ${payslip.batch_id}:`, updateError)
      } else {
        console.log(`Updated ${payslip.batch_id}: ${payslip.employee_name}`)
        console.log(`  Old: ${payslip.payslip_url}`)
        console.log(`  New: ${newUrl}`)
        updated++
      }
    }

    console.log(`\nMigration complete!`)
    console.log(`Updated: ${updated}`)
    console.log(`Skipped: ${skipped}`)

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  migratePayslipFilenames()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}

export { migratePayslipFilenames }
