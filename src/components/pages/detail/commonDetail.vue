<!-- @format -->
<!--歌手详情页-->

<template>
  <div
    ref="singerDetail"
    class="common-detail"
    :class="{ pt60: $store.state.miniMode }"
  >
    <!--    <smoothScroll>-->
    <van-icon name="arrow-left" size="0.4rem" v-back />
    <div class="singer-img" :class="{ sticky: isSticky }">
      <div>
        <img :src="avatar" @click="showInfo" />
        <p @click="backTop">{{ singerDetail.artistName }}</p>
      </div>
    </div>
    <!--歌曲列表-->
    <div class="song-list" :class="{ sticky: isSticky }" v-if="songList.length">
      <div
        class="cell"
        v-for="(item, index) in songList"
        :key="item.songId"
        v-show="item.listenUrl"
        @click="selectSong(index)"
      >
        <p class="no-wrap">{{ item.songName }}</p>
        <p class="no-wrap name">
          <span v-for="(name, index) in item.singerName" :key="index">{{
            name
          }}</span>
        </p>
      </div>
      <van-divider
        v-if="finished"
        :style="{
          margin: 'auto',
          width: '80%',
          borderColor: '#666',
          color: '#666'
        }"
        >已无更多</van-divider
      >
    </div>
    <van-loading v-else type="spinner" vertical style="margin-top: 1.5rem;"
      >加载中...</van-loading
    >

    <!--歌手详情-->
    <div
      class="info"
      :style="{ top: infoShow ? `${page.scrollHeight}px` : '-100vh' }"
      @touchmove.prevent
    >
      <img :src="avatar" />
      <h3>{{ singerDetail.artistName }}</h3>
      <p @touchmove.stop>{{ singerDetail.intro }}</p>
      <van-icon name="cross" size="20" color="#666" @click="closeInfo" />
    </div>
    <!--    </smoothScroll>-->
  </div>
</template>

<script>
import smoothScroll from '@/components/ui/smoothScroll';
// import BScroll from 'better-scroll';
import { mapMutations, mapActions } from 'vuex';
export default {
  // components: { smoothScroll },
  props: {
    singerId: [String, Number], //歌手id
    //歌手头像
    avatar: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      active: 0, //tab激活项
      loading: false, //列表是否正在加载
      finished: false, //列表数据否全部加载完
      isSticky: false, //滑动一定距离后背景图是否固定
      infoShow: false, //歌手详情显示状态
      //页面上需要获取处理的高度
      page: {
        topHigh: 275, //顶部标签栏需空出的高度，基于750px
        scrollHeight: 0, //滚动距离
        pageHeight: 0, //页面高度
        clientHeight: document.documentElement.clientHeight //可视区高度
      },
      singerDetail: {}, //歌手信息
      songList: [], //歌曲列表
      pageNum: 0, //歌曲页码
      nowTime: 0 //请求的时间戳，以便节流处理
    };
  },
  mounted() {
    // console.log(this.page.clientHeight);
    // console.log(document.getElementsByClassName('singer-img')[0].clientHeight);
    window.addEventListener('scroll', this.getScrollTop); //监听滚动事件
    this.page.topHigh =
      (this.page.topHigh *
        parseFloat(document.documentElement.style.fontSize)) /
      100; //计算应该空出的高度

    this.getSingerDetail();
    this.getSongList(0);

    // this.$nextTick(() => {
    //   this.scroll = new BScroll(this.$refs.scroll, {
    //     probeType: 1,
    //     click: true
    //   });
    // });
  },
  destroyed() {
    window.removeEventListener('scroll', this.getScrollTop); //解绑监听
  },
  methods: {
    ...mapMutations(['SET_PLAYLIST']),
    ...mapActions(['selectPlay']),
    /** 获取歌手详情 */
    getSingerDetail() {
      this.$api['singer/getSingerDetail']({ artistId: this.singerId }).then(
        res => {
          this.singerDetail = res;
        }
      );
    },
    /**
     * 获取歌手作品列表
     * @pageNum {number} 页码
     * */
    getSongList(pageNum) {
      this.$api['singer/getSongList']({
        artistId: this.singerId, //歌手id
        pageNo: pageNum,
        pageSize: 50
      }).then(res => {
        let tempList = res.results;
        if (tempList.length) {
          tempList.length < 50 && (this.finished = true); //判断首次加载歌曲数量是否满足允许再次请求

          tempList.forEach(item => {
            item.listenUrl && this.songList.push(item); //过滤掉不能播放的歌曲
          });
          this.SET_PLAYLIST(tempList);

          //列表更新后再判断新列表是否满足一页
          this.$nextTick(() => {
            this.$refs.singerDetail.scrollHeight <= window.innerHeight &&
              this.getSongList(++this.pageNum);
          });
        } else {
          this.finished = true;
        }

        // 获取页面高度
        this.$nextTick(() => {
          this.page.pageHeight = document.getElementsByClassName(
            'singer-detail'
          )[0].clientHeight;
        });
      });
    },
    /** 获取页面滚动距离以固定顶部 */
    getScrollTop() {
      let page = this.page,
        Y = window.pageYOffset, //滚动距离
        time = Date.now(); //获取时间戳
      this.isSticky = (Y >= page.topHigh && true) || false;
      this.page.scrollHeight = Y;

      //页面滚动到底部，还有数据情况下加载数据并做节流处理
      if (
        !this.finished &&
        page.pageHeight - page.clientHeight - 50 <= Y &&
        time - this.nowTime > 200
      ) {
        this.getSongList(++this.pageNum);
        this.nowTime = time;
      }
    },
    /** 返回顶部 */
    backTop() {
      const scrollToTop = () => {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
          window.requestAnimationFrame(scrollToTop);
          window.scrollTo(0, c - c / 8);
        }
      };
      scrollToTop();
    },
    /** 显示歌手资料 */
    showInfo() {
      this.infoShow = true;
      setTimeout(() => {
        this.$store.commit('SET_PLAYERLEVEL', 0); //隐藏播放页
      }, 300);
    },
    /** 关闭歌手资料 */
    closeInfo() {
      this.infoShow = false;
      this.$store.commit('SET_PLAYERLEVEL', 10); //还原播放页
    },
    /**
     * 点击播放歌曲
     * @index {number} 歌曲在列表的下标
     */
    selectSong(index) {
      //播放歌曲
      this.selectPlay({
        list: JSON.parse(JSON.stringify(this.songList)),
        index
      });
    }
  }
};
</script>

