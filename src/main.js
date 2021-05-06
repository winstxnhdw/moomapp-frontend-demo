import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

import './scss/main.scss';

import Vue from 'vue'
import VuePapaParse from 'vue-papa-parse'
import App from './App.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VuePapaParse)

new Vue({
  render: h => h(App),
}).$mount('#app')