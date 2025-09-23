'use client'

import { useState } from "react";
import { Button } from "@/components/react-ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/react-ui/card";
import { Badge } from "@/components/react-ui/badge";
import { Input } from "@/components/react-ui/input";
import { Label } from "@/components/react-ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/react-ui/select";
import { ShoppingCart, Plus, Minus, Calendar, User, CreditCard } from "lucide-react";
import { Separator } from "@/components/react-ui/separator";
import { useToast } from "@/hooks/use-toast";

interface ServiceSKU {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  configFields: {
    quantity?: { label: string; min: number; max: number };
    date?: { label: string; required: boolean };
    duration?: { label: string; options: string[] };
  };
}

interface CartItem extends ServiceSKU {
  quantity: number;
  selectedDate?: string;
  selectedDuration?: string;
  totalPrice: number;
}

const serviceSKUs: ServiceSKU[] = [
  {
    id: "tax-reg-basic",
    name: "Basic Tax Registration",
    description: "Standard business tax registration and setup",
    basePrice: 299,
    category: "Tax Services",
    configFields: {
      quantity: { label: "Number of Entities", min: 1, max: 10 },
      date: { label: "Effective Date", required: true }
    }
  },
  {
    id: "visa-app-work",
    name: "Work Visa Application",
    description: "Complete work visa application processing",
    basePrice: 899,
    category: "Immigration",
    configFields: {
      quantity: { label: "Number of Applicants", min: 1, max: 5 },
      duration: { label: "Support Duration", options: ["1 month", "3 months", "6 months"] }
    }
  },
  {
    id: "backlog-accounting",
    name: "Backlog Accounting Cleanup",
    description: "Comprehensive accounting backlog resolution",
    basePrice: 1299,
    category: "Accounting",
    configFields: {
      quantity: { label: "Number of Months", min: 1, max: 24 },
      date: { label: "Start Date", required: true },
      duration: { label: "Completion Timeline", options: ["2 weeks", "1 month", "2 months"] }
    }
  },
  {
    id: "compliance-audit",
    name: "Compliance Audit",
    description: "Full regulatory compliance assessment",
    basePrice: 799,
    category: "Compliance",
    configFields: {
      quantity: { label: "Number of Entities", min: 1, max: 5 },
      duration: { label: "Report Delivery", options: ["1 week", "2 weeks", "1 month"] }
    }
  },
  {
    id: "payroll-setup",
    name: "Payroll System Setup",
    description: "Complete payroll system implementation",
    basePrice: 599,
    category: "Payroll",
    configFields: {
      quantity: { label: "Number of Employees", min: 1, max: 100 },
      date: { label: "Go-Live Date", required: true }
    }
  }
];

export default function KwiverKiosk() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [checkoutStep, setCheckoutStep] = useState<number>(0);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    company: "",
    phone: ""
  });
  const { toast } = useToast();

  const categories = ["all", ...Array.from(new Set(serviceSKUs.map(sku => sku.category)))];
  const filteredSKUs = selectedCategory === "all" 
    ? serviceSKUs 
    : serviceSKUs.filter(sku => sku.category === selectedCategory);

  const addToCart = (sku: ServiceSKU, config: any) => {
    const totalPrice = sku.basePrice * (config.quantity || 1);
    const cartItem: CartItem = {
      ...sku,
      quantity: config.quantity || 1,
      selectedDate: config.date,
      selectedDuration: config.duration,
      totalPrice
    };

    setCart(prev => [...prev, { ...cartItem, id: `${cartItem.id}-${Date.now()}` }]);
    toast({
      title: "Added to Cart",
      description: `${sku.name} has been added to your cart`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    setCart(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, totalPrice: item.basePrice * newQuantity }
        : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const ServiceCard = ({ sku }: { sku: ServiceSKU }) => {
    const [config, setConfig] = useState<any>({
      quantity: sku.configFields.quantity?.min || 1
    });

    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xs">{sku.name}</CardTitle>
              <CardDescription>{sku.description}</CardDescription>
            </div>
            <Badge variant="secondary">{sku.category}</Badge>
          </div>
          <div className="text-xs font-bold text-primary">
            ${sku.basePrice.toLocaleString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sku.configFields.quantity && (
            <div>
              <Label>{sku.configFields.quantity.label}</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfig({...config, quantity: Math.max(sku.configFields.quantity!.min, config.quantity - 1)})}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={config.quantity}
                  onChange={(e) => setConfig({...config, quantity: parseInt(e.target.value) || 1})}
                  className="w-20 text-center"
                  min={sku.configFields.quantity.min}
                  max={sku.configFields.quantity.max}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfig({...config, quantity: Math.min(sku.configFields.quantity!.max, config.quantity + 1)})}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {sku.configFields.date && (
            <div>
              <Label>{sku.configFields.date.label}</Label>
              <Input
                type="date"
                value={config.date || ""}
                onChange={(e) => setConfig({...config, date: e.target.value})}
                className="mt-1"
              />
            </div>
          )}

          {sku.configFields.duration && (
            <div>
              <Label>{sku.configFields.duration.label}</Label>
              <Select onValueChange={(value) => setConfig({...config, duration: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {sku.configFields.duration.options.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="pt-4">
            <div className="text-xs font-semibold mb-2">
              Total: ${(sku.basePrice * (config.quantity || 1)).toLocaleString()}
            </div>
            <Button 
              onClick={() => addToCart(sku, config)}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CartSummary = () => (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart ({cart.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <p className="text-blue-400">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="border-b pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-xs text-blue-200">
                      Qty: {item.quantity}
                      {item.selectedDate && ` • Date: ${item.selectedDate}`}
                      {item.selectedDuration && ` • Duration: ${item.selectedDuration}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-right font-medium">
                  ${item.totalPrice.toLocaleString()}
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center text-xs font-bold">
              <span>Total:</span>
              <span>${cartTotal.toLocaleString()}</span>
            </div>
            <Button 
              onClick={() => setCheckoutStep(1)}
              className="w-full"
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const CheckoutFlow = () => {
    switch (checkoutStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={customerDetails.company}
                    onChange={(e) => setCustomerDetails({...customerDetails, company: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={() => setCheckoutStep(0)}>
                  Back to Cart
                </Button>
                <Button onClick={() => setCheckoutStep(2)}>
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Order Summary</h4>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>${item.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <Button className="w-full" size="lg">
                    Pay with Stripe
                  </Button>
                  <Button variant="outline" className="w-full">
                    Generate Payment Link
                  </Button>
                  <Button variant="outline" className="w-full">
                    Send PDF Invoice
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setCheckoutStep(1)}>
                  Back
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Order Submitted",
                    description: "Your order has been submitted successfully",
                  });
                  setCheckoutStep(0);
                  setCart([]);
                }}>
                  Complete Order
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (checkoutStep > 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-lg font-bold">Checkout</h1>
            <p className="text-blue-400">Complete your service order</p>
          </div>
          <CheckoutFlow />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-lg font-bold">$Kwiver Kiosk</h1>
        <p className="text-blue-400">Self-service ordering for ad hoc professional services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <Label htmlFor="category">Filter by Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSKUs.map((sku) => (
              <ServiceCard key={sku.id} sku={sku} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}