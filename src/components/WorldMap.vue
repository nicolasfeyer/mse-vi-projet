<template>
  <MapChart
      :countryData="{'US': 4, 'CA': 7, 'GB': 8, 'IE': 14, 'ES': 21}"
      highColor="#ff0000"
      lowColor="#aaaaaa"
      countryStrokeColor="#909090"
      defaultCountryFillColor="#dadada"
  />
</template>

<script>
import MapChart from 'vue-map-chart'

export default {
  name: "WorldMap",
  data: function () {
    return {
      showMapOverlay: false
    }
  },
  components: {
    MapChart
  },
  methods: {
/*    onMouseEnterMapCountry(countryCode) {
      this.showMapOverlay = true
      console.log(countryCode);
      // Update your data/property to be displayed on the overlay.
    },
    onMouseLeaveMapCountry() {
      this.showMapOverlay = false
    },
    onClickMapCountry(data) {
      console.log('Click Country', data)
    },*/
  }

}
</script>

<style scoped>

</style>