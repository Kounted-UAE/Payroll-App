'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Separator,
  Switch,
  Label,
  Textarea,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'
import {
  Code,
  Eye,
  Plus,
  Save,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  FileText,
  Settings,
  Users,
  Folder,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'


// design showcase imports
import { RevenueCard ,
SubscriptionsCard,
CalendarWidget,
MoveGoalWidget,
ExerciseMinutesChart,
UpgradeSubscriptionForm,
CreateAccountForm,
PaymentsTable,
TeamMembersWidget,
SupportChatWidget } from '@/components/admin/design-showcase';

const Index = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [playgroundComponents, setPlaygroundComponents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('showcase');
  const [editMode, setEditMode] = useState(false);
  const [componentCode, setComponentCode] = useState<Record<string, string>>({});
  const [customComponents, setCustomComponents] = useState<any[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newComponent, setNewComponent] = useState({
    title: '',
    description: '',
    category: 'widgets',
    code: `// New Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">New Component</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-xs text-muted-foreground">Component content goes here</p>
  </CardContent>
</Card>`
  });
  const { toast } = useToast();

  const components = [
    {
      id: 'revenue-card',
      title: 'Revenue Card',
      description: 'Display total revenue with trend indicators',
      category: 'analytics',
      component: <RevenueCard />,
      code: `// Revenue Card Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">Total Revenue</CardTitle>
    <div className="text-xs font-bold text-primary">$45,231.89</div>
    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
  </CardHeader>
</Card>`
    },
    {
      id: 'subscriptions-card',
      title: 'Subscriptions Card',
      description: 'Show subscription metrics with chart',
      category: 'analytics',
      component: <SubscriptionsCard />,
      code: `// Subscriptions Card Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">Subscriptions</CardTitle>
    <div className="text-xs font-bold text-primary">+2350</div>
    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
  </CardHeader>
</Card>`
    },
    {
      id: 'calendar-widget',
      title: 'Calendar Widget',
      description: 'Interactive monthly calendar with date selection',
      category: 'widgets',
      component: <CalendarWidget />,
      code: `// Calendar Widget Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">Calendar</CardTitle>
  </CardHeader>
  <CardContent>
    <Calendar mode="single" className="rounded-md border" />
  </CardContent>
</Card>`
    },
    {
      id: 'move-goal-widget',
      title: 'Move Goal Widget',
      description: 'Daily activity goal tracker with bar chart',
      category: 'widgets',
      component: <MoveGoalWidget />,
      code: `// Move Goal Widget Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">Move Goal</CardTitle>
    <p className="text-xs text-muted-foreground">Daily activity tracker</p>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <Progress value={70} className="h-2" />
      <p className="text-xs text-muted-foreground">70% of daily goal completed</p>
    </div>
  </CardContent>
</Card>`
    },
    {
      id: 'exercise-chart',
      title: 'Exercise Minutes Chart',
      description: 'Weekly exercise tracking with line chart',
      category: 'charts',
      component: <ExerciseMinutesChart />,
      code: `// Exercise Minutes Chart Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">Exercise Minutes</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={exerciseData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Line type="monotone" dataKey="minutes" stroke="hsl(var(--blue-500))" />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>`
    },
    {
      id: 'upgrade-form',
      title: 'Upgrade Subscription Form',
      description: 'Subscription upgrade form with plan selection',
      category: 'forms',
      component: <UpgradeSubscriptionForm />,
      code: `// Upgrade Subscription Form Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">Upgrade Plan</CardTitle>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div className="space-y-2">
        <Label>Select Plan</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose a plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic Plan</SelectItem>
            <SelectItem value="pro">Pro Plan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full">Upgrade Now</Button>
    </form>
  </CardContent>
</Card>`
    },
    {
      id: 'create-account-form',
      title: 'Create Account Form',
      description: 'User registration with social auth options',
      category: 'forms',
      component: <CreateAccountForm />,
      code: `// Create Account Form Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">Create Account</CardTitle>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Create password" />
      </div>
      <Button className="w-full">Create Account</Button>
    </form>
  </CardContent>
</Card>`
    },
    {
      id: 'payments-table',
      title: 'Payments Table',
      description: 'Transaction history with status indicators',
      category: 'tables',
      component: <PaymentsTable />,
      code: `// Payments Table Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">Recent Payments</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>2024-01-15</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell><Badge variant="success">Completed</Badge></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>`
    },
    {
      id: 'team-members',
      title: 'Team Members Widget',
      description: 'Team collaboration and member management',
      category: 'widgets',
      component: <TeamMembersWidget />,
      code: `// Team Members Widget Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">Team Members</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs font-medium">John Doe</p>
          <p className="text-xs text-muted-foreground">Administrator</p>
        </div>
      </div>
    </div>
  </CardContent>
</Card>`
    },
    {
      id: 'support-chat',
      title: 'Support Chat Widget',
      description: 'Customer support chat interface',
      category: 'widgets',
      component: <SupportChatWidget />,
      code: `// Support Chat Widget Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">Support Chat</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      <div className="bg-muted p-3 rounded-lg">
        <p className="text-xs">How can we help you today?</p>
      </div>
      <div className="flex space-x-2">
        <Input placeholder="Type your message..." className="flex-1" />
        <Button size="sm">Send</Button>
      </div>
    </div>
  </CardContent>
</Card>`
    },
    {
      id: 'simple-sidebar',
      title: 'Simple Sidebar',
      description: 'A simple sidebar with navigation grouped by section - clean and minimal design.',
      category: 'dashboards',
      component: (
        <div className="h-96 w-full border rounded-lg">
          <div className="flex h-full">
            <div className="w-60 border-r bg-muted/10 p-4">
              <div className="space-y-4">
                <div className="font-semibold text-xs">Documentation</div>
                <div className="space-y-2">
                  <div className="text-xs font-medium">Getting Started</div>
                  <div className="ml-4 space-y-1">
                    <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Installation</div>
                    <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Project Structure</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium">Building Your Application</div>
                  <div className="ml-4 space-y-1">
                    <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Data Fetching</div>
                    <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Routing</div>
                    <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Rendering</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Main Content Area</span>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `// Simple Sidebar Component
<div className="h-96 w-full border rounded-lg">
  <div className="flex h-full">
    <div className="w-60 border-r bg-muted/10 p-4">
      <div className="space-y-4">
        <div className="font-semibold text-xs">Documentation</div>
        <div className="space-y-2">
          <div className="text-xs font-medium">Getting Started</div>
          <div className="ml-4 space-y-1">
            <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Installation</div>
            <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Project Structure</div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex-1 p-4">
      <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Main Content Area</span>
      </div>
    </div>
  </div>
</div>`
    },
    {
      id: 'collapsible-sidebar',
      title: 'Collapsible Sidebar',
      description: 'A sidebar with collapsible sections and search functionality.',
      category: 'dashboards',
      component: (
        <div className="h-96 w-full border rounded-lg">
          <div className="flex h-full">
            <div className="w-60 border-r bg-muted/10 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs">Documentation</div>
                  <div className="text-xs bg-muted px-2 py-1 rounded">v1.0.1</div>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Search"
                    className="w-full pl-8 pr-4 py-2 text-xs border rounded-md bg-background"
                  />
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <ChevronDown className="h-4 w-4" />
                      Getting Started
                    </div>
                    <div className="ml-6 space-y-1">
                      <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Installation</div>
                      <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Project Structure</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <ChevronDown className="h-4 w-4" />
                      Building Your Application
                    </div>
                    <div className="ml-6 space-y-1">
                      <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Data Fetching</div>
                      <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Routing</div>
                      <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Rendering</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Main Content Area</span>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `// Collapsible Sidebar Component with Search
<div className="h-96 w-full border rounded-lg">
  <div className="flex h-full">
    <div className="w-60 border-r bg-muted/10 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-xs">Documentation</div>
          <div className="text-xs bg-muted px-2 py-1 rounded">v1.0.1</div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input placeholder="Search" className="w-full pl-8 pr-4 py-2 text-xs border rounded-md bg-background" />
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      id: 'icon-sidebar',
      title: 'Icon Collapsible Sidebar',
      description: 'A sidebar that collapses to icons with tooltips for compact navigation.',
      category: 'dashboards',
      component: (
        <div className="h-96 w-full border rounded-lg">
          <div className="flex h-full">
            <div className="w-16 border-r bg-muted/10 p-2 flex flex-col items-center space-y-4">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">D</span>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center cursor-pointer">
                  <Home className="h-4 w-4 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer hover:bg-muted">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer hover:bg-muted">
                  <Settings className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer hover:bg-muted">
                  <Users className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Collapsed Sidebar Content</span>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `// Icon Collapsible Sidebar Component
<div className="h-96 w-full border rounded-lg">
  <div className="flex h-full">
    <div className="w-16 border-r bg-muted/10 p-2 flex flex-col items-center space-y-4">
      <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
        <span className="text-primary-foreground text-xs font-bold">D</span>
      </div>
      <div className="space-y-2">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center cursor-pointer">
          <Home className="h-4 w-4 text-primary" />
        </div>
        <div className="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer hover:bg-muted">
          <FileText className="h-4 w-4" />
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      id: 'file-tree-sidebar',
      title: 'File Tree Sidebar',
      description: 'A sidebar with collapsible file tree navigation for project structure.',
      category: 'dashboards',
      component: (
        <div className="h-96 w-full border rounded-lg">
          <div className="flex h-full">
            <div className="w-64 border-r bg-muted/10 p-4">
              <div className="space-y-2">
                <div className="font-semibold text-xs">Explorer</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs">
                    <ChevronDown className="h-3 w-3" />
                    <Folder className="h-4 w-4" />
                    <span>components</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <div className="flex items-center gap-1 text-xs">
                      <ChevronDown className="h-3 w-3" />
                      <Folder className="h-4 w-4" />
                      <span>ui</span>
                    </div>
                    <div className="ml-8 space-y-1">
                      <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-1 rounded">
                        <FileText className="h-3 w-3" />
                        <span>button.tsx</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                        <FileText className="h-3 w-3" />
                        <span>input.tsx</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                        <FileText className="h-3 w-3" />
                        <span>card.tsx</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">File Editor Area</span>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `// File Tree Sidebar Component
<div className="h-96 w-full border rounded-lg">
  <div className="flex h-full">
    <div className="w-64 border-r bg-muted/10 p-4">
      <div className="space-y-2">
        <div className="font-semibold text-xs">Explorer</div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs">
            <ChevronDown className="h-3 w-3" />
            <Folder className="h-4 w-4" />
            <span>components</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      id: 'calendar-sidebar',
      title: 'Calendar Sidebar',
      description: 'A sidebar with integrated calendar and date picker functionality.',
      category: 'dashboards',
      component: (
        <div className="h-96 w-full border rounded-lg">
          <div className="flex h-full">
            <div className="w-72 border-r bg-muted/10 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">July 2025</div>
                  <div className="flex gap-1">
                    <ChevronLeft className="h-4 w-4 cursor-pointer" />
                    <ChevronRight className="h-4 w-4 cursor-pointer" />
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-muted-foreground p-1">{day}</div>
                  ))}
                  {Array.from({length: 35}, (_, i) => {
                    const day = i - 2;
                    const isToday = day === 21;
                    const isCurrentMonth = day > 0 && day <= 31;
                    return (
                      <div key={i} className={`text-center p-1 text-xs cursor-pointer rounded
                        ${isToday ? 'bg-primary text-primary-foreground' : ''}
                        ${isCurrentMonth ? 'hover:bg-muted' : 'text-muted-foreground'}
                      `}>
                        {isCurrentMonth ? day : day <= 0 ? 30 + day : day - 31}
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium">My Calendars</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span>Personal</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span>Work</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Family</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="h-full bg-muted/50 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Calendar Events View</span>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `// Calendar Sidebar Component
<div className="h-96 w-full border rounded-lg">
  <div className="flex h-full">
    <div className="w-72 border-r bg-muted/10 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">July 2025</div>
          <div className="flex gap-1">
            <ChevronLeft className="h-4 w-4 cursor-pointer" />
            <ChevronRight className="h-4 w-4 cursor-pointer" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-muted-foreground p-1">{day}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>`
    }
  ];

  const categories = ['all', 'analytics', 'widgets', 'charts', 'forms', 'tables', 'dashboards'];
  const [activeCategory, setActiveCategory] = useState('all');

  // Combine default and custom components
  const allComponents = [...components, ...customComponents];

  const filteredComponents = activeCategory === 'all' 
    ? allComponents 
    : allComponents.filter(comp => comp.category === activeCategory);

  const handleSaveCodeChanges = (instanceId: string) => {
    const updatedCode = componentCode[instanceId];
    if (updatedCode) {
      // Update the playground component with new code
      setPlaygroundComponents(prev => 
        prev.map(comp => 
          comp.instanceId === instanceId 
            ? { ...comp, code: updatedCode, component: createComponentFromCode(updatedCode) }
            : comp
        )
      );
      toast({
        title: "Code Changes Saved",
        description: "Your component code has been updated successfully.",
      });
    }
  };

  const createComponentFromCode = (code: string) => {
    try {
      // Simple JSX to React element conversion for basic cases
      // This is a simplified version - in a real app you'd use a proper JSX parser
      return (
        <div className="border rounded-lg p-4 bg-muted/20">
          <div dangerouslySetInnerHTML={{ __html: code.replace(/^\/\/.*$/gm, '') }} />
        </div>
      );
    } catch (error) {
      return (
        <div className="border rounded-lg p-4 bg-muted/20 text-red-500">
          Error rendering component
        </div>
      );
    }
  };

  const handleCreateComponent = () => {
    if (!newComponent.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a component title.",
        variant: "destructive",
      });
      return;
    }

    const componentElement = (
      <div 
        className="bg-card p-4 border rounded-lg"
        dangerouslySetInnerHTML={{ 
          __html: `<div class="text-xs text-muted-foreground">Custom Component: ${newComponent.title}</div><div class="mt-2 p-2 bg-muted/30 rounded text-xs">Preview of custom component</div>` 
        }}
      />
    );

    const customComponent = {
      id: `custom-${Date.now()}`,
      title: newComponent.title,
      description: newComponent.description,
      category: newComponent.category,
      component: componentElement,
      code: newComponent.code,
      isCustom: true
    };

    setCustomComponents(prev => [...prev, customComponent]);
    setCreateDialogOpen(false);
    setNewComponent({
      title: '',
      description: '',
      category: 'widgets',
      code: `// New Component
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-xs font-semibold">New Component</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-xs text-muted-foreground">Component content goes here</p>
  </CardContent>
</Card>`
    });

    toast({
      title: "Component Created",
      description: `${newComponent.title} has been added to the Component Showcase.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/20">
        <div className="container px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight">Dashboard Components</h1>
              <p className="text-muted-foreground mt-1">Interactive component library showcase</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {allComponents.length} Components
            </Badge>
          </div>
        </div>
      </header>

      <div className="container px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="showcase">Component Showcase</TabsTrigger>
            <TabsTrigger value="playground">Playground</TabsTrigger>
          </TabsList>

          <TabsContent value="showcase" className="mt-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Component Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredComponents.map((comp) => (
                <Card key={comp.id} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs">{comp.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {comp.category}
                      </Badge>
                    </div>
                    <CardDescription>{comp.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      {comp.component}
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => setSelectedComponent(selectedComponent === comp.id ? null : comp.id)}
                    >
                      {selectedComponent === comp.id ? 'Hide Details' : 'View Details'}
                    </Button>
                    {selectedComponent === comp.id && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Component Details</h4>
                        <p className="text-xs text-muted-foreground mb-3">{comp.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">React</Badge>
                          <Badge variant="secondary">TypeScript</Badge>
                          <Badge variant="secondary">Tailwind CSS</Badge>
                          <Badge variant="secondary">Shadcn/ui</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playground" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Component Playground</CardTitle>
                <CardDescription>
                  Drag and drop components to test them in an isolated environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Component Palette */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Components
                      </h3>
                      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="default" size="sm" className="flex items-center gap-2">
                            <Plus className="w-3 h-3" />
                            Create
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                          <DialogTitle>Create New Component</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="title">Component Title</Label>
                              <Input
                                id="title"
                                value={newComponent.title}
                                onChange={(e) => setNewComponent(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter component title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Input
                                id="description"
                                value={newComponent.description}
                                onChange={(e) => setNewComponent(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter component description"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="category">Category</Label>
                              <Select value={newComponent.category} onValueChange={(value) => setNewComponent(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="widgets">Widgets</SelectItem>
                                  <SelectItem value="analytics">Analytics</SelectItem>
                                  <SelectItem value="charts">Charts</SelectItem>
                                  <SelectItem value="forms">Forms</SelectItem>
                                  <SelectItem value="tables">Tables</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="code">Component Code</Label>
                              <Textarea
                                id="code"
                                value={newComponent.code}
                                onChange={(e) => setNewComponent(prev => ({ ...prev, code: e.target.value }))}
                                className="min-h-[200px] font-mono text-xs"
                                placeholder="Enter component JSX code"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleCreateComponent}>
                                Create Component
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-2">
                      {allComponents.map((comp) => (
                        <Button
                          key={comp.id}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => {
                            const newId = `${comp.id}-${Date.now()}`;
                            setPlaygroundComponents(prev => [...prev, { 
                              ...comp, 
                              id: newId,
                              instanceId: newId 
                            }]);
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-xs">{comp.title}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">{comp.category}</span>
                              {comp.isCustom && <Badge variant="secondary" className="text-xs px-1 py-0">Custom</Badge>}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Playground Canvas */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Canvas ({playgroundComponents.length} components)
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="edit-mode"
                            checked={editMode}
                            onCheckedChange={setEditMode}
                          />
                          <Label htmlFor="edit-mode" className="flex items-center gap-2 text-xs">
                            {editMode ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {editMode ? 'Edit Mode' : 'Preview Mode'}
                          </Label>
                        </div>
                        {playgroundComponents.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPlaygroundComponents([])}
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="min-h-[600px] border-2 border-dashed border-muted-foreground/20 rounded-lg p-6">
                      {playgroundComponents.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                          <div className="space-y-2">
                            <p className="text-muted-foreground">
                              No components added yet
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Click on components from the left panel to add them here
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {playgroundComponents.map((comp) => (
                            <div key={comp.instanceId} className="relative group">
                              <div className="absolute -top-2 -right-2 z-10">
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    setPlaygroundComponents(prev => 
                                      prev.filter(c => c.instanceId !== comp.instanceId)
                                    );
                                  }}
                                >
                                  ×
                                </Button>
                              </div>
                              {editMode ? (
                                <div className="grid grid-cols-2 gap-4">
                                  {/* Code Editor */}
                                  <div className="space-y-2">
                                    <div className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-2">
                                      <Code className="w-3 h-3" />
                                      {comp.title} - Code
                                    </div>
                                     <Textarea
                                       value={componentCode[comp.instanceId] || comp.code}
                                       onChange={(e) => setComponentCode(prev => ({ 
                                         ...prev, 
                                         [comp.instanceId]: e.target.value 
                                       }))}
                                       className="min-h-[200px] font-mono text-xs"
                                       placeholder="Component code..."
                                     />
                                     <Button 
                                       size="sm" 
                                       className="w-full mt-2 flex items-center gap-2"
                                       onClick={() => handleSaveCodeChanges(comp.instanceId)}
                                     >
                                       <Save className="w-3 h-3" />
                                       Save Changes
                                     </Button>
                                  </div>
                                  
                                  {/* Live Preview */}
                                  <div className="space-y-2">
                                    <div className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-2">
                                      <Eye className="w-3 h-3" />
                                      {comp.title} - Preview
                                    </div>
                                    <div className="border rounded-lg p-4 bg-muted/20 min-h-[200px]">
                                      {comp.component}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-xs text-muted-foreground mb-2 font-medium">
                                    {comp.title}
                                  </div>
                                  {comp.component}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
