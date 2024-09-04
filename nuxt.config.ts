// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: false,
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss", "nuxt-vuefire"],

  vuefire: {
    auth: {
      enabled: true
    },
    config: {
      apiKey: "AIzaSyBymfNDuy2Gx3DFtFRhSKHblJxUdRg3Rp0",
      authDomain: "tasky-20d91.firebaseapp.com",
      projectId: "tasky-20d91",
      storageBucket: "tasky-20d91.appspot.com",
      messagingSenderId: "225173706766",
      appId: "1:225173706766:web:a67048983caa758221045f",
    },
  },
});
