// TypeScript types for development progress tracking

export interface ProjectFeature {
  id: string;
  feature_key: string;
  category: string;
  title: string;
  description?: string;
  objectives: string[];
  estimated_hours: number;
  priority: number;
  status: 'planned' | 'in-progress' | 'completed' | 'deferred' | 'blocked';
  completion_percentage: number;
  url_path?: string;
  icon_name?: string;
  dependencies: string[];
  created_at: string;
  updated_at: string;
}

export interface SessionLog {
  id: string;
  session_date: string;
  session_title?: string;
  summary_text: string;
  ai_estimated_hours?: number;
  ai_confidence_score?: number;
  features_worked_on: string[];
  key_achievements: string[];
  blockers_identified: string[];
  tech_debt_notes?: string;
  created_by_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CodeMetrics {
  id: string;
  analysis_date: string;
  commit_count: number;
  files_changed: number;
  lines_added: number;
  lines_removed: number;
  feature_mappings: Record<string, number>;
  complexity_metrics: Record<string, any>;
  top_changed_files: string[];
  commit_messages: string[];
  created_at: string;
}

export interface Milestone {
  id: string;
  feature_id: string;
  milestone_name: string;
  description?: string;
  target_date?: string;
  completion_criteria: string[];
  is_completed: boolean;
  completed_at?: string;
  completion_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressSnapshot {
  id: string;
  feature_id: string;
  snapshot_date: string;
  completion_percentage: number;
  calculation_method: 'manual' | 'ai-estimated' | 'code-analysis' | 'combined';
  contributing_factors: Record<string, any>;
  notes?: string;
  created_at: string;
}

// AI Analysis interfaces
export interface AISessionAnalysis {
  estimated_hours: number;
  confidence_score: number;
  features_worked_on: string[];
  achievements: string[];
  blockers: string[];
  technical_notes?: string;
}

export interface ProgressAnalysis {
  completionPercentage: number;
  confidence: number;
  nextSteps: string[];
  estimatedCompletionDate?: string;
  riskFactors: string[];
}

// GitHub Analysis interfaces
export interface GitHubCommitAnalysis {
  sha: string;
  message: string;
  author: string;
  date: string;
  files_changed: string[];
  additions: number;
  deletions: number;
  feature_mappings: string[];
}

export interface GitHubRepoAnalysis {
  analysis_period: {
    start_date: string;
    end_date: string;
  };
  commits: GitHubCommitAnalysis[];
  summary: {
    total_commits: number;
    total_files_changed: number;
    total_lines_added: number;
    total_lines_removed: number;
    feature_activity: Record<string, number>;
  };
}

// Timeline visualization interfaces
export interface TimelineNode {
  id: string;
  feature: ProjectFeature;
  position: {
    x: number;
    y: number;
  };
  connections: string[]; // IDs of connected features
  milestones: Milestone[];
  recentActivity: {
    sessions: SessionLog[];
    commits: GitHubCommitAnalysis[];
  };
}

export interface TimelineViewport {
  scale: number;
  center: {
    x: number;
    y: number;
  };
  filter: {
    categories: string[];
    statuses: string[];
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

// Form interfaces for creating/editing
export interface CreateFeatureRequest {
  feature_key: string;
  category: string;
  title: string;
  description?: string;
  objectives: string[];
  estimated_hours: number;
  priority: number;
  url_path?: string;
  icon_name?: string;
  dependencies: string[];
}

export interface CreateSessionLogRequest {
  session_date: string;
  session_title?: string;
  summary_text: string;
  features_worked_on: string[];
}

export interface CreateMilestoneRequest {
  feature_id: string;
  milestone_name: string;
  description?: string;
  target_date?: string;
  completion_criteria: string[];
}

// Dashboard analytics interfaces
export interface ProgressDashboardData {
  overview: {
    total_features: number;
    completed_features: number;
    in_progress_features: number;
    planned_features: number;
    overall_completion: number;
    estimated_total_hours: number;
    hours_spent: number;
  };
  recent_activity: {
    sessions: SessionLog[];
    commits: GitHubCommitAnalysis[];
    milestones_completed: Milestone[];
  };
  feature_progress: ProjectFeature[];
  velocity_metrics: {
    avg_hours_per_week: number;
    features_completed_per_month: number;
    current_sprint_progress: number;
  };
  timeline_data: TimelineNode[];
}

// Utility types
export type FeatureStatus = ProjectFeature['status'];
export type CalculationMethod = ProgressSnapshot['calculation_method'];

// Constants
export const FEATURE_CATEGORIES = [
  'Navigation',
  'Client Profiles', 
  'Sales Tools',
  'Payroll Tools',
  'Support Tools',
  'Resource Centre',
  'Admin',
  'Settings'
] as const;

export const FEATURE_STATUSES = [
  'planned',
  'in-progress', 
  'completed',
  'deferred',
  'blocked'
] as const;

export const PRIORITY_LEVELS = {
  CRITICAL: 90,
  HIGH: 70,
  MEDIUM: 50,
  LOW: 30,
  BACKLOG: 10
} as const;