<!-- @format -->
<!--歌手详情页-->

<template>
  <div class="singer-detail">
    <van-icon name="arrow-left" color="#ffcd32" size="0.42rem" v-back />
    <div class="singer-img" :class="{ sticky: isSticky }">
      <div>
        <img :src="$route.query.img" />
        <p>{{ singerDetail.artistName }}</p>
      </div>
    </div>
    <!--tab标签-->
    <van-tabs
      v-model="active"
      :class="{ sticky: isSticky }"
      color="#ffcd32"
      title-active-color="#ffcd32"
      line-height="1px"
      swipeable
      animated
    >
      <van-tab title="歌曲列表">
        <div
          class="song-list"
          :class="{ sticky: isSticky }"
          v-if="songList.length"
        >
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
      </van-tab>
      <van-tab title="歌手详情">
        <p class="info" :class="{ sticky: isSticky }">
          {{ singerDetail.intro }}
        </p>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0, //tab激活项
      tabScroll: [0, 0], //
      loading: false, //列表是否正在加载
      finished: false, //列表数据否全部加载完
      isSticky: false, //滑动一定距离后背景图是否固定
      //页面上需要获取处理的高度
      page: {
        topHigh: 275, //顶部标签栏需空出的高度，基于750px
        pageHeight: 0, //页面高度
        clientHeight: document.documentElement.clientHeight //可视区高度
      },
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
    this.page.topHigh =
      (this.page.topHigh *
        parseFloat(document.documentElement.style.fontSize)) /
      100; //计算应该空出的高度

    this.getDetail();
    this.getSong(0);
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
    /**
     * 获取歌手作品
     * @pageNum {number} 页码
     * */
    getSong(pageNum) {
      this.$api['singer/getSongList']({
        artistId: this.singerId,
        pageNo: pageNum,
        pageSize: 20
      }).then(res => {
        if (res.results.length) {
          res.results.length < 20 && (this.finished = true); //判断首次加载歌曲数量是否满足允许再次请求
          this.songList.push(...res.results);
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

      //页面滚动到底部，还有数据情况下加载数据并做节流处理
      if (
        !this.finished &&
        page.pageHeight - page.clientHeight - 50 <= Y &&
        time - this.nowTime > 200
      ) {
        this.getSong(++this.pageNum);
        this.nowTime = time;
      }
    },
    /** tab切换 */
    changeTab() {
      this.$set(this.tabScroll, this.active, window.pageYOffset);
      // debugger;
      console.log(this.active);
      console.log(window.pageYOffset);
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
    &.sticky {
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
  /deep/.van-tabs__nav {
    background-color: #222;
  }
  /deep/.sticky .van-hairline--top-bottom {
    position: fixed;
    top: 0.85rem;
    z-index: 1;
    width: 100%;
  }
  .song-list {
    padding: 0.3rem 0;
    background-color: #222;
    //transform: translateY(-3rem);
    /*transform: translateY(0);*/
    /*transition-duration: 0.3s;*/
    &.sticky {
      padding-top: 4.8rem;
    }
    .cell {
      padding: 0.15rem 0.4rem;
      p {
        font-size: 0.28rem;
        color: #b9b9b9;
        &.name {
          margin-top: 0.1rem;
          color: #666;
          span {
            margin-right: 0.2rem;
            font-size: 0.26rem;
          }
        }
      }
    }
  }
  .info {
    padding: 0.3rem 0.4rem;
    font-size: 0.28rem;
    color: #b9b9b9;
    &.sticky {
      padding-top: 4.8rem;
    }
  }
}
</style>
