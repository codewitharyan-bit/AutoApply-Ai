const NORMALIZATION_MAP = new Map([
  ['javascript', 'javascript'],
  ['js', 'javascript'],
  ['typescript', 'typescript'],
  ['ts', 'typescript'],
  ['nodejs', 'nodejs'],
  ['node.js', 'nodejs'],
  ['node js', 'nodejs'],
  ['node', 'nodejs'],
  ['expressjs', 'express'],
  ['express.js', 'express'],
  ['express', 'express'],
  ['reactjs', 'react'],
  ['react.js', 'react'],
  ['react', 'react'],
  ['react native', 'reactnative'],
  ['reactnative', 'reactnative'],
  ['nextjs', 'nextjs'],
  ['next.js', 'nextjs'],
  ['next', 'nextjs'],
  ['vuejs', 'vuejs'],
  ['vue.js', 'vuejs'],
  ['vue', 'vuejs'],
  ['nuxtjs', 'nuxtjs'],
  ['nuxt.js', 'nuxtjs'],
  ['angular', 'angular'],
  ['angularjs', 'angular'],
  ['svelte', 'svelte'],
  ['jquery', 'jquery'],
  ['d3.js', 'd3js'],
  ['d3js', 'd3js'],
  ['chart.js', 'chartjs'],
  ['chartjs', 'chartjs'],
  ['three.js', 'threejs'],
  ['threejs', 'threejs'],
  ['rest api', 'restapi'],
  ['rest apis', 'restapi'],
  ['restapi', 'restapi'],
  ['restful api', 'restapi'],
  ['restful apis', 'restapi'],
  ['graphql', 'graphql'],
  ['apollo', 'apollo'],
  ['redux', 'redux'],
  ['redux toolkit', 'reduxtoolkit'],
  ['reduxtoolkit', 'reduxtoolkit'],
  ['zustand', 'zustand'],
  ['tailwind', 'tailwindcss'],
  ['tailwindcss', 'tailwindcss'],
  ['tail wind', 'tailwindcss'],
  ['bootstrap', 'bootstrap'],
  ['sass', 'sass'],
  ['scss', 'scss'],
  ['less', 'less'],
  ['styled components', 'styledcomponents'],
  ['styledcomponents', 'styledcomponents'],
  ['emotion', 'emotion'],
  ['material ui', 'materialui'],
  ['materialui', 'materialui'],
  ['mui', 'materialui'],
  ['shadcn', 'shadcn'],
  ['shadcn/ui', 'shadcn'],
  ['ant design', 'antdesign'],
  ['antdesign', 'antdesign'],
  ['chakra ui', 'chakraui'],
  ['chakraui', 'chakraui'],
  ['html', 'html'],
  ['html5', 'html'],
  ['css', 'css'],
  ['css3', 'css'],
  ['mongodb', 'mongodb'],
  ['mongo', 'mongodb'],
  ['mongo database', 'mongodb'],
  ['postgresql', 'postgresql'],
  ['postgres', 'postgresql'],
  ['psql', 'postgresql'],
  ['mysql', 'mysql'],
  ['sqlite', 'sqlite'],
  ['mariadb', 'mariadb'],
  ['redis', 'redis'],
  ['elasticsearch', 'elasticsearch'],
  ['elastic', 'elasticsearch'],
  ['firebase', 'firebase'],
  ['supabase', 'supabase'],
  ['dynamodb', 'dynamodb'],
  ['cassandra', 'cassandra'],
  ['neo4j', 'neo4j'],
  ['cockroachdb', 'cockroachdb'],
  ['prisma', 'prisma'],
  ['typeorm', 'typeorm'],
  ['sequelize', 'sequelize'],
  ['drizzle', 'drizzle'],
  ['mongoose', 'mongoose'],
  ['knex', 'knex'],
  ['docker', 'docker'],
  ['kubernetes', 'kubernetes'],
  ['k8s', 'kubernetes'],
  ['aws', 'aws'],
  ['amazon web services', 'aws'],
  ['gcp', 'gcp'],
  ['google cloud', 'gcp'],
  ['google cloud platform', 'gcp'],
  ['azure', 'azure'],
  ['microsoft azure', 'azure'],
  ['cloudflare', 'cloudflare'],
  ['terraform', 'terraform'],
  ['ansible', 'ansible'],
  ['pulumi', 'pulumi'],
  ['jenkins', 'jenkins'],
  ['github actions', 'githubactions'],
  ['githubactions', 'githubactions'],
  ['gitlab ci', 'gitlabci'],
  ['gitlabci', 'gitlabci'],
  ['circleci', 'circleci'],
  ['ci/cd', 'cicd'],
  ['cicd', 'cicd'],
  ['nginx', 'nginx'],
  ['apache', 'apache'],
  ['linux', 'linux'],
  ['bash', 'bash'],
  ['shell', 'shell'],
  ['python', 'python'],
  ['java', 'java'],
  ['golang', 'golang'],
  ['go', 'golang'],
  ['rust', 'rust'],
  ['c++', 'cpp'],
  ['cplusplus', 'cpp'],
  ['c#', 'csharp'],
  ['csharp', 'csharp'],
  ['dotnet', 'dotnet'],
  ['.net', 'dotnet'],
  ['asp.net', 'aspnet'],
  ['aspnet', 'aspnet'],
  ['php', 'php'],
  ['laravel', 'laravel'],
  ['symfony', 'symfony'],
  ['ruby', 'ruby'],
  ['rails', 'rubyonrails'],
  ['ruby on rails', 'rubyonrails'],
  ['rubyonrails', 'rubyonrails'],
  ['swift', 'swift'],
  ['kotlin', 'kotlin'],
  ['dart', 'dart'],
  ['flutter', 'flutter'],
  ['scala', 'scala'],
  ['elixir', 'elixir'],
  ['deno', 'deno'],
  ['bun', 'bun'],
  ['webpack', 'webpack'],
  ['vite', 'vite'],
  ['esbuild', 'esbuild'],
  ['rollup', 'rollup'],
  ['parcel', 'parcel'],
  ['babel', 'babel'],
  ['jest', 'jest'],
  ['mocha', 'mocha'],
  ['chai', 'chai'],
  ['cypress', 'cypress'],
  ['playwright', 'playwright'],
  ['puppeteer', 'puppeteer'],
  ['selenium', 'selenium'],
  ['vitest', 'vitest'],
  ['testing library', 'testinglibrary'],
  ['testinglibrary', 'testinglibrary'],
  ['react testing library', 'reacttestinglibrary'],
  ['reacttestinglibrary', 'reacttestinglibrary'],
  ['enzyme', 'enzyme'],
  ['git', 'git'],
  ['github', 'github'],
  ['gitlab', 'gitlab'],
  ['bitbucket', 'bitbucket'],
  ['svn', 'svn'],
  ['postman', 'postman'],
  ['insomnia', 'insomnia'],
  ['swagger', 'swagger'],
  ['openapi', 'openapi'],
  ['figma', 'figma'],
  ['sketch', 'sketch'],
  ['adobe xd', 'adobexd'],
  ['adobexd', 'adobexd'],
  ['photoshop', 'photoshop'],
  ['illustrator', 'illustrator'],
  ['openai', 'openai'],
  ['chatgpt', 'chatgpt'],
  ['gpt', 'chatgpt'],
  ['langchain', 'langchain'],
  ['llamaindex', 'llamaindex'],
  ['hugging face', 'huggingface'],
  ['huggingface', 'huggingface'],
  ['tensorflow', 'tensorflow'],
  ['pytorch', 'pytorch'],
  ['keras', 'keras'],
  ['scikit-learn', 'scikitlearn'],
  ['scikitlearn', 'scikitlearn'],
  ['sklearn', 'scikitlearn'],
  ['pandas', 'pandas'],
  ['numpy', 'numpy'],
  ['matplotlib', 'matplotlib'],
  ['seaborn', 'seaborn'],
  ['opencv', 'opencv'],
  ['nltk', 'nltk'],
  ['spacy', 'spacy'],
  ['ffmpeg', 'ffmpeg'],
  ['rabbitmq', 'rabbitmq'],
  ['kafka', 'kafka'],
  ['apache kafka', 'kafka'],
  ['nats', 'nats'],
  ['zeromq', 'zeromq'],
  ['grpc', 'grpc'],
  ['websocket', 'websocket'],
  ['socket.io', 'socketio'],
  ['socketio', 'socketio'],
  ['oauth', 'oauth'],
  ['jwt', 'jwt'],
  ['json web token', 'jwt'],
  ['saml', 'saml'],
  ['ldap', 'ldap'],
  ['es6', 'javascript'],
  ['es2015', 'javascript'],
  ['es2016', 'javascript'],
  ['es2017', 'javascript'],
  ['es2018', 'javascript'],
  ['es2019', 'javascript'],
  ['es2020', 'javascript'],
  ['es2021', 'javascript'],
  ['es2022', 'javascript'],
  ['es2023', 'javascript'],
  ['es2024', 'javascript'],
  ['ecmascript', 'javascript'],
  ['ecma script', 'javascript'],
]);

