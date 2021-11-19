<template>
  <SvgMap
      :map="map.locations"
      :wrapper-styles="{position: 'relative', width: '100%', height: '100vh'}"
      view-box="0 0 1000 1000"
      :thin-border-on-zoom="true"
  />
</template>

<script>
import SvgMap from 'vue-simple-svg-map'
import map from '@svg-maps/world'

export default {
  name: "WorldMapZoom",
  components: {
    SvgMap
  },
  mounted() {
    map.locations = map.locations.map(function (row) {

      return {name: row.name, id: row.id, d: row.path}
    })
    console.log(map.locations[0]);
  },
  data() {
    return {
      map
    }
  }
}

</script>

<style scoped>
.simple-svg-map__content{
  display: none;
}
</style>