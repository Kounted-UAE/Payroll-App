import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const SubscriptionsCard = () => {
  // Sample data for the curved chart
  const chartData = [32, 45, 38, 52, 47, 61, 55, 49, 43, 38, 42, 35];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-blue-200">
            Subscriptions
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
            View More
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs font-bold">+2,350</div>
        <p className="text-xs text-success flex items-center gap-1 mt-1">
          <span>+180.1% from last month</span>
        </p>
        
        {/* Curved line chart */}
        <div className="mt-4 h-16 relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 64"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            
            {/* Create curved path */}
            <path
              d={`M0,${64 - chartData[0]} ${chartData.map((value, index) => 
                `L${(index * 300) / (chartData.length - 1)},${64 - value}`
              ).join(' ')}`}
              stroke="hsl(var(--success))"
              strokeWidth="2"
              fill="none"
              className="drop-shadow-sm"
            />
            
            {/* Fill area under curve */}
            <path
              d={`M0,${64 - chartData[0]} ${chartData.map((value, index) => 
                `L${(index * 300) / (chartData.length - 1)},${64 - value}`
              ).join(' ')} L300,64 L0,64 Z`}
              fill="url(#chartGradient)"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};