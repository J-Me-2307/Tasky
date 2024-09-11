<template>
  <div>
    <button :class="buttonClass" :disabled="disable" @click="onClick">
      <div v-if="props.loading" class="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" role="status"/>
      <p v-if="!props.loading">{{ props.text }}</p>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'Button'
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'blue'
  },
  size: {
    type: String,
    default: 'md'
  },
  additionalClasses: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const disable = computed(() => props.loading || props.isDisabled);

const buttonClass = computed(() => {
  let fullClass = '';
  const baseClass = 'rounded-xl text-base transition duration-300 ease-in-out';

  // Handle color
  switch (props.color) {
    case 'blue':
      fullClass += `${baseClass} bg-blue`;
      break;
    case 'red':
      fullClass += `${baseClass} bg-red`;
      break;
    case 'green':
      fullClass += `${baseClass} bg-green`;
      break;
    case 'yellow':
      fullClass += `${baseClass} bg-yellow`;
      break;
  }

  // Handle size
  switch (props.size) {
    case 'sm':
      fullClass += ' px-2 py-1 text-sm';
      break;
    case 'md':
      fullClass += ' p-2';
      break;
  }

  // Handle disabled and loading states
  fullClass += disable.value ? ' opacity-50 cursor-not-allowed pointer-events-none' : ' hover:opacity-90';

  return fullClass + ' ' + props.additionalClasses;
});

const emit = defineEmits(['click']);
const onClick = () => {
  if (!disable.value) {
    emit('click');
  }
};
</script>