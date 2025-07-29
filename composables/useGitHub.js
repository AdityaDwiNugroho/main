import { ref, onMounted, onUnmounted } from 'vue'

export const useGitHub = (username = 'AdityaDwiNugroho') => {
  const status = ref('offline')
  const statusMessage = ref('Offline')
  const lastActivity = ref(null)
  const currentRepo = ref(null)
  const activityType = ref(null)
  const relativeTime = ref('Never')
  const publicRepos = ref(0)
  const followers = ref(0)
  const following = ref(0)
  const recentRepos = ref([])
  const isLoading = ref(true)
  const error = ref(null)
  
  let intervalId = null

  const fetchGitHubActivity = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const data = await $fetch(`/api/github-status?username=${username}`)
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Update all reactive values
      status.value = data.status
      statusMessage.value = data.statusMessage
      lastActivity.value = data.lastActivity ? new Date(data.lastActivity) : null
      currentRepo.value = data.currentRepo
      activityType.value = data.activityType
      relativeTime.value = data.relativeTime
      publicRepos.value = data.publicRepos || 0
      followers.value = data.followers || 0
      following.value = data.following || 0
      recentRepos.value = data.recentRepos || []
      
    } catch (err) {
      error.value = err.message
      status.value = 'offline'
      statusMessage.value = 'Unable to fetch GitHub status'
      console.error('Error fetching GitHub activity:', err)
    } finally {
      isLoading.value = false
    }
  }

  const getActivityStatus = () => {
    return status.value
  }

  const getStatusMessage = () => {
    return statusMessage.value
  }

  const getRelativeTime = () => {
    return relativeTime.value
  }

  const isOnline = () => {
    return status.value === 'online'
  }

  const isActive = () => {
    return ['online', 'idle', 'away'].includes(status.value)
  }

  const startPolling = (intervalMs = 30000) => {  // Poll every 30 seconds
    fetchGitHubActivity()
    intervalId = setInterval(fetchGitHubActivity, intervalMs)
  }

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onMounted(() => {
    startPolling()
  })

  onUnmounted(() => {
    stopPolling()
  })

  return {
    // Status
    status,
    statusMessage,
    lastActivity,
    currentRepo,
    activityType,
    relativeTime,
    
    // User info
    publicRepos,
    followers,
    following,
    recentRepos,
    
    // State
    isLoading,
    error,
    
    // Methods
    getActivityStatus,
    getStatusMessage,
    getRelativeTime,
    isOnline,
    isActive,
    fetchGitHubActivity,
    startPolling,
    stopPolling
  }
}
