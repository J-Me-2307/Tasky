export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser();

    if (user && (to.name === 'signUp' || to.name === 'signIn')) {
        return navigateTo('/');
    }
    
    if (!user && (to.name === 'signUp' || to.name === 'signIn')) {
        // Allow navigation to signUp and signIn pages
    } else if (!user) {
        // Redirect to signIn page if the user is not authenticated
        return navigateTo('/signIn');
    }
})
