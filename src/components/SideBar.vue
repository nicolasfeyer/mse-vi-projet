<template>
  <b-sidebar v-model="isOpenLocal" id="sidebar-right" :title="this.countryData['country']" right shadow
             @change="updateIsOpen">
    <div class="px-3 py-2">
      <country-flag :country="this.countryData['iso3c'].toLowerCase()" size='big' :shadow="true"/>
      <div v-if='this.countryData["capitalCity"]' class="description_row">
        <span style="font-weight: 900;">Capital : </span>
        <span>{{ this.countryData["capitalCity"] }}</span>
      </div>
      <div v-if='this.countryData["latitude"] && this.countryData["longitude"]' class="description_row">
        <span style="color: #666666; margin-left:auto">
          {{ this.countryData["latitude"].toLocaleString(undefined,{ minimumFractionDigits: 5 }) }}, {{this.countryData["longitude"].toLocaleString(undefined,{ minimumFractionDigits: 5 }) }}
        </span>
      </div>
      <div v-if='this.countryData["region"]' class="description_row">
        <span style="font-weight: 900;">Region : </span>
        <span>{{ this.countryData["region"] }}</span>
      </div>
      <div v-if='this.countryData["incomeLevel"]' class="description_row">
        <span style="font-weight: 900;">Income Level : </span>
        <span>{{ this.countryData["incomeLevel"] }}</span>
      </div>
      <div v-if='this.countryData["population"]' class="description_row">
        <span style="font-weight: 900;">Population : </span>
        <span>{{ this.countryData["population"].toLocaleString(undefined,{ minimumFractionDigits: 0 }) }}</span>
      </div>
      <div v-if='this.countryData["pop_density"]' class="description_row">
        <span style="font-weight: 900;">Population Density : </span>
        <span>{{ this.countryData["pop_density"].toLocaleString(undefined,{ minimumFractionDigits: 5 }) }}</span>
      </div>
      <div v-if='this.countryData["net_migration"]' class="description_row">
        <span style="font-weight: 900;">Net Migration : </span>
        <span>{{ this.countryData["net_migration"] }}</span>
      </div>
      <div v-if="this.countryData['migration_perc']" class="description_row">
        <span style="font-weight: 900;">Migration perc : </span>
        <span>{{ this.countryData["migration_perc"] }}</span>
      </div>
    </div>
  </b-sidebar>
</template>

<script>
import CountryFlag from 'vue-country-flag'

export default {
  name: "CountryDescription",
  props: ["countryData", "isOpen", "onChange"],
  components: {
    CountryFlag
  },
  methods: {
    updateIsOpen() {
      this.$emit('change', this.isOpenLocal);
    }
  },
  mounted() {
    this.isOpenLocal = this.isOpen
  },
  watch: {
    isOpen: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        this.isOpenLocal = val
      }
    }
  },
  data() {
    return {
      countryISO3166_3: null,
      isOpenLocal: false
    }
  },
}
</script>

<style scoped>

</style>