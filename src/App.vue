<template>
  <div id="app">
    <Org :dataSource="orgData" />
  </div>
</template>

<script>
import Org from './components/Org.vue';
import treeData from './treeData';

export default {
  name: 'App',
  components: {
    Org,
  },
  data() {
    return {
      orgData: treeData,
    };
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
}
</style>
