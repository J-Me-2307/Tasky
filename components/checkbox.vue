<template>
  <div class="relative flex items-start justify-start cursor-pointer" @click="toggle">
    <div class="w-6 h-6 flex items-center justify-center rounded-full border transition-all border-green">
      <svg v-if="isChecked" class="w-6 h-6 text-green transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isChecked: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:isChecked']);

const toggle = () => {
  emit('update:isChecked', !props.isChecked);
};
</script>