<!-- @format -->
<!--歌手列表-->

<template>
  <div class="singer">
    <van-index-bar :sticky-offset-top="topPosition" :index-list="indexList">
      <div class="area" v-for="(obj, i) in singerList" :key="i">
        <van-index-anchor :index="obj.key" />
        <div
          class="cell"
          v-for="(item, j) in obj.arr"
          :key="j"
          v-jump="['singerDetail', { artistId: item.artistId, img: item.img }]"
        >
          <img :src="item.img" />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </van-index-bar>
    <!--歌手详情-->
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import singerData from '@/assets/js/singerData';
export default {
  data() {
    return {
      topPosition: 130, //自动吸顶时与顶部的距离，750px设计图下为130px
      indexList: [], //侧边索引栏
      singerList: [] //歌手列表
    };
  },
  mounted() {
    this.getData();
    //计算不同分辨率下锚点自动吸顶时与顶部的距离
    this.topPosition =
      this.topPosition *
      (parseFloat(document.documentElement.style.fontSize) / 100);
  },
  methods: {
    /** 获取歌手数据列表 */
    getData() {
      singerData.forEach(item => {
        this.indexList.push(item.key);
      });
      this.singerList = singerData;
    }
  }
};
</script>

<style lang="less" scoped>
.singer {
  padding-bottom: 0.2rem;
  /deep/.van-index-bar {
    .van-hairline--bottom::after {
      display: none;
    }
    .van-index-bar__sidebar {
      padding: 0.2rem 0;
      border-radius: 0.2rem;
      .van-index-bar__index {
        padding: 0 0.08rem 0.04rem;
      }
    }
  }
  .cell {
    padding: 0.2rem 0.4rem;
    img {
      float: left;
      width: 0.75rem;
      height: 0.75rem;
      margin-right: 0.35rem;
      border-radius: 50%;
    }
    p {
      display: inline-block;
      font-size: 0.26rem;
      line-height: 0.75rem;
    }
  }
}
</style>
