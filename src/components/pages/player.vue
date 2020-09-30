<!-- @format -->
<!--歌曲播放页面-->

<template>
  <div class="player" v-show="playList.length">
    <transition name="van-slide-up">
      <div class="normal-player" v-if="fullScreen">
        <!--顶部-->
        <div class="top">
          <van-icon name="arrow-down" size="0.4rem" @click="closePlayer" />
          <h2 class="song-name van-ellipsis">枫</h2>
          <h3 class="author van-ellipsis">周杰伦</h3>
        </div>
        <!--主体-->
        <div class="main">
          <div class="disc">
            <img
              class="rotate"
              :class="{ paused: !playing }"
              src="https://y.gtimg.cn/music/photo_new/T002R300x300M000000MkMni19ClKG.jpg?max_age=2592000"
            />
          </div>
          <div class="lyric">
            <p>乌云在我们心里搁下一块阴影</p>
            <p class="current">我聆听沉寂已久的心情</p>
            <p>清晰透明 就像美丽的风景</p>
          </div>
        </div>
        <!--控制区-->
        <div class="bottom">
          <!--喜欢&更多-->
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
            <i @click="isShowList = true"
              ><icon-svg class="icon-svg" name="icon-playlist"></icon-svg
            ></i>
          </div>
        </div>
      </div>
    </transition>
    <!--迷你播放器-->
    <div class="mini-player" v-if="!fullScreen" @click="showPlayer">
      <div class="mini-disc">
        <img
          class="rotate-mini"
          :class="{ paused: !playing }"
          src="https://y.gtimg.cn/music/photo_new/T002R300x300M000000MkMni19ClKG.jpg?max_age=2592000"
        />
      </div>
      <div class="text">
        <van-swipe
          :autoplay="0"
          :show-indicators="false"
          :stop-propagation="false"
        >
          <van-swipe-item ref="swiper" v-for="(item, i) in 3" :key="i">
            <p class="van-ellipsis">枫 - 周杰伦</p>
          </van-swipe-item>
        </van-swipe>
      </div>
      <i @click.stop="playSong"
        ><icon-svg
          class="icon-svg mid"
          :name="(playing && 'icon-pause') || 'icon-play'"
        ></icon-svg
      ></i>
      <i @click.stop="isShowList = true"
        ><icon-svg class="icon-svg" name="icon-playlist"></icon-svg
      ></i>
    </div>
    <!--歌曲列表弹窗-->
    <van-popup
      v-model="isShowList"
      round
      position="bottom"
      :duration="0.15"
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
      <div class="song-list" ref="songList">
        <!--<van-list-->
        <!--class="song-list"-->
        <!--v-model="loading"-->
        <!--:finished="finished"-->
        <!--:immediate-check="false"-->
        <!--finished-text=""-->
        <!--&gt;-->
        <ul>
          <li>
            <icon-svg
              class="icon-svg"
              name="icon-sing"
              v-show="false"
            ></icon-svg>
            <p>
              <span>枫</span>
              -
              <span>周杰伦</span>
            </p>
            <van-icon name="cross" @click="delSong" />
          </li>
        </ul>
        <!--</van-list>-->
      </div>
      <div class="close-list" @click="isShowList = false">关闭</div>
    </van-popup>
  </div>
</template>

<script>
// import BScroll from 'better-scroll';
import { Dialog } from 'vant';
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {
      loading: false, //是否正在加载歌曲列表
      finished: false, //歌曲列表是否全部加载完毕
      songState: {
        like: false, //是否喜欢歌曲
        playing: false //是否正在播放歌曲
      },
      isShowList: false //歌曲列表是否显示
    };
  },
  created() {
    // this.$nextTick(() => {
    //   new BScroll(this.$refs.songList, {
    //     tap: true,
    //     click: true,
    //     mouseWheel: true
    //   });
    // });
  },
  computed: mapState(['playing', 'playMode', 'playList', 'fullScreen']),
  methods: {
    ...mapMutations(['SET_FULLSCREEN', 'SET_MINIMODE', 'SET_PLAYING']),
    onLoad() {
      this.loading = false;
      this.finished = true;
    },
    /** 打开播放页 */
    showPlayer() {
      this.SET_FULLSCREEN(true);
      this.SET_MINIMODE(false);
    },
    /** 关闭播放页 */
    closePlayer() {
      this.SET_FULLSCREEN(false);
      this.SET_MINIMODE(true);
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
    /** 清空歌曲列表 */
    deleteAll() {
      Dialog.confirm({
        message: '确定要清空播放列表？'
      })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    delSong() {}
  }
};
</script>

<style lang="less" scoped>
.player {
  .van-icon-arrow-down {
    position: absolute;
    left: 0.2rem;
    top: 0.1rem;
  }
  .van-popup {
    box-sizing: border-box;
    padding-top: 20px;
    /*padding: 20px 20px 0;*/
    background-color: #333;
    font-size: 14px;
    color: #fff;
    .icon-svg {
      width: 30px;
      height: 30px;
      &.mode {
        margin-right: 10px;
      }
      &.icon-svg__icon-delete {
        width: 22px;
        height: 22px;
        color: #666;
      }
    }
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      padding: 0 20px;
      span {
        flex: 1;
      }
    }
    .song-list {
      overflow: auto;
      height: 80%;
      padding: 0 20px;
      li {
        display: flex;
        position: relative;
        align-items: center;
        padding-left: 22px;
        line-height: 40px;
        .icon-svg {
          position: absolute;
          left: 0;
          width: 16px;
          height: 16px;
        }
        p {
          flex: 1;
        }
      }
    }
    .close-list {
      position: absolute;
      bottom: 8px;
      width: 100%;
      text-align: center;
      font-size: 16px;
      line-height: 30px;
    }
  }
  .normal-player {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: #222;
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
        border: 10px solid hsla(0, 0%, 100%, 0.1);
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
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
  }
  .mini-player {
    display: flex;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    align-items: center;
    width: 100%;
    height: 40px;
    background-color: #333;
    .mini-disc {
      height: 100%;
      padding-left: 20px;
      img {
        position: relative;
        bottom: 10px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
    }
    .text {
      overflow: hidden;
      flex: 1;
      height: 40px;
      padding-left: 8px;
      line-height: 40px;
      p {
        width: 100%;
        font-size: 14px;
        color: #fff;
      }
    }
    .icon-svg {
      width: 24px;
      height: 24px;
      padding: 0 10px;
      color: #998032;
    }
  }
}
.rotate {
  animation: rotate 30s linear infinite;
}
.rotate-mini {
  animation: rotate 10s linear infinite;
}
.paused {
  animation-play-state: paused;
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
