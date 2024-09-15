<template>
  <div v-if="showDialog" @click="toggle"
    class="fixed inset-0 z-50 flex items-center justify-center h-screen w-screen bg-gray-800 bg-opacity-50">
    <div class="ml-56 flex items-center justify-center h-screen w-screen">
      <div @click.stop class="bg-mantle rounded-xl px-6 py-3 w-96">
        <p class="text-2xl">Update {{ task.title || 'Task' }}</p>
        <div class="mb-3 mt-1">
          <label>Title<span class="text-red">*</span></label>
          <input type="text" v-model="title" @input="validateTitle" :class="[
            'rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none',
            {
              'focus:border-sky focus:ring-sky border-text': !titleErrorMessage,
              'border-red text-red focus:border-red focus:ring-red ring-red': titleErrorMessage
            }
          ]" placeholder="title">
          <p class="mt-2 text-red">{{ titleErrorMessage }}</p>
        </div>
        <div class="mb-3 mt-1">
          <label>Description</label>
          <input type="text" v-model="description"
            class="rounded-xl bg-surface0 px-4 py-2 w-full text-text border placeholder::text-overlay1 focus:ring-1 focus:outline-none focus:border-sky focus:ring-sky border-text"
            placeholder="description">
        </div>
        <div class="mb-3 mt-1">
          <label>Duedate</label>
          <DuedatePicker v-model="duedate" />
        </div>
        <div class="border border-b-overlay1 w-full" />
        <div class="flex mt-2 justify-end">
          <btn @click="cancel" text="Cancel" color="yellow" size="sm" additional-classes="mr-2" />
          <btn @click="deleteTask" text="Delete" color="red" size="sm" additional-classes="mr-2" />
          <btn @click="updateTask" text="Update" color="green" size="sm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getApp } from 'firebase/app';
import { getFirestore, setDoc, doc, deleteDoc } from 'firebase/firestore';

const props = defineProps({
  showDialog: Boolean,
  task: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      duedate: null,
    })
  }
});

const app = getApp();
const db = getFirestore(app);

const emit = defineEmits(['update:showDialog']);

let title = ref('');
let description = ref('');
let duedate = ref(null); // Initialize as null
let titleErrorMessage = ref('');

const toggle = () => {
  emit('update:showDialog', !props.showDialog);
};

const validateTitle = () => {
  if (!title.value) {
    titleErrorMessage.value = 'Title can not be empty';
  } else {
    titleErrorMessage.value = '';
  }
};

const deleteTask = async () => {
  await deleteDoc(doc(db, "tasks", props.task.id)).then(() => {
    title.value = '';
    description = '';
    duedate.value = '';
    toggle();
  })
}

const cancel = () => {
  title.value = '';
  description = '';
  duedate.value = '';
  toggle();
}

const updateTask = async () => {
  if (title.value) {
    await setDoc(doc(db, "tasks", props.task.id), {
      title: title.value,
      description: description.value ? description.value : null,
      duedate: duedate.value ? duedate.value : null,
      done: false
    }).then(() => {
      title.value = '';
      description.value = '';
      duedate.value = '';
      toggle();
    })
  }
}

// Watch for changes in the props.task and update local state accordingly
watch(() => props.task, (newTask) => {
  title.value = newTask.title;
  description.value = newTask.description;
  duedate.value = newTask.duedate || null;
}, { deep: true });
</script>
