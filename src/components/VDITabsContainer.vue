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
      <component :is="getCurrentTabComponent()" :selectedViewId="selectedViewId" :selectedViewName="selectedViewName" />
    </div>
  </div>
</template>

<script>
import VDIWelcomeInfo from './VDIWelcomeInfo.vue';
import VDIViewContent from './VDIViewContent.vue';

export default {
  name: 'VDITabsContainer',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    selectedViewId: {
      type: Number,
      default: null
    },
    selectedViewName: {
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
    VDIWelcomeInfo,
    VDIViewContent,
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
          return 'VDIWelcomeInfo';
        case 1:
          return 'VDIViewContent';
        default:
          return 'VDIWelcomeInfo';
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
