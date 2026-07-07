-- Add structured data columns to profiles table
-- Run this in the Supabase SQL Editor

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;

-- Migrate experience from TEXT to JSONB
-- Existing text values become [{ description: "..." }]
ALTER TABLE profiles
  ALTER COLUMN experience TYPE JSONB USING
    CASE
      WHEN experience IS NULL OR experience = '' THEN '[]'::jsonb
      WHEN experience::text LIKE '[%' THEN experience::jsonb
      ELSE jsonb_build_array(jsonb_build_object('description', experience))
    END;

ALTER TABLE profiles
  ALTER COLUMN experience SET DEFAULT '[]'::jsonb;
