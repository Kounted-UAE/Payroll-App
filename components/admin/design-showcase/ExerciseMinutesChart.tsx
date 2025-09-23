import { Card, CardContent, CardHeader, CardTitle } from "@/components/react-ui/card";

export const ExerciseMinutesChart = () => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const exerciseData = [45, 30, 65, 40, 55, 35, 60];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium text-blue-200">
          Exercise Minutes
        </CardTitle>
        <p className="text-xs text-blue-200">
          Your exercise minutes are ahead of where you normally are.
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Line chart */}
        <div className="h-32 relative mb-4">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 128"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="exerciseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((line) => (
              <line
                key={line}
                x1="0"
                y1={line * 32}
                x2="400"
                y2={line * 32}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}
            
            {/* Data line */}
            <path
              d={`M${exerciseData.map((value, index) => 
                `${index === 0 ? 'M' : 'L'}${(index * 400) / (exerciseData.length - 1)},${128 - (value / 70) * 128}`
              ).join(' ')}`}
              stroke="hsl(var(--success))"
              strokeWidth="2"
              fill="none"
              className="drop-shadow-sm"
            />
            
            {/* Data points */}
            {exerciseData.map((value, index) => (
              <circle
                key={index}
                cx={(index * 400) / (exerciseData.length - 1)}
                cy={128 - (value / 70) * 128}
                r="3"
                fill="hsl(var(--success))"
                className="drop-shadow-sm"
              />
            ))}
            
            {/* Fill area under curve */}
            <path
              d={`M${exerciseData.map((value, index) => 
                `${index === 0 ? 'M' : 'L'}${(index * 400) / (exerciseData.length - 1)},${128 - (value / 70) * 128}`
              ).join(' ')} L400,128 L0,128 Z`}
              fill="url(#exerciseGradient)"
            />
          </svg>
        </div>

        {/* Week days labels */}
        <div className="flex justify-between text-xs text-blue-200">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};