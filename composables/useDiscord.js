import { ref, onMounted, onUnmounted } from 'vue'

export const useDiscord = () => {
  const status = ref('offline')
  const lastActivity = ref(null)
  const isLoading = ref(true)
  const error = ref(null)
  
  let intervalId = null

  const fetchDiscordStatus = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await fetch('/api/discord-status')
      
      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Update reactive values
      status.value = data.status || 'offline'
      lastActivity.value = data.lastActivity ? new Date(data.lastActivity) : null
      
    } catch (err) {
      error.value = err.message
      status.value = 'offline'
      console.error('Error fetching Discord status:', err)
    } finally {
      isLoading.value = false
    }
  }

  const getStatusClass = () => {
    switch (status.value) {
      case 'online':
        return 'bg-green-500 shadow-green-400/50'
      case 'idle':
        return 'bg-yellow-500 shadow-yellow-400/50'
      case 'dnd':
        return 'bg-red-500 shadow-red-400/50'
      case 'offline':
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusMessage = () => {
    switch (status.value) {
      case 'online':
        return 'Online and active'
      case 'idle':
        return 'Away from keyboard'
      case 'dnd':
        return 'Do not disturb'
      case 'offline':
      default:
        return 'Offline'
    }
  }

  const isOnline = () => {
    return status.value === 'online'
  }

  const isActive = () => {
    return ['online', 'idle', 'dnd'].includes(status.value)
  }

  const startPolling = (intervalMs = 30000) => {  // Poll every 30 seconds
    fetchDiscordStatus()
    intervalId = setInterval(fetchDiscordStatus, intervalMs)
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
    lastActivity,
    
    // State
    isLoading,
    error,
    
    // Methods
    getStatusClass,
    getStatusMessage,
    isOnline,
    isActive,
    fetchDiscordStatus,
    startPolling,
    stopPolling
  }
}
