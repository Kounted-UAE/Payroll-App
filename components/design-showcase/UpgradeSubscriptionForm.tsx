'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export const UpgradeSubscriptionForm = () => {
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [formData, setFormData] = useState({
    name: "Evil Rabbit",
    email: "example@acme.com",
    cardNumber: "1234 1234 1234 1234",
    expiry: "MM/YY",
    cvc: "CVC",
    notes: ""
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Upgrade your subscription</CardTitle>
        <p className="text-sm text-muted-foreground">
          You are currently on the free plan. Upgrade to the pro plan to get access to all features.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name and Email */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="h-9"
            />
          </div>
        </div>

        {/* Card Details */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className="text-xs">Card Number</Label>
          <Input
            id="cardNumber"
            value={formData.cardNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="expiry" className="text-xs">MM/YY</Label>
            <Input
              id="expiry"
              value={formData.expiry}
              onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc" className="text-xs">CVC</Label>
            <Input
              id="cvc"
              value={formData.cvc}
              onChange={(e) => setFormData(prev => ({ ...prev, cvc: e.target.value }))}
              className="h-9"
            />
          </div>
        </div>

        {/* Plan Selection */}
        <div className="space-y-3">
          <Label className="text-xs">Plan</Label>
          <p className="text-xs text-muted-foreground">
            Select the plan that best fits your needs.
          </p>
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="starter" id="starter" />
              <div className="flex-1">
                <Label htmlFor="starter" className="text-sm font-medium">Starter Plan</Label>
                <p className="text-xs text-muted-foreground">Perfect for small businesses.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="pro" id="pro" />
              <div className="flex-1">
                <Label htmlFor="pro" className="text-sm font-medium">Pro Plan</Label>
                <p className="text-xs text-muted-foreground">More features and storage.</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-xs">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Enter notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="min-h-[60px] resize-none"
          />
        </div>

        {/* Terms and Email checkbox */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="text-xs">
              I agree to the terms and conditions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="emails" />
            <Label htmlFor="emails" className="text-xs">
              Allow us to send you emails
            </Label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            Upgrade Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};