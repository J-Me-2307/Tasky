<template>
  <div @click="closeQuickSettingsIfClickedOutside">
    <AddTask v-model:showDialog="addTaskDialog" />
    <aside class="bg-crust fixed top-0 left-0 z-40 w-56 h-screen sm:translate-x-0">
      <div class="h-full px-3 py-4 overflow-hidden relative">

        <button @click.stop="quickSettingsIsOpen = !quickSettingsIsOpen"
          class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full mb-2">
          <Icon v-if="!user.photoURL" name="mdi:user-circle" size="30" />
          <div v-if="user.photoURL" class="w-10 h-10 rounded-full overflow-hidden">
            <img class="h-full w-full object-cover" :src="user.photoURL" alt="Profile picture"/>
          </div>
          <span class="ms-3 text-lg">{{ user.displayName }}</span>
        </button>

        <div v-if="quickSettingsIsOpen"
          class="absolute top-14 right-4 bg-surface0 rounded-xl p-3 text-center shadow-md w-48 z-50"
          ref="quickSettings">
          <p class="text-lg block border-b border-text mb-2 pb-2 cursor-default">Quick settings</p>

          <button class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full" @click="navigate('profile')">
            <Icon name="mdi:user-circle" size="25" />
            <span class="ms-3">Profile</span>
          </button>

          <button :class="{'bg-surface1': isActive('/signout')}" @click="handleSignOut" class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full">
            <Icon name="mdi:logout" size="25" />
            <span class="ms-3">Sign out</span>
          </button>
        </div>

        <button @click="addTask" class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full my-2">
          <Icon name="mdi:add-circle" size="30" />
          <span class="pl-3">Add task</span>
        </button>

        <button :class="{'bg-surface1': isActive('/')}" @click="navigate('/')" class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full my-2">
          <Icon name="mdi:calendar-blank" size="30" />
          <span class="pl-3">Today</span>
        </button>

        <button :class="{'bg-surface1': isActive('/upcoming')}" @click="navigate('/upcoming')" class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full my-2">
          <Icon name="mdi:calendar-month" size="30" />
          <span class="pl-3">Upcoming</span>
        </button>
      </div>
    </aside>
    <div class="ml-56 flex">
      <slot />
    </div>
  </div>
</template>


<script setup>
import { getAuth, signOut } from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const user = useCurrentUser();
const addTaskDialog = ref(false);
const quickSettingsIsOpen = ref(false);
const quickSettings = ref(null);
const route = useRoute(); // Get the current route
const router = useRouter();

const closeQuickSettingsIfClickedOutside = (event) => {
  if (quickSettingsIsOpen.value && quickSettings.value && !quickSettings.value.contains(event.target)) {
    quickSettingsIsOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeQuickSettingsIfClickedOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeQuickSettingsIfClickedOutside);
});

const auth = getAuth();

const handleSignOut = () => {
  signOut(auth);
}

const navigate = (to) => {
  router.push(to);
  quickSettingsIsOpen.value = false;
}

const addTask = () => {
  addTaskDialog.value = true;
}

// Method to check if the current route is active
const isActive = (path) => {
  return route.path === path;
}
</script>
