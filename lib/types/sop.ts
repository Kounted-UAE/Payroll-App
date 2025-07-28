export interface SOP {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'active' | 'suspended' | 'archived';
  created_at: string;
  updated_at: string;
  created_by_user_id: string;
  view_count: number;
  template_count: number;
  who_and_when: string[];
  data_documents_required: SOPDocumentSection[];
  process_workflow: SOPWorkflowStep[];
  templates: SOPTemplate[];
  related_sops: string[];
}

export interface SOPDocumentSection {
  category: string;
  items: string[];
}

export interface SOPWorkflowStep {
  step: number;
  title: string;
  description: string;
  details: string[];
}

export interface SOPTemplate {
  name: string;
  description: string;
  fields: string[];
}

export interface SOPCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  sop_count: number;
}

export interface SOPSearchFilters {
  category?: string;
  status?: string;
  search?: string;
}

export interface SOPStats {
  total_sops: number;
  solution_groups: number;
  recent_updates: number;
  most_popular: number;
} 