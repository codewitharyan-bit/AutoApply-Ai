-- Add structured data columns to jobs table
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS required_skills text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS preferred_skills text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience_level text DEFAULT '',
  ADD COLUMN IF NOT EXISTS employment_type text DEFAULT '',
  ADD COLUMN IF NOT EXISTS remote_type text DEFAULT '',
  ADD COLUMN IF NOT EXISTS industry text DEFAULT '',
  ADD COLUMN IF NOT EXISTS technologies text[] DEFAULT '{}';

-- Create job_recommendations table
CREATE TABLE IF NOT EXISTS job_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  match_score integer NOT NULL DEFAULT 0,
  matched_skills text[] DEFAULT '{}',
  missing_skills text[] DEFAULT '{}',
  recommendation_reason text DEFAULT '',
  recommended_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_job_recommendations_user_id ON job_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_job_recommendations_match_score ON job_recommendations(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_required_skills ON jobs USING GIN(required_skills);
CREATE INDEX IF NOT EXISTS idx_jobs_technologies ON jobs USING GIN(technologies);
