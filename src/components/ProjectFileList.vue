<template>
  <div>
    <div class="project-file-list-title">
      <b>Log files in project</b> <i>{{ selectedProjectName }}</i>
    </div>
    <table>
      <tr
        v-for="file in files"
        :key="file.id"
        :class="{ 'selected-row': selectedFileId === file.id }"
        @click="switchSelectFile(file.id, file.file_name)"
      >
        <td class="name-column">{{ file.file_name }}</td>
        <td class="actions-column">
          <button @click.stop="confirmDeleteFile(this.selectedProjectId, file.id, file.file_name)" class="delete-button">
            <img src="@/assets/Trash_89060_The_Noun_Project.png" alt="delete" class="delete-icon"/>
          </button>
        </td>
      </tr>
    </table>
    <p v-if="files.length === 0" style="text-align: left;"><i>none yet</i></p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    fileUploaded: {
      type: Boolean,
      default: false,
    },
    selectedProjectName: {
      type: String,
      default: null,
    },
    selectedProjectId: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      files: [],
      selectedFileId: null,
    };
  },
  watch: {
    // watcher for changes in selectedProjectName
    selectedProjectName(newValue, oldValue) {
      if (newValue != oldValue) {
        this.fetchLogFiles();
      }
    },
    // watcher for changes in fileUploaded
    fileUploaded(newValue, oldValue) {
      if (newValue != oldValue) {
        this.fetchLogFiles();
      }
    }
  },
  methods: {
    async fetchLogFiles() {
      //console.log("selectedProjectName:", this.selectedProjectName);
      if (this.selectedProjectName === null) {
        this.files = [];
        return;
      }
      try {
        const response = await axios.get(`https://vdi-api.nessi.no:9815/projects/${this.selectedProjectName}/rawlogfiles`);
        this.files = response.data.log_files;
      } catch (error) {
        console.error('Error fetching raw log files:', error);
      }
    },
    switchSelectFile(fileId, fileName) {
      if (this.selecteFileId === fileId) {
        this.selectedFileId = null;
        this.selectedFileName = null;
      } else {
        this.selectedFileId = fileId;
        this.selectedFileName = fileName;
      }
      this.$emit('file-selected', this.selectedFileId, this.selectedFileName);
    },
    confirmDeleteFile(projectId, fileId, fileName) {
      const confirmed = confirm('Are you sure you want to delete the log file "' + fileName + '"?');
      if (confirmed) {
        this.deleteFile(projectId, fileId);
      }
    },
    async deleteFile(projectId, fileId) {
      try {
        await axios.delete(`https://vdi-api.nessi.no:9815/projects/${projectId}/${fileId}`);
        this.files = this.files.filter(file => file.id !== fileId);
        if (this.selectedFileId === fileId) {
          this.selectedFileId = null; // reset selected file if it was deleted
          this.selectedFileName = null; // reset selected file if it was deleted
          this.$emit('file-selected', this.selectedFileId, this.selectedFileName);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  },
  mounted() {
    this.fetchLogFiles();
  }
};
</script>

<style scoped>
.project-file-list-title {
  margin-bottom: 10px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  padding: 0px;
}
tr {
  padding: 0px;
  margin: 0px;
  vertical-align: middle;
}
td {
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
  padding: 0px;
  margin: 0px;
  vertical-align: middle;
}

.project-file-list {
  list-style-type: none;
  padding: 0;
}

.project-list li {
  padding: 5px 0;
  font-size: 16px;
}

button {
  font-size: 16px;
  cursor: pointer;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.create-button {
  padding: 5px 5px 5px 5px;
  margin: 5px 5px 5px 5px;
}

.delete-button {
  padding: 0px;
  margin: 0px;
  background: none;
  border: none;
  cursor: pointer;
}

.delete-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.name-column {
  text-align: left;
  cursor: default;
}

.actions-column {
  text-align: right;
}

.selected-row {
  background-color: #d3d3d3;
  color: #333333;
}
</style>
