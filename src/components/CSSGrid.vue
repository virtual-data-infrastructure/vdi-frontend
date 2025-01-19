<!-- CSS Grid-style organisation of components -->
<template>
  <div class="grid-container">
    <div class="project-list">
      <ProjectList @project-selected="updateSelectedProject" />
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
  emits: ['update:selectedProject'],
  props: {
    selectedProjectId: {
      type: Number,
      default: null
    },
    selectedProjectName: {
      type: String,
      default: null
    }
  },
  components: {
    CenterColumn,
    ProjectList,
  },
  data() {
    return {
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
    updateSelectedProject(newProjectId, newProjectName) {
      //this.selectedProjectId = projectId;
      //this.selectedProjectName = projectName;
      console.log(`received 'project-selected(${newProjectId}, ${newProjectName})'`);
      console.log(`emit 'update:selectedProject(${newProjectId}, ${newProjectName})'`);
      this.$emit('update:selectedProject', newProjectId, newProjectName);
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
