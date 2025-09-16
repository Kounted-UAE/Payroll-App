# Payslip Filename Update

## Overview
Updated payslip PDF filenames to include employee names for better organization and identification.

## Changes Made

### New Filename Format
- **Old**: `{token}.pdf` (e.g., `84b292d3-fa5b-4316-b5c8-86472ddb7780.pdf`)
- **New**: `{sanitized_employee_name}_{token}.pdf` (e.g., `aamir_moiz_ali_84b292d3-fa5b-4316-b5c8-86472ddb7780.pdf`)

### Files Updated

#### 1. New Utility Functions (`lib/utils/pdf/payslipNaming.ts`)
- `sanitizeFilename()` - Sanitizes employee names for safe filenames
- `generatePayslipFilename()` - Creates the new filename format
- `extractTokenFromFilename()` - Extracts token from filename (handles both formats)
- `extractEmployeeNameFromFilename()` - Extracts employee name from new format
- `isNewFilenameFormat()` - Checks if filename uses new format

#### 2. API Updates
- **`app/api/admin/payslips/generate/route.ts`** - Updated to use new naming in both Puppeteer and fallback methods

#### 3. Component Updates
- **`components/admin/PayslipFiltersAndTable.tsx`** - Updated PDF links and ZIP download
- **`components/admin/PayslipEmailFlow.tsx`** - Updated email PDF URLs
- **`components/advontier-payroll/actions/PayslipSelectionTable.tsx`** - Updated PDF links

#### 4. Migration Script
- **`scripts/migrate-payslip-filenames.ts`** - Script to update existing payslips
- **`package.json`** - Added `migrate-payslips` script

## Backward Compatibility

The system maintains backward compatibility:
- New payslips use the new naming format
- Existing payslips continue to work with old format
- The `extractTokenFromFilename()` function handles both formats
- Migration script can update existing payslips to new format

## Usage

### For New Payslips
The new naming is automatically applied when generating payslips.

### For Existing Payslips
Run the migration script to update existing payslips:

```bash
pnpm run migrate-payslips
```

### Manual Filename Generation
```typescript
import { generatePayslipFilename } from '@/lib/utils/pdf/payslipNaming'

const filename = generatePayslipFilename('Aamir Moiz Ali', '84b292d3-fa5b-4316-b5c8-86472ddb7780')
// Result: 'aamir_moiz_ali_84b292d3-fa5b-4316-b5c8-86472ddb7780.pdf'
```

## Benefits

1. **Better Organization**: PDFs are easier to identify by employee name
2. **Improved UX**: Users can quickly find payslips by employee name
3. **Maintained Uniqueness**: Token ensures unique filenames
4. **Backward Compatibility**: Existing payslips continue to work
5. **Safe Filenames**: Employee names are sanitized for filesystem safety

## Example URLs

### Before
```
https://alryjvnddvrrgbuvednm.supabase.co/storage/v1/object/public/generated-pdfs/payslips/84b292d3-fa5b-4316-b5c8-86472ddb7780.pdf
```

### After
```
https://alryjvnddvrrgbuvednm.supabase.co/storage/v1/object/public/generated-pdfs/payslips/aamir_moiz_ali_84b292d3-fa5b-4316-b5c8-86472ddb7780.pdf
```

## Testing

1. Generate new payslips and verify filenames include employee names
2. Test PDF links in all components work correctly
3. Test ZIP download includes properly named files
4. Test email functionality with new URLs
5. Run migration script on existing data (optional)

## Notes

- Employee names are sanitized to remove special characters and spaces
- Multiple spaces are replaced with single underscores
- The token remains unchanged for database consistency
- All existing functionality continues to work without changes
