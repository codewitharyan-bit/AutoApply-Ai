require('dotenv/config')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { clerkMiddleware, getAuth } = require('@clerk/express')
const withSupabase = require('./middleware/withSupabase')
const webhookRoutes = require('./routes/webhook.route')
const profileRoutes = require('./routes/profile.route')
const jobRoutes = require('./routes/job.route')
const dashboardRoutes = require("./routes/dashboard.route");
const applicationRoutes = require("./routes/application.route");
const resumeRoutes = require("./routes/resume.route");
const recommendationRoutes = require("./routes/recommendation.route");
const careerAnalysisRoutes = require("./routes/careerAnalysis.route");
const autoApplyRoutes = require('./routes/autoApply.route');



const app = express()
app.use(clerkMiddleware())

app.use(morgan('dev'))
// webhook routes, we need to use express.raw() to get the raw body for signature verification
app.use(
  '/api/webhooks',
  express.raw({type: 'application/json'}),
  webhookRoutes
)

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// profile and job routes and dashboard routes 
app.use('/api/profile', profileRoutes)
app.use('/api/jobs', jobRoutes)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);
app.use( "/api/recommendations",recommendationRoutes);
app.use("/api/career-analysis", careerAnalysisRoutes);
app.use('/api/auto-apply', autoApplyRoutes);

app.get(
  '/api/health',
  withSupabase({ auth: 'none' }),
  (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  },
)

app.get("/api/debug-auth", (req, res) => {
  const authHeader = req.headers.authorization || "";
  res.json({
    auth: getAuth(req),
    authorization: authHeader,
  });
});

app.get(
  '/api/db-health',
  withSupabase({ auth: 'none' }),
  async (_req, res) => {
    try {
      const { createClient } = require('@supabase/supabase-js')
      const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
      const { count, error } = await admin
        .from('users')
        .select('id', { count: 'exact', head: true })
      if (error) return res.status(503).json({ connected: false, error: error.message })
      res.json({ connected: true, table: 'users', count: count ?? 0, timestamp: new Date().toISOString() })
    } catch (err) {
      res.status(503).json({ connected: false, error: err.message })
    }
  },
)


const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app
