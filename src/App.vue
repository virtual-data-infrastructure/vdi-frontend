<template>
  <div id="app">
    <!-- <FlexboxLayout /> -->
    <CSSGrid />
  </div>
</template>

<script>
// import FlexboxLayout from './components/FlexboxLayout.vue';
import CSSGrid from './components/CSSGrid.vue';

export default {
  components: {
    // FlexboxLayout
    CSSGrid
  }
};
</script>

<style>
/* Global styles (if any) */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}
</style>
