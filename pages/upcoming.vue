<template>
  <div class="py-20 px-72 w-full">
    <div class="mb-10">
      <div class="mb-16">
        <p class="text-3xl font-bold">Upcoming</p>
        <div class="flex items-center space-x-2">
          <Icon class="leading-none" name="mdi:checkbox-marked-circle-outline" size="15" />
          <!-- Display total task count -->
          <p class="text-sm leading-1">{{ totalTasks }} Task<span v-if="totalTasks !== 1">s</span></p>
        </div>
      </div>
      <div v-for="(tasks, date) in taskGroups" :key="date" class="mb-8">
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
import { getApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import dayjs from 'dayjs';

useHead({
  title: 'Upcoming - Tasky'
});

const app = getApp();
const db = getFirestore(app);

const tasks = ref([]);
const taskGroups = ref({});

// Compute the total number of tasks across all groups
const totalTasks = computed(() => {
  return Object.values(taskGroups.value).reduce((count, group) => count + group.length, 0);
});

const loadData = () => {
  const taskRef = collection(db, 'tasks');

  // Real-time listener for tasks.
  const unsubUpcoming = onSnapshot(taskRef, (snapshot => {
    const upcomingTasks = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(task => task.done === false || task.done === undefined);

    // Group tasks by duedate, using dayjs to format and sort the dates.
    const groupedTasks = upcomingTasks.reduce((groups, task) => {
      const formattedDate = task.duedate
        ? dayjs(task.duedate.toDate()).format('DD.MM.YYYY')  // Format due date
        : 'No Due Date';  // For tasks with no due date
      if (!groups[formattedDate]) {
        groups[formattedDate] = [];
      }
      groups[formattedDate].push(task);
      return groups;
    }, {});

    // Sort the groups by date and ensure 'No Due Date' is at the end
    taskGroups.value = Object.keys(groupedTasks)
      .sort((a, b) => {
        if (a === 'No Due Date') return 1;  // Place 'No Due Date' at the end
        if (b === 'No Due Date') return -1;
        return dayjs(a, 'DD.MM.YYYY').unix() - dayjs(b, 'DD.MM.YYYY').unix();  // Sort other dates
      })
      .reduce((sortedGroups, date) => {
        // Sort tasks within each group by time
        sortedGroups[date] = groupedTasks[date].sort((a, b) => {
          if (!a.duedate) return 1; // Tasks with no duedate go last
          if (!b.duedate) return -1;
          return dayjs(a.duedate.toDate()).unix() - dayjs(b.duedate.toDate()).unix();
        });
        return sortedGroups;
      }, {});
  }));

  return () => {
    unsubUpcoming();
  };
}

onMounted(() => {
  const unsubscribe = loadData();

  // Clean up the listener when component is destroyed
  onUnmounted(() => {
    if (unsubscribe) unsubscribe();
  });
});
</script>
