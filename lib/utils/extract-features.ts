// Extract features from sidebar navigation and create initial feature data

import { sidebarSections } from '@/lib/config/sidebar-nav';
import type { CreateFeatureRequest } from '@/lib/types/dev-progress';

/**
 * Extract features from sidebar navigation configuration
 */
export function extractFeaturesFromSidebar(): CreateFeatureRequest[] {
  const features: CreateFeatureRequest[] = [];

  sidebarSections.forEach(section => {
    section.items.forEach(item => {
      // Generate feature key from URL or title
      const featureKey = generateFeatureKey(item.url, item.title);
      
      // Skip duplicate or placeholder items
      if (featureKey === 'unknown' || item.url === '#') {
        return;
      }

      const feature: CreateFeatureRequest = {
        feature_key: featureKey,
        category: section.label,
        title: item.title,
        description: generateFeatureDescription(item.title, section.label),
        objectives: generateInitialObjectives(item.title, section.label),
        estimated_hours: estimateInitialHours(item.title, section.label),
        priority: determinePriority(item.title, section.label),
        url_path: item.url,
        icon_name: getIconName(item.icon),
        dependencies: []
      };

      features.push(feature);
    });
  });

  return features;
}

/**
 * Generate a consistent feature key from URL or title
 */
function generateFeatureKey(url: string, title: string): string {
  if (url && url !== '#') {
    // Extract from URL path
    const pathParts = url.split('/').filter(Boolean);
    if (pathParts.length > 1) {
      return pathParts.slice(1).join('-'); // Remove 'kounted' prefix
    }
  }
  
  // Fallback to title
  return title.toLowerCase()
    .replace(/\$/g, '') // Remove $ symbols
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();
}

/**
 * Get the icon name for Lucide React
 */
function getIconName(IconComponent: any): string {
  if (!IconComponent || !IconComponent.name) {
    return 'Circle';
  }
  return IconComponent.name;
}

/**
 * Generate initial feature description based on title and category
 */
function generateFeatureDescription(title: string, category: string): string {
  const descriptions: Record<string, string> = {
    'Dashboard': 'Main dashboard interface with KPIs and quick access',
    'Reports': 'Analytics and reporting interface for business insights',
    'Airtable': 'Client profile management and CRM functionality',
    'Referral Programs': 'Sales referral tracking and commission management',
    '$Kwiver CPQ': 'Configure-Price-Quote system for service bundles',
    '$Kwiver Kiosk': 'Point-of-sale style service ordering interface',
    'kounted Payroll': 'Main payroll management dashboard',
    'Employers': 'Employer profile and company management',
    'Employees': 'Employee database and profile management',
    'Payroll Payruns': 'Monthly payroll processing and WPS export',
    'Payslips': 'Payslip generation and distribution system',
    'Expense Claims': 'Employee expense claim processing',
    'Payroll Reports': 'Payroll analytics and compliance reporting',
    'KYC Compliance': 'Know Your Customer compliance management',
    'Key Dates': 'UAE compliance calendar and deadline tracking',
    'kounted SOPs': 'Standard Operating Procedures documentation',
    'Templates': 'Document templates and form builders',
    'Info Links': 'Quick access to regulatory and reference links',
    'Historic Payruns': 'Historical payroll data import and management',
    'Excel File Payslips': 'Bulk payroll import from Excel files',
    'Settings': 'Application configuration and user preferences'
  };

  return descriptions[title] || `${title} functionality within ${category}`;
}

/**
 * Generate initial objectives for a feature
 */
function generateInitialObjectives(title: string, category: string): string[] {
  const baseObjectives = [
    'Design and implement user interface',
    'Integrate with backend services',
    'Add comprehensive error handling',
    'Implement data validation',
    'Add responsive design support',
    'Write unit and integration tests',
    'Optimize performance',
    'Add accessibility features'
  ];

  // Add specific objectives based on feature type
  const specificObjectives: Record<string, string[]> = {
    'Dashboard': [
      'Create KPI widgets and charts',
      'Implement real-time data updates',
      'Add customizable dashboard layout'
    ],
    'Payroll': [
      'Implement UAE WPS compliance',
      'Add EOSB calculation engine',
      'Integrate with MOL regulations'
    ],
    'CPQ': [
      'Build dynamic pricing engine',
      'Implement quote approval workflow',
      'Add PDF generation capabilities'
    ],
    'Reports': [
      'Create interactive charts and graphs',
      'Implement data export functionality',
      'Add scheduled report generation'
    ]
  };

  // Get category-specific objectives
  const categoryKey = Object.keys(specificObjectives).find(key => 
    title.toLowerCase().includes(key.toLowerCase()) || 
    category.toLowerCase().includes(key.toLowerCase())
  );

  const specific = categoryKey ? specificObjectives[categoryKey] : [];
  
  return [...specific, ...baseObjectives.slice(0, 5)];
}

