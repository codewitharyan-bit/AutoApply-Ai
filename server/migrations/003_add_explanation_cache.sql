ALTER TABLE job_recommendations
  ADD COLUMN IF NOT EXISTS explanation_data JSONB,
  ADD COLUMN IF NOT EXISTS explanation_generated_at TIMESTAMP WITH TIME ZONE;
