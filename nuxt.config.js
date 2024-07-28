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
})