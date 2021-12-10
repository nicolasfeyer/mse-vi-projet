<template>
  <div v-if="!showGraph" class="justify-content-md-center" style="position: absolute; bottom:10px; width:100%">
    <b-row class="justify-content-md-center">
      <b-col col lg="3">
        <b-card :title="yearSelectLocal" sub-title="Move cursor to change year">
          <div style="display: flex; align-items: center; justify-content:center;">
            <b-button v-shortkey="['arrowleft']" pill variant="outline-secondary" style="padding: 6px 15px;" @shortkey="minus" @click="minus">-</b-button>
            <b-form-input v-if="dataType == 'net_migration' || dataType=='migration_perc' " id="range-2"
                          v-model="yearSelectLocal" @change.native="changeYearLocal" type="range" min="1962"
                          max="2018" step="5"
                          style="width: 200px;"></b-form-input>
            <b-form-input v-if="dataType != 'net_migration' && dataType!='migration_perc' " id="range-1"
                          v-model="yearSelectLocal" @change.native="changeYearLocal" type="range" min="1960"
                          max="2018"
                          style="width: 200px;"></b-form-input>
            <b-button v-shortkey="['arrowright']" pill variant="outline-secondary" @shortkey="plus" @click="plus">+</b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from "vue";

Vue.use(require('vue-shortkey'))
export default {
  name: "Slider",
  props: ["yearSelect", "showGraph", "changeYear", "dataType"],
  methods: {
    changeYearLocal() {
      this.$emit('changeYear', this.yearSelectLocal);
    },
    minus() {
      if (this.dataType == "net_migration" || this.dataType == "migration_perc") {
        if (parseInt(this.yearSelectLocal) > 1962) {
          this.yearSelectLocal = "" + (parseInt(this.yearSelectLocal) - 5);
        }
      } else if (parseInt(this.yearSelectLocal) > 1960) {
        this.yearSelectLocal = "" + (parseInt(this.yearSelectLocal) - 1);
      }
      this.$emit('changeYear', this.yearSelectLocal);
    },
    plus() {
      if (this.dataType == "net_migration" || this.dataType == "migration_perc") {
        if (parseInt(this.yearSelectLocal) < 2017) {
          this.yearSelectLocal = "" + (parseInt(this.yearSelectLocal) + 5);
        }
      } else if (parseInt(this.yearSelectLocal) < 2018) {
        this.yearSelectLocal = "" + (parseInt(this.yearSelectLocal) + 1);
      }
      this.$emit('changeYear', this.yearSelectLocal);
    }
  },
  mounted() {
    this.yearSelectLocal = this.yearSelect
  },
  watch: {
    yearSelect: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler(val) {
        this.yearSelectLocal = val
      }
    },
    dataType: function () { // watch it
      if (this.dataType == "net_migration" || this.dataType == "migration_perc") {
        let diff = (parseInt(this.yearSelectLocal) - 2) % 5
        if (diff > 2) {
          this.yearSelectLocal = "" + (parseInt(this.yearSelectLocal) + (5 - diff));
        } else {
          this.yearSelectLocal = "" + (parseInt(this.yearSelectLocal) - diff);
        }
      }
      this.$emit('changeYear', this.yearSelectLocal);
    }
  },
  data() {
    return {
      yearSelectLocal: null,
    }
  }
}
</script>

<style scoped>

</style>