<template>
  <div
    class="file-drop-zone"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleFileDrop"
    :class="{ 'drag-over': isDragOver }"
  >
    <p v-if="!files.length">Drop files here or click to upload</p>
    <ul v-if="files.length">
      <li v-for="file in files" :key="file.name">{{ file.name }}</li>
    </ul>
    <input type="file" ref="fileInput" multiple @change="handleFileSelect" hidden />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDragOver: false,
      files: []
    };
  },
  methods: {
    handleDragOver(event) {
      this.isDragOver = true;
    },
    handleDragLeave(event) {
      this.isDragOver = false;
    },
    handleFileDrop(event) {
      this.isDragOver = false;
      const droppedFiles = event.dataTransfer.files;
      this.handleFiles(droppedFiles);
    },
    handleFileSelect(event) {
      const selectedFiles = event.target.files;
      this.handleFiles(selectedFiles);
    },
    handleFiles(files) {
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }
    }
  }
};
</script>

<style scoped>
.file-drop-zone {
  width: 100%;
  height: 200px;
  border: 2px dashed #cccccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  text-align: center;
  cursor: pointer;
}

.file-drop-zone.drag-over {
  background-color: #e0e0e0;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
