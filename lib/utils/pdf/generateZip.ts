import JSZip from 'jszip'

interface PayslipData {
  employeeName: string
  pdfBlob: Blob
}

export async function createPayslipsZip(payslips: PayslipData[]): Promise<Blob> {
  const zip = new JSZip()
  
  // Add each payslip to the zip
  payslips.forEach((payslip, index) => {
    const fileName = `${payslip.employeeName.replace(/[^a-zA-Z0-9]/g, '_')}-payslip.pdf`
    zip.file(fileName, payslip.pdfBlob)
  })
  
  // Generate the zip file
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  return zipBlob
}