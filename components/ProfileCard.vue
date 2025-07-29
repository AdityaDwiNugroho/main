<template>
    <div class="bg-gray-800 p-12 rounded-lg border border-blue-500 relative transition-transform transform hover:scale-105 hover:shadow-xl hover:border-blue-300 hover:ring-4 hover:ring-blue-300">
      <div class="flex flex-col items-center">
        <div class="relative">
          <img src="~/assets/img/profile.jpeg" alt="Profile Picture" class="w-48 h-48 rounded-full mb-6 border-4 border-blue-500 shadow-lg">
          
          <!-- GitHub Status Indicator -->
          <div 
            :class="githubStatusClass" 
            class="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-gray-800 cursor-pointer transition-all duration-300 transform hover:scale-125 flex items-center justify-center"
            @mouseenter="showGithubTooltip = true"
            @mouseleave="showGithubTooltip = false"
          >
            <span class="text-white text-xs font-bold">G</span>
          </div>
          
          <!-- Discord Status Indicator -->
          <div 
            :class="discordStatusClass" 
            class="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-gray-800 cursor-pointer transition-all duration-300 transform hover:scale-125 flex items-center justify-center"
            @mouseenter="showDiscordTooltip = true"
            @mouseleave="showDiscordTooltip = false"
          >
            <span class="text-white text-sm font-bold">D</span>
          </div>
          
          <!-- GitHub Tooltip -->
          <div v-if="showGithubTooltip" class="absolute -bottom-20 right-0 bg-gray-700 text-white text-sm py-2 px-3 rounded shadow-lg z-10 whitespace-nowrap">
            <div class="font-semibold">{{ github.getStatusMessage() }}</div>
            <div class="text-xs text-gray-300" v-if="github.lastActivity.value">
              {{ github.getRelativeTime() }}
            </div>
            <div class="text-xs text-gray-300" v-if="github.currentRepo.value">
              Repository: {{ github.currentRepo.value }}
            </div>
          </div>
          
          <!-- Discord Tooltip -->
          <div v-if="showDiscordTooltip" class="absolute -bottom-16 right-8 bg-gray-700 text-white text-sm py-2 px-3 rounded shadow-lg z-10">
            Discord: {{ discordStatus.charAt(0).toUpperCase() + discordStatus.slice(1) }}
          </div>
        </div>
        
        <h2 class="text-4xl font-bold text-white mb-2">Allen</h2>
        <p class="text-gray-400 text-lg mb-4">Aditya.</p>
        
        <!-- Status Information -->
        <div class="text-center mb-6">
          <div class="flex items-center justify-center space-x-4 text-sm text-gray-300">
            <div class="flex items-center space-x-1">
              <div :class="githubStatusClass" class="w-3 h-3 rounded-full"></div>
              <span>GitHub {{ github.getActivityStatus() }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <div :class="discordStatusClass" class="w-3 h-3 rounded-full"></div>
              <span>Discord {{ discordStatus }}</span>
            </div>
          </div>
          <div v-if="github.currentRepo.value" class="text-xs text-blue-400 mt-2">
            Working on: {{ github.currentRepo.value }}
          </div>
        </div>
        
        <!-- Social Media Icons -->
        <div class="flex space-x-6">
          <SocialIcon v-for="icon in socialIcons" :key="icon" :icon="icon" class="w-8 h-8 transition-transform transform hover:scale-125"/>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import SocialIcon from './SocialIcon.vue'
  import { useGitHub } from '~/composables/useGitHub'
  
  const socialIcons = ['github', 'twitter', 'discord', 'spotify', 'trello']
  const discordStatus = ref('offline')
  const showGithubTooltip = ref(false)
  const showDiscordTooltip = ref(false)
  
  // Initialize GitHub composable
  const github = useGitHub('AdityaDwiNugroho')  // Replace with your GitHub username
  
  const discordStatusClass = computed(() => {
    switch (discordStatus.value) {
      case 'online':
        return 'bg-green-500'
      case 'idle':
        return 'bg-yellow-500'
      case 'dnd':
        return 'bg-red-500'
      case 'offline':
      default:
        return 'bg-gray-500'
    }
  })
  
  const githubStatusClass = computed(() => {
    const status = github.getActivityStatus()
    switch (status) {
      case 'online':
        return 'bg-green-500 shadow-green-400/50'
      case 'idle':
        return 'bg-yellow-500 shadow-yellow-400/50'
      case 'away':
        return 'bg-orange-500 shadow-orange-400/50'
      case 'offline':
      default:
        return 'bg-gray-500'
    }
  })
  
  const fetchDiscordStatus = async () => {
    try {
      const response = await fetch('https://backend-g8hgudo26-adityas-projects-271d2892.vercel.app/discord-status')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched Discord data:', data)
      if (data.status) {
        discordStatus.value = data.status
      } else {
        console.error('Invalid Discord response format:', data)
      }
    } catch (error) {
      console.error('Error fetching Discord status:', error)
    }
  }
  
  // Fetch Discord status periodically
  const startDiscordPolling = () => {
    fetchDiscordStatus()
    setInterval(fetchDiscordStatus, 30000) // Update every 30 seconds
  }
  
  onMounted(() => {
    startDiscordPolling()
  })
  </script>
  
  <style scoped>
  </style>
  