<!-- @format -->
<!--首页-->

<template>
  <div class="home">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-swipe
        v-if="bannerList.length"
        :autoplay="3000"
        indicator-color="#ffcd32"
      >
        <van-swipe-item v-for="(item, i) in bannerList" :key="i"
          ><img :src="item.linkData.linkPicUrl"
        /></van-swipe-item>
      </van-swipe>
      <van-loading v-else type="spinner" vertical>加载中...</van-loading>
      <h3>新歌速递</h3>
      <van-list
        v-if="newSongList.length"
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          class="cell van-clearfix"
          v-for="(item, index) in newSongList"
          :key="index"
          @click="selectSong(index)"
        >
          <img :src="item.picM" />
          <div class="con fl">
            <p class="no-wrap">{{ item.songName }}</p>
            <p class="no-wrap name">
              <span v-for="(name, index) in item.singerName" :key="index">{{
                name
              }}</span>
            </p>
          </div>
        </div>
      </van-list>
      <van-loading v-else type="spinner" vertical style="margin-top: 1.5rem;"
        >加载中...</van-loading
      >
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      isLoading: false, //是否正在下拉刷新
      loading: false, //列表是否正在加载
      finished: false, //列表数据否全部加载完
      nowTime: 0, //请求的时间戳，以便节流处理
      bannerList: [], //轮播图列表
      newSongList: [], //新歌速递列表
      pageNum: 0 //新歌列表页码
    };
  },
  created() {
    this.getBanner();
    this.getNewSong(0);
  },
  methods: {
    ...mapActions(['selectPlay']),
    /**
     * 获取轮播图列表
     */
    getBanner() {
      this.$api['home/getBanner']().then(res => {
        this.bannerList = res.results;
      });
    },
    /**
     * 获取新歌速递
     * @pageNum {number} 页码
     */
    getNewSong(pageNum) {
      this.$api['home/getNewSongList']({
        pageNo: pageNum
      }).then(res => {
        res.results.forEach(item => {
          this.newSongList.push(item.songData);
        });
        this.newSongList.length >= res.totalCount && (this.finished = true); //数据全部加载完毕
      });
    },
    /** 加载更多 */
    onLoad() {
      let time = Date.now();
      //节流处理
      if (time - this.nowTime > 200) {
        this.getNewSong(++this.pageNum);
        this.nowTime = time;
      }
      this.loading = false;
    },
    /** 下拉刷新 */
    onRefresh() {
      this.bannerList = [];
      this.newSongList = [];
      this.isLoading = false;
      this.getBanner();
      this.getNewSong(0);
    },
    /**
     * 点击播放歌曲
     * @index {number} 歌曲在列表的下标
     */
    selectSong(index) {
      let isFilter = false; //过滤后的列表，无需再次过滤
      //播放歌曲
      this.selectPlay({
        list: JSON.parse(JSON.stringify(this.newSongList)),
        index,
        isFilter
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  /deep/.van-swipe {
    height: 3rem;
    .van-swipe__indicator {
      background-color: #fff;
    }
    img {
      width: 100%;
      height: 3rem;
    }
  }
  h3 {
    margin-top: 0.1rem;
    text-align: center;
    font-size: 14px;
    line-height: 2;
  }
  /deep/.van-loading__text {
    font-size: 0.18rem;
  }
  .cell {
    height: 1.5rem;
    padding: 0.15rem 0.4rem;
    img {
      float: left;
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.45rem;
    }
    .con {
      font-size: 0.3rem;
      .name {
        margin-top: 0.3rem;
        span {
          margin-right: 0.2rem;
        }
      }
    }
  }
}
</style>
