export default defineNuxtPlugin((nuxtApp) => {
    const savedTheme = localStorage.getItem('theme')

    const theme = savedTheme || 'Latte'

    document.documentElement.setAttribute('data-theme', theme)

    nuxtApp.provide('setTheme', (newTheme) => {
        localStorage.setItem('theme', newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
    })
})