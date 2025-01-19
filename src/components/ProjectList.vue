<template>
  <div>
    <div class="project-list-title">
      <b>Project list</b>
    </div>
    <div class="project-creation">
      <input type="text" v-model="newProjectName" @keyup.enter="createProject" placeholder="Enter project name" />
      <button @click="createProject" class="create-button">Create Project</button>
    </div>
    <table>
      <tr
        v-for="project in projects"
        :key="project.id"
        :class="{ 'selected-row': selectedProjectId === project.id }"
        @click="switchSelectProject(project.id, project.name)"
      >
        <td class="name-column">{{ project.name }}</td>
        <td class="actions-column">
          <button @click.stop="confirmDeleteProject(project.id, project.name)" class="delete-button">
            <img src="@/assets/Trash_89060_The_Noun_Project.png" alt="delete" class="delete-icon"/>
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: [],
  emits: ['project-selected'],
  data() {
    return {
      newProjectName: '',
      projects: [],
      selectedProjectId: null
    };
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await axios.get('https://vdi-api.nessi.no:9815/projects');
        this.projects = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    async createProject() {
      if (this.newProjectName.trim() === '') {
        alert('Project name cannot be empty.');
        return;
      }

      try {
        const response = await axios.post('https://vdi-api.nessi.no:9815/projects', {
          name: this.newProjectName
        });
        this.projects.push(response.data);
        this.newProjectName = ''; // reset input field
      } catch (error) {
        console.error('Error adding project:', error);
      }
    },
    switchSelectProject(projectId, projectName) {
      if (this.selectedProjectId === projectId) {
        this.selectedProjectId = null;
        this.selectedProjectName = null;
      } else {
        this.selectedProjectId = projectId;
        this.selectedProjectName = projectName;
      }
      console.log(`emit 'project-selected(${this.selectedProjectId}, ${this.selectedProjectName})'`);
      this.$emit('project-selected', this.selectedProjectId, this.selectedProjectName);
    },
    confirmDeleteProject(projectId, projectName) {
      const confirmed = confirm('Are you sure you want to delete project "' + projectName + '"?');
      if (confirmed) {
        this.deleteProject(projectId);
      }
    },
    async deleteProject(projectId) {
      try {
        await axios.delete(`https://vdi-api.nessi.no:9815/projects/${projectId}`);
        this.projects = this.projects.filter(project => project.id !== projectId);
        if (this.selectedProjectId === projectId) {
          this.selectedProjectId = null; // reset selected project if it was deleted
          this.selectedProjectName = null; // reset selected project if it was deleted
          console.log(`emit 'project-selected(${this.selectedProjectId}, ${this.selectedProjectName})'`);
          this.$emit('project-selected', this.selectedProjectId, this.selectedProjectName);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  },
  mounted() {
    this.fetchProjects();
  }
};
</script>

<style scoped>
.project-list-title {
  margin-bottom: 10px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.project-creation {
  margin-bottom: 10px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

input[type="text"] {
  padding: 5px;
  font-size: 16px;
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

.project-list {
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
