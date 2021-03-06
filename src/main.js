import Vue from 'vue'
import App from './App.vue'
import VueYoutube from 'vue-youtube'

Vue.use(VueYoutube)

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false

import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
