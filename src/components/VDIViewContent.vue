<template>
  <div class="view-content">
    <div class="file-list">
      <VDIViewFileList :selectedViewId="selectedViewId" :selectedViewName="selectedViewName" :fileUploaded="fileUploaded" />
    </div>
    <div v-if="selectedViewId !== null" class="file-drop">
      <VDIFileDrop @fileUploaded="handleFileUploaded" :selectedViewId="selectedViewId" :selectedViewName="selectedViewName" />
    </div>
  </div>
</template>

<script>
import VDIFileDrop from './VDIFileDrop.vue';
import VDIViewFileList from './VDIViewFileList.vue';

export default {
  name: 'VDIViewContent',
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
  components: {
    VDIFileDrop,
    VDIViewFileList,
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
.view-content {
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
