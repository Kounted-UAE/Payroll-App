import { Card, CardContent, CardHeader, CardTitle } from "@/components/react-ui/card";
import { TrendingUp } from "lucide-react";

export const RevenueCard = () => {
  // Sample data for the trend line
  const trendData = [45, 52, 48, 61, 55, 67, 69, 73, 78, 85];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-blue-200">
            Total Revenue
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs font-bold">$15,231.89</div>
        <p className="text-xs text-success flex items-center gap-1 mt-1">
          <span>+20.1% from last month</span>
        </p>
        
        {/* Mini trend chart */}
        <div className="mt-4 h-12 flex items-end gap-1">
          {trendData.map((value, index) => (
            <div
              key={index}
              className="bg-success/20 flex-1 rounded-sm min-w-[2px] transition-all hover:bg-success/40"
              style={{ height: `${(value / 100) * 100}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};