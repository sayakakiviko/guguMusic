<!-- @format -->
<!--歌曲播放页面-->

<template>
  <div class="player" v-show="playList.length">
    <transition name="van-slide-up" @enter="enter" @after-enter="afterEnter">
      <div
        ref="normal"
        class="normal-player"
        v-show="fullScreen"
        @touchmove.prevent
      >
        <!--顶部-->
        <div class="top">
          <van-icon name="arrow-down" size="0.4rem" @click="closePlayer" />
          <div class="song-name">
            <h2 ref="songName">
              <span>{{ songInfo.songName }}</span>
              <span style="margin: 0 40px" v-if="songState.longName">{{
                songInfo.songName
              }}</span>
            </h2>
          </div>
          <h3
            class="author van-ellipsis"
            @click="showSinger($event, songInfo.singerName)"
          >
            <!--歌手-->
            <span v-for="(item, i) in songInfo.singerName" :key="i"
              >{{ (i && ',') || '' }}{{ item }}</span
            >
          </h3>
        </div>
        <!--主体-->
        <div class="main" @click="songState.lyricShow = !songState.lyricShow">
          <div class="cd" :class="{ show: !songState.lyricShow }">
            <div class="disc" ref="cdWrapper">
              <img
                class="rotate"
                :class="{ paused: !playing }"
                :src="songInfo.picM"
              />
            </div>
            <div class="lyric cd-lyric">
              <div
                class="cd-roll van-ellipsis"
                :style="{ top: `calc(24px - ${lyricLine * 24}px)` }"
              >
                <p
                  v-for="(line, i) in lyric.lines"
                  :key="i"
                  :class="{ current: lyricLine === i }"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </div>
          <!--滚动歌词-->
          <div
            ref="lyric"
            class="lyric warp"
            :class="{ show: songState.lyricShow }"
            @touchmove.stop
          >
            <!--            <div-->
            <!--              class="roll"-->
            <!--              :style="{ top: `calc(45% - ${lyricLine * 38}px)` }"-->
            <!--            >-->
            <div ref="lyricRoll" class="roll">
              <p
                v-for="(line, i) in lyric.lines"
                :key="i"
                :class="{ current: lyricLine === i }"
              >
                {{ line.txt }}
              </p>
            </div>
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
            <span class="timer">{{
              songTime.currentTime | formatSongTime
            }}</span>
            <div class="progress">
              <van-slider
                v-model="rate"
                bar-height="4px"
                @change="rateChange"
                @drag-start="dragStart"
                @drag-end="dragEnd"
              />
            </div>
            <span class="time">{{ songTime.duration | formatSongTime }}</span>
          </div>
          <!--操作区-->
          <div class="handle">
            <i @click="changMode"
              ><icon-svg
                class="icon-svg"
                :name="'icon-' + songState.playMode[modeIndex]"
              ></icon-svg
            ></i>
            <i @click="prevNextSong(true)"
              ><icon-svg
                class="icon-svg"
                :class="{ disabled: !songReady }"
                name="icon-prev"
              ></icon-svg
            ></i>
            <i @click="togglePlay"
              ><icon-svg
                class="icon-svg mid"
                :class="{ disabled: !songReady }"
                :name="(playing && 'icon-pause') || 'icon-play'"
              ></icon-svg
            ></i>
            <i @click="prevNextSong(false)"
              ><icon-svg
                class="icon-svg"
                :class="{ disabled: !songReady }"
                name="icon-next"
              ></icon-svg
            ></i>
            <i @click="showSongList"
              ><icon-svg class="icon-svg" name="icon-playlist"></icon-svg
            ></i>
          </div>
        </div>
      </div>
    </transition>
    <!--迷你播放器-->
    <div
      class="mini-player"
      :class="{ show: !fullScreen && songState.miniShow }"
      @click="showPlayer"
    >
      <div class="mini-disc">
        <van-circle
          v-model="rate"
          :rate="rate"
          :speed="100"
          layer-color="rgba(255,255,255,0.3)"
          size="52px"
        />
        <img
          class="rotate-mini"
          :class="{ paused: !playing }"
          :src="songInfo.picS"
        />
      </div>
      <div class="text" v-if="!fullScreen">
        <van-swipe
          :autoplay="0"
          :show-indicators="false"
          :stop-propagation="false"
          :initial-swipe="currentIndex"
          @change="changeSwipe"
        >
          <van-swipe-item
            class="van-ellipsis"
            v-for="(item, index) in playList"
            :key="index"
          >
            <p ref="miniTitle">
              {{ item.songName }} -
              <span v-for="(name, i) in item.singerName" :key="i"
                >{{ (i && ',') || '' }}{{ name }}</span
              >
            </p>
          </van-swipe-item>
        </van-swipe>
      </div>
      <i @click.stop="togglePlay"
        ><icon-svg
          class="icon-svg mid"
          :class="{ disabled: !songReady }"
          :name="(playing && 'icon-pause') || 'icon-play'"
        ></icon-svg
      ></i>
      <i @click.stop="showSongList"
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
          ><icon-svg
            class="icon-svg"
            :name="'icon-' + songState.playMode[modeIndex]"
          ></icon-svg
        ></i>
        <span>{{
          modeIndex ? (modeIndex === 1 && '单曲循环') || '随机播放' : '列表循环'
        }}</span>
        <i @click="deleteAll"
          ><icon-svg class="icon-svg" name="icon-delete"></icon-svg
        ></i>
      </div>
      <!--歌曲列表-->
      <div class="song-list" ref="songList">
        <ul>
          <li
            v-for="(item, i) in songList"
            :key="item.songId"
            :class="{ active: songState.active === i }"
          >
            <icon-svg
              class="icon-svg"
              name="icon-sing"
              v-show="songState.active === i"
            ></icon-svg>
            <p class="van-ellipsis" @click="selectSong(i)">
              <span>{{ item.songName }}</span>
              -
              <span v-for="(val, i) in item.singerName" :key="i"
                >{{ (i && ',') || '' }}{{ val }}</span
              >
            </p>
            <van-icon name="cross" @click="delSong(item)" />
          </li>
        </ul>
      </div>
      <div class="close-list" @click="isShowList = false">关闭</div>
    </van-popup>
    <audio
      ref="audio"
      :src="songInfo.listenUrl"
      @canplay="audioReady"
      @error="audioReady"
      @timeupdate="timeUpdate"
      @ended="playEnd"
    ></audio>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import animations from 'create-keyframe-animation';
