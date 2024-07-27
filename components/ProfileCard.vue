<template>
    <div class="bg-gray-800 p-12 rounded-lg border border-blue-500 relative transition-transform transform hover:scale-105 hover:shadow-xl hover:border-blue-300 hover:ring-4 hover:ring-blue-300">
      <div class="flex flex-col items-center">
        <div class="relative">
          <img src="~/assets/img/profile.jpeg" alt="Profile Picture" class="w-48 h-48 rounded-full mb-6 border-4 border-blue-500 shadow-lg">
          
          <div 
            :class="statusClass" 
            class="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-gray-800 cursor-pointer transition-transform transform hover:scale-125"
            @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false"
          ></div>
          
          <div v-if="showTooltip" class="absolute -bottom-10 right-0 bg-gray-700 text-white text-sm py-2 px-3 rounded shadow-lg">
            {{ status.charAt(0).toUpperCase() + status.slice(1) }}
          </div>
        </div>
        
        <h2 class="text-4xl font-bold text-white mb-2">Allen</h2>
        <p class="text-gray-400 text-lg mb-6">Aditya.</p>
        
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
  
  const socialIcons = ['github', 'twitter', 'discord', 'spotify', 'trello']
  const status = ref('offline')
  const showTooltip = ref(false)
  
  const statusClass = computed(() => {
    switch (status.value) {
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
  
  const fetchDiscordStatus = async () => {
    try {
      const response = await fetch('https://backend-g8hgudo26-adityas-projects-271d2892.vercel.app/discord-status')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched data:', data) // Debugging log
      if (data.status) {
        status.value = data.status
      } else {
        console.error('Invalid response format:', data)
      }
    } catch (error) {
      console.error('Error fetching Discord status:', error)
    }
  }
  
  onMounted(fetchDiscordStatus)
  </script>
  
  <style scoped>
  </style>
  