// app/backyard/admin/component-library/page.tsx

'use client'

import React, { useState } from 'react';
import {
  RevenueCard,
  SubscriptionsCard,
  CalendarWidget,
  MoveGoalWidget,
  ExerciseMinutesChart,
  UpgradeSubscriptionForm,
} from '@/components/admin/design-showcase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const COMPONENTS = [
  {
    key: 'revenue',
    title: 'Revenue Card',
    description: 'Display total revenue with trend indicators',
    category: 'analytics',
    tags: ['analytics'],
    component: <RevenueCard />,
  },
  {
    key: 'subscriptions',
    title: 'Subscriptions Card',
    description: 'Show subscription metrics with chart',
    category: 'analytics',
    tags: ['analytics'],
    component: <SubscriptionsCard />,
  },
  {
    key: 'calendar',
    title: 'Calendar Widget',
    description: 'Interactive monthly calendar with date selection',
    category: 'widgets',
    tags: ['widgets'],
    component: <CalendarWidget />,
  },
  {
    key: 'move-goal',
    title: 'Move Goal Widget',
    description: 'Daily activity goal tracker with bar chart',
    category: 'widgets',
    tags: ['widgets'],
    component: <MoveGoalWidget />,
  },
  {
    key: 'exercise-minutes',
    title: 'Exercise Minutes Chart',
    description: 'Weekly exercise tracking with line chart',
    category: 'charts',
    tags: ['charts'],
    component: <ExerciseMinutesChart />,
  },
  {
    key: 'upgrade-subscription',
    title: 'Upgrade Subscription Form',
    description: 'Subscription upgrade form with plan selection',
    category: 'forms',
    tags: ['forms'],
    component: <UpgradeSubscriptionForm />,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'widgets', label: 'Widgets' },
  { id: 'charts', label: 'Charts' },
  { id: 'forms', label: 'Forms' },
  { id: 'tables', label: 'Tables' },
  { id: 'dashboards', label: 'Dashboards' },
];

export default function ComponentLibraryPage() {
  const [activeTab, setActiveTab] = useState('showcase');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredComponents =
    activeCategory === 'all'
      ? COMPONENTS
      : COMPONENTS.filter((c) => c.category === activeCategory || c.tags.includes(activeCategory));

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Dashboard Components</h1>
            <p className="text-blue-400">Interactive component library showcase</p>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            {COMPONENTS.length} Components
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="showcase">Component Showcase</TabsTrigger>
            <TabsTrigger value="playground">Playground</TabsTrigger>
          </TabsList>

          <TabsContent value="showcase">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full px-4"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Component Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComponents.map((comp) => (
                <Card key={comp.key} className="flex flex-col h-full">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xs font-semibold">{comp.title}</h2>
                      <Badge variant="secondary" className="text-xs lowercase">
                        {comp.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-200 mb-4">{comp.description}</p>
                    <div className="flex-1 flex items-center justify-center mb-4">
                      {comp.component}
                    </div>
                    <Button variant="outline" className="w-full mt-auto">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playground">
            <div className="text-center text-blue-200 py-16">
              <p>Component playground coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
