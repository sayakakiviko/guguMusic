/** @format */
import tokenUtil from '../../utils/tokenUtil';
import Vue from 'vue';
import axios from 'axios';
import router from '@/router';

export default {
  state: {
    singer: {}, //歌手
    playing: false, //是否正在播放歌曲
    fullScreen: false, //是否位于播放页
    miniMode: false, //是否处于mini模式
    playList: [], //播放列表，实际播放顺序的列表（代码看）
    songList: [], //歌曲列表，即mini模式的歌曲列表（人看）
    playMode: 'order', //播放模式
    currentIndex: -1 //当前播放歌曲位于列表的位置
  },
  mutations: {
    SET_SINGER(state, singer) {
      state.singer = singer;
    },
    //是否正在播放歌曲
    SET_PLAYING(state, playing) {
      state.playing = playing;
    },
    //是否处于播放页
    SET_FULLSCREEN(state, fullScreen) {
      state.fullScreen = fullScreen;
    },
    //是否处于mini模式
    SET_MINIMODE(state, miniMode) {
      state.miniMode = miniMode;
    },
    //设置播放列表，实际播放顺序的列表
    SET_PLAYLIST(state, playList) {
      state.playList = playList;
    },
    //设置歌曲列表，歌曲列表为顺序的播放，即mini模式的歌曲列表
    SET_SONGLIST(state, songList) {
      state.songList = songList;
    },
    //设置播放模式
    SET_PLAYMODE(state, playMode) {
      state.playMode = playMode;
    },
    SET_CURRENTINDEX(state, currentIndex) {
      state.currentIndex = currentIndex;
    }
  },
  actions: {
    /** 点击歌曲开始播放 */
    selectPlay({ commit, state }, { list, index }) {
      commit('SET_SONGLIST', list); //歌曲列表
      commit('SET_PLAYLIST', list); //播放列表
      commit('SET_CURRENTINDEX', index); //第几首歌
      commit('SET_FULLSCREEN', true); //打开播放器
      commit('SET_PLAYING', true); //是否正在播放歌曲
    }
  }
};