import lyric from 'lyric-parser';
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
  data() {
    return {
      songReady: false, //歌曲是否可以播放
      songTime: {
        currentTime: 0, //当前播放的时间
        duration: 0 //歌曲总时长
      },
      timer: null, //进度条用的计时器
      loading: false, //是否正在加载歌曲列表
      finished: false, //歌曲列表是否全部加载完毕
      lyric: '', //滚动歌词
      lyricLine: 0, //当前歌词所在行
      //歌曲相关状态
      songState: {
        playMode: ['order', 'loop', 'random'], //播放模式
        miniShow: false, //是否展示迷你播放器
        lyricShow: false, //是否展示歌词页
        longName: false, //是否是长歌名
        isDrag: false, //是否正在拖动进度条
        like: false, //是否喜欢歌曲
        index: 0 //歌曲位于歌曲列表的下标
      },
      isShowList: false, //歌曲列表是否显示
      rate: 0 //进度条百分比
    };
  },
  computed: mapState([
    'songInfo',
    'playing',
    'modeIndex',
    'songList',
    'playList',
    'fullScreen',
    'currentIndex',
    'songIndex'
  ]),
  watch: {
    //监听当前歌曲
    songInfo(newSong, oldSong) {
      if (!newSong) return;
      if (!this.playList.length || newSong.songId === oldSong.songId) return; //同一首歌无需重播
      this.lyric && this.lyric.stop(); //切歌时有歌词，则暂停上一首歌词滚动

      this.$nextTick(() => {
        //获取正在播放歌曲的下标
        this.songState.active = this.findIndex(this.songList);

        this.getLyric(this.songInfo.copyrightId); //获取当前歌曲歌词
        this.$refs.audio.play();
        this.$refs.songName.className = ''; //每次切歌需重置歌名class
        this.songState.longName = false; //隐藏长歌名
        this.fullScreen ? this.showSongName() : this.showSongTitle(); //切歌后处于迷你模式需要重新设计迷你标题运动动画
        this.$refs.lyric.scrollTop = 0; //每次切歌后歌词滚动top重置
      });
    },
    //是否正在播放歌曲
    playing(newVal) {
      this.$nextTick(() => {
        let audio = this.$refs.audio;
        (newVal && audio.play()) || audio.pause();

        this.timer && clearInterval(this.timer);
        //若正在播放歌曲，则实时改变进度条进度
        if (this.playing) {
          this.timer = setInterval(() => {
            if (this.songState.isDrag) return; //若进度条正在拖动中
            //改变进度条进度
            this.rate =
              (
                (this.songTime.currentTime / this.songTime.duration) *
                100
              ).toFixed(2) * 1;
          }, 1000);
        }
      });
    }
  },
  methods: {
    ...mapMutations([
      'SET_SONGINFO',
      'SET_FULLSCREEN',
      'SET_MINIMODE',
      'SET_MODEINDEX',
      'SET_PLAYING',
      'SET_SONGLIST',
      'SET_PLAYLIST',
      'SET_CURRENTINDEX',
      'SET_SONGINDEX'
    ]),
    ...mapActions(['selectPlay', 'deleteSong', 'clearList']),
    /** 音频允许播放时会执行该方法，报错时也要执行，否则会阻塞流程 */
    audioReady() {
      this.songReady = true;
      this.songTime.duration = this.$refs.audio.duration; //获取音频总时长
    },
    /**
     * 设置当前音频时间
     * @e {object} event对象
     */
    timeUpdate(e) {
      this.songTime.currentTime = e.target.currentTime;
    },
    /** 歌曲播放完毕 */
    playEnd() {
      this.modeIndex === 1 ? this.loopMode() : this.prevNextSong(false);
    },
    /** 单曲循环模式 */
    loopMode() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this.lyric && this.lyric.seek(0);
      this.$refs.lyric.scrollTop = 0; //歌词滚动top重置
    },
    /**
     * 拖动进度条
     * @val {number} 进度百分比
     * */
    rateChange(val) {
      let time = (this.songTime.duration * val) / 100;
      this.$refs.audio.currentTime = time;
      this.lyric && this.lyric.seek(time * 1000); //拖动进度条后重设歌词滚动距离
    },
    /** 开始拖动时触发 */
    dragStart() {
      this.songState.isDrag = true;
    },
    /** 结束拖动时触发 */
    dragEnd() {
      this.songState.isDrag = false;
    },
    /** 打开播放页 */
    showPlayer() {
      this.SET_FULLSCREEN(true);
      this.SET_MINIMODE(false);

      this.$nextTick(() => this.showSongName());
    },
    /** 关闭播放页 */
    closePlayer() {
      this.SET_FULLSCREEN(false);
      this.SET_MINIMODE(true);

      this.$nextTick(() => this.showSongTitle());
    },
    /**
     * 处理歌词，滚动歌词，让当前歌词始终处于页面中央
     * @lineNum {number} 当前歌词所在行
     */
    handleLyric({ lineNum }) {
      //每次歌词换行时，平滑滚动到当前歌词
      const scrollToTop = () => {
        let el = this.$refs.lyric,
          top = el.scrollTop,
          num = lineNum * 36; //当前歌词距离，36为行高

        if (top >= el.scrollHeight - el.clientHeight) return; //滑动到底部则不再运行动画

        //滚动距离超过了一行
        if (top < num - 36) {
          window.requestAnimationFrame(scrollToTop);
          el.scrollTop = top + ((top < num - 36 * 3 && 24) || 3); //滚动距离超过三行时，提升滚动速度，每帧24
        } else if (top > num + 36) {
          window.requestAnimationFrame(scrollToTop);
          el.scrollTop = top - ((top > num + 36 * 3 && 24) || 3);
        }
      };
      scrollToTop();

      this.lyricLine = lineNum; //设置歌词当前行
    },
    /**
     * 歌手名过长时点击显示完整名称
     * @e {object} event对象
     * @name {array} 歌手数组
     * */
    showSinger(e, name) {
      //若文字溢出
      e.target.scrollWidth - e.target.clientWidth > 0 && Toast(...name);
    },
    /** 点击更多 */
    clickMore() {},
    /** 更换播放模式 */
    changMode() {
      let modeIndex = (this.modeIndex + 1) % 3;
      this.SET_MODEINDEX(modeIndex);

      //随机模式下需要打乱播放顺序
      let list =
        (this.modeIndex === 2 &&
          this.$shuffle(JSON.parse(JSON.stringify(this.songList)))) ||
        this.songList;
      //模式改变后，需找到当前歌曲于播放列表中的位置以便重新赋值
      let index = this.findIndex(list);

      this.SET_PLAYLIST(list);
      this.SET_CURRENTINDEX(index);
    },
    /**
     * 封装切歌方法，上一曲/下一曲
     * @bool {boolean} true为上一首，false为下一首
     * */
    prevNextSong(bool) {
      if (!this.songReady) return;

      if (this.playList.length === 1) {
        this.loopMode(); //播放列表仅一首歌时为单曲循环模式
      } else {
        this.rate = 0; //进度归零
        let index = this.currentIndex;
        if (bool) {
          index--;
          index === -1 && (index = this.playList.length - 1); //第一首切到最后一首
        } else {
          index++;
          index === this.playList.length && (index = 0); //最后一首切到第一首
        }
        this.SET_CURRENTINDEX(index);
        this.SET_SONGINDEX(this.findIndex(this.songList));
        this.lyricLine = 0; //歌词马上到第一行
        !this.playing && this.togglePlay(); //暂停时切歌情况
      }
      this.songReady = false;
    },
    /**
     * 迷你模式切歌
     * @index {number} 当前页的索引
     */
    changeSwipe(index) {
      //第一首切到最后一首 和 最后一首切到第一首情况
      (!index || index + 1 === this.playList.length) &&
        this.SET_CURRENTINDEX(index + 1);

      this.prevNextSong(this.currentIndex >= index);
    },
    /**
     * 播放/暂停歌曲
     * @id {string} id
     * */
    togglePlay() {
      if (!this.songReady) return;
      this.SET_PLAYING(!this.playing);
      this.lyric && this.lyric.togglePlay(); //暂停时候停止滚动歌词
    },
    /**
     * 获取歌词
     * @id {string} 歌曲id
     */
    getLyric(id) {
      //获取歌词
      this.$api['player/getSongDetail']({ cpid: id })
        .then(res => {
          this.SET_SONGINFO((res.lyricLrc && res.lyricLrc) || '');

          if (this.songInfo.lyricLrc) {
            this.lyric = new lyric(this.songInfo.lyricLrc, this.handleLyric); //有歌词则获取解析后的歌词对象
            this.playing && this.lyric.play();
          }
        })
        .catch(() => {
          this.SET_SONGINFO('');
          this.lyricLine = 0;
        });
    },
    /** 显示歌曲列表,并让当前歌曲位于列表列表中间 */
    showSongList() {
      this.isShowList = true;
      this.$nextTick(() => {
        let list = this.$refs.songList,
          index = this.songIndex;

        list.scrollTop = index > 4 ? index * 40 - list.clientHeight / 2 : 0; //播放歌曲下标大于4时，才设置滚动距离
      });
    },
    /**
     * 播放歌曲列表选中的歌曲
     * @index {number} 歌曲下标
     */
    selectSong(index) {
      this.selectPlay({
        list: JSON.parse(JSON.stringify(this.songList)),
        index
      });
    },
    /**
     * 删除单首歌曲
     * @song {object} 要删除的歌曲
     * */
    delSong(song) {
      this.deleteSong(song);
      this.songState.active = this.findIndex(this.songList);
    },
    /** 清空歌曲列表 */
    deleteAll() {
      Dialog.confirm({
        message: '确定要清空播放列表？'
      })
        .then(() => {
          this.isShowList = false; //关闭歌曲列表
          this.songState.miniShow = false;
          this.clearList();
        })
        .catch(() => {
          // on cancel
        });
    },
    /**
     * 动画进入事件，当cd从隐藏到显示的动画
     * @el {object} dom元素
     * @done {callback} 完成的回调
     */
    enter(el, done) {
      this.songState.miniShow = true; //展示迷你播放器
      const { x, y, scale } = this.getPosAndScale();

      //动画进度
      let animation = {
        // 第0帧的时候，先让图片缩小，显示在右下角
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        // 变回原来的尺寸，从而有一个回弹的效果
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };

      // 动画的一些配置
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400, //动画时长
          easing: 'linear' //动画运行速度
        }
      });

      animations.runAnimation(this.$refs.cdWrapper, 'move', done);
    },
    /** 进入动画完成事件 */
    afterEnter() {
      //运行完动画之后，注销掉动画
      animations.unregisterAnimation('move');
      this.$refs.cdWrapper.style.animation = '';
    },
    /** 计算cd的x y偏移量和scale缩放比例 */
    getPosAndScale() {
      const targetWidth = 46; //迷你cd大小
      const paddingLeft = 40; //迷你cd离左侧距离
      const paddingBottom = 30; //迷你cd离底部距离
      const paddingTop = 80; //cd与顶部距离
      const width = window.innerWidth * 0.8; //cd大小
      const scale = targetWidth / width; //缩放比例
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    /** 全屏模式歌名标题过长时显示的规则 */
    showSongName() {
      let name = this.$refs.songName, //歌名
        width = name.children[0].clientWidth, //标题实际宽
        diff = width - name.clientWidth, //实际宽-容器宽
        style = document.styleSheets[0]; //获取页面使用的样式列表

      //如果标题过长且没有动画效果
      if (diff > 0 && !name.classList.contains('roll-name')) {
        //设置动画，width加的40为外边距
        style.cssRules[0].name === 'showSongName' && style.deleteRule(0); //下标0被mini的暂用，所以用1
        style.insertRule(
          `@keyframes showSongName {to {transform: translateX(-${width +
            40}px)}}`
        );
        //执行动画
        this.songState.longName = true;
        name.className = 'roll-name';
      }
    },
    /** 迷你模式歌名标题过长时显示的规则 */
    showSongTitle() {
      let title = this.$refs.miniTitle[this.currentIndex], //标题元素
        width = title.clientWidth, //页标题面显示宽
        diff = title.scrollWidth - width, //滚动宽减去页面显示宽
        style = document.styleSheets[0]; //获取页面使用的样式列表

      //如果标题过长且没有动画效果
      if (diff > 0 && !title.classList.contains('title-name')) {
        let time = Math.max(Math.ceil((diff / width) * 8), 4); //动画运行时长：宽度差值/页标题面显示宽*8，且向上取整，但运行时间最少为4s（8为差值刚好为100%时的运行时长）
        style.cssRules[1].name === 'miniTitleName' && style.deleteRule(1); //清除之前写入的miniTitleName动画规则
        //插入新的动画规则
        style.insertRule(
          `@keyframes miniTitleName {to {transform: translateX(-${diff}px)}}`,
          1
        );
        title.className = 'title-name';
        title.style.animation = `miniTitleName ${time}s 2s ease-in-out infinite alternate`;
      }
    },
    /**
     * 找到歌曲位于列表中的位置
     * @list {array} 歌曲列表
     */
    findIndex(list) {
      return list.findIndex(item => item.songId === this.songInfo.songId);
    }
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
    font-size: 14px;
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
        padding-left: 10px;
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
          padding-right: 10px;
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
    transition: top 0.4s;
    .top {
      text-align: center;
      .song-name {
        overflow: hidden;
        width: 70%;
        margin: auto;
        h2 {
          white-space: nowrap;
          font-size: 18px;
          line-height: 40px;
          span {
            display: inline-block;
          }
        }
      }
      .author {
        width: 70%;
        margin: 0.1rem auto 0;
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
      .cd {
        opacity: 0;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        transition: opacity 0.25s;
        &.show {
          opacity: 1;
        }
      }
      .disc {
        box-sizing: border-box;
        width: 5.8rem;
        height: 5.8rem;
        margin: auto;
        border-radius: 50%;
        img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .lyric {
        position: relative;
        margin-top: 18px;
        line-height: 24px;
        &.cd-lyric {
          overflow: hidden;
          height: 72px;
          .cd-roll {
            position: relative;
            top: 24px;
            transition: top 0.3s;
          }
        }
        &.warp {
          overflow: scroll;
          opacity: 0;
          //position: static;
          height: 90%;
          line-height: 36px;
          transition: opacity 0.25s;
          //&:before {
          //  content: '';
          //  position: absolute;
          //  top: 18px;
          //  left: 0;
          //  z-index: 2;
          //  width: 100%;
          //  height: 90%;
          //  background-size: 100% 110px;
          //  background-repeat: no-repeat;
          //  background-position: top, bottom;
          //  backface-visibility: hidden;
          //  pointer-events: none;
          //}
          &.show {
            opacity: 1;
          }
          .roll {
            padding: 45% 0.3rem;
            transition: top 0.3s;
          }
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
        }
      }
      .progress-warp {
        display: flex;
        width: 80%;
        margin: 25px auto;
        .progress {
          flex: 1;
          margin: auto;
          /deep/.van-slider {
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            .van-slider__button {
              box-sizing: border-box;
              width: 16px;
              height: 16px;
              border-radius: 50%;
            }
          }
        }
        span {
          width: 45px;
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
          &.disabled {
            opacity: 0.3;
          }
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
    opacity: 0;
    position: fixed;
    left: 0;
    bottom: -60px;
    z-index: 10;
    align-items: center;
    width: 100%;
    height: 40px;
    transition: bottom 0.4s;
    &.show {
      opacity: 1;
      bottom: 0;
      z-index: 11;
    }
    .mini-disc {
      height: 100%;
      padding-left: 20px;
      .van-circle {
        position: absolute;
        top: -17px;
        left: 17px;
      }
      img {
        position: relative;
        bottom: 14px;
        width: 46px;
        height: 46px;
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
        font-size: 14px;
      }
    }
    .icon-svg {
      width: 24px;
      height: 24px;
      padding: 0 10px;
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
  to {
    transform: rotate(360deg);
  }
}

.roll-name {
  animation: 8s 2s showSongName linear infinite normal;
}
</style>
