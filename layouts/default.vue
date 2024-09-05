<template>
  <div class="text-text bg-base" @click="closeQuickSettingsIfClickedOutside">
    <aside class="bg-crust fixed top-0 left-0 z-40 w-56 h-screen sm:translate-x-0">
      <div class="h-full px-3 py-4 overflow-hidden relative">

        <button @click.stop="quickSettingsIsOpen = !quickSettingsIsOpen"
          class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full mb-2">
          <Icon name="mdi:user-circle" size="30" />
          <span class="ms-3 text-lg">[Username]</span>
        </button>

        <div v-if="quickSettingsIsOpen" class="absolute top-14 right-4 bg-surface0 rounded-xl p-3 text-center shadow-md w-48 z-50" ref="quickSettings">
          <p class="text-lg block border-b border-text mb-2 pb-2 cursor-default">Quick settings</p>

          <button class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full">
            <Icon name="mdi:user-circle" size="25" />
            <span class="ms-3">Profile</span>
          </button>

          <button class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full">
            <Icon name="mdi:logout" size="25" />
            <span class="ms-3">Sign out</span>
          </button>
        </div>

        <button class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full">
          <Icon name="mdi:add-circle" size="30" />
          <span class="pl-3">Add task</span>
        </button>

        <button class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full">
          <Icon name="mdi:calendar-blank" size="30" />
          <span class="pl-3">Today</span>
        </button>

        <button class="flex items-center p-2 rounded-xl hover:bg-surface1 w-full">
          <Icon name="mdi:calendar-month" size="30" />
          <span class="pl-3">Upcoming</span>
        </button>
      </div>
    </aside>
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

let quickSettingsIsOpen = ref(false);
const quickSettings = ref(null);

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
</script>
