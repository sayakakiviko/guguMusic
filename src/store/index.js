/** @format */

import Vue from 'vue';
import Vuex from 'vuex';
import song from './modules/song';

import { VUEX_DEFAULT_CONFIG } from '@/config';

Vue.use(Vuex);
let { state, mutations, getters, actions } = song;
export default new Vuex.Store({
  ...VUEX_DEFAULT_CONFIG,
  state,
  mutations,
  getters,
  actions
});
