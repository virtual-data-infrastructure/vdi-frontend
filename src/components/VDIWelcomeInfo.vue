<template>
  <div class="welcome-info">
    <h2>{{ welcomeMessage }}</h2>
    <p v-if="selectedViewId === null">{{ infoMessage }}</p>
    <p v-else>Here is some statistics about the view <i>{{ selectedViewName }}</i></p>
  </div>
</template>

<script>
export default {
  name: 'VDIWelcomeInfo',
  props: {
    selectedViewId: {
      type: Number,
      default: null
    },
    selectedViewName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      welcomeMessage: 'Welcome to your virtual data infrastructure!',
      infoMessage: 'Please select or create a view to get started.'
    };
  }
};
</script>

<style scoped>
.welcome-info {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.welcome-info h2 {
  margin-top: 0;
}

.welcome-info p {
  margin: 10px 0 0;
}
</style>
