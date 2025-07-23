import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Mail
} from "lucide-react"
import { Link } from "react-router-dom"

const PayrollEmployers = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const employers = [
    {
      id: 1,
      legal_name: "Emirates Technology LLC",
      trade_license: "DED-123456",
      jurisdiction: "Dubai Mainland",
      license_expiry: "2025-12-31",
      mohre_id: "MOH-789123",
      bank_name: "Emirates NBD",
      employee_count: 85,
      status: "Active",
      contact_email: "hr@emiratestech.ae",
      contact_phone: "+971-4-1234567",
      address: "Dubai Internet City, Dubai"
    },
    {
      id: 2,
      legal_name: "Al Noor Industries PJSC",
      trade_license: "ADCCI-987654",
      jurisdiction: "Abu Dhabi",
      license_expiry: "2025-08-15",
      mohre_id: "MOH-456789",
      bank_name: "ADCB",
      employee_count: 156,
      status: "Active",
      contact_email: "payroll@alnoor.ae",
      contact_phone: "+971-2-9876543",
      address: "Khalifa Industrial Zone, Abu Dhabi"
    },
    {
      id: 3,
      legal_name: "Gulf Trading Company LLC",
      trade_license: "DED-555888",
      jurisdiction: "Dubai",
      license_expiry: "2025-03-20",
      mohre_id: "MOH-321654",
      bank_name: "FAB",
      employee_count: 42,
      status: "Active",
      contact_email: "admin@gulftrading.ae",
      contact_phone: "+971-4-5555888",
      address: "Deira, Dubai"
    }
  ]

  const filteredEmployers = employers.filter(employer =>
    employer.legal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employer.trade_license.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employers</h1>
          <p className="text-muted-foreground">
            Manage client companies and their payroll setup
          </p>
        </div>
        <Link to="/payroll/employers/new">
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

      {/* Employers List */}
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
                      <span>{employer.jurisdiction}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={employer.status === "Active" ? "default" : "secondary"}>
                    {employer.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
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
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{employer.contact_email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{employer.contact_phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{employer.address}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Compliance Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">MoHRE ID:</span>
                      <span className="text-sm font-medium">{employer.mohre_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Bank:</span>
                      <span className="text-sm font-medium">{employer.bank_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">License Expiry:</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{employer.license_expiry}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Employee Stats
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Employees:</span>
                      <span className="text-lg font-bold text-blue-600">{employer.employee_count}</span>
                    </div>
                    <div className="pt-2">
                      <Link to={`/payroll/employees?employer=${employer.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Employees
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No employers found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first client employer"}
            </p>
            <Link to="/payroll/employers/new">
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