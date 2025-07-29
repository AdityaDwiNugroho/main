export default defineEventHandler(async (event) => {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    
    const headers = {
      'User-Agent': 'Portfolio-App',
      'Accept': 'application/vnd.github.v3+json'
    }
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`
    }
    
    const rateLimitResponse = await $fetch('https://api.github.com/rate_limit', { headers })
    
    return {
      core: rateLimitResponse.rate,
      authenticated: !!GITHUB_TOKEN,
      resetTime: new Date(rateLimitResponse.rate.reset * 1000).toISOString(),
      timeUntilReset: Math.max(0, (rateLimitResponse.rate.reset * 1000) - Date.now()),
      status: rateLimitResponse.rate.remaining > 0 ? 'available' : 'rate-limited'
    }
    
  } catch (error) {
    return {
      error: error.message,
      status: 'error'
    }
  }
})
