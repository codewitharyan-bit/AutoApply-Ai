const supabase = require("../config/supabase");
const { getUserByClerkId } = require("./user.service");
const { validatePreferences } = require("./autoApply.validation");

const DEFAULT_PREFERENCES = {
  enabled: false,
  minimum_match_score: 80,
  minimum_resume_score: 75,
  daily_limit: 10,
  allow_remote: true,
  locations: [],
  job_types: [],
  experience_levels: [],
  required_skills: [],
  excluded_companies: [],
};

async function getPreferences(clerkId) {
  const user = await getUserByClerkId(clerkId);

  const { data, error } = await supabase
    .from("auto_apply_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  const { data: created, error: createError } = await supabase
    .from("auto_apply_preferences")
    .insert({ user_id: user.id, ...DEFAULT_PREFERENCES })
    .select()
    .single();

  if (createError) throw createError;
  return created;
}

async function updatePreferences(clerkId, updates) {
  const existing = await getPreferences(clerkId);
  const payload = validatePreferences(updates);

  if (Object.keys(payload).length === 0) return existing;

  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("auto_apply_preferences")
    .update(payload)
    .eq("id", existing.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = { getPreferences, updatePreferences };
