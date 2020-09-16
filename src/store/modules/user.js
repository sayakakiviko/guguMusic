/** @format */
import tokenUtil from '../../utils/tokenUtil';
import Vue from 'vue';
import axios from 'axios';
import router from '@/router';

export default {
  state: {
    singer: {}, //歌手
    playing: false, //是否正在播放
    fullScreen: false, //是否位于播放页
    playList: [], //播放列表
    sequenceList: [], //歌曲列表
    playMode: 'order', //播放模式
    currentIndex: -1, //当前播放歌曲位于列表的位置
  },
  getters: {
    singer(state) {
      return state.singer;
    },
    playing(state) {
      return state.playing;
    },
    fullScreen(state) {
      return state.fullScreen;
    },
    playList(state) {
      return state.playList;
    },
    sequenceList(state) {
      return state.sequenceList;
    },
    playMode(state) {
      return state.playMode;
    },
    currentIndex(state) {
      return state.currentIndex;
    },
    currentSong(state) {
      return state.playList[state.currentIndex];
    },
  },
  mutations: {
    SET_USERINFO(states, user) {
      states.user = { ...states.user, ...user };
    },
  },
  actions: {
    getUserInfo({ commit, state }, params) {
      return {};
    },
  },
};
