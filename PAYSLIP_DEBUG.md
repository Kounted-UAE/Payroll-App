# Payslip Generation Debug Guide

## Issue
Payslip generation works on localhost but fails on the live site.

## Root Cause
The payslip generation uses Puppeteer to convert HTML templates to PDFs. Production environments often lack the necessary Chrome/Chromium binaries and have different security restrictions.

## Fixes Applied

### 1. Enhanced Puppeteer Configuration
- Added production-specific Chrome arguments
- Increased timeouts for PDF generation
- Added proper error handling and logging

### 2. File Path Resolution
- Changed from relative path `./payslip-template.html` to absolute path using `process.cwd()`
- Added file existence checks before processing

### 3. Production Dependencies
- Added `postinstall` script to install Chrome browser
- Created Vercel configuration for proper Chrome installation
- Added `.vercelignore` to ensure template file is included

### 4. Error Handling
- Added specific error messages for common production issues
- Enhanced logging for debugging
- Added timeout handling for PDF generation

## Testing the Fix

1. **Deploy the changes** to your production environment
2. **Check the logs** for any error messages during payslip generation
3. **Test with a small batch** of payslips first

## Alternative Solutions (if Puppeteer still fails)

### Option 1: Use @react-pdf/renderer
Replace Puppeteer with a pure JavaScript PDF generation library:

```bash
npm install @react-pdf/renderer
```

### Option 2: Use Playwright
Replace Puppeteer with Playwright (better production support):

```bash
npm install playwright
```

### Option 3: Serverless PDF Service
Use an external service like:
- PDFShift
- HTML/CSS to PDF API
- Puppeteer as a service

## Monitoring

Check these logs in production:
- Browser launch errors
- Template file access errors
- PDF generation timeouts
- Memory usage during generation

## Common Production Issues

1. **Chrome not found**: Install Chrome in production environment
2. **Memory limits**: Reduce batch size or increase memory allocation
3. **Timeout errors**: Increase function timeout limits
4. **File permissions**: Ensure template file is readable
5. **Missing fonts**: Install required fonts in production

## Next Steps

1. Deploy the updated code
2. Test payslip generation
3. Monitor logs for any remaining issues
4. Consider alternative PDF generation methods if needed
