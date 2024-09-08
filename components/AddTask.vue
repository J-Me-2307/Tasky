<template>
  <div v-if="showDialog" @click="toggle"
    class="fixed inset-0 z-50 flex items-center justify-center h-screen w-screen bg bg-gray-800 bg-opacity-50">
    <div class="ml-56 flex items-center justify-center h-screen w-screen">
      <div @click.stop class="bg-mantle rounded-xl px-6 py-3 w-96">
        <p class="text-2xl">Add task</p>
        <input v-model="title" type="text"
          class="bg-transparent text-lg w-full border-none placeholder::text-overlay1 focus:border-none focus:ring-0 focus:outline-none"
          placeholder="title">
        <input v-model="description" type="text"
          class="bg-transparent w-full border-none placeholder::text-overlay1 focus:border-none focus:ring-0 focus:outline-none"
          placeholder="description">
        <DuedatePicker class="my-2" v-model="duedate" />
        <div class="border border-b-overlay1 w-full" />
        <div class="flex mt-2 justify-end">
          <button @click="toggle" class="rounded-xl bg-yellow text-base px-2 py-1 text-sm mr-2">
            Cancel
          </button>
          <button class="rounded-xl bg-green text-base px-2 py-1 text-sm">
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { db } from 'firebase/firestore'
let title = ref('');
let description = ref('')
let duedate = ref('');

const props = defineProps({
  showDialog: Boolean
});

const emit = defineEmits(['update:showDialog']);

const toggle = () => {
  emit('update:showDialog', !props.showDialog);
}
</script>
