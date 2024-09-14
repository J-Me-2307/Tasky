<template>
  <div class="py-20 px-72 w-full">
    <div class="mb-10">
      <div class="mb-16">
        <p class="text-3xl font-bold">Today</p>
        <div class="flex items-center space-x-2">
          <Icon class="leading-none" name="mdi:checkbox-marked-circle-outline" size="15" />
          <p class="text-sm leading-1">{{ tasks.length }} Task<span v-if="tasks.length !== 1">s</span></p>
        </div>
      </div>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <Task :task="task" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getApp } from "firebase/app";
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";

useHead({
  title: 'Today - Tasky'
});

const app = getApp();
const db = getFirestore(app);

const tasks = ref([]);

const loadData = () => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  const tasksRef = collection(db, 'tasks');
  const todayQuery = query(tasksRef, where('duedate', '>=', startOfDay), where('duedate', '<=', endOfDay));
  const nullQuery = query(tasksRef, where('duedate', '==', null));

  // Real-time listener for tasks with today's due date
  const unsubToday = onSnapshot(todayQuery, (snapshot) => {
    const todayTasks = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(task => task.done === false || task.done === undefined); // Filter done == false or undefined
    tasks.value = [...todayTasks, ...tasks.value.filter(task => task.duedate === null)];
  });

  // Real-time listener for tasks with no due date
  const unsubNull = onSnapshot(nullQuery, (snapshot) => {
    const nullTasks = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(task => task.done === false || task.done === undefined); // Filter done == false or undefined
    tasks.value = [...tasks.value.filter(task => task.duedate), ...nullTasks];
  });

  return () => {
    unsubToday();
    unsubNull();
  };
};


onMounted(() => {
  const unsubscribe = loadData();

  // Clean up the listener when component is destroyed
  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });
});
</script>
