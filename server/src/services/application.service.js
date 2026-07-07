const supabase = require("../config/supabase");
const { getUserByClerkId } = require("./user.service");

const APPLICATION_STATUSES = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

const JOB_SELECT = `
  *,
  jobs (
    id,
    title,
    company,
    location,
    salary,
    description,
    job_url,
    created_at
  )
`;

const saveApplication = async (clerkId, jobId) => {
  const user = await getUserByClerkId(clerkId);

  const { data: existing, error: existingError } = await supabase
    .from("applications")
    .select("id")
    .eq("user_id", user.id)
    .eq("job_id", jobId)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    throw new Error("Job already saved.");
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      job_id: jobId,
      status: "saved",
    })
    .select(JOB_SELECT)
    .single();

  if (error) throw error;

  return data;
};

const getApplicationsByClerkId = async (clerkId) => {
  const user = await getUserByClerkId(clerkId);

  const { data, error } = await supabase
    .from("applications")
    .select(JOB_SELECT)
    .eq("user_id", user.id)
    .order("updated_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
};

const getApplicationById = async (clerkId, applicationId) => {
  const user = await getUserByClerkId(clerkId);

  const { data, error } = await supabase
    .from("applications")
    .select(JOB_SELECT)
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;

  return data;
};

const updateApplicationStatus = async (
  clerkId,
  applicationId,
  status
) => {
  if (!APPLICATION_STATUSES.includes(status)) {
    throw new Error("Invalid application status.");
  }

  const user = await getUserByClerkId(clerkId);

  const { data, error } = await supabase
    .from("applications")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .select(JOB_SELECT)
    .single();

  if (error) throw error;

  return data;
};

const deleteApplication = async (
  clerkId,
  applicationId
) => {
  const user = await getUserByClerkId(clerkId);

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", applicationId)
    .eq("user_id", user.id);

  if (error) throw error;

  return true;
};

module.exports = {
  saveApplication,
  getApplicationsByClerkId,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  APPLICATION_STATUSES,
};