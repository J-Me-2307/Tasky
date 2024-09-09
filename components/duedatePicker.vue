<template>
  <div class="relative">
    <btn @click="togglePicker" size="sm" :text="formattedDateTime ? formattedDateTime : 'Duedate'" />

    <div v-if="showPicker" class="absolute mt-2 bg-mantle shadow-xl rounded-lg p-4 z-10 text-text">
      <div class="flex flex-col space-y-2">
        <input type="date" v-model="selectedDate"
          class="rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none" />

        <input type="time" v-model="selectedTime"
          class="rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none" />
        <btn text="Confirm" @click="applyDateTime" color="green" additional-classes="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import dayjs from 'dayjs';

// State
const showPicker = ref(false);
const selectedDate = ref('');
const selectedTime = ref('');
const formattedDateTime = ref('');

const emit = defineEmits(['update:modelValue']);

const togglePicker = () => {
  showPicker.value = !showPicker.value;
};

const applyDateTime = () => {
  if (selectedDate.value && selectedTime.value) {
    const datetime = `${selectedDate.value} ${selectedTime.value}`;
    formattedDateTime.value = dayjs(datetime).format('ddd. DD. MMM. - HH:mm');
    emit('update:modelValue', formattedDateTime.value); // Emit the selected value to the parent
    showPicker.value = false;
  }
};
</script>