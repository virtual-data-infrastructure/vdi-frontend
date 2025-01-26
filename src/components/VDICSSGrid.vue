<!-- CSS Grid-style organisation of components -->
<template>
  <div class="grid-container">
    <div class="view-list">
      <VDIViewList @view-selected="updateSelectedView" />
    </div>
    <div class="center-column">
      <VDICenterColumn :slotName="selectTab" :selectedViewId="selectedViewId" :selectedViewName="selectedViewName" />
    </div>
  </div>
</template>

<script>
import VDIViewList from './VDIViewList.vue';
import VDICenterColumn from './VDICenterColumn.vue';

export default {
  emits: ['update:selectedView'],
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
    VDICenterColumn,
    VDIViewList,
  },
  data() {
    return {
      currentTab: 'tab1',
    };
  },
  computed: {
    selectTab() {
      if (this.selectedViewId === null) {
        return 'tab1';
      } else {
        return 'tab2';
      }
    }
  },
  methods: {
    updateSelectedView(newViewId, newViewName) {
      console.log(`received 'view-selected(${newViewId}, ${newViewName})'`);
      console.log(`emit 'update:selectedView(${newViewId}, ${newViewName})'`);
      this.$emit('update:selectedView', newViewId, newViewName);
    }
  }
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 3fr; /* 1 part ViewList, 2 parts FileDrop */
  height: 100vh; /* Full height of the viewport */
  gap: 10px; /* Space between components */
}

.view-list {
  border-right: 1px solid #ddd; /* Optional border to separate components */
  padding: 10px;
  box-sizing: border-box;
}

.center-column {
  padding: 10px;
  box-sizing: border-box;
}
</style>
