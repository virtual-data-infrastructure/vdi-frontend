<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <h1>Welcome Page</h1>
      <button class="welcome-button" @click="navigateTo('dataflowgraph')">Open Data Flow Graph</button>
      <button class="welcome-button" @click="navigateTo('virtualdatainfrastructure')">Open Virtual Data Infrastructure</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateTo(routeName) {
  router.push({ name: routeName });
}
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
}

.welcome-content {
  text-align: center;
}

.welcome-button {
  font-size: 1.25em; /* Increase font size */
  margin: 10px; /* Add space between buttons */
  padding: 10px 20px;
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.welcome-button:hover {
  background-color: #3700b3;
}

h1 {
  margin-bottom: 20px;
}
</style>
