const { generateCareerAnalysis } = require('./careerAnalysis.service');

const pending = new Set();

const scheduleAnalysis = async (clerkId, { trigger, delayMs = 0 } = {}) => {
  if (!clerkId) return;

  if (pending.has(clerkId)) return;
  pending.add(clerkId);

  try {
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    await generateCareerAnalysis(clerkId); // { data, created } returned but not needed here
  } catch (err) {
    console.error(`[CareerAnalysis] Failed for ${clerkId} (trigger: ${trigger}):`, err);
  } finally {
    pending.delete(clerkId);
  }
};

module.exports = { scheduleAnalysis };
