const normalizeJob = (job) => {
  return {
    title: job.job_title || '',
    company: job.employer_name || '',
    location: job.job_city || job.job_country || '',
    description: job.job_description || '',
    job_url: job.job_apply_link || '',
    salary: job.job_min_salary && job.job_max_salary
      ? `${job.job_min_salary} - ${job.job_max_salary}`
      : job.job_max_salary
        ? `Up to ${job.job_max_salary}`
        : job.job_min_salary
          ? `From ${job.job_min_salary}`
          : null,
    employment_type: job.job_employment_type || '',
    required_skills: [],
    preferred_skills: [],
    experience_level: '',
    remote_type: '',
    industry: '',
    technologies: [],
  };
};

module.exports = normalizeJob;
