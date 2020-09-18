<!-- @format -->

<template>
  <div class="singer">
    <van-index-bar highlight-color="#ffcd32" :index-list="indexList">
      <div class="area" v-for="(obj, i) in singerList" :key="i">
        <van-index-anchor :index="obj.key" />
        <div v-for="(item, j) in obj.arr" :key="j">
          <div class="cell">
            <img :src="item.img" />
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
    </van-index-bar>
  </div>
</template>

<script>
import singerData from '@/assets/js/singerData';
export default {
  data() {
    return {
      indexList: [], //侧边索引栏
      singerList: [] //歌手列表
    };
  },
  created() {
    this.getData();
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
    .van-index-anchor {
      background-color: #333;
      color: #999;
    }
    .van-index-bar__sidebar {
      padding: 0.2rem 0;
      background-color: rgba(24, 24, 24, 0.5);
      color: #999;
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
      color: #999;
    }
  }
}
</style>
