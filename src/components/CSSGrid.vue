<!-- CSS Grid-style organisation of components -->
<template>
  <div class="grid-container">
    <div class="project-list">
      <ProjectList @project-selected="handleProjectSelected" />
    </div>
    <div class="center-column">
      <CenterColumn :slotName="selectTab" :selectedProjectId="selectedProjectId" :selectedProjectName="selectedProjectName" />
    </div>
  </div>
</template>

<script>
import ProjectList from './ProjectList.vue';
import CenterColumn from './CenterColumn.vue';

export default {
  components: {
    CenterColumn,
    ProjectList,
  },
  data() {
    return {
      selectedProjectId: this.selectedProjectId,
      currentTab: 'tab1',
    };
  },
  computed: {
    selectTab() {
      if (this.selectedProjectId === null) {
        return 'tab1';
      } else {
        return 'tab2';
      }
    }
  },
  methods: {
    handleProjectSelected(projectId, projectName) {
      this.selectedProjectId = projectId;
      this.selectedProjectName = projectName;
    }
  }
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr; /* 1 part ProjectList, 2 parts FileDrop */
  height: 100vh; /* Full height of the viewport */
  gap: 10px; /* Space between components */
}

.project-list {
  border-right: 1px solid #ddd; /* Optional border to separate components */
  padding: 10px;
  box-sizing: border-box;
}

.center-column {
  padding: 10px;
  box-sizing: border-box;
}
</style>
