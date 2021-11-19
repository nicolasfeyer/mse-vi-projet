<template>
  <div id="app">
    <!--    <WorldMap/>-->
    <WorldMapZoom/>
    <!--    <VueHorizontalTimeline :items="items"/>-->
  </div>
</template>

<script>
//import WorldMap from "@/components/WorldMap";
import WorldMapZoom from "@/components/WorldMapZoom";
//import VueHorizontalTimeline from "vue-horizontal-timeline";

export default {
  name: 'App',
  components: {
    //WorldMap,
    WorldMapZoom,
    //VueHorizontalTimeline
  },
  data() {
    const example1 = {
      title: "Title example 1",
      content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio.",
    };
    const example2 = {
      title: "Title example 2",
      content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio.",
    };
    const example3 = {
      title: "Title example 3",
      content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio.",
    };
    const example4 = {
      title: "Title example 1",
      content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio.",
    };
    const example5 = {
      title: "Title example 2",
      content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio.",
    };
    const example6 = {
      title: "Title example 3",
      content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ex dolor, malesuada luctus scelerisque ac, auctor vitae risus. Vivamus risus dolor, faucibus a bibendum quis, facilisis eget odio.",
    };
    const items = [example1, example2, example3, example4, example5, example6];

    return {items};
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
