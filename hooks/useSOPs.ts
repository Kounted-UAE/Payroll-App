'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/supabase'
import type { SOP, SOPCategory, SOPStats, SOPSearchFilters } from '@/lib/types/sop'

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Mock data for development - replace with actual database queries
const mockSOPs: SOP[] = [
  {
    id: 'corporate-tax-registration',
    title: 'Corporate Tax Registration',
    category: 'taxation',
    description: 'Complete guide for registering companies for Corporate Tax with FTA',
    status: 'active',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z',
    created_by_user_id: 'user-1',
    view_count: 145,
    template_count: 3,
    who_and_when: [
      'All companies (mainland and free zone) are required to register for Corporate Tax with the FTA, even if they expect to be taxed at 0% (free zone) or have no profit, unless explicitly exempt.',
      'The Ministry of Finance set staggered deadlines in 2024 for existing companies\' registration, depending on license issuance month.',
      'For example, a company licensed Jan-Feb had to register by May 31, 2024; those licensed later by subsequent monthly deadlines up to Dec 31, 2024.',
      'New companies (incorporated from 2024 onward) must register within 30 days of receiving their trade license or before earning any taxable income.'
    ],
    data_documents_required: [
      {
        category: 'Trade License Information',
        items: [
          'License number, license issue date, issuing authority (Emirate or free zone)'
        ]
      },
      {
        category: 'Company Details',
        items: [
          'Legal name in English (and Arabic if required)',
          'Legal form (LLC, PJSC, branch, etc.)',
          'Date of incorporation',
          'Emirates where it operates'
        ]
      }
    ],
    process_workflow: [
      {
        step: 1,
        title: 'Access EmaraTax',
        description: 'The same FTA e-Services platform is used. If the company already has an account (e.g., for VAT), the CT registration can be done under the same login. Otherwise, create a new account.',
        details: []
      },
      {
        step: 2,
        title: 'Fill Corporate Tax Registration Form',
        description: 'After logging in, select "Register for Corporate Tax". Input all requested details.',
        details: [
          'Identification: Are you an existing tax registrant (for VAT)? If yes, some info pre-fills. If no, fill fresh.',
          'Legal Info: Enter license number and attach a copy of trade license.',
          'Financial Period: Choose the start and end month of the financial year.'
        ]
      }
    ],
    templates: [
      {
        name: 'CT Registration Info Sheet',
        description: 'Form to collect needed data from the client',
        fields: ['Trade license details', 'All owners\' names', 'Financial year', 'Group information', 'Authorized signatory identification']
      }
    ],
    related_sops: ['vat-registration', 'trade-license-renewal', 'ubo-registration']
  },
  {
    id: 'trade-license-renewal',
    title: 'Trade License Renewal',
    category: 'company-registrations',
    description: 'Annual trade license renewal process for mainland and free zone companies',
    status: 'active',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-03T00:00:00Z',
    created_by_user_id: 'user-1',
    view_count: 89,
    template_count: 2,
    who_and_when: [
      'All companies must renew their trade licenses annually',
      'Renewal should be initiated 30 days before expiry',
      'Free zone companies follow their respective authority\'s renewal process'
    ],
    data_documents_required: [
      {
        category: 'Required Documents',
        items: [
          'Current trade license',
          'Emirates ID of authorized signatory',
          'Updated tenancy contract (if applicable)'
        ]
      }
    ],
    process_workflow: [
      {
        step: 1,
        title: 'Prepare Documents',
        description: 'Gather all required documents for renewal',
        details: ['Ensure all documents are valid and up-to-date']
      }
    ],
    templates: [
      {
        name: 'License Renewal Checklist',
        description: 'Checklist for license renewal process',
        fields: ['Company details', 'License information', 'Document checklist']
      }
    ],
    related_sops: ['corporate-tax-registration', 'company-setup']
  },
  {
    id: 'ubo-registration',
    title: 'Ultimate Beneficial Owner Registration',
    category: 'taxation',
    description: 'UBO registration requirements and process for UAE companies',
    status: 'active',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
    created_by_user_id: 'user-1',
    view_count: 67,
    template_count: 2,
    who_and_when: [
      'All UAE companies must register their UBOs',
      'Registration is mandatory for compliance with AML regulations',
      'Updates required when ownership changes'
    ],
    data_documents_required: [
      {
        category: 'UBO Information',
        items: [
          'Full name and nationality of UBOs',
          'Passport copies',
          'Proof of address',
          'Ownership percentage'
        ]
      }
    ],
    process_workflow: [
      {
        step: 1,
        title: 'Identify UBOs',
        description: 'Determine who the ultimate beneficial owners are',
        details: ['Review shareholding structure', 'Identify individuals with 25%+ ownership']
      }
    ],
    templates: [
      {
        name: 'UBO Declaration Form',
        description: 'Form for declaring ultimate beneficial owners',
        fields: ['UBO details', 'Ownership percentage', 'Supporting documents']
      }
    ],
    related_sops: ['corporate-tax-registration', 'company-setup']
  },
  {
    id: 'employee-visa-renewal',
    title: 'Employee Visa Renewal Process',
    category: 'hr-visas',
    description: 'Complete process for renewing employee visas in the UAE',
    status: 'active',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    created_by_user_id: 'user-1',
    view_count: 234,
    template_count: 4,
    who_and_when: [
      'All expatriate employees must renew visas before expiry',
      'Process should start 60 days before expiry',
      'Different processes for mainland vs free zone'
    ],
    data_documents_required: [
      {
        category: 'Employee Documents',
        items: [
          'Current passport with 6+ months validity',
          'Current visa copy',
          'Emirates ID',
          'Medical fitness certificate'
        ]
      }
    ],
    process_workflow: [
      {
        step: 1,
        title: 'Prepare Application',
        description: 'Gather all required documents and prepare application',
        details: ['Ensure all documents are valid and complete']
      }
    ],
    templates: [
      {
        name: 'Visa Renewal Application',
        description: 'Application form for visa renewal',
        fields: ['Employee details', 'Current visa info', 'Document checklist']
      }
    ],
    related_sops: ['new-employee-onboarding', 'visa-cancellation']
  }
]

