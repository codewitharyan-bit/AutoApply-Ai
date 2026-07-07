const supabase = require('../config/supabase');
const { searchJobs } = require('./jsearch.service');
const { generateJobSearchQueries } = require('./jobQuery.service');
const { batchParseJobs } = require('./jobParser.service');
const normalizeJob = require('../utils/normalize');
const { importJobs } = require('./jobimporter');
const { getUserByClerkId } = require('./user.service');



const fetchJobsWithFallback = async (searchQueries) => {
  const seenQueries = new Set();
  const seenUrls = new Set();
  const allJobs = [];

  for (const query of searchQueries) {
    if (!query || seenQueries.has(query)) continue;

    seenQueries.add(query);

    try {
      const response = await searchJobs({ query });

      const jobs = Array.isArray(response) ? response : [];

      for (const job of jobs) {
        const url = job.job_apply_link || job.job_url;

        if (!url || seenUrls.has(url)) continue;

        seenUrls.add(url);
        allJobs.push(job);
      }

      // Stop once enough jobs are collected
      if (allJobs.length >= 20) {
        break;
      }
    } catch (err) {
      console.error(`JSearch query failed: "${query}"`, err.message);
    }
  }

  return allJobs;
};

const runJobImport = async (clerkId) => {
  let log = null;

  try {
    const startTime = Date.now();
    const user = await getUserByClerkId(clerkId);

    const { data, error } = await supabase
      .from('import_logs')
      .insert({ source: 'JSearch', status: 'running', user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    log = data;

    const searchQueries = await generateJobSearchQueries(clerkId);

    const rawJobs = await fetchJobsWithFallback(searchQueries);
    const normalized = rawJobs.map(normalizeJob);

    const { data: existing } = await supabase
      .from('jobs')
      .select('job_url, required_skills')
      .in('job_url', normalized.map((j) => j.job_url));

    const existingMap = new Map();
    if (existing) {
      for (const row of existing) {
        existingMap.set(row.job_url, row.required_skills && row.required_skills.length > 0);
      }
    }

    const newJobs = normalized.filter((j) => !existingMap.has(j.job_url));
    const parsedJobs = newJobs.length > 0 ? await batchParseJobs(newJobs, 5) : [];
    const parsedMap = new Map(parsedJobs.map((j) => [j.job_url, j]));

    const finalJobs = normalized.map((job) => {
      const parsed = parsedMap.get(job.job_url);
      if (parsed) {
        return {
          ...job,
          required_skills: parsed.required_skills || [],
          preferred_skills: parsed.preferred_skills || [],
          experience_level: parsed.experience_level || '',
          employment_type: parsed.employment_type || '',
          remote_type: parsed.remote_type || '',
          industry: parsed.industry || '',
          technologies: parsed.technologies || [],
        };
      }
      if (existingMap.has(job.job_url)) {
        return job;
      }
      return {
        ...job,
        required_skills: [],
        preferred_skills: [],
        experience_level: '',
        employment_type: '',
        remote_type: '',
        industry: '',
        technologies: [],
      };
    });

    await importJobs(finalJobs);

    await supabase
      .from('import_logs')
      .update({
        status: 'success',
        jobs_imported: finalJobs.length,
        completed_at: new Date().toISOString(),
        duration_ms: Date.now() - startTime,
      })
      .eq('id', log.id);

    return {
      success: true,
      imported: finalJobs.length,
      lastImport: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Job import failed:', err);
    if (log) {
      await supabase
        .from('import_logs')
        .update({
          status: 'failed',
          error_message: err.message,
          completed_at: new Date().toISOString(),
        })
        .eq('id', log.id);
    }
    throw err;
  }
};

const reparseExistingJobs = async () => {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .or('required_skills.eq.{}');

  if (error) throw error;
  if (!jobs || jobs.length === 0) return { parsed: 0 };

  const parsed = await batchParseJobs(jobs, 5);
  const { error: updateError } = await supabase
    .from('jobs')
    .upsert(parsed, { onConflict: 'id' });

  if (updateError) throw updateError;
  return { parsed: parsed.length };
};

module.exports = {
  runJobImport,
  reparseExistingJobs,
};
