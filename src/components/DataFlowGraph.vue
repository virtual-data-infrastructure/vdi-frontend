<template>
  <div id="dataflowgraph">
    <CSSGrid
      :selectedProjectId="selectedProjectId"
      :selectedProjectName="selectedProjectName"
      @update:selectedProject="handleUpdateSelectedProject"
    />
  </div>
</template>

<script>
import CSSGrid from './CSSGrid.vue';

export default {
  components: {
    CSSGrid
  },
  data() {
    return {
      selectedProjectId: null,
      selectedProjectName: null,
    };
  },
  methods: {
    handleUpdateSelectedProject(newProjectId, newProjectName) {
      console.log(`received 'update:selectedProject(${newProjectId}, ${newProjectName})'`);
      this.selectedProjectId = newProjectId;
      this.selectedProjectName = newProjectName;
    }
  }
};
</script>

<style>
/* Global styles (if any) */
#dataflowgraph {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}
</style>
