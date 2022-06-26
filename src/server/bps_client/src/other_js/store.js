

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    count: 0,
    mainData:{
      mainFilters:{
        dtStart:new Date(), //.setDate()-10
        dtEnd:new Date()

      }
    }},
  getters: {},
  mutations: {},
  actions: {},
});