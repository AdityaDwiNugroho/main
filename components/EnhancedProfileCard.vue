<template>
  <div class="bg-gray-800 p-12 rounded-lg border border-blue-500 relative transition-transform transform hover:scale-105 hover:shadow-xl hover:border-blue-300 hover:ring-4 hover:ring-blue-300">
    <div class="flex flex-col items-center">
      <div class="relative">
        <img src="~/assets/img/profile.jpeg" alt="Profile Picture" class="w-48 h-48 rounded-full mb-6 border-4 border-blue-500 shadow-lg">
        
        <!-- GitHub Status Indicator -->
        <div 
          :class="githubStatusClass" 
          class="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-gray-800 cursor-pointer transition-all duration-300 transform hover:scale-125 flex items-center justify-center shadow-lg"
          @mouseenter="showGithubTooltip = true"
          @mouseleave="showGithubTooltip = false"
        >
          <span class="text-white text-xs font-bold">G</span>
        </div>
        
        <!-- Discord Status Indicator -->
        <div 
          :class="discordStatusClass" 
          class="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-gray-800 cursor-pointer transition-all duration-300 transform hover:scale-125 flex items-center justify-center shadow-lg"
          @mouseenter="showDiscordTooltip = true"
          @mouseleave="showDiscordTooltip = false"
        >
          <span class="text-white text-sm font-bold">D</span>
        </div>
        
        <!-- GitHub Tooltip -->
        <div v-if="showGithubTooltip && !github.isLoading.value" class="absolute -bottom-28 right-0 bg-gray-700 text-white text-sm py-3 px-4 rounded shadow-lg z-10 whitespace-nowrap">
          <div class="font-semibold">{{ github.getStatusMessage() }}</div>
          <div class="text-xs text-gray-300 mt-1">
            Last activity: {{ github.getRelativeTime() }}
          </div>
          <div class="text-xs text-blue-400 mt-1" v-if="github.currentRepo.value">
            Repository: {{ github.currentRepo.value }}
          </div>
          <div class="text-xs text-green-400 mt-1" v-if="!github.error.value">
            ✓ Real-time data
          </div>
          <div class="text-xs text-yellow-400 mt-1" v-else-if="github.error.value.includes('cached')">
            ⚠ Cached data (rate limited)
          </div>
          <div class="text-xs text-red-400 mt-1" v-else>
            ✗ API unavailable
          </div>
        </div>
        
        <!-- Discord Tooltip -->
        <div v-if="showDiscordTooltip" class="absolute -bottom-16 right-8 bg-gray-700 text-white text-sm py-2 px-3 rounded shadow-lg z-10">
          Discord: {{ discord.getStatusMessage() }}
        </div>
      </div>
      
      <h2 class="text-4xl font-bold text-white mb-2">Allen</h2>
      <p class="text-gray-400 text-lg mb-4">Aditya.</p>
      
      <!-- Status Information -->
      <div class="text-center mb-4">
        <div class="flex items-center justify-center space-x-6 text-sm text-gray-300">
          <div class="flex items-center space-x-2">
            <div :class="githubStatusClass" class="w-3 h-3 rounded-full shadow-sm"></div>
            <span class="font-medium">GitHub: {{ github.getActivityStatus() }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div :class="discordStatusClass" class="w-3 h-3 rounded-full shadow-sm"></div>
            <span class="font-medium">Discord: {{ discord.status.value }}</span>
          </div>
        </div>
        
        <!-- Current Activity -->
        <div v-if="github.currentRepo.value && github.isActive()" class="text-xs text-blue-400 mt-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
          <span class="font-medium">Working on:</span> {{ github.currentRepo.value }}
        </div>
        
        <!-- API Status Indicator -->
        <div v-if="github.error.value" class="text-xs text-red-400 mt-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
          {{ github.error.value.includes('rate limit') ? 'Rate limited - showing cached data' : 'API unavailable' }}
        </div>
        
        <!-- GitHub Stats -->
        <div v-if="!github.isLoading.value" class="flex items-center justify-center space-x-4 text-xs text-gray-400 mt-3">
          <div class="flex items-center space-x-1">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>{{ github.publicRepos.value }} repos</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{{ github.followers.value }} followers</span>
          </div>
        </div>
      </div>
      
      <!-- Real-time Activity Feed -->
      <div v-if="github.recentRepos.value.length > 0 && !github.isLoading.value" class="mb-6 w-full max-w-sm">
        <h3 class="text-sm font-semibold text-gray-300 mb-2 text-center">Recent Projects</h3>
        <div class="space-y-2">
          <div 
            v-for="repo in github.recentRepos.value.slice(0, 2)" 
            :key="repo.name"
            class="bg-gray-700/50 rounded p-2 text-xs"
          >
            <div class="flex items-center justify-between">
              <span class="text-blue-400 font-medium">{{ repo.name }}</span>
              <span v-if="repo.language" class="text-gray-400">{{ repo.language }}</span>
            </div>
            <p v-if="repo.description" class="text-gray-300 mt-1 truncate">{{ repo.description }}</p>
            <div class="flex items-center justify-between mt-1">
              <span class="text-gray-400">{{ formatDate(repo.updated) }}</span>
              <span v-if="repo.stars > 0" class="text-yellow-400">⭐ {{ repo.stars }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="github.isLoading.value" class="mb-4">
        <div class="animate-pulse flex space-x-1">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
        <p class="text-xs text-gray-400 mt-2">Loading GitHub status...</p>
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
import { useDiscord } from '~/composables/useDiscord'

const socialIcons = ['github', 'twitter', 'discord', 'spotify', 'trello']
const showGithubTooltip = ref(false)
const showDiscordTooltip = ref(false)

// Initialize GitHub and Discord composables
const github = useGitHub('AdityaDwiNugroho')  // Replace with your GitHub username
const discord = useDiscord()

const discordStatusClass = computed(() => {
  return discord.getStatusClass()
})

const githubStatusClass = computed(() => {
  const status = github.getActivityStatus()
  switch (status) {
    case 'online':
      return 'bg-green-500 shadow-green-400/50 ring-2 ring-green-400/20'
    case 'idle':
      return 'bg-yellow-500 shadow-yellow-400/50 ring-2 ring-yellow-400/20'
    case 'away':
      return 'bg-orange-500 shadow-orange-400/50 ring-2 ring-orange-400/20'
    case 'offline':
    default:
      return 'bg-gray-500'
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -6px, 0);
  }
  70% {
    transform: translate3d(0, -3px, 0);
  }
  90% {
    transform: translate3d(0, -1px, 0);
  }
}
</style>