const SOFT_SKILLS = new Set([
  'communication', 'teamwork', 'leadership', 'problemsolving', 'problem solving',
  'analytical thinking', 'critical thinking', 'creativity', 'timemanagement',
  'time management', 'adaptability', 'collaboration', 'interpersonal',
  'conflict resolution', 'decision making', 'decisionmaking', 'negotiation',
  'presentation', 'public speaking', 'mentoring', 'coaching', 'empathy',
  'emotional intelligence', 'work ethic', 'selfmotivation', 'self motivation',
  'attention to detail', 'detail oriented', 'organizational', 'multitasking',
  'multitask', 'flexibility', 'resilience', 'patience', 'dependability',
  'integrity', 'professionalism', 'positive attitude', 'quick learner',
  'fast learner', 'eager to learn', 'willingness to learn', 'team player',
  'people skills', 'social skills', 'verbal communication', 'written communication',
  'active listening', 'stress management', 'accountability', 'initiative',
  'dedication', 'reliability', 'punctuality', 'enthusiasm', 'motivated',
  'selfstarter', 'self starter', 'results driven', 'resultsdriven',
  'customer service', 'client facing', 'stakeholder management',
  'relationship building', 'networking', 'persuasion', 'influencing',
]);

const stripVersion = (s) => {
  return s.replace(/\d+(\.\d+)*$/, '').replace(/[\s_-]+$/, '');
};

