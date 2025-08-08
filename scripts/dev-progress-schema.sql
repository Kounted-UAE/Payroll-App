-- Development Progress Tracking Schema
-- Creates tables for tracking project features, sessions, and progress

-- Project features tracking (derived from sidebar navigation and project goals)
CREATE TABLE IF NOT EXISTS dev_project_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT UNIQUE NOT NULL, -- Unique identifier (e.g., "kwiver-cpq", "payroll-payruns")
  category TEXT NOT NULL, -- "Sales Tools", "Payroll Tools", etc.
  title TEXT NOT NULL,
  description TEXT,
  objectives JSONB DEFAULT '[]'::jsonb, -- Array of objectives/specifications
  estimated_hours DECIMAL DEFAULT 0,
  priority INTEGER DEFAULT 50, -- 1-100 priority scale
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed', 'deferred', 'blocked')),
  completion_percentage DECIMAL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  url_path TEXT, -- Associated route/URL
  icon_name TEXT, -- Lucide icon name
  dependencies JSONB DEFAULT '[]'::jsonb, -- Array of feature_keys this depends on
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session summaries with AI analysis
CREATE TABLE IF NOT EXISTS dev_session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date DATE NOT NULL,
  session_title TEXT,
  summary_text TEXT NOT NULL,
  ai_estimated_hours DECIMAL, -- From OpenAI analysis
  ai_confidence_score DECIMAL, -- 0-1 confidence in AI analysis
  features_worked_on JSONB DEFAULT '[]'::jsonb, -- Array of feature_keys
  key_achievements JSONB DEFAULT '[]'::jsonb,
  blockers_identified JSONB DEFAULT '[]'::jsonb,
  tech_debt_notes TEXT,
  created_by_user_id TEXT REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Code metrics from GitHub analysis
CREATE TABLE IF NOT EXISTS dev_code_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_date DATE NOT NULL,
  commit_count INTEGER DEFAULT 0,
  files_changed INTEGER DEFAULT 0,
  lines_added INTEGER DEFAULT 0,
  lines_removed INTEGER DEFAULT 0,
  feature_mappings JSONB DEFAULT '{}'::jsonb, -- Map feature_keys to line counts
  complexity_metrics JSONB DEFAULT '{}'::jsonb,
  top_changed_files JSONB DEFAULT '[]'::jsonb,
  commit_messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress checkpoints and milestones
CREATE TABLE IF NOT EXISTS dev_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID REFERENCES dev_project_features(id) ON DELETE CASCADE,
  milestone_name TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  completion_criteria JSONB DEFAULT '[]'::jsonb,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  completion_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress snapshots for historical tracking
CREATE TABLE IF NOT EXISTS dev_progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID REFERENCES dev_project_features(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  completion_percentage DECIMAL NOT NULL,
  calculation_method TEXT, -- 'manual', 'ai-estimated', 'code-analysis', 'combined'
  contributing_factors JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dev_features_status ON dev_project_features(status);
CREATE INDEX IF NOT EXISTS idx_dev_features_category ON dev_project_features(category);
CREATE INDEX IF NOT EXISTS idx_dev_sessions_date ON dev_session_logs(session_date);
CREATE INDEX IF NOT EXISTS idx_dev_metrics_date ON dev_code_metrics(analysis_date);
CREATE INDEX IF NOT EXISTS idx_dev_milestones_feature ON dev_milestones(feature_id);
CREATE INDEX IF NOT EXISTS idx_dev_snapshots_feature_date ON dev_progress_snapshots(feature_id, snapshot_date);

-- Enable RLS (Row Level Security)
ALTER TABLE dev_project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_code_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_progress_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow access for authenticated users with admin roles)
CREATE POLICY "Enable read access for authenticated users" ON dev_project_features
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for kounted staff" ON dev_project_features
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM v_authenticated_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role_slug LIKE 'kounted-%'
  )
);

CREATE POLICY "Enable read access for authenticated users" ON dev_session_logs
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for kounted staff" ON dev_session_logs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM v_authenticated_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role_slug LIKE 'kounted-%'
  )
);

CREATE POLICY "Enable read access for authenticated users" ON dev_code_metrics
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for kounted staff" ON dev_code_metrics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM v_authenticated_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role_slug LIKE 'kounted-%'
  )
);

CREATE POLICY "Enable read access for authenticated users" ON dev_milestones
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for kounted staff" ON dev_milestones
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM v_authenticated_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role_slug LIKE 'kounted-%'
  )
);

CREATE POLICY "Enable read access for authenticated users" ON dev_progress_snapshots
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for kounted staff" ON dev_progress_snapshots
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM v_authenticated_profiles 
    WHERE auth_user_id = auth.uid() 
    AND role_slug LIKE 'kounted-%'
  )
);

-- Update trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dev_features_updated_at BEFORE UPDATE ON dev_project_features
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dev_sessions_updated_at BEFORE UPDATE ON dev_session_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dev_milestones_updated_at BEFORE UPDATE ON dev_milestones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();