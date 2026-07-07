const ai = require('../utils/gemini');
const { normalizeSkills } = require('../utils/skillNormalizer');

const parseJobDescription = async (job) => {
  if (!job.description || job.description.trim().length < 50) {
    return {
      required_skills: [],
      preferred_skills: [],
      experience_level: '',
      employment_type: '',
      remote_type: '',
      industry: '',
      technologies: [],
    };
  }

  const prompt = `You are a job parser. Extract structured data from this job posting.

Return ONLY valid JSON. No markdown, no code fences.

Schema:
{
  "required_skills": ["string"],
  "preferred_skills": ["string"],
  "experience_level": "string",
  "employment_type": "string",
  "remote_type": "string",
  "industry": "string",
  "technologies": ["string"]
}

Rules:
- required_skills: Technical skills MENTIONED AS REQUIRED. Include programming languages, frameworks, databases, tools, platforms.
- preferred_skills: Skills listed as "nice to have", "preferred", "bonus", "plus".
- experience_level: "Entry", "Mid", "Senior", "Lead", or "Principal". Extract from years of experience mentioned.
- employment_type: "Full-time", "Part-time", "Contract", "Freelance", "Internship".
- remote_type: "Remote", "Hybrid", "On-site", or empty string.
- industry: The industry sector (e.g., "Fintech", "Healthcare", "E-commerce", "SaaS").
- technologies: ALL technologies, tools, platforms mentioned anywhere.
- DO NOT include soft skills (communication, leadership, teamwork, problem solving, analytical thinking, etc.)
- DO NOT include vague concepts.
- Use exact skill names as written, capitalize properly.
- If a field cannot be determined, use empty string or empty array.

Title: ${job.title || ''}
Company: ${job.company || ''}
Description:
${job.description.slice(0, 4000)}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const raw = typeof response.text === 'function' ? response.text() : response.text;

  if (!raw) {
    return {
      required_skills: [],
      preferred_skills: [],
      experience_level: '',
      employment_type: '',
      remote_type: '',
      industry: '',
      technologies: [],
    };
  }

  let parsed;
  try {
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini parse error for job:', job.id || job.title);
    console.error('Raw response:', raw.slice(0, 500));
    return {
      required_skills: [],
      preferred_skills: [],
      experience_level: '',
      employment_type: '',
      remote_type: '',
      industry: '',
      technologies: [],
    };
  }

  return {
    required_skills: normalizeSkills(parsed.required_skills || []),
    preferred_skills: normalizeSkills(parsed.preferred_skills || []),
    experience_level: typeof parsed.experience_level === 'string' ? parsed.experience_level.trim() : '',
    employment_type: typeof parsed.employment_type === 'string' ? parsed.employment_type.trim() : '',
    remote_type: typeof parsed.remote_type === 'string' ? parsed.remote_type.trim() : '',
    industry: typeof parsed.industry === 'string' ? parsed.industry.trim() : '',
    technologies: normalizeSkills(parsed.technologies || []),
  };
};

const batchParseJobs = async (jobs, batchSize = 5) => {
  const results = [];
  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    const parsed = await Promise.allSettled(batch.map(parseJobDescription));
    for (let j = 0; j < parsed.length; j++) {
      const job = batch[j];
      const result = parsed[j];
      results.push({
        ...job,
        ...(result.status === 'fulfilled' ? result.value : {
          required_skills: [],
          preferred_skills: [],
          experience_level: '',
          employment_type: '',
          remote_type: '',
          industry: '',
          technologies: [],
        }),
      });
    }
  }
  return results;
};

module.exports = {
  parseJobDescription,
  batchParseJobs,
};
