import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(require('vue-shortkey'))
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.component('VueSlider', VueSlider)

new Vue({
  render: h => h(App),
}).$mount('#app')
