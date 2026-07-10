const ARRAY_FIELDS = [
  "locations",
  "job_types",
  "experience_levels",
  "required_skills",
  "excluded_companies",
];

const ALLOWED_FIELDS = [
  "enabled",
  "minimum_match_score",
  "minimum_resume_score",
  "daily_limit",
  "allow_remote",
  ...ARRAY_FIELDS,
];

function validatePreferences(updates) {
  if (updates === null || typeof updates !== "object" || Array.isArray(updates)) {
    const err = new Error("Request body must be an object");
    err.statusCode = 400;
    throw err;
  }

  const payload = {};

  for (const field of ALLOWED_FIELDS) {
    if (updates[field] === undefined) continue;

    switch (field) {
      case "minimum_match_score":
      case "minimum_resume_score":
        if (
          typeof updates[field] !== "number" ||
          !Number.isInteger(updates[field]) ||
          Number.isNaN(updates[field]) ||
          updates[field] < 0 ||
          updates[field] > 100
        ) {
          const err = new Error(`Invalid ${field}`);
          err.statusCode = 400;
          throw err;
        }
        break;

      case "daily_limit":
        if (
          typeof updates[field] !== "number" ||
          !Number.isInteger(updates[field]) ||
          updates[field] < 1 ||
          updates[field] > 100
        ) {
          const err = new Error("Invalid daily limit");
          err.statusCode = 400;
          throw err;
        }
        break;

      case "enabled":
      case "allow_remote":
        if (typeof updates[field] !== "boolean") {
          const err = new Error(`${field} must be a boolean`);
          err.statusCode = 400;
          throw err;
        }
        break;

      default:
        if (!ARRAY_FIELDS.includes(field)) break;

        if (!Array.isArray(updates[field])) {
          const err = new Error(`${field} must be an array`);
          err.statusCode = 400;
          throw err;
        }

        const normalized = [];
        const seen = new Set();

        for (const item of updates[field]) {
          if (typeof item !== "string") {
            const err = new Error(`${field} must contain only strings`);
            err.statusCode = 400;
            throw err;
          }

          const value = item.trim();
          if (!value) continue;

          const key = value.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            normalized.push(value);
          }
        }

        payload[field] = normalized;
        continue;
    }

    payload[field] = updates[field];
  }

  return payload;
}

module.exports = { validatePreferences };
