/** @format */
export default {
  state: {
    singer: {}, //歌手
    songInfo: {}, //歌曲
    playing: false, //是否正在播放歌曲
    fullScreen: false, //是否位于播放页
    miniMode: false, //是否处于mini模式
    playList: [], //播放列表，实际播放顺序的列表，该列表随机模式时排序会变
    songList: [], //歌曲列表，即mini模式的歌曲列表，该列表排序不变
    modeIndex: 0, //播放模式的下标。0顺序播放、1单曲循环、2随机播放
    currentIndex: -1 //当前播放歌曲位于列表的位置
  },
  mutations: {
    SET_SINGER(state, singer) {
      state.singer = singer;
    },
    //添加歌词或替换歌曲对象
    SET_SONGINFO(state, songInfo) {
      typeof songInfo === 'string'
        ? (state.songInfo.lyricLrc = songInfo)
        : (state.songInfo = songInfo);
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
    //设置歌曲列表，歌曲列表为顺序的播放
    SET_SONGLIST(state, songList) {
      state.songList = songList;
    },
    //设置播放模式
    SET_MODEINDEX(state, modeIndex) {
      state.modeIndex = modeIndex;
    },
    //当前播放歌曲位于列表的下标
    SET_CURRENTINDEX(state, currentIndex) {
      state.currentIndex = currentIndex;
      state.songInfo = state.playList[currentIndex]; //获取到是列表里的哪首歌
    }
  },
  actions: {
    /**
     * 点击歌曲开始播放
     * @list {array} 歌曲列表
     * @index {number} 歌曲位于列表的下标
     * */
    selectPlay({ commit, state }, { list, index }) {
      commit('SET_SONGLIST', list); //歌曲列表
      if (state.modeIndex === 2) {
        //随机模式下点击列表播放歌曲
        commit('SET_PLAYLIST', state.playList); //播放列表
        index = findIndex(state.playList, list[index]);
      } else {
        commit('SET_PLAYLIST', list); //播放列表
      }
      commit('SET_CURRENTINDEX', index); //第几首歌
      !state.miniMode && commit('SET_FULLSCREEN', true); //非mini模式才打开播放器
      commit('SET_PLAYING', true); //是否正在播放歌曲
    },
    /**
     * 删除单首歌曲
     * @song {object} 要删除的歌曲
     * */
    deleteSong({ commit, state }, song) {
      let playList = state.playList.slice(), //深拷贝，让对象与原列表脱钩避免报错
        songList = state.songList.slice(),
        pIndex = findIndex(playList, song), //获取删除歌曲于列表中的位置
        sIndex = findIndex(songList, song),
        index = state.currentIndex;

      playList.splice(pIndex, 1);
      songList.splice(sIndex, 1);
      (index > pIndex || index === playList.length) && index--; //若删除当前播放的歌曲为最后一首，或删除当前歌曲之前的歌曲，index下标-1

      commit('SET_PLAYLIST', playList);
      commit('SET_SONGLIST', songList);
      commit('SET_CURRENTINDEX', index);
      //删除的不是当前歌曲，则播放状态不变。列表还有歌曲则继续播放，否则停止播放
      index !== state.currentIndex &&
        commit('SET_PLAYING', (playList.length && true) || false);

      //删除单曲时，若该单曲是列表最后一首
      if (!playList.length) {
        commit('SET_FULLSCREEN', false);
        commit('SET_MINIMODE', false);
        commit('SET_PLAYING', false);
        commit('SET_SONGINFO', {});
      }
    },
    /** 清空歌曲列表 */
    clearList({ commit }) {
      commit('SET_PLAYLIST', []);
      commit('SET_SONGLIST', []);
      commit('SET_CURRENTINDEX', -1);
      commit('SET_FULLSCREEN', false);
      commit('SET_MINIMODE', false);
      commit('SET_PLAYING', false);
      commit('SET_SONGINFO', {}); //歌曲对象初始化，否则会报错
    }
  }
};

/**
 * 找到歌曲位于列表中的位置
 * @list {array} 歌曲列表
 * @song {object} 歌曲对象
 */
function findIndex(list, song) {
  return list.findIndex(item => item.songId === song.songId);
}
