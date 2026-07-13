const supabase = require('../config/supabase');
const { getUserByClerkId } = require('./user.service');
const { updateStatus } = require('./queue.service');
const { logActivity } = require('./activity.service');
const { QUEUE_STATUS, ACTIVITY_EVENTS, WORKER_STATE, WORKER_CONFIG } = require('./constants');

// TODO (Phase 4): Replace select+update with an atomic claim
// to support concurrent workers without race conditions.
async function getNextPendingJob(clerkId) {
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
    .eq('status', QUEUE_STATUS.PENDING)
    .order('queued_at', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

async function startProcessing(clerkId, queueItem) {
  await updateStatus(queueItem.id, clerkId, {
    status: QUEUE_STATUS.PROCESSING,
    attempt_count: (queueItem.attempt_count || 0) + 1,
    started_at: new Date().toISOString(),
  });

  const title = queueItem.jobs?.title || 'Unknown';
  const company = queueItem.jobs?.company || 'Unknown';

  await logActivity({
    clerkId,
    queueId: queueItem.id,
    event: ACTIVITY_EVENTS.STARTED,
    message: `Started processing — ${title} at ${company}`,
    metadata: { jobTitle: title, company },
  });
}

// Phase 4: Replace executeJob body with adapter.apply({ queueItem, clerkId })
async function executeJob({ queueItem, clerkId }) {
  await new Promise((resolve) => setTimeout(resolve, WORKER_CONFIG.simulatedDelayMs));
  return { success: true };
}

async function completeJob(clerkId, queueItem, durationMs) {
  await updateStatus(queueItem.id, clerkId, {
    status: QUEUE_STATUS.COMPLETED,
    completed_at: new Date().toISOString(),
  });

  const title = queueItem.jobs?.title || 'Unknown';
  const company = queueItem.jobs?.company || 'Unknown';

  await logActivity({
    clerkId,
    queueId: queueItem.id,
    event: ACTIVITY_EVENTS.COMPLETED,
    message: `Completed — ${title} at ${company}`,
    metadata: { jobTitle: title, company, durationMs },
  });
}

async function failJob(clerkId, queueItem, error_, durationMs) {
  await updateStatus(queueItem.id, clerkId, {
    status: QUEUE_STATUS.FAILED,
    failure_reason: error_.message,
    completed_at: new Date().toISOString(),
  });

  const title = queueItem.jobs?.title || 'Unknown';
  const company = queueItem.jobs?.company || 'Unknown';

  await logActivity({
    clerkId,
    queueId: queueItem.id,
    event: ACTIVITY_EVENTS.FAILED,
    message: `Failed — ${title} at ${company}: ${error_.message}`,
    metadata: { jobTitle: title, company, durationMs, error: error_.message },
  });
}

async function runNextJob(clerkId) {
  const queueItem = await getNextPendingJob(clerkId);

  if (!queueItem) {
    return {
      processed: false,
      worker: { state: WORKER_STATE.IDLE, processedCount: 0 },
      job: null,
    };
  }

  const started = Date.now();

  try {
    await startProcessing(clerkId, queueItem);
    await executeJob({ queueItem, clerkId });
    const durationMs = Date.now() - started;
    await completeJob(clerkId, queueItem, durationMs);

    return {
      processed: true,
      worker: { state: WORKER_STATE.IDLE, processedCount: 1 },
      job: {
        queueId: queueItem.id,
        jobId: queueItem.job_id,
        status: QUEUE_STATUS.COMPLETED,
        durationMs,
      },
    };
  } catch (err) {
    const durationMs = Date.now() - started;
    await failJob(clerkId, queueItem, err, durationMs);

    return {
      processed: true,
      worker: { state: WORKER_STATE.IDLE, processedCount: 1 },
      job: {
        queueId: queueItem.id,
        jobId: queueItem.job_id,
        status: QUEUE_STATUS.FAILED,
        durationMs,
        failureReason: err.message,
      },
    };
  }
}

async function runBatch(clerkId) {
  const results = [];
  let processed = 0;
  let completed = 0;
  let failed = 0;

  while (processed < WORKER_CONFIG.maxBatchSize) {
    const result = await runNextJob(clerkId);
    if (!result.processed) break;
    results.push(result.job);
    processed++;
    if (result.job.status === QUEUE_STATUS.COMPLETED) completed++;
    else failed++;
  }

  return {
    processed,
    worker: { state: WORKER_STATE.IDLE, processedCount: processed },
    summary: { completed, failed },
    jobs: results,
  };
}

module.exports = {
  runNextJob,
  runBatch,
};
