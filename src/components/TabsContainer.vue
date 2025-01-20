<template>
  <div>
    <!-- Tab headers -->
    <div class="tabs">
      <div 
        v-for="(tab, index) in tabs" 
        :key="index" 
        :class="['tab', { active: selectedTab === index }]" 
        @click="selectedTab = index"
      >
        {{ tab.name }}
      </div>
    </div>
    
    <!-- Tab content -->
    <div class="tab-content">
      <component :is="getCurrentTabComponent()" :selectedProjectId="selectedProjectId" :selectedProjectName="selectedProjectName" />
    </div>
  </div>
</template>

<script>
import WelcomeInfo from './WelcomeInfo.vue';
import ProjectContent from './ProjectContent.vue';
import DataFlowGraph from './DataFlowGraph.vue';

export default {
  name: 'TabsContainer',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    selectedProjectId: {
      type: Number,
      default: null
    },
    selectedProjectName: {
      type: String,
      default: null
   }
  },
  data() {
    return {
      selectedTab: 0,
    };
  },
  components: {
    WelcomeInfo,
    ProjectContent,
    DataFlowGraph,
  },
  computed: {
    currentSlotName() {
      return this.tabs[this.selectedTab]?.slotName || '';
    }
  },
  methods: {
    getCurrentTabComponent() {
      switch(this.selectedTab) {
        case 0:
          return 'WelcomeInfo';
        case 1:
          return 'ProjectContent';
        case 2:
          return 'DataFlowGraph';
        default:
          return 'WelcomeInfo';
      }
    },
  }
};
</script>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid #ccc;
}

.tab {
  padding: 10px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-bottom: none;
  margin-right: 5px;
}

.tab.active {
  background-color: #fff;
  font-weight: bold;
}

.tab-content {
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