const stripParens = (s) => {
  return s.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
};

const tryLookup = (s) => {
  const exact = NORMALIZATION_MAP.get(s);
  if (exact) return exact;
  const noSpace = s.replace(/[\s_-]+/g, '');
  if (NORMALIZATION_MAP.has(noSpace)) return NORMALIZATION_MAP.get(noSpace);
  const normalized = noSpace.replace(/[^a-z0-9]/g, '');
  if (NORMALIZATION_MAP.has(normalized)) return NORMALIZATION_MAP.get(normalized);
  const stripped = stripVersion(s);
  if (stripped !== s && NORMALIZATION_MAP.has(stripped)) return NORMALIZATION_MAP.get(stripped);
  const words = s.split(/[\s_-]+/);
  if (words.length > 1) {
    const resolved = words.map(w => {
      const clean = w.replace(/[^a-z0-9]/g, '');
      return NORMALIZATION_MAP.get(clean) || NORMALIZATION_MAP.get(w) || null;
    });
    if (resolved.every(r => r !== null && r === resolved[0])) {
      return resolved[0];
    }
  }
  return null;
};

const normalize = (skill) => {
  if (!skill || typeof skill !== 'string') return '';
  const trimmed = skill.trim().toLowerCase();
  return tryLookup(trimmed) || tryLookup(stripParens(trimmed)) || trimmed;
};

const isSoftSkill = (skill) => {
  if (!skill || typeof skill !== 'string') return false;
  const key = skill.trim().toLowerCase().replace(/[\s_-]+/g, '').replace(/[^a-z0-9]/g, '');
  const exact = skill.trim().toLowerCase();
  return SOFT_SKILLS.has(exact) || SOFT_SKILLS.has(key);
};

const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];
  const seen = new Set();
  const result = [];
  for (const skill of skills) {
    const key = normalize(skill);
    if (key && !seen.has(key)) {
      seen.add(key);
      result.push(key);
    }
  }
  return result;
};

const displayName = (normalized) => {
  const display = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'nodejs': 'Node.js',
    'express': 'Express.js',
    'react': 'React',
    'reactnative': 'React Native',
    'nextjs': 'Next.js',
    'vuejs': 'Vue.js',
    'nuxtjs': 'Nuxt.js',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'sqlite': 'SQLite',
    'redis': 'Redis',
    'elasticsearch': 'Elasticsearch',
    'dynamodb': 'DynamoDB',
    'cassandra': 'Cassandra',
    'graphql': 'GraphQL',
    'prisma': 'Prisma',
    'typeorm': 'TypeORM',
    'sequelize': 'Sequelize',
    'mongoose': 'Mongoose',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'terraform': 'Terraform',
    'ansible': 'Ansible',
    'jenkins': 'Jenkins',
    'githubactions': 'GitHub Actions',
    'gitlabci': 'GitLab CI',
    'circleci': 'CircleCI',
    'cicd': 'CI/CD',
    'tailwindcss': 'Tailwind CSS',
    'materialui': 'Material UI',
    'html': 'HTML',
    'css': 'CSS',
    'chakraui': 'Chakra UI',
    'antdesign': 'Ant Design',
    'styledcomponents': 'Styled Components',
    'restapi': 'REST API',
    'socketio': 'Socket.io',
    'cpp': 'C++',
    'csharp': 'C#',
    'dotnet': '.NET',
    'aspnet': 'ASP.NET',
    'rubyonrails': 'Ruby on Rails',
    'scikitlearn': 'scikit-learn',
    'pytorch': 'PyTorch',
    'tensorflow': 'TensorFlow',
    'huggingface': 'Hugging Face',
    'pandas': 'Pandas',
    'numpy': 'NumPy',
    'matplotlib': 'Matplotlib',
    'seaborn': 'Seaborn',
    'opencv': 'OpenCV',
    'openai': 'OpenAI',
    'langchain': 'LangChain',
    'llamaindex': 'LlamaIndex',
    'playwright': 'Playwright',
    'cypress': 'Cypress',
    'puppeteer': 'Puppeteer',
    'selenium': 'Selenium',
    'vitest': 'Vitest',
    'testinglibrary': 'Testing Library',
    'reacttestinglibrary': 'React Testing Library',
    'reduxtoolkit': 'Redux Toolkit',
    'shadcn': 'shadcn/ui',
    'adobexd': 'Adobe XD',
    'ffmpeg': 'FFmpeg',
    'rabbitmq': 'RabbitMQ',
    'socketio': 'Socket.io',
    'golang': 'Go',
    'rubyonrails': 'Ruby on Rails',
    'flutter': 'Flutter',
    'dart': 'Dart',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'rust': 'Rust',
    'github': 'GitHub',
    'gitlab': 'GitLab',
    'bitbucket': 'Bitbucket',
    'firebase': 'Firebase',
    'supabase': 'Supabase',
    'cloudflare': 'Cloudflare',
  };
  return display[normalized] || normalized.toUpperCase();
};

