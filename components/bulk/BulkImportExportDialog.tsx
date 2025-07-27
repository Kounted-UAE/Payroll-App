'use client'

import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Papa from 'papaparse';
import { z, ZodSchema } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export type BulkImportExportDialogProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objectName: string;
  tableName: string;
  schema: ZodSchema<T>;
  templateHeaders: string[];
  exampleRow: Partial<T>;
  transform?: (row: T) => T | Promise<T>;
  filters?: Record<string, any>;
};

export function BulkImportExportDialog<T>({
  open,
  onOpenChange,
  objectName,
  tableName,
  schema,
  templateHeaders,
  exampleRow,
  transform,
  filters
}: BulkImportExportDialogProps<T>) {
  const [tab, setTab] = useState<'import' | 'export' | 'template'>('import');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<{ valid: T[]; errors: { row: number; error: string }[] }>({ valid: [], errors: [] });
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];
        setParsedRows(rows);
        const valid: T[] = [];
        const errors: { row: number; error: string }[] = [];
        rows.forEach((row, idx) => {
          const parsed = schema.safeParse(row);
          if (parsed.success) {
            valid.push(parsed.data);
          } else {
            errors.push({ row: idx + 2, error: parsed.error.errors.map(e => e.message).join('; ') });
          }
        });
        setValidationResults({ valid, errors });
      },
      error: (err) => {
        toast({ title: 'CSV Parse Error', description: err.message, variant: 'destructive' });
      }
    });
  };

  const handleCopyErrors = () => {
    const text = validationResults.errors.map(e => `Row ${e.row}: ${e.error}`).join('\n');
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied', description: 'Error messages copied to clipboard.' });
  };

  const handleImport = async () => {
    setImporting(true);
    let rows = validationResults.valid;
    
    try {
      // Apply transform if provided
      if (transform) {
        console.log('🔄 Applying transform to', rows.length, 'rows...');
        rows = await Promise.all(rows.map(transform));
        console.log('✅ Transform completed. Sample row:', rows[0]);
      }
      
      console.log('📊 Attempting to insert', rows.length, 'rows into', tableName);
      console.log('📋 Sample data being inserted:', JSON.stringify(rows.slice(0, 1), null, 2));
      console.log('📦 Total rows:', rows.length);
      
      // Test with single row first if multiple rows
      if (rows.length > 1) {
        console.log('🧪 Testing single row insert first...');
        const testResult = await supabase.from(tableName).insert(rows[0]);
        if (testResult.error) {
          console.error('❌ Single row test failed:', testResult.error);
          console.log('🔍 Failed row data:', JSON.stringify(rows[0], null, 2));
          toast({ 
            title: 'Import Error', 
            description: `Test insert failed: ${testResult.error.message || 'Constraint violation'}`, 
            variant: 'destructive' 
          });
          return;
        } else {
          console.log('✅ Single row test successful, proceeding with batch insert...');
        }
      }
      
      // Enhanced insert with better error handling
      const { data, error } = await supabase.from(tableName).insert(rows);
      
      if (error) {
        console.error('❌ Supabase insert error:', error);
        console.error('🔍 Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        console.log('🔍 Inserted row shape:', JSON.stringify(rows[0], null, 2));
        console.log('🔍 All rows shape:', rows.map((row, i) => ({ row: i, keys: Object.keys(row) })));
        
        // Check for common constraint violations
        let errorMessage = error.message || 'Unknown constraint violation';
        if (error.code === '23505') {
          errorMessage = 'Duplicate entry detected (unique constraint violation)';
        } else if (error.code === '23502') {
          errorMessage = 'Required field missing (NOT NULL constraint violation)';
        } else if (error.code === '22P02') {
          errorMessage = 'Invalid data type (type mismatch)';
        }
        
        toast({ 
          title: 'Import Error', 
          description: `Database error: ${errorMessage}`, 
          variant: 'destructive' 
        });
      } else {
        console.log('✅ Insert successful. Inserted data:', data);
        toast({ 
          title: 'Import Success', 
          description: `Successfully imported ${rows.length} ${objectName.toLowerCase()}(s).` 
        });
        onOpenChange(false);
      }
    } catch (err) {
      console.error('💥 Unexpected error during import:', err);
      toast({ 
        title: 'Import Error', 
        description: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`, 
        variant: 'destructive' 
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    let query = supabase.from(tableName).select('*');
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    setExporting(false);
    if (error) {
      toast({ title: 'Export Error', description: error.message, variant: 'destructive' });
      return;
    }
    const csv = Papa.unparse(data, { columns: templateHeaders });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${objectName.toLowerCase()}s_export.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Export Success', description: `Exported ${data.length} ${objectName.toLowerCase()}(s).` });
  };

  const handleDownloadTemplate = () => {
    setDownloading(true);
    const csv = Papa.unparse([exampleRow], { columns: templateHeaders });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${objectName.toLowerCase()}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  const resetImport = () => {
    setParsedRows([]);
    setValidationResults({ valid: [], errors: [] });
    setCsvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import/Export {objectName}s</DialogTitle>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <Button 
            variant={tab === 'import' ? 'default' : 'outline'} 
            onClick={() => setTab('import')}
            className="flex-1"
          >
            Import CSV
          </Button>
          <Button 
            variant={tab === 'export' ? 'default' : 'outline'} 
            onClick={() => setTab('export')}
            className="flex-1"
          >
            Export CSV
          </Button>
          <Button 
            variant={tab === 'template' ? 'default' : 'outline'} 
            onClick={() => setTab('template')}
            className="flex-1"
          >
            Download Template
          </Button>
        </div>

        {/* Import Tab */}
        {tab === 'import' && (
          <div className="space-y-6">
            {/* File Input */}
            <div>
              <Input 
                type="file" 
                accept=".csv" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            {/* Preview and Validation Results */}
            {parsedRows.length > 0 && (
              <div className="space-y-4">
                {/* Preview Table */}
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">
                    Preview ({parsedRows.length} rows):
                  </div>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="text-xs w-full">
                      <thead>
                        <tr className="bg-muted">
                          {templateHeaders.map(h => (
                            <th key={h} className="px-3 py-2 text-left font-medium">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedRows.slice(0, 10).map((row, i) => (
                          <tr key={i} className="border-t">
                            {templateHeaders.map(h => (
                              <td key={h} className="px-3 py-2">
                                {row[h] || ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Validation Status */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  {validationResults.errors.length > 0 ? (
                    <>
                      <Badge variant="destructive" className="text-sm">
                        {validationResults.errors.length} row(s) with errors
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyErrors}
                        className="text-xs"
                      >
                        Copy Errors
                      </Button>
                    </>
                  ) : (
                    <Badge variant="default" className="text-sm">
                      All rows valid
                    </Badge>
                  )}
                </div>

                {/* Error Details */}
                {validationResults.errors.length > 0 && (
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-2 text-destructive">
                      Validation Errors:
                    </div>
                    <div className="max-h-32 overflow-y-auto text-xs text-destructive">
                      <ul className="space-y-1">
                        {validationResults.errors.map((err, i) => (
                          <li key={i} className="flex">
                            <span className="font-mono mr-2">Row {err.row}:</span>
                            <span>{err.error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={resetImport}
                    disabled={importing}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={importing || validationResults.valid.length === 0}
                    className="min-w-[120px]"
                  >
                    {importing ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Importing...
                      </>
                    ) : (
                      `Import ${validationResults.valid.length} ${objectName}(s)`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export Tab */}
        {tab === 'export' && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-4">
                Export all or filtered {objectName}s as CSV.
              </div>
              <Button 
                onClick={handleExport} 
                disabled={exporting}
                className="w-full"
              >
                {exporting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Exporting...
                  </>
                ) : (
                  'Export CSV'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Template Tab */}
        {tab === 'template' && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-4">
                Download a sample CSV template for {objectName}s.
              </div>
              <Button 
                onClick={handleDownloadTemplate} 
                disabled={downloading}
                className="w-full"
              >
                {downloading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Downloading...
                  </>
                ) : (
                  'Download Template'
                )}
              </Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-sm font-medium mb-3">Template Fields:</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                {templateHeaders.map(h => (
                  <div key={h} className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    {h}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
