export default defineNuxtConfig({
  head: {
    title: 'main-portfolio',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '~/assets/css/main.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  plugins: [
    '~/plugins/vue-toastification.client.js',
    '~/plugins/iconify.client.js'
  ],

  components: true,

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  build: {
    transpile: ['@fortawesome/vue-fontawesome', 'vue-toastification']
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2024-07-28',
  
  // Nitro configuration for better build stability
  nitro: {
    experimental: {
      wasm: true
    },
    // Skip API routes during static generation
    prerender: {
      crawlLinks: false,
      ignore: ['/api/']
    }
  },
  
  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    githubToken: process.env.GITHUB_TOKEN || '',
    discordBotToken: process.env.DISCORD_BOT_TOKEN || '',
    discordUserId: process.env.DISCORD_USER_ID || '',
    
    // Public keys (exposed to client-side)
    public: {
      githubUsername: process.env.GITHUB_USERNAME || 'AdityaDwiNugroho'
    }
  }
})