// ─── Role normalizer ──────────────────────────────────────────────────────────

const ROLE_ALIASES = new Map([
  ['frontend developer', ['frontend developer', 'front end developer', 'front-end developer', 'react developer', 'reactjs developer', 'ui developer', 'ui engineer', 'frontend engineer', 'front end engineer', 'software engineer frontend', 'software engineer - frontend', 'frontend ui developer', 'frontend web developer']],
  ['backend developer', ['backend developer', 'back end developer', 'back-end developer', 'nodejs developer', 'node.js developer', 'backend engineer', 'back end engineer', 'software engineer backend', 'software engineer - backend', 'backend web developer', 'server side developer', 'api developer']],
  ['full stack developer', ['full stack developer', 'fullstack developer', 'full-stack developer', 'full stack engineer', 'fullstack engineer', 'mern stack developer', 'mean stack developer', 'web developer', 'software engineer full stack', 'software engineer - full stack']],
  ['data scientist', ['data scientist', 'data science engineer', 'machine learning engineer', 'ml engineer', 'data analyst', 'ai engineer', 'deep learning engineer', 'data science']],
  ['devops engineer', ['devops engineer', 'devops', 'site reliability engineer', 'sre', 'platform engineer', 'infrastructure engineer', 'cloud engineer']],
  ['mobile developer', ['mobile developer', 'react native developer', 'android developer', 'ios developer', 'flutter developer', 'mobile app developer']],
  ['product manager', ['product manager', 'product owner', 'technical product manager', 'apm', 'associate product manager']],
  ['designer', ['designer', 'ui designer', 'ux designer', 'ui/ux designer', 'product designer', 'visual designer', 'graphic designer']],
  ['qa engineer', ['qa engineer', 'quality assurance engineer', 'test engineer', 'automation engineer', 'sdet', 'software test engineer']],
]);

const ROLE_CACHE = new Map();
let ROLE_REVERSE_MAP = null;

const buildReverseMap = () => {
  if (ROLE_REVERSE_MAP) return;
  ROLE_REVERSE_MAP = new Map();
  for (const [canonical, aliases] of ROLE_ALIASES) {
    for (const alias of aliases) {
      ROLE_REVERSE_MAP.set(alias, canonical);
    }
  }
};

const normalizeRole = (title) => {
  if (!title || typeof title !== 'string') return null;
  const cached = ROLE_CACHE.get(title);
  if (cached !== undefined) return cached;

  buildReverseMap();

  const lower = title.trim().toLowerCase().replace(/\s+/g, ' ');
  if (ROLE_REVERSE_MAP.has(lower)) {
    ROLE_CACHE.set(title, ROLE_REVERSE_MAP.get(lower));
    return ROLE_REVERSE_MAP.get(lower);
  }

  for (const [canonical, aliases] of ROLE_ALIASES) {
    for (const alias of aliases) {
      const aliasWords = alias.split(' ');
      const matchCount = aliasWords.filter(w => lower.includes(w)).length;
      if (matchCount >= Math.min(2, aliasWords.length)) {
        ROLE_CACHE.set(title, canonical);
        return canonical;
      }
    }
  }

  const display = title.trim();
  ROLE_CACHE.set(title, display);
  return display;
};

const getRoleDisplayName = (normalized) => {
  if (!normalized) return 'Unknown Role';
  return normalized
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

module.exports = {
  normalize,
  normalizeSkills,
  isSoftSkill,
  displayName,
  NORMALIZATION_MAP,
  SOFT_SKILLS,
  normalizeRole,
  getRoleDisplayName,
};
