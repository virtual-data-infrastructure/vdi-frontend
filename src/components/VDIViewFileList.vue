<template>
  <div>
    <div class="view-file-list-title">
      <b>Files in view</b> <i>{{ selectedViewName }}</i>
    </div>
    <table>
      <tr
        v-for="file in files"
        :key="file.id"
        :class="{ 'selected-row': selectedFileId === file.id }"
        @click="switchSelectFile(file.id, file.filename)"
      >
        <td class="name-column">{{ file.filename }}</td>
        <td class="actions-column">
          <button @click.stop="confirmDeleteFile(this.selectedViewId, file.id, file.filename)" class="delete-button">
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
    selectedViewName: {
      type: String,
      default: null,
    },
    selectedViewId: {
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
    // watcher for changes in selectedViewName
    selectedViewName(newValue, oldValue) {
      if (newValue != oldValue) {
        this.fetchFiles();
      }
    },
    // watcher for changes in fileUploaded
    fileUploaded(newValue, oldValue) {
      if (newValue != oldValue) {
        this.fetchFiles();
      }
    }
  },
  methods: {
    async fetchFiles() {
      if (this.selectedViewName === null) {
        this.files = [];
        return;
      }
      try {
        const response = await axios.get(`https://vdi-api.nessi.no:9815/views/${this.selectedViewName}/files`);
        this.files = response.data.files;
      } catch (error) {
        console.error('Error fetching files:', error);
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
    confirmDeleteFile(viewId, fileId, fileName) {
      const confirmed = confirm('Are you sure you want to delete the file "' + fileName + '"?');
      if (confirmed) {
        this.deleteFile(viewId, fileId);
      }
    },
    async deleteFile(viewId, fileId) {
      try {
        await axios.delete(`https://vdi-api.nessi.no:9815/views/${viewId}/${fileId}`);
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
    this.fetchFiles();
  }
};
</script>

<style scoped>
.view-file-list-title {
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

.view-file-list {
  list-style-type: none;
  padding: 0;
}

.view-list li {
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
