<template>
  <div>
    <div class="view-list-title">
      <b>View list</b>
    </div>
    <div class="view-creation">
      <input type="text" v-model="newViewName" @keyup.enter="createView" placeholder="Enter view name" />
      <button @click="createView" class="create-button">Create View</button>
    </div>
    <table>
      <tr
        v-for="view in views"
        :key="view.id"
        :class="{ 'selected-row': selectedViewId === view.id }"
        @click="switchSelectView(view.id, view.name)"
      >
        <td class="name-column">{{ view.name }}</td>
        <td class="actions-column">
          <button @click.stop="confirmDeleteView(view.id, view.name)" class="delete-button">
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
  emits: ['view-selected'],
  data() {
    return {
      newViewName: '',
      views: [],
      selectedViewId: null
    };
  },
  methods: {
    async fetchViews() {
      try {
        const response = await axios.get('https://vdi-api.nessi.no:9815/views');
        this.views = response.data;
      } catch (error) {
        console.error('Error fetching views:', error);
      }
    },
    async createView() {
      if (this.newViewName.trim() === '') {
        alert('View name cannot be empty.');
        return;
      }

      try {
        const response = await axios.post('https://vdi-api.nessi.no:9815/views', {
          name: this.newViewName
        });
        this.views.push(response.data);
        this.newViewName = ''; // reset input field
      } catch (error) {
        console.error('Error adding view:', error);
      }
    },
    switchSelectView(viewId, viewName) {
      if (this.selectedViewId === viewId) {
        this.selectedViewId = null;
        this.selectedViewName = null;
      } else {
        this.selectedViewId = viewId;
        this.selectedViewName = viewName;
      }
      console.log(`emit 'view-selected(${this.selectedViewId}, ${this.selectedViewName})'`);
      this.$emit('view-selected', this.selectedViewId, this.selectedViewName);
    },
    confirmDeleteView(viewId, viewName) {
      const confirmed = confirm('Are you sure you want to delete view "' + viewName + '"?');
      if (confirmed) {
        this.deleteView(viewId);
      }
    },
    async deleteView(viewId) {
      try {
        await axios.delete(`https://vdi-api.nessi.no:9815/views/${viewId}`);
        this.views = this.views.filter(view => view.id !== viewId);
        if (this.selectedViewId === viewId) {
          this.selectedViewId = null; // reset selected view if it was deleted
          this.selectedViewName = null; // reset selected view if it was deleted
          console.log(`emit 'view-selected(${this.selectedViewId}, ${this.selectedViewName})'`);
          this.$emit('view-selected', this.selectedViewId, this.selectedViewName);
        }
      } catch (error) {
        console.error('Error deleting view:', error);
      }
    }
  },
  mounted() {
    this.fetchViews();
  }
};
</script>

<style scoped>
.view-list-title {
  margin-bottom: 10px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.view-creation {
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

.view-list {
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
