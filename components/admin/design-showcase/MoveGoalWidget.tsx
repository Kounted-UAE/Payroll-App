'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/react-ui/card";
import { Button } from "@/components/react-ui/button";
import { Minus, Plus } from "lucide-react";

export const MoveGoalWidget = () => {
  const [goal, setGoal] = useState(350);
  
  // Sample data for daily calories over 2 weeks
  const dailyData = [280, 320, 290, 380, 260, 400, 350, 310, 285, 395, 340, 365, 275, 410];

  const adjustGoal = (amount: number) => {
    setGoal(prev => Math.max(100, Math.min(1000, prev + amount)));
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium text-blue-200">
          Move Goal
        </CardTitle>
        <p className="text-xs text-blue-200">
          Set your daily activity goal.
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Goal selector */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustGoal(-25)}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="text-center">
            <div className="text-lg font-bold">{goal}</div>
            <div className="text-xs text-blue-200">CALORIES/DAY</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustGoal(25)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Bar chart */}
        <div className="space-y-2">
          <div className="flex items-end justify-between gap-1 h-16">
            {dailyData.map((calories, index) => {
              const height = (calories / 450) * 100; // Scale to container
              const isGoalMet = calories >= goal;
              
              return (
                <div
                  key={index}
                  className={`flex-1 rounded-t-sm transition-all hover:opacity-80 ${
                    isGoalMet ? 'bg-success' : 'bg-success/40'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`Day ${index + 1}: ${calories} calories`}
                />
              );
            })}
          </div>
        </div>

        <Button className="w-full" size="sm">
          Set Goal
        </Button>
      </CardContent>
    </Card>
  );
};