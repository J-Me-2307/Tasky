<template>
  <div class="relative">
    <!-- Button to open/close the datepicker -->
    <button @click="togglePicker" class="rounded-xl bg-blue text-base px-2 py-1 text-sm">
      <p v-if="!formattedDateTime">Duedate</p>
      <p v-else>{{ formattedDateTime }}</p>
    </button>

    <!-- Datepicker popover -->
    <div v-if="showPicker" class="absolute mt-2 bg-mantle shadow-xl rounded-lg p-4 z-10 text-text">
      <div class="flex flex-col space-y-2">
        <!-- Date input -->
        <input type="date" v-model="selectedDate" class="rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none"  />

        <!-- Time input -->
        <input type="time" v-model="selectedTime" class="rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none" />

        <!-- Confirm button -->
        <button @click="applyDateTime" class="bg-green py-2 px-4 rounded-lg text-base">
          Confirm
        </button>
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

// Emit the selected value to the parent
const emit = defineEmits(['update:modelValue']);

// Toggles the visibility of the picker
const togglePicker = () => {
  showPicker.value = !showPicker.value;
};

// Apply selected date and time
const applyDateTime = () => {
  if (selectedDate.value && selectedTime.value) {
    const datetime = `${selectedDate.value} ${selectedTime.value}`;
    formattedDateTime.value = dayjs(datetime).format('ddd. DD. MMM. - HH:mm');
    emit('update:modelValue', formattedDateTime.value); // Emit the selected value to the parent
    showPicker.value = false;
  }
};
</script>