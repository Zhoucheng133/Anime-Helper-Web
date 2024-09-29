// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@ant-design-vue/nuxt', 
    '@pinia/nuxt'
  ],
  css: [
    'bootstrap-icons/font/bootstrap-icons.css',
    '~/style/global.css'
  ],
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "icon.svg" }
      ]
    }
  }
})