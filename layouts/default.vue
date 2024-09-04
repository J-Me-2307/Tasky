<template>
  <div class="text-text">
    <aside class="bg-crust fixed top-0 left-0 z-40 w-56 h-screen sm:translate-x-0">
      <div class="h-full px-3 py-4 overflow-hidden">
        <a href="#" class="flex items-center p-2 text-text rounded-lg">
          <Icon name="mdi:user-circle" class="text-text" size="30" />
          <span class="ms-3 text-lg"><a href="">[Username]</a></span>
        </a>
        <a href="#" class="flex items-center p-2 text-text rounded-lg">
          <Icon name="mdi:add-circle" class="text-text" size="30" />
          <span class="pl-3"><a href="">Add task</a></span>
        </a>
        <a href="#" class="flex items-center p-2 text-text rounded-lg">
          <Icon name="mdi:calendar-blank" class="text-text" size="30" />
          <span class="pl-3"><a href="">Today</a></span>
        </a>
        <a href="#" class="flex items-center p-2 text-text rounded-lg">
          <Icon name="mdi:calendar-month" class="text-text" size="30" />
          <span class="pl-3"><a href="">Today</a></span>
        </a>
        <select v-model="selectedTheme">
          <option value="Latte">Latte</option>
          <option value="Frappe">Frappe</option>
          <option value="Macchiato">Macchiato</option>
          <option value="Mocha">Mocha</option>
        </select>
      </div>
    </aside>
    <slot />
  </div>
</template>

<script setup>
const { $setTheme } = useNuxtApp()

let selectedTheme = ref('Latte')

watch(selectedTheme, (newTheme) => {
  $setTheme(newTheme)
});
</script>