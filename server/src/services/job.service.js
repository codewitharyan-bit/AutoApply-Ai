const supabase = require('../config/supabase')

const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

const getJobById = async (jobId) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

module.exports = {
  getJobs,
  getJobById,
}