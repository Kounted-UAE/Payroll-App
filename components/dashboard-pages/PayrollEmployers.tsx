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
  AlertCircle
} from "lucide-react"
import Link from "next/link"

const PayrollEmployers = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const { 
    employers, 
    loading, 
    error, 
    deleteEmployer 
  } = usePayrollEmployers()

  const filteredEmployers = employers.filter(employer =>
    employer.legal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employer.trade_license.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-bold">Error Loading Employers</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
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
          <h1 className="text-3xl font-bold tracking-tight">Employers</h1>
          <p className="text-muted-foreground">
            Manage client companies and their payroll setup
          </p>
        </div>
        <Link href="/backyard/payroll/employers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employer
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
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

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Employers List */}
      {!loading && (
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
                      <CardTitle className="text-xl">{employer.legal_name}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span>License: {employer.trade_license}</span>
                        <span>•</span>
                        <span>Updated: {new Date(employer.updated_at).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">
                      Active
                    </Badge>
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
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      {employer.contact_info && typeof employer.contact_info === 'object' && (
                        <>
                          {employer.contact_info.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{employer.contact_info.email}</span>
                            </div>
                          )}
                          {employer.contact_info.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{employer.contact_info.phone}</span>
                            </div>
                          )}
                        </>
                      )}
                      {employer.address && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{employer.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Compliance Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Trade License:</span>
                        <span className="text-sm font-medium">{employer.trade_license}</span>
                      </div>
                      {employer.wps_details && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">WPS Details:</span>
                          <span className="text-sm font-medium">Configured</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Updated:</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {new Date(employer.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
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

      {!loading && filteredEmployers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No employers found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first client employer"}
            </p>
            <Link href="/backyard/payroll/employers/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Employer
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PayrollEmployers