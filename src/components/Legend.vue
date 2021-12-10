<template>
  <div>
    <div v-if="!isActiveBut['incomeLevel'] && !showGraph" class="justify-content-md-center"
         style="position: absolute; left:10px; bottom:130px; width:110px">

      <b-container>
        <b-card class="legend_card">
          <span>Legend</span>
          <b-row v-if="isActiveBut['population'] || isActiveBut['pop_density']">
            <b-col cols="5" style="display: flex; justify-content: end; padding: 3px;">
              <div
                  style="width: 20px; height: 200px; background: linear-gradient(hsl(100, 50%, 50%), hsl(0, 50%, 50%));"></div>
            </b-col>
            <b-col cols="7" style="padding: 3px;">
              <div
                  style="height: 200px; width: 40px; display: flex; flex-direction: column; justify-content: space-between; align-content:left">
                <div class="legend_value">&#60; {{ legendScale[0] }}</div>
                <div class="legend_value">{{ legendScale[1] }}</div>
                <div class="legend_value">{{ legendScale[2] }}</div>
                <div class="legend_value">{{ legendScale[3] }}</div>
                <div class="legend_value">>{{ legendScale[4] }}</div>
              </div>
            </b-col>
          </b-row>
          <b-row v-if="isActiveBut['migration_perc'] || isActiveBut['net_migration']">
            <b-col cols="5" style="display: flex; justify-content: end; padding: 3px;">
              <div
                  style="width: 20px; height: 200px; background: linear-gradient(hsl(0, 70%, 50%), hsl(0, 0%, 50%), hsl(100, 70%, 50%));"></div>
            </b-col>
            <b-col cols="7" style="padding: 3px;">
              <div
                  style="height: 200px; width: 40px; display: flex; flex-direction: column; justify-content: space-between; align-content:left">
                <div class="legend_value">&#60; -{{ legendScale[4] }}</div>
                <div class="legend_value">-{{ legendScale[2] }}</div>
                <div class="legend_value">{{ legendScale[0] }}</div>
                <div class="legend_value">{{ legendScale[2] }}</div>
                <div class="legend_value">>{{ legendScale[4] }}</div>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-container>
    </div>
    <div v-if="isActiveBut['incomeLevel'] && !showGraph" class="justify-content-md-center"
         style="position: absolute; left:10px; bottom:130px; width:110px">

      <b-container>
        <b-card class="legend_card">
          <span>Legend</span>
          <b-row>
            <b-col cols="5" style="display: flex; justify-content: end; padding: 3px;">
              <div
                  style="height: 200px; display: flex; flex-direction: column; justify-content: space-between; align-content:right">
                <div style="width: 20px; height: 20px; background-color: hsl(0, 50%, 50%);"></div>
                <div style="width: 20px; height: 20px; background-color: hsl(40, 50%, 50%);"></div>
                <div style="width: 20px; height: 20px; background-color: hsl(60, 50%, 50%);"></div>
                <div style="width: 20px; height: 20px; background-color: hsl(100, 50%, 50%);"></div>
              </div>
            </b-col>
            <b-col cols="7" style="padding: 3px;">
              <div
                  style="height: 200px; width: 40px; display: flex; flex-direction: column; justify-content: space-between; align-content:left">
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
  </div>
</template>

<script>
export default {
  name: "Legend",
  props: ["isActiveBut", "legendScale", "showGraph"]
}
</script>

<style scoped>

</style>