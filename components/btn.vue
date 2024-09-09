<template>
  <div>
    <button :class="buttonClass" :disabled="isDisabled" @click="onClick">
      {{ text }}
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
  }
})

const buttonClass = computed(() => {
  let fullClass = '';
  const baseClass = 'rounded-xl text-base transition duration-300 ease-in-out';
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
  switch (props.size) {
    case 'sm':
      fullClass += ' px-2 py-1 text-sm';
      break;
    case 'md':
      fullClass += ' p-2';
      break;
  }
  if (props.isDisabled) {
    fullClass += ' opacity-50 cursor-not-allowed';
  } else {
    fullClass += ' hover:opacity-90';
  }
  return fullClass + ' ' + props.additionalClasses;
})

const emit = defineEmits(['click']);
const onClick = () => {
  if (!props.isDisabled) {
    emit('click');
  }
};
</script>