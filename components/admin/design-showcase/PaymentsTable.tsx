import { Card, CardContent, CardHeader, CardTitle } from "@/components/react-ui/card";
import { Button } from "@/components/react-ui/button";
import { Badge } from "@/components/react-ui/badge";
import { Checkbox } from "@/components/react-ui/checkbox";
import { MoreHorizontal } from "lucide-react";

export const PaymentsTable = () => {
  const payments = [
    { email: "ken99@example.com", status: "Success", amount: "$316.00" },
    { email: "abe45@example.com", status: "Success", amount: "$242.00" },
    { email: "monserrat44@example.com", status: "Processing", amount: "$837.00" },
    { email: "carmella@example.com", status: "Failed", amount: "$721.00" },
    { email: "jason78@example.com", status: "Pending", amount: "$450.00" },
    { email: "sarah23@example.com", status: "Success", amount: "$1,280.00" }
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Success": return "default";
      case "Processing": return "secondary";
      case "Failed": return "destructive";
      case "Pending": return "outline";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success": return "bg-success/10 text-success hover:bg-success/20";
      case "Processing": return "bg-processing/10 text-processing hover:bg-processing/20";
      case "Failed": return "bg-failed/10 text-failed hover:bg-failed/20";
      case "Pending": return "bg-warning/10 text-warning hover:bg-warning/20";
      default: return "";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xs">Payments</CardTitle>
            <p className="text-xs text-zinc-400">Manage your payments.</p>
          </div>
          <Button size="sm">Add Payment</Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-3 text-xs font-medium text-zinc-400 border-b">
          <div className="col-span-1">
            <Checkbox />
          </div>
          <div className="col-span-3">Status</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-3">Amount</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0">
          {payments.map((payment, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 py-3 text-xs border-b last:border-b-0 hover:bg-zinc-100/30">
              <div className="col-span-1 flex items-center">
                <Checkbox />
              </div>
              <div className="col-span-3 flex items-center">
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(payment.status)} text-xs`}
                >
                  {payment.status}
                </Badge>
              </div>
              <div className="col-span-4 flex items-center text-zinc-400">
                {payment.email}
              </div>
              <div className="col-span-3 flex items-center font-medium">
                {payment.amount}
              </div>
              <div className="col-span-1 flex items-center">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 text-xs text-zinc-400">
          <span>0 of 6 row(s) selected.</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};