<template>
  <div
    class="file-drop-zone"
    @dragover.prevent
    @dragenter.prevent="onDragEnter"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
    :class="{ 'drop-zone': true, 'drop-zone-active': isDragActive }"
    @click="triggerFileInput"
  >
    <p>Drop log files here or click to upload files</p>
    <input type="file" multiple @change="handleFileChange" ref="fileInput" style="display: none;" />
  </div>
  <div>
    <table>
      <tr v-if="files.length">
        <td id="header-row"><b>Log files to be uploaded</b></td>
        <td id="header-row">&nbsp;</td>
        <td id="header-row">&nbsp;</td>
      </tr>
      <tr v-for="(file, index) in files" :key="index">
        <td class="name-column">{{ file.name }}</td>
        <td class="actions-column">
          <button @click.stop="uploadFile(this.selectedProjectId, this.selectedProjectName, index)" class="upload-button">
            <img src="@/assets/Upload_89524_The_Noun_Project.png" alt="upload" class="upload-icon"/>
          </button>
        </td>
        <td class="actions-column">
          <button @click.stop="removeFileFromList(file.name)" class="remove-button">
            <img src="@/assets/Remove_89612_The_Noun_Project.png" alt="remove" class="remove-icon"/>
          </button>
        </td>
      </tr>
      <tr v-if="files.length > 1">
        <td class="name-column" id="footer-row"><i>Act on all {{ files.length }} files above</i></td>
        <td class="actions-column" id="footer-row">
          <button @click.stop="uploadFiles(this.selectedProjectId, this.selectedProjectName, files)" class="upload-button">
            <img src="@/assets/Upload_89524_The_Noun_Project.png" alt="upload" class="upload-icon"/>
          </button>
        </td>
        <td class="actions-column" id="footer-row">
          <button @click.stop="removeFilesFromList()" class="remove-button">
            <img src="@/assets/Remove_89612_The_Noun_Project.png" alt="remove" class="remove-icon"/>
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

const LOG_FILTERS = [
  '12@@@^open$@@@13@@@^/cvmfs/software\\.eessi\\.io',
  '12@@@^open64$@@@13@@@^/cvmfs/software\\.eessi\\.io',
  '12@@@^fopen$@@@13@@@^/cvmfs/software\\.eessi\\.io',
  '12@@@^fopen64$@@@13@@@^/cvmfs/software\\.eessi\\.io',
  '12@@@^fopen$@@@13@@@^/etc/psm3.conf',
  '12@@@^open64$@@@13@@@matplotlib/fontlist-v330.json$',
  '12@@@^fopen$@@@13@@@matplotlib/fontlist-v330.json$',
  '12@@@^fopen$@@@13@@@mca-params.conf$',
  '12@@@^open$@@@13@@@^/proc',
  '12@@@^openat$@@@14@@@^/proc',
  '12@@@^fopen$@@@13@@@^/proc',
  '12@@@^openat$@@@14@@@^/run',
  '12@@@^open$@@@13@@@^/sys',
  '12@@@^openat$@@@14@@@^/sys',
  '12@@@^fopen$@@@13@@@^/sys',
  '12@@@^open$@@@13@@@^/tmp/ompi',
  '12@@@^fopen$@@@13@@@^/tmp/ompi',
  '12@@@^fopen$@@@13@@@ucx.conf$',
  '12@@@^fopen$@@@13@@@^/usr/share',
];

export default {
  name: 'FileDrop',
  emits: ['fileUploaded'],
  props: {
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
      isDragActive: false,
    };
  },
  watch: {
    // watcher for changes in selectedProjectName
    selectedProjectName(newValue, oldValue) {
      if (newValue != oldValue) {
        this.files = [];
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
    onDragEnter() {
      this.isDragActive = true;
    },
    onDragLeave() {
      this.isDragActive = false;
    },
    onDrop(event) {
      this.isDragActive = false;
      this.files = Array.from(event.dataTransfer.files);
    },
    handleFileChange(event) {
      this.files = Array.from(event.target.files);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async uploadFile(projectId, projectName, index) {
      console.log("ProjectId: ", projectId)
      console.log("ProjectName: ", projectName)
      console.log("index: ", index)
      const formData = new FormData();
      formData.append('files', this.files[index]);
      formData.append('projectId', projectId);
      formData.append('filters', JSON.stringify(LOG_FILTERS));
      console.log('FormData prepared:', formData);

      try {
        const response = await axios.post(`https://vdi-api.nessi.no:9815/upload/${projectName}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Upload successful:', response.data);
        this.removeFileFromList(this.files[index].name);
        this.$emit('fileUploaded');
      } catch (error) {
        console.error('Upload failed:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request data:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
      }
    },
    async uploadFiles(projectId, projectName) {
      const formData = new FormData();
      console.log("ProjectId: ", projectId)
      console.log("ProjectName: ", projectName)
      console.log("files: ", this.files)
      this.files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('projectId', projectId);
      formData.append('filters', JSON.stringify(LOG_FILTERS));
      console.log('FormData prepared:', formData);

      try {
        const response = await axios.post(`https://vdi-api.nessi.no:9815/upload/${projectName}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Upload successful:', response.data);
        this.removeFilesFromList();
        this.$emit('fileUploaded');
      } catch (error) {
        console.error('Upload failed:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request data:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
      }
    },
    removeFileFromList(file_name) {
      this.files = this.files.filter(file => file.name !== file_name);
    },
    removeFilesFromList() {
      this.files = [];
    },
  },
};
</script>

<style scoped>
.file-drop-zone {
  width: 100%;
  height: 100px;
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

#header-row {
  border-bottom: 4px double #ddd;
  border-top: 0px solid #ddd;
  padding: 0px 0px 5px 0px; /* top right bottom left */
  margin: 0px;
  vertical-align: middle;
  text-align: left;
}

#footer-row {
  border-bottom: 0px solid #ddd;
  border-top: 4px double #ddd;
  padding: 3px 0px 0px 0px; /* top right bottom left */
  margin: 0px;
  vertical-align: middle;
}

button {
  margin-top: 10px;
}

.name-column {
  text-align: left;
  cursor: default;
}

.actions-column {
  text-align: right;
}

.remove-button {
  padding: 0px;
  margin: 0px;
  background: none;
  border: none;
  cursor: pointer;
}

.remove-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.upload-button {
  padding: 0px;
  margin: 0px;
  background: none;
  border: none;
  cursor: pointer;
}

.upload-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
</style>
