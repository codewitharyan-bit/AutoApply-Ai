const { PDFParse } = require('pdf-parse');
const supabase = require('../config/supabase');
const ai = require('../utils/gemini');
const { getUserByClerkId } = require('./user.service');
const { normalizeSkills, isSoftSkill, displayName } = require('../utils/skillNormalizer');

const normalizeStr = (s) => (typeof s === 'string' ? s.trim() : '');
const normalizeArr = (arr) => (Array.isArray(arr) ? arr.map(normalizeStr).filter(Boolean) : []);
const uniqueArr = (arr) => [...new Set(arr)];

const filterTechnicalSkills = (skills) => {
  return skills.filter((s) => !isSoftSkill(s));
};

const normalizeExperienceEntry = (entry) => {
  if (typeof entry === 'string') return null;
  if (!entry || typeof entry !== 'object') return null;
  return {
    company: normalizeStr(entry.company),
    role: normalizeStr(entry.role),
    duration: normalizeStr(entry.duration),
    description: normalizeStr(entry.description),
  };
};

const normalizeExperience = (exp) => {
  if (typeof exp === 'string') {
    if (!exp.trim()) return [];
    return [{ description: exp.trim() }];
  }
  if (!Array.isArray(exp)) return [];
  return exp.map(normalizeExperienceEntry).filter(Boolean);
};

const normalizeEducationEntry = (entry) => {
  if (typeof entry === 'string') return null;
  if (!entry || typeof entry !== 'object') return null;
  const e = {
    degree: normalizeStr(entry.degree),
    specialization: normalizeStr(entry.specialization || entry.field || entry.major || ''),
    institute: normalizeStr(entry.institute || entry.school || entry.university || ''),
    graduation_year: normalizeStr(entry.graduation_year || entry.year || ''),
  };
  if (!e.degree && !e.institute) return null;
  return e;
};

const normalizeEducation = (edu) => {
  if (!Array.isArray(edu)) return [];
  return edu.map(normalizeEducationEntry).filter(Boolean);
};

const normalizeProjectEntry = (entry) => {
  if (typeof entry === 'string') return null;
  if (!entry || typeof entry !== 'object') return null;
  return {
    name: normalizeStr(entry.name || entry.title || ''),
    technologies: Array.isArray(entry.technologies || entry.tech || entry.stack || entry.skills || [])
      ? uniqueArr(
          (entry.technologies || entry.tech || entry.stack || entry.skills || [])
            .map(normalizeStr)
            .filter(Boolean)
        ).sort()
      : [],
    description: normalizeStr(entry.description),
  };
};

const normalizeProjects = (projects) => {
  if (!Array.isArray(projects)) return [];
  return projects.map(normalizeProjectEntry).filter((p) => p.name || p.description);
};

const capitalizeRole = (s) => {
  const lower = s.toLowerCase();
  const preserved = new Map([
    ['nodejs developer', 'Node.js Developer'],
    ['node.js developer', 'Node.js Developer'],
    ['react developer', 'React Developer'],
    ['reactjs developer', 'React Developer'],
    ['full stack developer', 'Full Stack Developer'],
    ['fullstack developer', 'Full Stack Developer'],
    ['backend developer', 'Backend Developer'],
    ['back-end developer', 'Backend Developer'],
    ['frontend developer', 'Frontend Developer'],
    ['front-end developer', 'Frontend Developer'],
    ['software engineer', 'Software Engineer'],
    ['software developer', 'Software Developer'],
    ['data scientist', 'Data Scientist'],
    ['machine learning engineer', 'Machine Learning Engineer'],
    ['ml engineer', 'Machine Learning Engineer'],
    ['devops engineer', 'DevOps Engineer'],
    ['product manager', 'Product Manager'],
  ]);
  return preserved.get(lower) || lower.replace(/\b\w/g, (c) => c.toUpperCase());
};

const normalizeRoles = (roles) => {
  const raw = normalizeArr(roles);
  const mapped = raw.map(capitalizeRole).filter(Boolean);
  return uniqueArr(mapped);
};

const parseResume = async (clerkId) => {
  const user = await getUserByClerkId(clerkId);

  const { data: resume, error: resumeError } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (resumeError) throw resumeError;
  if (!resume) throw new Error('Resume not found.');

  const { data: file, error: downloadError } = await supabase.storage
    .from('resumes')
    .download(resume.file_path);

  if (downloadError) throw downloadError;

  const buffer = Buffer.from(await file.arrayBuffer());
  const pdf = new PDFParse({ data: buffer });
  const parsedPdf = await pdf.getText();
  const resumeText = parsedPdf.text;

  const prompt = `You are an ATS (Applicant Tracking System) resume parser.

Parse the following resume and return ONLY valid JSON. Do not include markdown or code fences.

Schema:
{
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "specialization": "string",
      "institute": "string",
      "graduation_year": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "technologies": ["string"],
      "description": "string"
    }
  ],
  "preferred_roles": ["string"]
}

Rules:
- Extract ONLY technical skills: Programming languages, frameworks, libraries, databases, cloud platforms, DevOps tools, testing frameworks, version control, tools.
- DO NOT include soft skills: Communication, Leadership, Analytical Thinking, Problem Solving, Critical Thinking, Teamwork, or any similar non-technical skills.
- Experience must be an array of objects, NOT a single string.
- Break each job/internship into its own object with company, role, duration, and description.
- Education must be an array with degree, specialization, institute name, and graduation year.
- Projects must be an array with name, technologies used, and a short description.
- Preferred roles are the job titles the candidate is seeking.
- If a field is missing from the resume, use an empty array or empty string as appropriate.
- Do NOT summarize or paraphrase. Extract facts exactly as written.

Resume:
${resumeText}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const raw = typeof response.text === 'function' ? response.text() : response.text;

  if (!raw) {
    throw new Error('Gemini returned an empty response.');
  }

  let parsed;
  try {
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini Response:', raw.slice(0, 500));
    throw new Error('Failed to parse Gemini response.');
  }

  const rawSkills = normalizeArr(parsed.skills);
  const technicalSkills = filterTechnicalSkills(rawSkills);

  const normalized = {
    skills: normalizeSkills(technicalSkills),
    experience: normalizeExperience(parsed.experience),
    education: normalizeEducation(parsed.education),
    projects: normalizeProjects(parsed.projects),
    preferred_roles: normalizeRoles(parsed.preferred_roles),
  };

  return {
    skills: normalized.skills,
    experience: normalized.experience,
    education: normalized.education,
    projects: normalized.projects,
    preferred_roles: normalized.preferred_roles,
  };
};

module.exports = {
  parseResume,
};
