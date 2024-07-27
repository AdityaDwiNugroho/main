<template>
    <a :href="socialMediaLinks[props.icon]" class="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
      <span v-if="props.icon === 'wakatime'" class="w-8 h-8 transition-transform transform hover:scale-125" v-html="wakatimeIcon"/>
      <Icon v-else :icon="iconName" class="w-8 h-8 transition-transform transform hover:scale-125" />
    </a>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { Icon } from '@iconify/vue'
  
  const props = defineProps({
    icon: String
  })
  
  const iconName = computed(() => {
    const icons = {
      github: 'mdi:github',
      twitter: 'mdi:twitter',
      discord: 'mdi:discord',
      spotify: 'mdi:spotify',
      trello: 'mdi:trello'
    }
    return icons[props.icon] || 'mdi:help-circle' // Fallback icon
  })
  
  const socialMediaLinks = computed(() => {
    return {
      github: 'https://github.com/AdityaDwiNugroho', 
      twitter: 'https://x.com/ProgrammerADN', 
      discord: 'https://discord.com/invite/yourinvitecode', 
      spotify: 'https://open.spotify.com/user/31dggjk2y46qhas24p7khrrxffwu', 
      trello: 'https://trello.com/u/allen_adityadn',
      wakatime: 'https://wakatime.com/@abc' 
    }
  })
  
  const wakatimeIcon = computed(() => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8"><path d="M12 2a10 10 0 0110 10v6a10 10 0 01-10 10A10 10 0 012 18v-6a10 10 0 0110-10zm0 2a8 8 0 00-8 8v6a8 8 0 008 8 8 8 0 008-8v-6a8 8 0 00-8-8zm-1 4h2v6h-2v-6zm0 8h2v2h-2v-2z"/></svg>
  `)
  </script>
  