/**
 * Estimate initial development hours
 */
function estimateInitialHours(title: string, category: string): number {
  // Complex features
  if (title.includes('CPQ') || title.includes('Payroll') || title === 'Dashboard') {
    return 40;
  }
  
  // Medium complexity
  if (category.includes('Tools') || title.includes('Reports')) {
    return 24;
  }
  
  // Simple features
  if (category === 'Settings' || title.includes('Templates')) {
    return 8;
  }
  
  // Default estimate
  return 16;
}

/**
 * Determine feature priority
 */
function determinePriority(title: string, category: string): number {
  // Critical infrastructure
  if (title === 'Dashboard' || title === 'Settings') {
    return 90;
  }
  
  // Core business features
  if (title.includes('Payroll') || title.includes('CPQ')) {
    return 80;
  }
  
  // Important features
  if (category.includes('Tools') || title.includes('Reports')) {
    return 60;
  }
  
  // Support features
  if (category === 'Support Tools' || category === 'Resource Centre') {
    return 40;
  }
  
  // Admin and maintenance
  if (category === 'Admin') {
    return 30;
  }
  
  return 50; // Default medium priority
}

/**
 * Create additional features not in sidebar (future roadmap items)
 */
export function createAdditionalFeatures(): CreateFeatureRequest[] {
  return [
    {
      feature_key: 'multi-tenant-platform',
      category: 'Platform Architecture',
      title: 'Multi-Tenant Platform',
      description: 'Transform to kounted Practice Manager multi-tenant SaaS',
      objectives: [
        'Design organization-based data isolation',
        'Implement tenant-aware routing',
        'Create organization signup flow',
        'Add subscription management',
        'Build white-label branding system'
      ],
      estimated_hours: 120,
      priority: 95,
      dependencies: []
    },
    {
      feature_key: 'uae-compliance-engine',
      category: 'Regulatory Compliance',
      title: 'UAE Compliance Engine',
      description: 'Comprehensive UAE regulatory compliance automation',
      objectives: [
        'Integrate with ADGM/DIFC APIs',
        'Automate VAT and Corporate Tax filing',
        'Implement ESR reporting',
        'Add AML/KYC workflows',
        'Create compliance dashboards'
      ],
      estimated_hours: 80,
      priority: 85,
      dependencies: []
    },
    {
      feature_key: 'practice-coordination',
      category: 'Practice Management',
      title: 'Practice Coordination Hub',
      description: 'Central coordination for accounting firm operations',
      objectives: [
        'Build client portfolio management',
        'Implement task assignment system',
        'Create team workload distribution',
        'Add inter-client analytics',
        'Build communication center'
      ],
      estimated_hours: 60,
      priority: 75,
      dependencies: ['multi-tenant-platform']
    },
    {
      feature_key: 'billing-subscription',
      category: 'Business Operations',
      title: 'Billing & Subscription Management',
      description: 'SaaS billing and subscription management system',
      objectives: [
        'Integrate with Stripe billing',
        'Create plan tier management',
        'Implement usage tracking',
        'Add invoice generation',
        'Build payment processing'
      ],
      estimated_hours: 40,
      priority: 70,
      dependencies: ['multi-tenant-platform']
    },
    {
      feature_key: 'ai-compliance-assistant',
      category: 'AI Features',
      title: 'AI Compliance Assistant',
      description: 'AI-powered compliance guidance and automation',
      objectives: [
        'Build regulatory Q&A system',
        'Implement document analysis',
        'Create compliance recommendations',
        'Add deadline notifications',
        'Build risk assessment'
      ],
      estimated_hours: 50,
      priority: 60,
      dependencies: ['uae-compliance-engine']
    }
  ];
}

/**
 * Get all features (current + future roadmap)
 */
export function getAllFeatures(): CreateFeatureRequest[] {
  return [
    ...extractFeaturesFromSidebar(),
    ...createAdditionalFeatures()
  ];
}