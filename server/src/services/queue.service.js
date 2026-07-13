const supabase = require('../config/supabase');
const { getUserByClerkId } = require('./user.service');
const { QUEUE_STATUS, ACTIVITY_EVENTS } = require('./constants');
const { logActivity } = require('./activity.service');

const VALID_STATUSES = Object.values(QUEUE_STATUS);
const DUPLICATE_STATUSES = [QUEUE_STATUS.PENDING, QUEUE_STATUS.PROCESSING, QUEUE_STATUS.COMPLETED];

function mapQueueItem(row, index) {
  return {
    id: row.id,
    jobId: row.job_id,
    position: index + 1,
    status: row.status,
    matchScore: row.match_score,
    resumeScore: row.resume_score,
    attemptCount: row.attempt_count,
    queuedAt: row.queued_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    failureReason: row.failure_reason,
    job: row.jobs
      ? {
          title: row.jobs.title,
          company: row.jobs.company,
          location: row.jobs.location,
          employmentType: row.jobs.employment_type,
          remoteType: row.jobs.remote_type,
          jobUrl: row.jobs.job_url,
        }
      : null,
  };
}

async function getExistingJobIds(clerkId) {
  const user = await getUserByClerkId(clerkId);

  const { data, error } = await supabase
    .from('auto_apply_queue')
    .select('job_id')
    .eq('user_id', user.id)
    .in('status', DUPLICATE_STATUSES);

  if (error) throw error;
  return new Set((data || []).map((r) => r.job_id));
}

async function queueJobs({ clerkId, jobs }) {
  const user = await getUserByClerkId(clerkId);
  const requested = jobs?.length || 0;

  if (requested === 0) {
    return { queued: 0, duplicates: 0, failed: 0, requested: 0, items: [] };
  }

  for (const job of jobs) {
    if (
      typeof job.jobId !== 'string' ||
      typeof job.matchScore !== 'number' ||
      typeof job.resumeScore !== 'number' ||
      job.matchScore < 0 || job.matchScore > 100 ||
      job.resumeScore < 0 || job.resumeScore > 100
    ) {
      return { queued: 0, duplicates: 0, failed: 1, requested, items: [] };
    }
  }

  const existingIds = await getExistingJobIds(clerkId);

  const toInsert = [];
  let duplicates = 0;

  for (const job of jobs) {
    if (existingIds.has(job.jobId)) {
      duplicates++;
    } else {
      toInsert.push({
        user_id: user.id,
        job_id: job.jobId,
        match_score: Math.round(job.matchScore),
        resume_score: Math.round(job.resumeScore),
      });
    }
  }

  let queued = 0;
  let failed = 0;

  if (toInsert.length > 0) {
    const { data, error } = await supabase
      .from('auto_apply_queue')
      .insert(toInsert)
      .select();

    if (error) {
      failed = toInsert.length;
    } else {
      queued = data.length;

      const jobIds = toInsert.map((r) => r.job_id);
      const { data: jobData } = await supabase
        .from('jobs')
        .select('id, title, company')
        .in('id', jobIds);

      const jobInfo = {};
      if (jobData) {
        for (const j of jobData) {
          jobInfo[j.id] = { title: j.title || 'Unknown', company: j.company || 'Unknown' };
        }
      }

      for (let i = 0; i < data.length; i++) {
        try {
          const info = jobInfo[data[i].job_id] || {};
          await logActivity({
            clerkId,
            queueId: data[i].id,
            event: ACTIVITY_EVENTS.QUEUED,
            message: `Queued — ${info.title} at ${info.company}`,
            metadata: { jobTitle: info.title, company: info.company },
          });
        } catch {
          // Activity logging failure should not block queue insertion
        }
      }
    }
  }

  const items = await getQueue(clerkId);

  return { queued, duplicates, failed, requested, items };
}

async function getQueue(clerkId) {
  const user = await getUserByClerkId(clerkId);

  const { data, error } = await supabase
    .from('auto_apply_queue')
    .select(`
      id,
      job_id,
      status,
      match_score,
      resume_score,
      attempt_count,
      queued_at,
      started_at,
      completed_at,
      failure_reason,
      jobs (
        title,
        company,
        location,
        employment_type,
        remote_type,
        job_url
      )
    `)
    .eq('user_id', user.id)
    .order('queued_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row, i) => mapQueueItem(row, i));
}

async function updateStatus(id, clerkId, updates) {
  const user = await getUserByClerkId(clerkId);

  const payload = {};

  if (updates.status !== undefined) {
    if (!VALID_STATUSES.includes(updates.status)) {
      throw new Error(`Invalid status: ${updates.status}`);
    }
    payload.status = updates.status;

    if (updates.status === QUEUE_STATUS.PROCESSING && !updates.started_at) {
      payload.started_at = new Date().toISOString();
    }
    if ([QUEUE_STATUS.COMPLETED, QUEUE_STATUS.FAILED, QUEUE_STATUS.SKIPPED].includes(updates.status) && !updates.completed_at) {
      payload.completed_at = new Date().toISOString();
    }
  }

  if (updates.failure_reason !== undefined) {
    payload.failure_reason = updates.failure_reason;
  }
  if (updates.attempt_count !== undefined) {
    payload.attempt_count = updates.attempt_count;
  }
  if (updates.started_at) {
    payload.started_at = updates.started_at;
  }
  if (updates.completed_at) {
    payload.completed_at = updates.completed_at;
  }

  payload.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from('auto_apply_queue')
    .update(payload)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

async function removeQueueItem(id, clerkId) {
  const user = await getUserByClerkId(clerkId);

  const { error } = await supabase
    .from('auto_apply_queue')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

async function clearCompleted(clerkId) {
  const user = await getUserByClerkId(clerkId);

  const { error } = await supabase
    .from('auto_apply_queue')
    .delete()
    .eq('user_id', user.id)
    .in('status', [QUEUE_STATUS.COMPLETED, QUEUE_STATUS.FAILED, QUEUE_STATUS.SKIPPED]);

  if (error) throw error;
}

module.exports = {
  queueJobs,
  getQueue,
  updateStatus,
  removeQueueItem,
  clearCompleted,
};
