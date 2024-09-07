<template>
  <div class="text-text bg-base min-h-screen">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const user = useCurrentUser();

onMounted(() => {
  watch(user, (currentUser, prevUser) => {
    if (prevUser && !currentUser) {
      return router.push('/signIn')
    }
  })
})
</script>
