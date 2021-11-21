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
    <div class="justify-content-md-center">
      <b-row class="justify-content-md-center">
        <b-col col lg="3">
          <b-card :title="overCountryName" sub-title="Subtitle">
          </b-card>
        </b-col>
      </b-row>
    </div>
    <div class="justify-content-md-center" style="position: absolute; bottom:10px; width:100%">
      <b-row class="justify-content-md-center">
        <b-col col lg="3">
          <b-card :title="yearSelect" sub-title="Move cursor to change year">
            <b-form-input id="range-1" v-model="yearSelect" type="range" min="1960" max="2018" style="width: 200px;"></b-form-input>
          </b-card>
        </b-col>
      </b-row>
    </div>
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

const lightGrey =  "#aaaaaa";
const normalGrey = "#555555";
const whiteBorder = "#eeeeee";

export default {
  name: "WorldMapZoom",
  components: {
    SvgMap
  },
  mounted() {
    map.locations = map.locations.map(function (row) {
      let color = normalGrey; //'#'+(Math.random()*0xFFFFFF<<0).toString(16);
      return {name: row.name, id: row.id, d: row.path, stroke: whiteBorder, fill: color}
    })
    //console.log(map.locations);
    //console.log(this.worldData[1960]);
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
      selectedCountryID: null,  
      overCountryID: -1,   
      overCountryName: "World", 
      overCountryElem: null,
      clickCountryID: -1,
      clickCountryName: "",
      clickCountryCapital: "",
      clickCountryDescription: "",
      clickCountryPic: "",
      isSidebarOpen: false  
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
        console.log("entering " + elem.name);
        //removing old elem
        this.overCountryID = map.locations.indexOf(elem);
        if (this.overCountryID > -1) {
          map.locations.splice(this.overCountryID, 1);
        }
        this.overCountryName = this.overCountryElem.name;
        this.overCountryElem.stroke = lightGrey;
        this.overCountryElem.fill = lightGrey;        
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
        console.log("leaving " + this.overCountryElem.name);
        this.overCountryElem.stroke = whiteBorder;
        this.overCountryElem.fill = normalGrey;
        /*map.locations.push(elem);
        if (this.overCountryID > -1) {
          map.locations.splice(this.overCountryID, 1);
        }
        map.locations.push(elem);*/
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
      console.log("clicking " + elem.name);
      //cleaning old one
      map.locations.forEach(element => {
          if(element.name != elem.name){
            element.stroke = whiteBorder;
            element.fill = normalGrey;
          }
      });
      this.clickCountryID = elem.id.toUpperCase();
      this.clickCountryName = elem.name;
      console.log(this.worldData[this.yearSelect][this.clickCountryID])
      this.clickCountryCapital = this.worldData[this.yearSelect][this.clickCountryID]["capitalCity"];
      this.clickCountryDescription = "Capital : " + this.clickCountryCapital + 
                                      "<br>Cras mattis consectetur purus sit amet fermentum."+
                                      this.worldData[this.yearSelect][this.clickCountryID]
                                      "<br> Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.";
      this.clickCountryPic = "https://www.worldometers.info/img/flags/" + elem.id + "-flag.gif" //"https://en.wikipedia.org/wiki/File:Flag_of_" + this.clickCountryName + ".svg";
      console.log(this.clickCountryPic)
      elem.stroke = whiteBorder;
      elem.fill = "blue";
      //this.overCountryName = "World";
      this.overCountryElem = null;
      /*const index = map.locations.indexOf(elem);
      if (index > -1) {
        map.locations.splice(index, 1);
      }*/
      this.isSidebarOpen = true
    }
 }
}

</script>

<style scoped>
.simple-svg-map__content{
  display: none;
}
</style>