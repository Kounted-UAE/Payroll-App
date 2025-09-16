/**
 * Utility functions for payslip file naming
 */

/**
 * Sanitizes a string to be safe for use in filenames
 * Removes special characters and replaces spaces with underscores
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
}

/**
 * Generates a payslip filename with employee name and token
 * Format: {sanitized_employee_name}_{token}.pdf
 */
export function generatePayslipFilename(employeeName: string, token: string): string {
  const sanitizedName = sanitizeFilename(employeeName)
  return `${sanitizedName}_${token}.pdf`
}

/**
 * Extracts the token from a payslip filename
 * Handles both old format (token.pdf) and new format (name_token.pdf)
 */
export function extractTokenFromFilename(filename: string): string | null {
  // Remove .pdf extension
  const withoutExt = filename.replace(/\.pdf$/, '')
  
  // If it contains underscore, extract the part after the last underscore
  if (withoutExt.includes('_')) {
    const parts = withoutExt.split('_')
    return parts[parts.length - 1] // Last part should be the token
  }
  
  // If no underscore, assume it's the old format (just token)
  return withoutExt
}

/**
 * Extracts the employee name from a payslip filename
 * Only works with new format (name_token.pdf)
 */
export function extractEmployeeNameFromFilename(filename: string): string | null {
  const withoutExt = filename.replace(/\.pdf$/, '')
  
  if (withoutExt.includes('_')) {
    const parts = withoutExt.split('_')
    const token = parts[parts.length - 1]
    const nameParts = parts.slice(0, -1) // Everything except the last part (token)
    return nameParts.join('_').replace(/_/g, ' ')
  }
  
  return null
}

/**
 * Checks if a filename is in the new format (contains employee name)
 */
export function isNewFilenameFormat(filename: string): boolean {
  const withoutExt = filename.replace(/\.pdf$/, '')
  return withoutExt.includes('_') && withoutExt.split('_').length > 1
}
