<template>
  <div style="width: 100%; height: 100%;">
    <div v-if="!showGraphFull && !showGraphCountry"
         style="border-style: solid; border-color: #333333; border-width: 1px; width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; z-index: 0;">
      <SvgMap class="map"
              :map="map.locations"
              :wrapper-styles="{position: 'relative', width: '100%', height: '100%'}"
              view-box="0 -100 1000 1000"
              :zoom-factor="zoomFactor"
              :min-size="minSize"
              :max-size="maxSize"
              :size="sizeOnStart"
              :thin-border-on-zoom="thinBorder"
              :min-thin-border="minBorder"
              :max-thin-border="maxBorder"
              @mouseover="overCountry"
              @mouseleave="leaveCountry"
              @click="clickCountry"
      />
    </div>
    <div v-if="showGraphCountry" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0;">
      <WorldChart :data='worldData' :country='"CH"' :dataType='dataType'/>
    </div>
    <div v-if="showGraphFull" style="width: 100%; height: 100%; position: fixed; top: 0; left: 0;">
      <WorldFullChart :data='worldData' :year='yearSelect'/>
    </div>
    <!-- Bouton de selection d'affichage -->
    <div v-if="!showGraphFull" class="justify-content-md-center" style="position: absolute; top:0; width:100%">
      <b-row class="justify-content-md-center">
        <b-col col>
          <b-card style="border: none; background-color: rgba(0,0,0,0)">
            <b-button v-shortkey="['1']" pill variant="outline-secondary" @shortkey="changeData('population')"
                      :class="{ top_but: !isActiveBut['population'], top_but_select: isActiveBut['population'] }"
                      @click="changeData('population')">Population
            </b-button>
            <b-button v-shortkey="['2']" pill variant="outline-secondary" @shortkey="changeData('pop_density')"
                      :class="{ top_but: !isActiveBut['pop_density'], top_but_select: isActiveBut['pop_density'] }"
                      @click="changeData('pop_density')">Population density
            </b-button>
            <b-button v-shortkey="['3']" pill variant="outline-secondary" @shortkey="changeData('net_migration')"
                      :class="{ top_but: !isActiveBut['net_migration'], top_but_select: isActiveBut['net_migration'] }"
                      @click="changeData('net_migration')">Net migration
            </b-button>
            <b-button v-shortkey="['4']" pill variant="outline-secondary" @shortkey="changeData('migration_perc')"
                      :class="{ top_but: !isActiveBut['migration_perc'], top_but_select: isActiveBut['migration_perc'] }"
                      @click="changeData('migration_perc')">Migration percentage
            </b-button>
            <b-button v-if="!showGraphCountry" v-shortkey="['5']" pill variant="outline-secondary"
                      @shortkey="changeData('incomeLevel')"
                      :class="{ top_but: !isActiveBut['incomeLevel'], top_but_select: isActiveBut['incomeLevel'] }"
                      @click="changeData('incomeLevel')">Income Level
            </b-button>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <!-- Bouton de changement de vue -->
    <div class="justify-content-md-center" style="position: absolute; top:0px; right:10px ">
      <b-card style="border: none; background-color: rgba(0,0,0,0)">
        <b-button pill variant="outline-secondary"
                  :class="{ top_but: !showGraphCountry, top_but_select: showGraphCountry }"
                  @click="switchShowGraphCountry">Graph Country
        </b-button>
        <b-button pill variant="outline-secondary" :class="{ top_but: !showGraphFull, top_but_select: showGraphFull }"
                  @click="switchShowGraphFull">Graph Full
        </b-button>
      </b-card>
    </div>
    <!-- Titre du pays en haut de la page -->
    <div v-if="!showGraphFull && !showGraphCountry" class="justify-content-md-center">
      <b-row class="justify-content-md-center">
        <b-col col lg="3">
          <b-card>
            <h2>{{ overCountryName }}</h2>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <!-- Slider année -->
    <Slider v-if="dataType != 'incomeLevel'" :showGraph="showGraphCountry" :yearSelect="yearSelect" :drawMap="drawMap"
            :dataType='dataType' @changeYear="changeYear"></Slider>
    <!-- Légende -->
    <Legend :isActiveBut="isActiveBut" :legendScale="legendScale"
            :showGraph="showGraphCountry || showGraphFull"></Legend>
    <!-- SideBar -->
    <SideBar v-if="this.clickedCountryData && !showGraphFull && !showGraphCountry" :isOpen.sync="isSidebarOpen"
             @change="changeIsOpen"
             :countryData="this.clickedCountryData"></SideBar>
  </div>

</template>

<script>
import SvgMap from 'vue-simple-svg-map'
import map from '@svg-maps/world'
import Legend from "@/components/Legend";
import SideBar from "@/components/SideBar";
import Slider from "@/components/Slider";
import WorldChart from "@/components/WorldChart";
import WorldFullChart from "@/components/WorldFullChart";

