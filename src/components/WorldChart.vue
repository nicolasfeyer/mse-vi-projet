<template>
  
  <div style='width:100%; height:100%; padding:100px 50px;'>
      <b-row style='padding: 20px;'>
        <b-col v-for="country in countrySelect" :key="country">
            <b-button variant="outline-primary" @click="removeCountry(country)">{{data[1990][country].country}} X</b-button>
        </b-col>
      </b-row>
      <h4>Add a country : </h4>
      <b-form-select v-model="countrySelected" :options="getFreeCountry()"  @change="newCountry"></b-form-select>
      <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
        MAx number of country reached !
        </b-alert>
      <la-cartesian autoresize :height="windowHeight"  :data="values"> <!--:bound="[n => n - 10, n => n + 10]"-->
        <span v-html="HTMLcontent"></span>
        <la-line :width="2" dashed dot animated curve :label="countrySelect[0]" :prop="countrySelect[0]"></la-line>
        <la-line :width="2" dashed dot animated curve :label="countrySelect[1]" :prop="countrySelect[1]"></la-line>
        <la-line :width="2" dashed dot animated curve :label="countrySelect[2]" :prop="countrySelect[2]"></la-line>
        <la-line :width="2" dashed dot animated curve :label="countrySelect[3]" :prop="countrySelect[3]"></la-line>
        <la-line :width="2" dashed dot animated curve :label="countrySelect[4]" :prop="countrySelect[4]"></la-line>
        <la-line :width="2" dashed dot animated curve :label="countrySelect[5]" :prop="countrySelect[5]"></la-line>
        <la-x-axis prop="name" class="x-axis-style"></la-x-axis>
        <la-y-axis :format="v => Math.round(v)"></la-y-axis>
        <la-tooltip></la-tooltip>
        <la-legend selectable></la-legend>
        <la-y-marker dashed :value="0" label="0"></la-y-marker>
    </la-cartesian>
    </div>
  
</template>

<script>
import Vue from 'vue';
import { Laue } from 'laue';

Vue.use(Laue);

export default {
    props: ['data', 'country', 'dataType'],

    
    watch: { 
        dataType: function(newVal, oldVal){ // watch it
            console.log('Prop changed: ', newVal, ' | was: ', oldVal)
            this.drawGraph();
        }
    },
    

    data: () => ({
        values: [],
        windowHeight: window.innerHeight - 300,
        countrySelect: [],
        countrySelected: "",
        showDismissibleAlert: false
    }),

    methods: {
        drawGraph() {
            this.values = [];
            if (this.dataType == 'migration_perc' || this.dataType == "net_migration"){
                for (let i = 1962; i < 2019; i=i+5) {
                    this.values.push(this.getCountryData(i));
                }
            } else {
                for (let i = 1960; i < 2019; i++) {
                    this.values.push(this.getCountryData(i));
                }
            }
            console.log(this.values)
        },
        getCountryData(i) {
            let val = {name: i}
            this.countrySelect.forEach(selectedElem => {
                    val[selectedElem] = this.data[i][selectedElem][this.dataType];
                })
            return val
        },
        getFreeCountry() {
            let free = [];
            for(let element in this.data[1990]) {
                let test = true;
                this.countrySelect.forEach(selectedElem => {
                    if(element == selectedElem){
                        test = false;
                    }
                })
                if(test){
                    free.push({ value: element, text: this.data[1990][element].country });
                }
            }
            return free;
        },

        newCountry(){
            if(this.countrySelected){
                if(this.countrySelect.length > 5){
                    this.showDismissibleAlert=true
                } else {
                    this.countrySelect.push(this.countrySelected)
                    this.countrySelected = ""
                }
            }
            this.drawGraph()
        },
        removeCountry(elem){
            this.countrySelect.splice(this.countrySelect.indexOf(elem), 1);
            this.drawGraph()
        }
    },

    mounted() {
        this.countrySelect.push(this.country)
        this.drawGraph()
    }
};
</script>

<style>
    .x-axis-style text{
        transform-box: fill-box;
        transform-origin: center;
        transform: translate(10px, 5px) rotate(45deg);
    }
</style>