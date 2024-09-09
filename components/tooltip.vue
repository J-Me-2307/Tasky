<template>
  <div class="relative inline-block" @mouseover="showTooltip" @mouseleave="hideTooltip">
    <slot name="trigger"></slot>
    <div
      v-if="visible"
      class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max bg-mantle text-text text-sm rounded-xl p-2"
      :class="positionClass"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);

const showTooltip = () => {
  visible.value = true;
};

const hideTooltip = () => {
  visible.value = false;
};

const positionClass = 'bottom-full mb-2';
</script>