const supabase = require("../config/supabase");

const importJobs = async (jobs) => {
  const { error } = await supabase
    .from("jobs")
    .upsert(jobs, {
      onConflict: "job_url",
    });

  if (error) {
    throw error;
  }

  return jobs.length;
};

module.exports = {
  importJobs,
};