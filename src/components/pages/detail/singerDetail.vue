<!-- @format -->
<!--歌手详情页-->

<template>
  <div class="singer-detail">
    <van-icon name="arrow-left" color="#ffcd32" size="0.42rem" v-back />
    <div class="singer-img" :class="{ fixed: isFixed }">
      <div>
        <img :src="$route.query.img" />
        <p>{{ singerDetail.artistName }}</p>
      </div>
    </div>
    <div class="song-list" :class="{ fixed: isFixed }" v-if="songList.length">
      <!--<van-list finished-text="没有更多了" v-model="loading" @load="onLoad">-->
      <div
        class="cell"
        v-for="item in songList"
        :key="item.songId"
        v-show="item.songName"
      >
        <p class="no-wrap">{{ item.songName }}</p>
        <p class="no-wrap name">
          <span v-for="(name, index) in item.singerName" :key="index">{{
            name
          }}</span>
        </p>
      </div>
      <!--</van-list>-->
      <!--<van-divider>文字</van-divider>-->
    </div>
    <van-loading v-else type="spinner" vertical style="margin-top: 1.5rem;"
      >加载中...</van-loading
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false, //列表是否正在加载
      isFixed: false, //滑动一定距离后背景图是否固定
      topHigh: 275, //顶部标签栏应该空出的高度，基于750px
      pageHeight: 0, //页面高度
      singerId: 0, //歌手id
      singerDetail: {}, //歌手信息
      songList: [], //歌曲列表
      pageNum: 0, //歌曲页码
      nowTime: 0 //请求的时间戳，以便节流处理
    };
  },
  mounted() {
    this.singerId = this.$route.query.artistId;
    window.addEventListener('scroll', this.getScrollTop); //监听滚动事件
    this.topHigh =
      (this.topHigh * parseFloat(document.documentElement.style.fontSize)) /
      100; //计算应该空出的高度

    this.getDetail();
    this.getSong();
  },
  destroyed() {
    window.removeEventListener('scroll', this.getScrollTop); //解绑监听
  },
  methods: {
    /** 获取歌手详情 */
    getDetail() {
      this.$api['singer/getSingerDetail']({ artistId: this.singerId }).then(
        res => {
          this.singerDetail = res;
        }
      );
    },
    /** 获取歌手作品 */
    getSong() {
      this.$api['singer/getSongList']({
        artistId: this.singerId,
        pageNo: this.pageNum,
        pageSize: 20
      }).then(res => {
        this.songList = res.results;

        this.pageHeight = document.getElementsByClassName(
          'singer-detail'
        )[0].clientHeight;
      });
    },
    /** 获取页面滚动距离以固定顶部 */
    getScrollTop() {
      this.isFixed = (window.pageYOffset >= this.topHigh && true) || false;
    },
    /** 加载更多 */
    onLoad() {
      console.log(555);
      // let time = Date.now();
      // //节流处理
      // if (time - this.nowTime > 200) {
      //   this.getNewSong(++this.pageNum);
      //   this.nowTime = time;
      // }
      // this.loading = false;
    }
  }
};
</script>

<style lang="less" scoped>
.singer-detail {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  min-height: 100%;
  background-color: #222;
  .van-icon-arrow-left {
    position: fixed;
  }
  .singer-img {
    position: relative;
    width: 100%;
    height: 3.6rem;
    background-image: url('~@/assets/images/singer-detail-bg.jpg');
    &.fixed {
      position: fixed;
      top: -2.75rem;
      z-index: 1;
      &:before {
        content: '';
        display: block;
      }
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
      color: #fff;
      img {
        margin-bottom: 0.2rem;
        width: 1.68rem;
        height: 1.68rem;
        border-radius: 50%;
      }
    }
  }
  .song-list {
    padding: 0.3rem 0;
    background-color: #222;
    //transform: translateY(-3rem);
    /*transform: translateY(0);*/
    /*transition-duration: 0.3s;*/
    &.fixed {
      padding-top: 4rem;
    }
    .cell {
      padding: 0.15rem 0.4rem;
      p {
        font-size: 0.28rem;
        color: #fff;
        &.name {
          margin-top: 0.1rem;
          span {
            margin-right: 0.2rem;
            font-size: 0.26rem;
            color: hsla(0, 0%, 100%, 0.3);
          }
        }
      }
    }
  }
}
</style>
