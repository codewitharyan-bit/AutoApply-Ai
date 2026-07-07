const supabase = require("../config/supabase");
const { getUserByClerkId } = require("./user.service");

const EXPERIENCE_HINTS = {
  "fresher": "Fresher",
  "0-1 years": "Fresher",
  "1-2 years": "Junior",
  "2-3 years": "Junior",
  "3-5 years": "Mid Level",
  "5-7 years": "Senior",
  "7-10 years": "Senior",
  "10+ years": "Principal",
};

const generateJobSearchQueries = async (clerkId) => {
  const user = await getUserByClerkId(clerkId);

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`
      skills,
      preferred_roles,
      location,
      experience_level
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const location = profile.location?.trim() || "India";

  const experience =
    EXPERIENCE_HINTS[
      profile.experience_level?.toLowerCase()
    ] || "";

  const roles =
    profile.preferred_roles?.length
      ? profile.preferred_roles
      : ["Software Engineer"];

  const skills = (profile.skills || []).slice(0, 2);

  const queries = [];

  for (const role of roles) {
    queries.push(
      `${experience} ${role} ${location}`.trim()
    );

    if (skills.length) {
      queries.push(
        `${experience} ${role} ${skills.join(" ")} ${location}`.trim()
      );
    }
  }

  if (!profile.preferred_roles?.length) {
    if (skills.length > 0) {
      queries.push(
        `${experience} ${skills.join(' ')} ${location}`.trim()
      );
    } else {
      queries.push(
        `${experience} Software Engineer ${location}`.trim()
      );
    }
  }

  return [...new Set(queries)];
};

module.exports = {
  generateJobSearchQueries,
};