/* 
Vuex использует в своей работе Promise (opens new window). 
Если необходимо поддерживать старые браузеры, 
которые не реализуют Promise (например, IE) — добавим полифил, 
например es6-promise (https://github.com/stefanpenner/es6-promise).

через CDN:
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js"></script>
 
*/
import 'es6-promise/auto';
/* ===================================================== */

import Vue from 'vue';
import Vuex from 'vuex'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';

import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/css/main.css';
import {store} from '@/other_js/store.js';
/* oo */
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

/* 
export const store = new Vuex.Store({
  state: {
    count: 0,
    mainData:{
      mainFilters:{
        dtStart:new Date()

      }
    }
  },
  mutations: {
    increment (state) {
      state.count++ 
    }    
  },
  getters: {},
  actions: {}
}); 
 */



new Vue({
  el: '#app',
  store: store,
  render: h => h(App)
  
}).$mount('#app');
