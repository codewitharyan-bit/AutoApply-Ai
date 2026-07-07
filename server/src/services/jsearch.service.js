const axios = require('axios');

const searchJobs = async ({ query = 'software engineer', page = 1, num_pages = 1 }) => {
  try {
    const response = await axios.get('https://jsearch.p.rapidapi.com/search-v2', {
      params: { query, page, num_pages },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
      timeout: 15000,
    });

    const body = response.data;
    const jobs = body?.data?.jobs;

    if (!Array.isArray(jobs)) {
      console.warn('JSearch returned unexpected format for query:', query);
      return [];
    }

    return jobs;
  } catch (err) {
    console.error('JSearch API error:', err.message);
    return [];
  }
};

module.exports = {
  searchJobs,
};
