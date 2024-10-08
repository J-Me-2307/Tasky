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
import { Timestamp } from "firebase/firestore"; // Import Firebase Timestamp

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => null
  }
});

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
    const datetime = `${selectedDate.value}T${selectedTime.value}`; // ISO format
    const dateObj = new Date(datetime);
    formattedDateTime.value = dayjs(datetime).format('ddd. DD. MMM. - HH:mm');
    
    const firebaseTimestamp = Timestamp.fromDate(dateObj); // Create Firebase timestamp
    emit('update:modelValue', firebaseTimestamp); // Emit the Firebase timestamp to the parent
    showPicker.value = false;
  }
};

// Watch for changes in modelValue prop
watch(() => props.modelValue, (newValue) => {
  if (newValue instanceof Timestamp) {
    const dateObj = newValue.toDate();
    selectedDate.value = dayjs(dateObj).format('YYYY-MM-DD');
    selectedTime.value = dayjs(dateObj).format('HH:mm');
    formattedDateTime.value = dayjs(dateObj).format('ddd. DD. MMM. - HH:mm');
  }
}, { immediate: true });

</script>
