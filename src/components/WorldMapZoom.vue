<template>
  <div style="width: 100%; height: 90vh;">
    <div style="border-style: solid; border-color: #333333; border-width: 1px; width: 100%; height: 100%; position: fixed; top: 0px; left: 0px;">
        <SvgMap
          :map="map.locations"
          :wrapper-styles="{position: 'relative', width: '100%', height: '100%'}"
          view-box="0 -100 1000 1000"
          :thin-border-on-zoom="true"
          @mouseover="overCountry"
          @mouseleave="leaveCountry"
          @click="clickCountry"
        />
      </div>
    <b-container class="bv-example-row">
      <b-row class="justify-content-md-center" style="height: 50px;">
        <b-col col lg="3" class="bg-info" style="border-radius: 10px;"><h2>{{overCountryName}}</h2></b-col>
      </b-row>
    </b-container>
    <b-sidebar v-model="isSidebarOpen" id="sidebar-right" :title=clickCountryName right shadow>
      <div class="px-3 py-2">
        <p>{{clickCountryDescription}}</p>
        <b-img :src=clickCountryPic fluid thumbnail></b-img>
      </div>
    </b-sidebar>
      
  </div>
  
</template>

<script>
import SvgMap from 'vue-simple-svg-map'
import map from '@svg-maps/world'

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
    console.log(map.locations);
  },
  data() {
    return {
      map,
      selectedCountryID: null,  
      overCountryID: -1,   
      overCountryName: "", 
      overCountryElem: null,
      clickCountryID: -1,
      clickCountryName: "",
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
        this.overCountryName = "";
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
      this.clickCountryID = map.locations.indexOf(elem);
      this.clickCountryName = elem.name;
      this.clickCountryDescription = "Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.";
      this.clickCountryPic = "https://picsum.photos/500/500/?image=54";
      elem.stroke = "blue";
      elem.fill = "blue";
      this.overCountryName = "";
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