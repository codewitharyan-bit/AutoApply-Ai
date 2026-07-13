const ACTIVITY_EVENTS = {
  QUEUED: 'queued',
  STARTED: 'started',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

const QUEUE_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  SKIPPED: 'skipped',
};

const WORKER_STATE = {
  IDLE: 'idle',
  RUNNING: 'running',
  ERROR: 'error',
};

const WORKER_CONFIG = {
  simulatedDelayMs: 1500,
  maxBatchSize: 100,
  maxRetries: 3,
};

module.exports = {
  ACTIVITY_EVENTS,
  QUEUE_STATUS,
  WORKER_STATE,
  WORKER_CONFIG,
};
