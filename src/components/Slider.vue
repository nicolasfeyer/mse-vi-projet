<template>
  <div v-if="!showGraph" class="justify-content-md-center" style="position: absolute; bottom:10px; width:100%">
    <b-row class="justify-content-md-center">
      <b-col col lg="8">
        <b-card><!--:title="yearSelectLocal.toString()" sub-title="Move cursor to change year"-->
          <div style="display: flex; align-items: center; justify-content:center;">
            <b-button v-shortkey="['arrowleft']" pill variant="outline-secondary"
                      style="padding: 6px 15px; margin: 0 15px;"
                      @shortkey="minus" @click="minus">-
            </b-button>
            <vue-slider v-model="yearSelectLocal" @change="changeYearLocal" :interval="step()" width="100%"
                        :min="minYear()" :max="maxYear()" :marks="marks()" :tooltip="'always'">
              <template v-slot:step="{ label, active }">
                <div :class="['custom-step', { active }]"></div>
              </template>
            </vue-slider>
            <b-button v-shortkey="['arrowright']" pill variant="outline-secondary" @shortkey="plus" @click="plus"
                      style="margin: 0 15px;">+
            </b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>

export default {
  name: "Slider",
  props: ["yearSelect", "showGraph", "changeYear", "dataType"],
  methods: {
    changeYearLocal() {
      this.$emit('changeYear', this.yearSelectLocal);
    },
    isMigration() {
      return this.dataType === "net_migration" || this.dataType === "migration_perc"
    },
    step() {
      return this.isMigration() ? 5 : 1;
    },
    minYear() {
      return this.isMigration() ? 1962 : 1960;
    },
    maxYear() {
      return this.isMigration() ? 2017 : 2018;
    },
    marks() {
      const marks = [], step = 5, max = this.maxYear()
      let mark = this.minYear();
      while (mark < max) {
        marks.push(mark)
        mark += step
      }
      marks.push(max)
      return marks;
    },
    minus() {
      if (this.yearSelectLocal > this.minYear()) {
        this.yearSelectLocal -= this.step();
      }
      this.changeYearLocal();
    },
    plus() {
      if (this.yearSelectLocal < this.maxYear()) {
        this.yearSelectLocal += this.step();
      }
      this.changeYearLocal();
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
    dataType() { // watch it
      if (this.isMigration()) {
        let diff = (this.yearSelectLocal - 2) % 5
        if (diff > 2) {
          this.yearSelectLocal += 5 - diff;
        } else {
          this.yearSelectLocal -= diff;
        }
      }
      this.changeYearLocal();
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
.custom-step {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #ccc;
  background-color: #fff;
}

.custom-step.active {
  box-shadow: 0 0 0 3px #3498db;
  background-color: #3498db;
}
</style>