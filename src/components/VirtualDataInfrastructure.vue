<template>
  <div id="virtualdatainfrastructure">
    <VDICSSGrid
      :selectedViewId="selectedViewId"
      :selectedViewName="selectedViewName"
      @update:selectedView="handleUpdateSelectedView"
    />
  </div>
</template>

<script>
import VDICSSGrid from './VDICSSGrid.vue';

export default {
  components: {
    VDICSSGrid
  },
  data() {
    return {
      selectedViewId: null,
      selectedViewName: null,
    };
  },
  methods: {
    handleUpdateSelectedView(newViewId, newViewName) {
      console.log(`received 'update:selectedView(${newViewId}, ${newViewName})'`);
      this.selectedViewId = newViewId;
      this.selectedViewName = newViewName;
    }
  }
};
</script>

<style>
/* Global styles (if any) */
#virtualdatainfrastructure {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}
</style>
