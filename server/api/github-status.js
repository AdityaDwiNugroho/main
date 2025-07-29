// GitHub status cache to avoid rate limits
let cachedGitHubData = null
let lastFetchTime = null
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes cache to respect rate limits

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const username = query.username || 'AdityaDwiNugroho'

  try {
    // Set headers to prevent caching for real-time data
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
    setHeader(event, 'Pragma', 'no-cache')
    setHeader(event, 'Expires', '0')

    // Check if we have cached data and it's still fresh
    const now = Date.now()
    if (cachedGitHubData && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
      console.log('Using cached GitHub data to avoid rate limits')
      return cachedGitHubData
    }

    // Only fetch real GitHub data - no simulation
    try {
      console.log(`Fetching real GitHub data for ${username}...`)
      
      // Get GitHub token from environment for higher rate limits
      const GITHUB_TOKEN = process.env.GITHUB_TOKEN
      
      const headers = {
        'User-Agent': 'Portfolio-App',
        'Accept': 'application/vnd.github.v3+json'
      }
      
      // Add authorization if token is provided (5000 requests/hour vs 60)
      if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`
        console.log('Using GitHub token for higher rate limits')
      } else {
        console.log('No GitHub token - using unauthenticated requests (60/hour limit)')
      }
      
      // Fetch user events (public activity) - most important for real-time status
      const eventsResponse = await $fetch(`https://api.github.com/users/${username}/events/public`, { headers })

      // Fetch user data for stats
      const userResponse = await $fetch(`https://api.github.com/users/${username}`, { headers })

      // Fetch recent repositories for project info
      const reposResponse = await $fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, { headers })

      let lastActivity = null
      let currentRepo = null
      let activityType = null

      // Process events to find the most recent real activity
      if (eventsResponse && eventsResponse.length > 0) {
        const latestEvent = eventsResponse[0]
        lastActivity = new Date(latestEvent.created_at)
        currentRepo = latestEvent.repo?.name?.split('/')[1] || latestEvent.repo?.name // Get repo name without username
        activityType = latestEvent.type

        console.log('Latest GitHub activity:', {
          repo: currentRepo,
          type: activityType,
          time: lastActivity
        })
      }

      // Determine status based on real activity
      let status = 'offline'
      if (lastActivity) {
        const now = new Date()
        const timeDiff = now - lastActivity
        
        if (timeDiff < 10 * 60 * 1000) { // 10 minutes
          status = 'online'
        } else if (timeDiff < 60 * 60 * 1000) { // 1 hour
          status = 'idle'
        } else if (timeDiff < 24 * 60 * 60 * 1000) { // 24 hours
          status = 'away'
        }
      }

      // Create status message based on real data
      let statusMessage = 'Offline'
      if (status === 'online' && currentRepo) {
        statusMessage = `Currently working on ${currentRepo}`
      } else if (status === 'online') {
        statusMessage = 'Currently active on GitHub'
      } else if (status === 'idle') {
        statusMessage = 'Recently active on GitHub'
      } else if (status === 'away') {
        statusMessage = 'Was active today'
      }

      // Calculate relative time for real activity
      let relativeTime = 'Never'
      if (lastActivity) {
        const now = new Date()
        const timeDiff = now - lastActivity
        const minutes = Math.floor(timeDiff / (1000 * 60))
        const hours = Math.floor(timeDiff / (1000 * 60 * 60))
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
        
        if (minutes < 1) {
          relativeTime = 'Just now'
        } else if (minutes < 60) {
          relativeTime = `${minutes}m ago`
        } else if (hours < 24) {
          relativeTime = `${hours}h ago`
        } else {
          relativeTime = `${days}d ago`
        }
      }

      const realData = {
        status,
        statusMessage,
        lastActivity: lastActivity ? lastActivity.toISOString() : null,
        currentRepo,
        activityType,
        relativeTime,
        publicRepos: userResponse.public_repos,
        followers: userResponse.followers,
        following: userResponse.following,
        recentRepos: reposResponse.slice(0, 3).map(repo => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          updated: repo.updated_at
        })),
        source: 'github-api-real',
        timestamp: new Date().toISOString()
      }

      // Cache the real data
      cachedGitHubData = realData
      lastFetchTime = now

      console.log('Real GitHub data fetched successfully:', {
        status: realData.status,
        repo: realData.currentRepo,
        message: realData.statusMessage
      })

      return realData

    } catch (apiError) {
      console.error('GitHub API Error - Real data unavailable:', apiError.message)
      
      // Return error state instead of dummy data
      return {
        status: 'offline',
        statusMessage: 'GitHub API unavailable',
        lastActivity: null,
        currentRepo: null,
        activityType: null,
        relativeTime: 'Unknown',
        publicRepos: 0,
        followers: 0,
        following: 0,
        recentRepos: [],
        source: 'api-error',
        error: `GitHub API Error: ${apiError.message}`
      }
    }

  } catch (error) {
    console.error('GitHub Status Error:', error)
    
    return {
      status: 'offline',
      statusMessage: 'Unable to fetch GitHub status',
      lastActivity: null,
      currentRepo: null,
      activityType: null,
      relativeTime: 'Unknown',
      publicRepos: 0,
      followers: 0,
      following: 0,
      recentRepos: [],
      source: 'system-error',
      error: error.message
    }
  }
})
