import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// NOTE: If you see a papaparse import error, run: npm install papaparse @types/papaparse
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
  objectName: string; // e.g. "Employer"
  tableName: string; // e.g. "payroll_objects_employers"
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

  // Handle CSV file upload and parse
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedRows(results.data as any[]);
        // Validate rows
        const valid: T[] = [];
        const errors: { row: number; error: string }[] = [];
        (results.data as any[]).forEach((row, idx) => {
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

  // Handle import to Supabase
  const handleImport = async () => {
    setImporting(true);
    let rows = validationResults.valid;
    if (transform) {
      rows = await Promise.all(rows.map(transform));
    }
    const { error, count } = await supabase.from(tableName).insert(rows, { count: 'exact' });
    setImporting(false);
    if (error) {
      toast({ title: 'Import Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Import Success', description: `Imported ${rows.length} ${objectName.toLowerCase()}(s).` });
      onOpenChange(false);
    }
  };

  // Handle export from Supabase
  const handleExport = async () => {
    setExporting(true);
    let query = supabase.from(tableName).select('*', { head: false });
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

  // Handle template download
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Import/Export {objectName}s</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-2 mb-4">
          <Button variant={tab === 'import' ? 'default' : 'outline'} onClick={() => setTab('import')}>Import CSV</Button>
          <Button variant={tab === 'export' ? 'default' : 'outline'} onClick={() => setTab('export')}>Export CSV</Button>
          <Button variant={tab === 'template' ? 'default' : 'outline'} onClick={() => setTab('template')}>Download Template</Button>
        </div>
        {tab === 'import' && (
          <div>
            <Input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} />
            {parsedRows.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-xs text-muted-foreground">Preview ({parsedRows.length} rows):</div>
                <div className="overflow-x-auto max-h-48 border rounded">
                  <table className="text-xs w-full">
                    <thead>
                      <tr>
                        {templateHeaders.map(h => <th key={h} className="px-2 py-1 bg-muted text-left">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(0, 10).map((row, i) => (
                        <tr key={i}>
                          {templateHeaders.map(h => <td key={h} className="px-2 py-1">{row[h]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-xs">
                  {validationResults.errors.length > 0 ? (
                    <Badge variant="destructive">{validationResults.errors.length} row(s) with errors</Badge>
                  ) : (
                    <Badge variant="default">All rows valid</Badge>
                  )}
                </div>
                {validationResults.errors.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto text-xs text-destructive">
                    <ul>
                      {validationResults.errors.map((err, i) => (
                        <li key={i}>Row {err.row}: {err.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setCsvFile(null)} disabled={importing}>Cancel</Button>
                  <Button onClick={handleImport} disabled={importing || validationResults.valid.length === 0}>
                    {importing && <span className="animate-spin mr-2">⏳</span>}
                    Import {validationResults.valid.length} {objectName}(s)
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'export' && (
          <div>
            <div className="mb-2 text-xs text-muted-foreground">Export all or filtered {objectName}s as CSV.</div>
            <Button onClick={handleExport} disabled={exporting}>
              {exporting && <span className="animate-spin mr-2">⏳</span>}
              Export CSV
            </Button>
          </div>
        )}
        {tab === 'template' && (
          <div>
            <div className="mb-2 text-xs text-muted-foreground">Download a sample CSV template for {objectName}s.</div>
            <Button onClick={handleDownloadTemplate} disabled={downloading}>
              {downloading && <span className="animate-spin mr-2">⏳</span>}
              Download Template
            </Button>
            <div className="mt-4 text-xs text-muted-foreground">
              <div>Fields:</div>
              <ul className="list-disc ml-6">
                {templateHeaders.map(h => <li key={h}>{h}</li>)}
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 