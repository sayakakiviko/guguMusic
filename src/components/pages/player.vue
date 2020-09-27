<!-- @format -->
<!--歌曲播放页面-->

<template>
  <div class="player" v-show="playList.length">
    <div class="normal-player" v-show="fullScreen">
      <div class="top">
        <van-icon name="arrow-down" size="0.4rem" @click="close" />
        <h2 class="song-name van-ellipsis">枫</h2>
        <h3 class="author van-ellipsis">周杰伦</h3>
      </div>
      <div class="main">
        <div class="disc"></div>
        <div class="lyric">
          <p>乌云在我们心里搁下一块阴影</p>
          <p class="current">我聆听沉寂已久的心情</p>
          <p>清晰透明 就像美丽的风景</p>
        </div>
      </div>
      <div class="bottom">
        <div class="option">
          <i @click="songState.like = !songState.like"
            ><icon-svg
              class="icon-svg"
              :name="(songState.like && 'icon-like-fill') || 'icon-like'"
            ></icon-svg
          ></i>
          <i @click="clickMore"
            ><icon-svg class="icon-svg" name="icon-more"></icon-svg
          ></i>
        </div>
        <!--进度条-->
        <div class="progress-warp">
          <span class="timer">00:00</span>
          <div class="progress">
            <div class="progress-btn"></div>
          </div>
          <span class="time">00:00</span>
        </div>
        <!--操作区-->
        <div class="handle">
          <i @click="changMode"
            ><icon-svg class="icon-svg" name="icon-order"></icon-svg
          ></i>
          <i @click="prevSong"
            ><icon-svg class="icon-svg" name="icon-prev"></icon-svg
          ></i>
          <i @click="playSong"
            ><icon-svg
              class="icon-svg mid"
              :name="(playing && 'icon-pause') || 'icon-play'"
            ></icon-svg
          ></i>
          <i @click="nextSong"
            ><icon-svg class="icon-svg" name="icon-next"></icon-svg
          ></i>
          <i @click="showSongList"
            ><icon-svg class="icon-svg" name="icon-playlist"></icon-svg
          ></i>
        </div>
      </div>
    </div>
    <div class="mini-player" v-show="!fullScreen"></div>
    <!--歌曲列表弹窗-->
    <van-popup
      v-model="isShowList"
      round
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="header">
        <i @click="changMode"
          ><icon-svg class="icon-svg mode" name="icon-order"></icon-svg
        ></i>
        <span>顺序播放</span>
        <i @click="deleteAll"
          ><icon-svg class="icon-svg" name="icon-delete"></icon-svg
        ></i>
      </div>
      <!--歌曲列表-->
      <div class="song-list">
        <ul>
          <li></li>
        </ul>
      </div>
      <!--<icon-svg class="icon-svg" name="icon-song"></icon-svg>-->
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {
      songState: {
        like: false, //是否喜欢歌曲
        playing: false //是否正在播放歌曲
      },
      isShowList: true //歌曲列表是否显示
    };
  },
  created() {},
  computed: mapState(['playing', 'playMode', 'playList', 'fullScreen']),
  methods: {
    ...mapMutations(['SET_FULLSCREEN', 'SET_PLAYING']),
    /** 关闭播放页 */
    close() {
      this.SET_FULLSCREEN(false);
    },
    clickMore() {},
    changMode() {},
    prevSong() {},
    nextSong() {},
    /**
     * 播放/暂停歌曲
     * @id {string} id
     * */
    playSong() {
      this.SET_PLAYING(!this.playing);
    },
    showSongList() {},
    deleteAll() {}
  }
};
</script>

<style lang="less" scoped>
.player {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: #222;
  .van-icon-arrow-down {
    position: absolute;
    left: 0.2rem;
    top: 0.1rem;
  }
  .top {
    text-align: center;
    color: #fff;
    .song-name {
      width: 70%;
      margin: auto;
      font-size: 18px;
      line-height: 40px;
    }
    .author {
      margin-top: 0.1rem;
      font-size: 14px;
      line-height: 20px;
    }
  }
  .main {
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    text-align: center;
    font-size: 14px;
    white-space: nowrap;
    color: #fff;
    .disc {
      box-sizing: border-box;
      width: 5.8rem;
      height: 5.8rem;
      margin: auto;
      border: 0.1rem solid hsla(0, 0%, 100%, 0.1);
      border-radius: 50%;
    }
    .lyric {
      position: relative;
      margin-top: 18px;
      line-height: 24px;
      .current {
        color: #ffcd32;
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 28px;
    width: 100%;
    .option {
      display: flex;
      justify-content: space-between;
      width: 80%;
      margin: auto;
      .icon-svg {
        width: 30px;
        height: 30px;
        &.icon-svg__icon-like-fill {
          color: #d93f30;
        }
      }
    }
    .progress-warp {
      display: flex;
      width: 80%;
      margin: 25px auto;
      color: #fff;
      .progress {
        position: relative;
        flex: 1;
        height: 4px;
        margin: auto;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        .progress-btn {
          box-sizing: border-box;
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto;
          width: 16px;
          height: 16px;
          background-color: #ffcd32;
          border: 3px solid #fff;
          border-radius: 50%;
        }
      }
      span {
        width: 40px;
        font-size: 12px;
        &.time {
          text-align: right;
        }
      }
    }
    .handle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 80%;
      margin: auto;
      .icon-svg {
        width: 30px;
        height: 30px;
        &.mid {
          width: 42px;
          height: 42px;
        }
      }
    }
  }
  .van-popup {
    box-sizing: border-box;
    padding: 20px;
    background-color: #333;
    .icon-svg {
      width: 30px;
      height: 30px;
      &.mode {
        margin-right: 10px;
      }
      &.icon-svg__icon-delete {
        height: 22px;
        color: #666;
      }
    }
    .header {
      display: flex;
      align-items: center;
      color: #999;
      span {
        flex: 1;
      }
    }
  }
}
</style>
