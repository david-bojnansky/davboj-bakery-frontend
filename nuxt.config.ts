export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  nitro: {
    preset: 'node-server'
  },
  runtimeConfig: {
    cosmos: {
      endpoint: '',
      key: '',
      database: 'davboj-bakery',
      container: 'orders'
    }
  },
  app: {
    head: {
      title: 'DavBoj Bakery',
      meta: [
        { name: 'description', content: 'Order fresh bread and rolls for pickup from DavBoj Bakery.' }
      ]
    }
  }
})