const mockCategories: SOPCategory[] = [
  {
    id: 'hr-visas',
    name: 'HR & Visas',
    description: 'Employee relations, visa processing, work permits',
    color: 'bg-blue-500',
    sop_count: 24
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Financial reporting, bookkeeping, auditing',
    color: 'bg-green-500',
    sop_count: 18
  },
  {
    id: 'payroll',
    name: 'Payroll',
    description: 'Salary processing, WPS, EOSB calculations',
    color: 'bg-purple-500',
    sop_count: 15
  },
  {
    id: 'taxation',
    name: 'Taxation',
    description: 'VAT, Corporate Tax, compliance reporting',
    color: 'bg-red-500',
    sop_count: 32
  },
  {
    id: 'corporate-support',
    name: 'Corporate Support',
    description: 'Business setup, legal compliance, governance',
    color: 'bg-orange-500',
    sop_count: 21
  },
  {
    id: 'company-formations',
    name: 'Company Formations',
    description: 'New company setup, licensing, registrations',
    color: 'bg-cyan-500',
    sop_count: 28
  },
  {
    id: 'company-registrations',
    name: 'Company Registrations',
    description: 'Trade licenses, permits, regulatory filings',
    color: 'bg-teal-500',
    sop_count: 19
  }
]

export function useSOPs() {
  const [sops, setSops] = useState<SOP[]>([])
  const [categories, setCategories] = useState<SOPCategory[]>([])
  const [stats, setStats] = useState<SOPStats>({
    total_sops: 0,
    solution_groups: 0,
    recent_updates: 0,
    most_popular: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSOPs()
  }, [])

  const loadSOPs = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual database queries
      // const { data, error } = await supabase
      //   .from('sops')
      //   .select('*')
      
      // For now, use mock data
      setSops(mockSOPs)
      setCategories(mockCategories)
      
      // Calculate stats
      const totalSOPs = mockSOPs.length
      const solutionGroups = mockCategories.length
      const recentUpdates = mockSOPs.filter(sop => {
        const updatedDate = new Date(sop.updated_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return updatedDate > weekAgo
      }).length
      const mostPopular = Math.max(...mockSOPs.map(sop => sop.view_count))

      setStats({
        total_sops: totalSOPs,
        solution_groups: solutionGroups,
        recent_updates: recentUpdates,
        most_popular: mostPopular
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load SOPs')
    } finally {
      setLoading(false)
    }
  }

  const getSOPsByCategory = (categoryId: string): SOP[] => {
    return sops.filter(sop => sop.category === categoryId)
  }

  const getSOPById = (sopId: string): SOP | undefined => {
    return sops.find(sop => sop.id === sopId)
  }

  const getCategoryById = (categoryId: string): SOPCategory | undefined => {
    return categories.find(category => category.id === categoryId)
  }

  const searchSOPs = (filters: SOPSearchFilters): SOP[] => {
    let filteredSOPs = [...sops]

    if (filters.category) {
      filteredSOPs = filteredSOPs.filter(sop => sop.category === filters.category)
    }

    if (filters.status) {
      filteredSOPs = filteredSOPs.filter(sop => sop.status === filters.status)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredSOPs = filteredSOPs.filter(sop => 
        sop.title.toLowerCase().includes(searchLower) ||
        sop.description.toLowerCase().includes(searchLower)
      )
    }

    return filteredSOPs
  }

  const getRecentSOPs = (limit: number = 4): SOP[] => {
    return sops
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit)
  }

  const incrementViewCount = async (sopId: string) => {
    try {
      // TODO: Replace with actual database update
      // await supabase
      //   .from('sops')
      //   .update({ view_count: supabase.rpc('increment') })
      //   .eq('id', sopId)
      
      // For now, update local state
      setSops(prevSOPs => 
        prevSOPs.map(sop => 
          sop.id === sopId 
            ? { ...sop, view_count: sop.view_count + 1 }
            : sop
        )
      )
    } catch (err) {
      console.error('Failed to increment view count:', err)
    }
  }

  return {
    sops,
    categories,
    stats,
    loading,
    error,
    getSOPsByCategory,
    getSOPById,
    getCategoryById,
    searchSOPs,
    getRecentSOPs,
    incrementViewCount,
    refresh: loadSOPs
  }
} 