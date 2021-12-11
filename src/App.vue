<template>
  <div id="app">
    <WorldMapZoom />
  </div>
</template>

<script>
import WorldMapZoom from "@/components/WorldMapZoom";

export default {
  name: 'App',
  components: {
    WorldMapZoom,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
