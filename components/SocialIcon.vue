<template>
  <a 
    v-if="props.icon !== 'discord'"
    :href="socialMediaLinks[props.icon]" 
    class="text-gray-400 hover:text-white"
    target="_blank" 
    rel="noopener noreferrer"
  >
    <Icon :icon="iconName" class="w-8 h-8 transition-transform transform hover:scale-125" />
  </a>
  <button 
    v-else
    @click="copyDiscordLink" 
    class="text-gray-400 hover:text-white relative"
  >
    <Icon :icon="iconName" class="w-8 h-8 transition-transform transform hover:scale-125" />
    <span 
      v-if="showNotification" 
      class="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
    >
      Copied to clipboard!
    </span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  }
})

const showNotification = ref(false)

const socialMediaLinks = {
  github: 'https://github.com/AdityaDwiNugroho',
  twitter: 'https://x.com/ProgrammerADN',
  discord: 'uknown7550',
  spotify: 'https://open.spotify.com/user/31dggjk2y46qhas24p7khrrxffwu',
  trello: 'https://trello.com/u/allen_adityadn',
  wakatime: 'https://wakatime.com/@abc'
}

const iconName = computed(() => {
  const icons = {
    github: 'mdi:github',
    twitter: 'mdi:twitter',
    discord: 'mdi:discord',
    spotify: 'mdi:spotify',
    trello: 'mdi:trello',
    wakatime: 'mdi:clock-outline'
  }
  return icons[props.icon] || 'mdi:help-circle'
})

const copyDiscordLink = () => {
  navigator.clipboard.writeText(socialMediaLinks.discord)
    .then(() => {
      showNotification.value = true
      setTimeout(() => {
        showNotification.value = false
      }, 2000)
    })
    .catch(err => {
      console.error('Failed to copy: ', err)
    })
}
</script>