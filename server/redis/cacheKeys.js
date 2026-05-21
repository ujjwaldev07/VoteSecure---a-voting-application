const cacheKeys = {
  candidates: (page, limit) => `candidates:${page}:${limit}`,
  results: () => 'results:summary',
  analytics: () => 'analytics:summary',
  refreshSession: (sessionId) => `refresh:${sessionId}`,
  rateLimit: (prefix, key) => `ratelimit:${prefix}:${key}`,
}

module.exports = { cacheKeys }
