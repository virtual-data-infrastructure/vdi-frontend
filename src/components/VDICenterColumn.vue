<template>
  <div id="center-column">
    <VDITabsContainer :tabs="tabs" :selectedViewId="selectedViewId" :selectedViewName="selectedViewName">
      <template #tab1>
      </template>
      <template #tab2>
      </template>
    </VDITabsContainer>
  </div>
</template>

<script>
import VDITabsContainer from './VDITabsContainer.vue';

export default {
  name: 'VDICenterColumn',
  props: {
    slotName: {
      type: String,
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
  components: {
    VDITabsContainer,
  },
  data() {
    return {
      tabs: [
        { name: 'Welcome', slotName: 'tab1', index: 0 },
        { name: 'Data in View', slotName: 'tab2', index: 1 },
      ],
    };
  },
};
</script>

<style>
/* Add your global styles here */
</style>
