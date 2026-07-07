CREATE TABLE IF NOT EXISTS career_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    resume_score INTEGER NOT NULL DEFAULT 0,
    market_score INTEGER NOT NULL DEFAULT 0,
    role_readiness JSONB DEFAULT '{}'::jsonb,
    top_matching_skills JSONB DEFAULT '[]'::jsonb,
    missing_skills JSONB DEFAULT '[]'::jsonb,
    learning_roadmap JSONB DEFAULT '[]'::jsonb,
    total_jobs_analyzed INTEGER NOT NULL DEFAULT 0,
    last_job_import TIMESTAMPTZ,
    analysis_version INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_analysis_user_id ON career_analysis(user_id);
