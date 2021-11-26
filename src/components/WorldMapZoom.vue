<template>
  <div style="width: 100%; height: 100%;">
    <div style="border-style: solid; border-color: #333333; border-width: 1px; width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; z-index: 0;">
        <SvgMap
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
    <!-- Bouton de selection d'affichage -->
    <div class="justify-content-md-center" style="position: absolute; top:0px; width:100%">
      <b-row class="justify-content-md-center">
        <b-col col >
          <b-card style="border: none; background-color: rgba(0,0,0,0)">
            <b-button pill variant="outline-secondary" :class="{ top_but: !isActiveBut['population'], top_but_select: isActiveBut['population'] }" @click="changeData('population')">population</b-button>
            <b-button pill variant="outline-secondary" :class="{ top_but: !isActiveBut['pop_density'], top_but_select: isActiveBut['pop_density'] }" @click="changeData('pop_density')">pop_density</b-button>
            <b-button pill variant="outline-secondary" :class="{ top_but: !isActiveBut['net_migration'], top_but_select: isActiveBut['net_migration'] }" @click="changeData('net_migration')">net_migration</b-button>
            <b-button pill variant="outline-secondary" :class="{ top_but: !isActiveBut['migration_perc'], top_but_select: isActiveBut['migration_perc'] }" @click="changeData('migration_perc')">migration_perc</b-button>
            <b-button pill variant="outline-secondary" :class="{ top_but: !isActiveBut['incomeLevel'], top_but_select: isActiveBut['incomeLevel'] }" @click="changeData('incomeLevel')">incomeLevel</b-button>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <!-- Titre du pays en haut de la page -->
    <div class="justify-content-md-center">
      <b-row class="justify-content-md-center">
        <b-col col lg="3">
          <b-card>
            <h2>{{overCountryName}}</h2>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <!-- Slider année -->
    <div class="justify-content-md-center" style="position: absolute; bottom:10px; width:100%">
      <b-row class="justify-content-md-center">
        <b-col col lg="3">
          <b-card :title="yearSelect" sub-title="Move cursor to change year">
            <b-form-input id="range-1" v-model="yearSelect" @change.native="drawMap" type="range" min="1960" max="2018" style="width: 200px;"></b-form-input>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <!-- Légende -->
    <div v-if="!isActiveBut['incomeLevel']" class="justify-content-md-center" style="position: absolute; left:10px; bottom:130px; width:110px">
      <b-container>
          <b-card class="legend_card">
            <span>Legend</span>
            <b-row v-if="!isActiveBut['migration_perc'] && !isActiveBut['net_migration']">
              <b-col cols="5" style="display: flex; justify-content: end; padding: 3px;">
                <div style="width: 20px; height: 200px; background: linear-gradient(hsl(100, 50%, 50%), hsl(0, 50%, 50%));"></div>
              </b-col>
              <b-col cols="7" style="padding: 3px;">
                <div style="height: 200px; width: 40px; display: flex; flex-direction: column; justify-content: space-between; align-content:left">
                  <div class="legend_value">&#60; {{legendScale[0]}}</div>
                  <div class="legend_value">{{legendScale[1]}}</div>
                  <div class="legend_value">{{legendScale[2]}}</div>
                  <div class="legend_value">{{legendScale[3]}}</div>
                  <div class="legend_value">>{{legendScale[4]}}</div>
                </div>
            </b-col>
            </b-row>
            <b-row v-if="isActiveBut['migration_perc'] || isActiveBut['net_migration']">
              <b-col cols="5" style="display: flex; justify-content: end; padding: 3px;">
                <div style="width: 20px; height: 200px; background: linear-gradient(hsl(0, 70%, 50%), hsl(0, 0%, 50%), hsl(100, 70%, 50%));"></div>
              </b-col>
              <b-col cols="7" style="padding: 3px;">
                <div style="height: 200px; width: 40px; display: flex; flex-direction: column; justify-content: space-between; align-content:left">
                  <div class="legend_value">&#60; -{{legendScale[4]}}</div>
                  <div class="legend_value">-{{legendScale[2]}}</div>
                  <div class="legend_value">{{legendScale[0]}}</div>
                  <div class="legend_value">{{legendScale[2]}}</div>
                  <div class="legend_value">>{{legendScale[4]}}</div>
                </div>
            </b-col>
            </b-row>
          </b-card>
      </b-container>
    </div>
    <div v-if="isActiveBut['incomeLevel']" class="justify-content-md-center" style="position: absolute; left:10px; bottom:130px; width:110px">
      <b-container>
          <b-card class="legend_card">
            <span>Legend</span>
            <b-row>
              <b-col cols="5" style="display: flex; justify-content: end; padding: 3px;">
                <div style="height: 200px; display: flex; flex-direction: column; justify-content: space-between; align-content:right">
                  <div style="width: 20px; height: 20px; background-color: hsl(0, 50%, 50%);"></div>
                  <div style="width: 20px; height: 20px; background-color: hsl(40, 50%, 50%);"></div>
                  <div style="width: 20px; height: 20px; background-color: hsl(60, 50%, 50%);"></div>
                  <div style="width: 20px; height: 20px; background-color: hsl(100, 50%, 50%);"></div>
                </div>
              </b-col>
              <b-col cols="7" style="padding: 3px;">
                <div style="height: 200px; width: 40px; display: flex; flex-direction: column; justify-content: space-between; align-content:left">
                  <div class="legend_value">Low</div>
                  <div class="legend_value">Lower <br>middle</div>
                  <div class="legend_value">Upper <br>middle</div>
                  <div class="legend_value">High</div>
                </div>
            </b-col>
            </b-row>
          </b-card>
      </b-container>
    </div>
    <!-- SideBar -->
    <b-sidebar v-model="isSidebarOpen" id="sidebar-right" :title=clickCountryName right shadow>
      <div class="px-3 py-2">
        <b-img :src=clickCountryPic fluid thumbnail></b-img>
        <span v-html="clickCountryDescription"></span> 
      </div>
    </b-sidebar>
      
  </div>
  
