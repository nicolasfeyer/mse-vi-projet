<template>
  <div style='width:100%; height:100%; padding:100px 50px;'>
    <b-row style='padding: 20px;'>
      <b-col v-for="country in countrySelect" :key="country">
        <b-button variant="outline-primary" @click="removeCountry(country)">{{ data[1990][country].country }} X
        </b-button>
      </b-col>
    </b-row>
    <b-form-select :disabled="disabledCountrySelect" class="form-control mt-3" style="width: 20%;display: initial;"
                   v-model="countrySelected"
                   :options="countryData"
                   @change="newCountry"></b-form-select>
    <la-cartesian v-if="countrySelect.length > 0" autoresize :height="windowHeight" :data="values">
      <la-line v-for="(country, index) in countrySelect" :width="2" dashed dot animated curve :label="isoToName[country]"
               :prop="isoToName[country]" :key="`country-${index}`"/>
      <la-x-axis prop="name" class="x-axis-style"></la-x-axis>
      <la-y-axis :format="formatLegend"></la-y-axis>
      <la-tooltip></la-tooltip>
      <la-legend selectable></la-legend>
      <la-y-marker dashed :value="0" label="0"></la-y-marker>
    </la-cartesian>
  </div>
</template>

<script>
import Vue from 'vue';
import {Laue} from 'laue';

Vue.use(Laue);

export default {
  props: ['data', 'country', 'dataType', 'isoToName'],
  watch: {
    dataType() {
      this.drawGraph();
    }
  },
  data: () => ({
    values: [],
    windowHeight: window.innerHeight - 300,
    countrySelect: [],
    countrySelected: null,
    disabledCountrySelect: false,
    switch: false,
    countryData: null
  }),
  methods: {
    drawGraph() {
      this.values = [];
      if (this.dataType === 'migration_perc' || this.dataType === "net_migration") {
        for (let i = 1962; i < 2019; i = i + 5) {
          this.values.push(this.getCountryData(i));
        }
      } else {
        for (let i = 1960; i < 2019; i++) {
          this.values.push(this.getCountryData(i));
        }
      }
    },
    getCountryData(i) {
      let val = {name: i}
      this.countrySelect.forEach(selectedElem => {
        val[this.isoToName[selectedElem]] = this.data[i][selectedElem][this.dataType];
      })
      return val
    },
    getFreeCountry() {
      let free = [];
      for (let element in this.data[1990]) {
        let test = true;
        this.countrySelect.forEach(selectedElem => {
          if (element === selectedElem) {
            test = false;
          }
        })
        if (test) {
          free.push({value: element, text: this.data[1990][element].country});
        }
      }
      return free;
    },
    newCountry() {
      if (this.countrySelected) {
        this.countrySelect.push(this.countrySelected)
        this.countrySelected = null
        if (this.countrySelect.length > 4) {
          this.disabledCountrySelect = true
        }
        this.countryData = this.getFreeCountry()
        this.countryData.push({value: null, text: 'Add a country'})
      }
      this.drawGraph()

    },
    removeCountry(elem) {
      this.countrySelect.splice(this.countrySelect.indexOf(elem), 1);
      this.disabledCountrySelect = false
      this.countryData = this.getFreeCountry()
      this.countryData.push({value: null, text: 'Add a country'})
      this.drawGraph()
    },
    formatLegend(v) {
      if (this.dataType == 'population') {
        if (v / 10000 % 2 == 0) {
          return "";
        }
      }
      let exp = Math.round(Math.log10(Math.abs(v)))
      if (exp >= 9) {
        return "" + Math.round((v / 1000000000) * 10) / 10 + "B";
      } else if (exp >= 6) {
        return "" + Math.round((v / 1000000) * 10) / 10 + "M";
      } else if (exp >= 3) {
        return "" + Math.round((v / 1000) * 10) / 10 + "k";
      }
      if (this.dataType == 'migration_perc') {
        return Math.round((v) * 100) + "%";
      } else {
        return Math.round((v) * 10) / 10;
      }
    }
  },
  mounted() {
    this.countrySelect.push(this.country)
    this.drawGraph()
    this.countryData = this.getFreeCountry()
    this.countryData.push({value: null, text: 'Add a country'})
  }
};
</script>

<style>
.x-axis-style text {
  transform-box: fill-box;
  transform-origin: center;
  transform: translate(10px, 5px) rotate(45deg);
}
</style>