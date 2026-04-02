export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {}
    }
  },

  runtimeConfig: {
    wpBasicAuthUser: '',
    wpBasicAuthPassword: '',
    public: {
      wpBaseUrl: ''
    }
  }
})
