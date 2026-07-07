const { createSupabaseContext } = require('@supabase/server')

function buildWebRequest(req) {
  const url = new URL(
    `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  )

  let body
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = JSON.stringify(req.body)
  }

  return new Request(url, {
    method: req.method,
    headers: req.headers,
    body,
  })
}

function withSupabase(options = {}) {
  return async (req, res, next) => {
    try {
      const webRequest = buildWebRequest(req)
      const { data: ctx, error } = await createSupabaseContext(
        webRequest,
        options,
      )

      if (error) {
        return res.status(error.status).json({
          message: error.message,
          code: error.code,
        })
      }

      req.supabase = ctx.supabase
      req.supabaseAdmin = ctx.supabaseAdmin
      req.userClaims = ctx.userClaims
      req.jwtClaims = ctx.jwtClaims
      req.authMode = ctx.authMode

      next()
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

module.exports = withSupabase
