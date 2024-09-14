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
          <btn @click="toggle" text="Cancel" color="yellow" size="sm" additional-classes="mr-2" />
          <btn color="green" size="sm" text="Add" @click="addTask" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'

let title = ref('');
let description = ref('')
let duedate = ref('');

const app = getApp();
const db = getFirestore(app);

const props = defineProps({
  showDialog: Boolean
});

const emit = defineEmits(['update:showDialog']);

const toggle = () => {
  emit('update:showDialog', !props.showDialog);
}

const addTask = async () => {
  const id = uuidv4();
  if (title.value && description.value && duedate.value) {
    await setDoc(doc(db, "tasks", id), {
      title: title.value,
      description: description.value,
      duedate: duedate.value,
    }).then(() => toggle())
  }
}
</script>