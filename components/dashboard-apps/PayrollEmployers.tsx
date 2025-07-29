// components/dashboard-apps/PayrollEmployers.tsx

'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { usePayrollEmployers } from "@/hooks/usePayroll"
import {
  Building,
  Search,
  Plus,
  Eye,
  Edit,
  Upload,
  Calendar,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  LayoutGrid,
  List as ListIcon,
  Trash2Icon,
} from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BulkImportExportDialog } from '@/components/bulk/BulkImportExportDialog'
import { employerCsvSchema, EMPLOYER_CSV_TEMPLATE, EMPLOYER_EXAMPLE_ROW } from '@/lib/validators/employerCsvSchema'

const PayrollEmployers = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const {
    employers,
    loading,
    error,
    deleteEmployer
  } = usePayrollEmployers()

  const filteredEmployers = employers.filter(employer =>
    employer.legal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employer.trade_license || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteEmployer = async (id: string, name: string) => {
    try {
      await deleteEmployer(id)
      toast({
        title: "Employer deleted",
        description: `${name} has been successfully deleted.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employer. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-xs font-bold">Error Loading Employers</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Employers</h1>
          <p className="text-md text-muted-foreground">
            Manage client companies and their payroll setup
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className={`p-2 rounded ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            className={`p-2 rounded ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setView('list')}
            aria-label="List view"
          >
            <ListIcon className="h-5 w-5" />
          </Button>
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Bulk Import/Export
          </Button>
          <Link href="/backyard/payroll/employers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employer
            </Button>
          </Link>
        </div>
      </div>

      <BulkImportExportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        objectName="Employer"
        tableName="payroll_objects_employers"
        schema={employerCsvSchema}
        templateHeaders={EMPLOYER_CSV_TEMPLATE}
        exampleRow={EMPLOYER_EXAMPLE_ROW}
      />

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employers by name or license..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View: Grid */}
      {!loading && view === 'grid' && (
        <div className="grid gap-6">
          {filteredEmployers.map((employer) => (
            <Card key={employer.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xs">{employer.legal_name}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span>License: {employer.trade_license}</span>
                        <span>•</span>
                        <span>Updated: {new Date(employer.updated_at).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Active</Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEmployer(employer.id, employer.legal_name)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      {employer.email && <div className="text-xs">{employer.email}</div>}
                      {employer.phone && <div className="text-xs">{employer.phone}</div>}
                      {employer.website && <div className="text-xs">{employer.website}</div>}
                      {employer.address && <div className="text-xs">{employer.address}</div>}
                    </div>
                  </div>

                  {/* Compliance */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Compliance Details
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div>MOHRE ID: {employer.mohre_id}</div>
                      <div>Bank: {employer.bank_name}</div>
                      <div>Bank Code: {employer.bank_code}</div>
                      <div>Routing #: {employer.routing_number}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Actions
                    </h4>
                    <div className="space-y-2">
                      <Link href={`/backyard/payroll/employees?employer=${employer.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Employees
                        </Button>
                      </Link>
                      <Link href={`/backyard/payroll/payruns?employer=${employer.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Payruns
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View: List */}
      {!loading && view === 'list' && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Trade License</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployers.map((employer) => (
              <TableRow key={employer.id}>
                <TableCell className="font-medium">{employer.legal_name}</TableCell>
                <TableCell>{employer.trade_license}</TableCell>
                <TableCell>{employer.email}</TableCell>
                <TableCell>{employer.phone}</TableCell>
                <TableCell>
                  <Badge variant="default">Active</Badge>
                </TableCell>
                <TableCell>{new Date(employer.updated_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEmployer(employer.id, employer.legal_name)}
                    >
                      <Trash2Icon className="text-red-700 h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default PayrollEmployers