<style lang="less" scoped>
.common-detail {
  .singer-img {
    position: relative;
    width: 100%;
    height: 3.6rem;
    background-image: url('~@/assets/images/singer-detail-bg.jpg');
    &.sticky {
      position: fixed;
      top: -2.75rem;
      z-index: 1;
    }
    div {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 1.68rem;
      height: 1.68rem;
      text-align: center;
      font-size: 0.28rem;
      font-weight: bold;
      img {
        margin-bottom: 0.3rem;
        width: 1.68rem;
        height: 1.68rem;
        border-radius: 50%;
      }
    }
  }
  /*/deep/.sticky .van-hairline--top-bottom {
    position: fixed;
    top: 0.85rem;
    z-index: 1;
    width: 100%;
  }*/
  .song-list {
    //margin-top: 0;
    padding: 0.3rem 0;
    //transition: margin-top 0.3s;
    &.sticky {
      padding-top: 3.9rem;
    }
    //&.hide{
    //  margin-top: calc(100vh - 3.6rem);
    //}
    .cell {
      padding: 0.15rem 0.4rem;
      p {
        font-size: 0.28rem;
        &.name {
          margin-top: 0.1rem;
          span {
            margin-right: 0.2rem;
            font-size: 0.26rem;
          }
        }
      }
    }
  }
  .info {
    overflow: hidden;
    position: absolute;
    left: 0;
    top: -100vh;
    z-index: 2;
    height: 100vh;
    background-color: #fff;
    transition: top 0.4s;
    //background: no-repeat center/cover;
    //filter: blur(30px);
    //div {
    //  position: absolute;
    //  left: 0;
    //  top: 0;
    //  width: 110%;
    //  height: 100%;
    //  background: no-repeat center/cover;
    //  filter: blur(30px);
    //}
    img {
      display: block;
      position: relative;
      z-index: 1;
      width: 1.68rem;
      height: 1.68rem;
      margin: 0.8rem auto 0.5rem;
      border-radius: 50%;
    }
    h3 {
      position: relative;
      z-index: 1;
      margin-bottom: 0.5rem;
      text-align: center;
      font-size: 18px;
    }
    p {
      overflow-y: scroll;
      position: relative;
      z-index: 1;
      width: 80%;
      height: 60vh;
      margin: auto;
      font-size: 12px;
    }
    .van-icon {
      display: block;
      position: relative;
      z-index: 1;
      margin: 0.5rem;
      text-align: center;
    }
  }
}
</style>
