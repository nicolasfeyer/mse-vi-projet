<template>
  <div v-if="!showGraph" class="justify-content-md-center" style="position: absolute; bottom:10px; width:100%">
    <b-row class="justify-content-md-center">
      <b-col col lg="3">
        <b-card :title="yearSelectLocal" sub-title="Move cursor to change year">
          <b-form-input id="range-1" v-model="yearSelectLocal" @change.native="changeYearLocal" type="range" min="1960"
                        max="2018"
                        style="width: 200px;"></b-form-input>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "Slider",
  props: ["yearSelect", "showGraph", "changeYear"],
  methods: {
    changeYearLocal() {
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
    }
  },
  data() {
    return {
      yearSelectLocal: null
    }
  }
}
</script>

<style scoped>

</style>