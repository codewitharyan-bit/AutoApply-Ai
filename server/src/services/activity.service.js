const supabase = require('../config/supabase');
const { getUserByClerkId } = require('./user.service');

async function logActivity({ clerkId, queueId, event, message, metadata = {} }) {
  const user = await getUserByClerkId(clerkId);

  const { error } = await supabase
    .from('auto_apply_activity')
    .insert({
      user_id: user.id,
      queue_id: queueId,
      event,
      message,
      metadata,
    });

  if (error) throw error;
}

async function listActivity({ clerkId, limit = 20, offset = 0 }) {
  const user = await getUserByClerkId(clerkId);

  const { data, error } = await supabase
    .from('auto_apply_activity')
    .select(`
      id,
      event,
      message,
      metadata,
      created_at,
      queue_id
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    event: row.event,
    message: row.message,
    metadata: row.metadata || {},
    createdAt: row.created_at,
    queueId: row.queue_id,
  }));
}

module.exports = {
  logActivity,
  listActivity,
};
