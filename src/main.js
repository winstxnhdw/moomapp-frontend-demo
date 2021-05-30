import 'leaflet/dist/leaflet.css'

import './scss/main.scss'

import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import App from './App.vue'
import store from './store/index.js'

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
