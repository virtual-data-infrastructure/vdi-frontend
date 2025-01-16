<template>
  <div id="center-column">
    <TabsContainer :tabs="tabs" :selectedProjectId="selectedProjectId" :selectedProjectName="selectedProjectName">
      <template #tab1>
      </template>
      <template #tab2>
      </template>
      <template #tab3>
      </template>
    </TabsContainer>
  </div>
</template>

<script>
import TabsContainer from './TabsContainer.vue';

export default {
  name: 'CenterColumn',
  props: {
    slotName: {
      type: String,
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
  components: {
    TabsContainer,
  },
  data() {
    return {
      tabs: [
        { name: 'Welcome', slotName: 'tab1', index: 0 },
        { name: 'Log files', slotName: 'tab2', index: 1 },
        { name: 'Data flow graph', slotName: 'tab3', index: 2 },
      ],
    };
  },
};
</script>

<style>
/* Add your global styles here */
</style>
