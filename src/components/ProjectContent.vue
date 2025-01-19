<template>
  <div class="project-content">
    <div class="file-list">
      <ProjectFileList :selectedProjectId="selectedProjectId" :selectedProjectName="selectedProjectName" :fileUploaded="fileUploaded" />
    </div>
    <div v-if="selectedProjectId !== null" class="file-drop">
      <FileDrop @fileUploaded="handleFileUploaded" :selectedProjectId="selectedProjectId" :selectedProjectName="selectedProjectName" />
    </div>
  </div>
</template>

<script>
import FileDrop from './FileDrop.vue';
import ProjectFileList from './ProjectFileList.vue';

export default {
  name: 'ProjectContent',
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
    FileDrop,
    ProjectFileList,
  },
  data() {
    return {
      fileUploaded: false
    };
  },
  methods: {
    handleFileUploaded() {
      this.fileUploaded = !this.fileUploaded;
    }
  }
};
</script>

<style scoped>
.project-content {
  display: grid;
  grid-template-areas:
    "filelist"
    "filedrop"
    "fileinfo";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 5px;
}

.file-list {
  border-right: 0px solid #ddd; /* Optional border to separate components */
  padding: 5px;
  box-sizing: border-box;
}

.file-drop {
  border-right: 0px solid #ddd; /* Optional border to separate components */
  padding: 5px;
  box-sizing: border-box;
}
</style>