</template>

<script>
import SvgMap from 'vue-simple-svg-map'
import map from '@svg-maps/world'

import json from '../assets/worldData.json'

//const lightGrey =  "#aaaaaa";
const black = "hsl(100, 60%, 0%)";
const noDataGrey = "hsl(100, 0%, 10%)";
const whiteBorder = "#eeeeee";

export default {
  name: "WorldMapZoom",
  components: {
    SvgMap
  },
  mounted() {
    map.locations = map.locations.map(function (row) {
      let color = noDataGrey; //'#'+(Math.random()*0xFFFFFF<<0).toString(16);
      return {name: row.name, id: row.id, d: row.path, stroke: whiteBorder, fill: color}
    })
  },
  data() {
    return {
      worldData: json,
      yearSelect: "2018",
      map,
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
      clickCountryName: "",
      clickCountryDescription: "",
      clickCountryPic: "",
      isSidebarOpen: false,
      legendScale: [0, 25, 50, 75, 100],
      scaleFactor: {"population":0.000000071801426, "pop_density":0.2, "net_migration":0.000002139450587, "migration_perc":500, "incomeLevel":1},
      logBool: {"population":true, "pop_density":true, "net_migration":true, "migration_perc":false, "incomeLevel":false},  
      isActiveBut: {"population":false, "pop_density":false, "net_migration":false, "migration_perc":false, "incomeLevel":false},
      padding: {"population":3893, "pop_density":10, "net_migration":0, "migration_perc":0, "incomeLevel":0},
      added: {"population":0, "pop_density":0, "net_migration":5, "migration_perc":5, "incomeLevel":0}
    }
  },
  methods:{
    /* --------------------------
     happends when mouse goes over a country
     - change its color and border to a lighter gray
     - display its name on top of window
    --------------------------*/
     overCountry: function(elem) {
       if(this.overCountryElem == null && elem.name != this.clickCountryName){
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
    leaveCountry: function(elem) {
      if(this.overCountryElem != null && elem.name != this.clickCountryName && this.overCountryElem.name != this.clickCountryName){
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
    clickCountry: function(elem) {
      this.clickCountryElem = elem;
      this.clickCountryName = elem.name;
      this.drawMap();
      this.loadSidebarData();
      this.overCountryElem = null;
      this.isSidebarOpen = true
    },

    loadSidebarData: function() {
      if(this.clickCountryElem){
        let clickCountryData = this.worldData[this.yearSelect][this.clickCountryElem.id.toUpperCase()];
        this.clickCountryDescription = this.printDescription(clickCountryData);
        this.clickCountryPic = "https://www.worldometers.info/img/flags/" + this.clickCountryElem.id + "-flag.gif" //"https://en.wikipedia.org/wiki/File:Flag_of_" + this.clickCountryName + ".svg";
        this.clickCountryElem.stroke = whiteBorder;
        this.clickCountryElem.fill = "blue";
      }
    },

    changeData: function(dataType){
      (this.dataType != "") ? this.isActiveBut[this.dataType] = false : "";
      this.dataType = (this.dataType == dataType) ? "" : dataType;
      (this.dataType != "") ? this.isActiveBut[this.dataType] = true : "";
      this.drawMap();
    },

    drawMap: function(){
      map.locations.forEach(element => {
            element.stroke = whiteBorder;
            try {
              element.fill = this.getColor(this.yearSelect, element.id.toUpperCase(), this.dataType, this.scaleFactor[this.dataType], true, this.logBool[this.dataType], this.padding[this.dataType], this.added[this.dataType]);
            } catch {
              element.fill = noDataGrey;
            }
      });
      this.updateLegend(this.scaleFactor[this.dataType], this.logBool[this.dataType], this.padding[this.dataType]);
      this.loadSidebarData()
    },

    getColor: function(year, country, type, factor, reverse, log, padding, added) {
      if (type == "incomeLevel"){
        return this.getColorForIncome(year, country, type);
      }
      if (type == "migration_perc" || type == "net_migration"){
        return this.getColorForNeg(year, country, type, factor, reverse, log, padding, added);
      }
      let color_val = parseFloat(this.worldData[year][country][type]);
      if(!color_val){
        return noDataGrey;
      }
      color_val -= padding;
      if(color_val < 0){
        color_val = 0;
      }
      color_val *= factor;
      if(log) {
        color_val = (Math.log2(color_val + 2) - 1) * (100/(Math.log2(100)));
      }
      color_val += added;
      if (color_val > 100){
        color_val = 100;
      }
      if(reverse) {
        color_val = 100 - color_val;
      }
      return "hsl(" + color_val + ", 50%, 50%)";
    },

    getColorForIncome: function(year, country, type) {
      let color_val = this.worldData[year][country][type];
        if(!color_val){
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
          default:
            console.log("default" + color_val + " " + country);
        }
        return "hsl(" + color + ", 50%, 50%)";
    },

    getColorForNeg: function(year, country, type, factor, reverse, log, padding, added){
      let color_val = parseFloat(this.worldData[year][country][type]);
      if(!color_val){
        return noDataGrey;
      }
      let signcolor = 100;
      if(color_val < 0){
        color_val = -color_val;
        signcolor = 0;
      }
      color_val -= padding;
      if(color_val < 0){
        color_val = 0;
      }
      color_val *= factor;
      if(log) {
        color_val = (Math.log2(color_val + 2) - 1) * (100/(Math.log2(100)));
      }
      color_val += added;
      if (color_val > 100){
        color_val = 100;
      }
      /*if(reverse) {
        color_val = 100 - color_val;
      }*/
      return "hsl(" + signcolor + ", "+color_val+"%, 50%)";
    },

    updateLegend: function(factor, log, padding) {
      if (log) {
        this.legendScale[0] = ((Math.pow(2, ((0)+1)) - 2)/factor + padding);
        this.legendScale[1] = ((Math.pow(2, ((25/100*Math.log2(100))+1)) - 2) /factor + padding);
        this.legendScale[2] = ((Math.pow(2, ((50/100*Math.log2(100))+1)) - 2) /factor + padding);
        this.legendScale[3] = ((Math.pow(2, ((75/100*Math.log2(100))+1)) - 2) /factor + padding);
        this.legendScale[4] = ((Math.pow(2, ((100/100*Math.log2(100))+1)) - 2) /factor + padding);
      } else {
        this.legendScale[0] = ((0/factor) + padding);
        this.legendScale[1] = ((25/factor) + padding);
        this.legendScale[2] = ((50/factor) + padding);
        this.legendScale[3] = ((75/factor) + padding);
        this.legendScale[4] = ((100/factor) + padding);
      }
      if(this.dataType == "migration_perc"){
        this.legendScale[0] *= 100;
        this.legendScale[1] *= 100;
        this.legendScale[2] *= 100;
        this.legendScale[3] *= 100;
        this.legendScale[4] *= 100;
      }
      this.legendScale[0] = this.legendScale[0].toFixed(0);
      this.legendScale[1] = this.legendScale[1].toFixed(0);
      this.legendScale[2] = this.legendScale[2].toFixed(0);
      this.legendScale[3] = this.legendScale[3].toFixed(0);
      this.legendScale[4] = this.legendScale[4].toFixed(0);
    },

    printDescription: function(data) {
        let descriptionHTML = '<div class="description_row"><span>Capital : </span><span style="font-weight: 900;">' + data["capitalCity"] + "</span></div>";
        descriptionHTML += '<div class="description_row"><span> </span><span style="color: #666666">(' + data["latitude"] + ", " + data["longitude"] + ")</span></div>";
        descriptionHTML += '<div class="description_row"><span>Region : </span><span style="font-weight: 900;">' + data["region"] + "</span></div>";
        descriptionHTML += '<div class="description_row"><span>Income Level : </span><span style="font-weight: 900;">' + data["incomeLevel"] + "</span></div>";
        descriptionHTML += '<div class="description_row"><span>Population : </span><span style="font-weight: 900;">' + data["population"] + "</span></div>";
        descriptionHTML += '<div class="description_row"><span>Population Density : </span><span style="font-weight: 900;">' + data["pop_density"] + "</span></div>";
        descriptionHTML += '<div class="description_row"><span>Net Migration : </span><span style="font-weight: 900;">' + data["net_migration"] + "</span></div>";
        descriptionHTML += '<div class="description_row"><span>Migration perc : </span><span style="font-weight: 900;">' + data["migration_perc"] + "</span></div>";
        descriptionHTML += "<br>Cras mattis consectetur purus sit amet fermentum.<br> Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</div>";
        return descriptionHTML;
    }
 }
}

</script>

<style scoped>
.simple-svg-map__content{
  display: none;
}

</style>

<style>
.description_row{
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
.top_but{
  margin-left: 5px;
  margin-right: 5px;
  background-color: #ffffff !important;
  color: #555555 !important;
}
.top_but:hover{
  background-color: #555555 !important;
  color: #ffffff !important;
}
.top_but_select{
  margin-left: 5px;
  margin-right: 5px;
  background-color: #555555 !important;
  color: #ffffff !important;
}
</style>