import json from '../assets/worldData.json'

//const lightGrey =  "#aaaaaa";
const black = "hsl(100, 60%, 0%)";
const noDataGrey = "hsl(100, 0%, 10%)";
const whiteBorder = "#eeeeee";

export default {
  name: "WorldMapZoom",
  components: {
    Slider,
    SvgMap,
    WorldChart,
    WorldFullChart,
    SideBar,
    Legend
  },
  mounted() {
    map.locations = map.locations.map((row) => {
      return {name: row.name, id: row.id, d: row.path, stroke: whiteBorder, fill: noDataGrey}
    })
    this.changeData("population");
  },
  data() {
    return {
      worldData: json,
      yearSelect: 2018,
      map,
      showGraphFull: false,
      showGraphCountry: false,
      zoomFactor: 0.8,
      minSize: 1000,
      maxSize: 15000,
      sizeOnStart: 1300,
      thinBorder: true,
      minBorder: 1,
      maxBorder: 1,
      dataType: "",
      selectedCountryID: null,
      overCountryID: -1,
      overCountryName: "World",
      overCountryElem: null,
      clickCountryElem: null,
      clickedCountryData: null,
      clickCountryName: "",
      clickCountryDescription: "",
      clickCountryPic: "",
      isSidebarOpen: false,
      legendScale: [0, 25, 50, 75, 100],
      scaleFactor: {
        "population": 0.000000071801426,
        "pop_density": 0.2,
        "net_migration": 0.000002139450587,
        "migration_perc": 500,
        "incomeLevel": 1
      },
      logBool: {
        "population": true,
        "pop_density": true,
        "net_migration": true,
        "migration_perc": false,
        "incomeLevel": false
      },
      isActiveBut: {
        "population": true,
        "pop_density": false,
        "net_migration": false,
        "migration_perc": false,
        "incomeLevel": false
      },
      padding: {"population": 3893, "pop_density": 10, "net_migration": 0, "migration_perc": 0, "incomeLevel": 0},
      added: {"population": 0, "pop_density": 0, "net_migration": 5, "migration_perc": 5, "incomeLevel": 0}
    }
  },
  methods: {
    switchShowGraphCountry() {
      this.showGraphFull = false;
      this.showGraphCountry = !this.showGraphCountry;
    },
    switchShowGraphFull() {
      this.showGraphCountry = false;
      this.changeData('net_migration');
      this.showGraphFull = !this.showGraphFull;
    },
    changeIsOpen(val) {
      this.isSidebarOpen = val;
    },
    changeYear(val) {
      this.yearSelect = val;
      this.clickedCountryData = this.worldData[this.yearSelect][this.clickCountryElem];
      this.drawMap();
    },
    /* --------------------------
     happends when mouse goes over a country
     - change its color and border to a lighter gray
     - display its name on top of window
    --------------------------*/
    overCountry(elem) {
      if (this.overCountryElem == null && elem.name != this.clickCountryName) {
        this.overCountryElem = JSON.parse(JSON.stringify(elem));
        //removing old elem
        this.overCountryID = map.locations.indexOf(elem);
        if (this.overCountryID > -1) {
          map.locations.splice(this.overCountryID, 1);
        }
        this.overCountryName = this.overCountryElem.name;
        this.overCountryElem.stroke = black;

        map.locations.push(this.overCountryElem);
        this.overCountryID = map.locations.indexOf(this.overCountryElem);
      }
    },
    /* --------------------------
     happends when mouse leaves a country
     - put back the previous elem
     - remove display name
    --------------------------*/
    leaveCountry(elem) {
      if (this.overCountryElem != null && elem.name != this.clickCountryName && this.overCountryElem.name != this.clickCountryName) {
        this.overCountryElem.stroke = whiteBorder;
        this.overCountryName = "World";
        this.overCountryElem = null;
      }
    },
    /* --------------------------
     happends when mouse click on a country
     - change its color and border to blue
     - display sidebar with info
    --------------------------*/
    clickCountry(elem) {
      this.clickedCountryData = this.worldData[this.yearSelect][elem.id.toUpperCase()]
      this.clickCountryElem = elem.id.toUpperCase();
      this.drawMap();
      this.overCountryElem = null;
      this.isSidebarOpen = true
      elem.stroke = whiteBorder;
      elem.fill = "blue";
    },
    changeData(dataType) {
      (this.dataType != "") ? this.isActiveBut[this.dataType] = false : "";
      this.dataType = dataType
      this.isActiveBut[this.dataType] = true
      this.drawMap();
    },
    drawMap() {
      map.locations.forEach(element => {
        element.stroke = whiteBorder;
        try {
          element.fill = this.getColor(this.yearSelect, element.id.toUpperCase(), this.dataType, this.scaleFactor[this.dataType], true, this.logBool[this.dataType], this.padding[this.dataType], this.added[this.dataType]);
        } catch {
          element.fill = noDataGrey;
        }
      });
      this.updateLegend(this.scaleFactor[this.dataType], this.logBool[this.dataType], this.padding[this.dataType]);
      //this.loadSidebarData()
    },
    getColor(year, country, type, factor, reverse, log, padding, added) {
      if (type == "incomeLevel") {
        return this.getColorForIncome(year, country, type);
      }
      if (type == "migration_perc" || type == "net_migration") {
        return this.getColorForNeg(year, country, type, factor, reverse, log, padding, added);
      }
      let color_val = parseFloat(this.worldData[year][country][type]);
      if (!color_val) {
        return noDataGrey;
      }
      color_val -= padding;
      if (color_val < 0) {
        color_val = 0;
      }
      color_val *= factor;
      if (log) {
        color_val = (Math.log2(color_val + 2) - 1) * (100 / (Math.log2(100)));
      }
      color_val += added;
      if (color_val > 100) {
        color_val = 100;
      }
      if (reverse) {
        color_val = 100 - color_val;
      }
      return "hsl(" + color_val + ", 50%, 50%)";
    },
    getColorForIncome(year, country, type) {
      let color_val = this.worldData[year][country][type];
      if (!color_val) {
        return noDataGrey;
      }
      let color = 310
      switch (color_val) {
        case 'Low income':
          color = 0;
          break;
        case 'Lower middle income':
          color = 40;
          break;
        case 'Upper middle income':
          color = 60;
          break;
        case 'High income':
          color = 100;
          break;
      }
      return "hsl(" + color + ", 50%, 50%)";
    },
    getColorForNeg(year, country, type, factor, reverse, log, padding, added) {
      let color_val = parseFloat(this.worldData[year][country][type]);
      if (!color_val) {
        return noDataGrey;
      }
      let signColor = 100;
      if (color_val < 0) {
        color_val = -color_val;
        signColor = 0;
      }
      color_val -= padding;
      if (color_val < 0) {
        color_val = 0;
      }
      color_val *= factor;
      if (log) {
        color_val = (Math.log2(color_val + 2) - 1) * (100 / (Math.log2(100)));
      }
      color_val += added;
      if (color_val > 100) {
        color_val = 100;
      }
      /*if(reverse) {
        color_val = 100 - color_val;
      }*/
      return "hsl(" + signColor + ", " + color_val + "%, 50%)";
    },
    updateLegend(factor, log, padding) {
      const num = [0, 25, 50, 75, 100];
      if (log) {
        for (let i = 0; i < 5; i++) {
          this.legendScale[i] = ((Math.pow(2, ((num[i] / 100 * Math.log2(100)) + 1)) - 2) / factor + padding);
        }
      } else {
        for (let i = 0; i < 5; i++) {
          this.legendScale[i] = ((num[i] / factor) + padding);
        }
      }
      if (this.dataType === "migration_perc") {
        for (let i = 0; i < 5; i++) {
          this.legendScale[i] *= 100;
        }
      }
      for (let i = 0; i < 5; i++) {
        this.legendScale[i] = this.roundLegend(this.legendScale[i].toFixed(0));
      }
    },

    roundLegend(v) {
      let exp = Math.round(Math.log10(Math.abs(v)))
      if (exp >= 9) {
        return "" + Math.round((v / 1000000000) * 10) / 10 + "B";
      } else if (exp >= 6) {
        return "" + Math.round((v / 1000000) * 10) / 10 + "M";
      } else if (exp >= 3) {
        return "" + Math.round((v / 1000) * 10) / 10 + "k";
      }
      if (this.dataType === 'migration_perc') {
        return Math.round((v)) + "%";
      } else {
        return Math.round((v) * 10) / 10;
      }
    }
  }
}


</script>

<style scoped>
.simple-svg-map__content {
  display: none;
}

</style>

<style>
.map path {
  transform-box: fill-box;
  transform-origin: center center;
  transition: transform 1.1s;
}

.map path:hover {
  transform: scale(1.1);
}

.description_row {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.legend_card .card-body {
  padding: 10px 0px;
}

.legend_card .legend_value {
  text-align: start;
  overflow: revert;
  white-space: nowrap;
}

.top_but {
  margin-left: 5px;
  margin-right: 5px;
  background-color: #ffffff !important;
  color: #555555 !important;
}

.top_but:hover {
  background-color: #555555 !important;
  color: #ffffff !important;
}

.top_but_select {
  margin-left: 5px;
  margin-right: 5px;
  background-color: #555555 !important;
  color: #ffffff !important;
}
</style>