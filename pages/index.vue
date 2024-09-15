<template>
  <div class="py-20 px-72 w-full">
    <div class="mb-10">
      <div class="mb-16">
        <p class="text-3xl font-bold">Today</p>
        <div class="flex items-center space-x-2">
          <Icon class="leading-none" name="mdi:checkbox-marked-circle-outline" size="15" />
          <p class="text-sm leading-1">{{ totalTasks }} Task<span v-if="totalTasks !== 1">s</span></p>
        </div>
      </div>

      <!-- Grouped Tasks by Date -->
      <div v-for="(tasks, date) in groupedTasks" :key="date" class="mb-8">
        <p class="text-xl font-bold mb-4">{{ date }}</p>
        <ul>
          <li v-for="task in tasks" :key="task.id">
            <Task :task="task" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getApp } from "firebase/app";
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";
import dayjs from 'dayjs';

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

// Group tasks by due date (including "No Due Date")
const groupedTasks = computed(() => {
  const groups = tasks.value.reduce((acc, task) => {
    const formattedDate = task.duedate
      ? dayjs(task.duedate.toDate()).format('DD.MM.YYYY')  // Format due date
      : 'No Due Date';  // Group tasks with no due date
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(task);
    return acc;
  }, {});

  // Sort groups by date, with "No Due Date" at the end
  const sortedGroups = Object.keys(groups).sort((a, b) => {
    if (a === 'No Due Date') return 1; // "No Due Date" should always be last
    if (b === 'No Due Date') return -1;
    return dayjs(a, 'DD.MM.YYYY').unix() - dayjs(b, 'DD.MM.YYYY').unix();
  });

  // Return sorted tasks grouped by date
  return sortedGroups.reduce((acc, date) => {
    acc[date] = groups[date].sort((a, b) => {
      if (!a.duedate) return 1;  // No due date goes last within the group
      if (!b.duedate) return -1;
      return dayjs(a.duedate.toDate()).unix() - dayjs(b.duedate.toDate()).unix();  // Sort by time within each group
    });
    return acc;
  }, {});
});

// Calculate total number of tasks
const totalTasks = computed(() => tasks.value.length);

onMounted(() => {
  const unsubscribe = loadData();

  // Clean up the listener when component is destroyed
  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });
});
</script>
