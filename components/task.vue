<template>
  <div class="bg-mantle p-4 rounded-xl my-2 cursor-pointer hover:opacity-90 transition-all ease-in-out duration-300">
    <div class="flex flex-col">
      <div class="flex items-center">
        <div @click.stop>
          <Checkbox :isChecked="task.done" @update:isChecked="updateTaskStatus" />
        </div>
        <p class="ml-4">{{ task.title }}</p>
      </div>
      <div v-if="task.duedate || task.description" class="flex ml-10 mt-1 text-overlay0">
        <p v-if="task.duedate">{{ formatDuedate(task.duedate) }}</p>
        <p v-if="task.description" class="ml-5">{{ task.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { getApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const app = getApp();
const db = getFirestore(app);
const user = await getCurrentUser();

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits();

const formatDuedate = (duedate) => {
  let datetime = duedate.toDate();

  return dayjs(datetime).format('ddd. DD. MMM. - HH:mm');
};

const updateTaskStatus = async (newStatus) => {
  props.task.done = newStatus;
  await setDoc(doc(db, 'tasks', props.task.id), {
    title: props.task.title,
    description: props.task.description,
    duedate: props.task.duedate,
    done: props.task.done,
    userId: user.uid
  });
};
</script>
