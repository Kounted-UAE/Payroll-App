export interface CampaignConfig {
  id: string
  label: string
  route: string

  hero: {
    title: string
    subtitle: string
    image?: string
  }

  filters?: FilterDefinition[]

  pricing: {
    type: PricingType
    cards: Record<string, PricingCard> | PricingMatrix
  }

  form: {
    submissionApi: string
    fields: FormField[]
    terms: string
    dateCalculations?: DateCalculation[]
  }

  email: EmailConfig
}

export type PricingType = 'static' | 'matrix'
export type FiltersState = Record<string, string | string[]>
export type FilterType = 'choice' | 'checkbox' | 'slider'
export type FilterMode = 'single' | 'multi' | 'exclusive' | 'selectAll'

export interface FilterDefinition {
  key: string                  // required for matrix resolution
  id?: string                  // optional for form UI
  label: string
  values?: string[]           // for 'choice' and 'checkbox'
  mode?: FilterMode           // single, multi, etc.
  type?: FilterType           // default: 'choice'
  min?: number                // for 'slider'
  max?: number
  step?: number
  unit?: string
}

export interface PricingCard {
  id: string
  name: string
  price: string
  description: string
  heading?: string
  description1?: string
  description2?: string
  description3?: string
  features?: string[]
  featuredLabel?: string
  conditions?: string[]
}

export type PricingMatrix = Record<string, Record<string, PricingCard>>

export interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'date'
  required?: boolean
}

export type DateCalculation = {
  fieldId: string
  label: string
  outputFieldId?: string
  offset?: number // new, preferred key
  unit?: 'days' | 'months' | 'years'
  daysOffset?: number // legacy fallback, optional
}



export interface EmailConfig {
  to: string[]
  from: string
  subject: (data: Record<string, any>) => string
  bodyHtml: (data: Record<string, any>, terms: string) => string
}

export interface FormWorkflowContextValue {
  config: CampaignConfig
  pricingType: 'static' | 'matrix'
  filters: Record<string, string | string[]>
  setFilter: (key: string, value: string) => void
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>>
  selectedCard: PricingCard | null
  setSelectedCard: (card: PricingCard | null) => void
  setFormOpen: (open: boolean) => void
  resolvedCards: PricingCard[]
}
