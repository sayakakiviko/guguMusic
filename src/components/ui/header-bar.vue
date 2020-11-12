<!-- @format -->
<template>
  <div class="header-bar">
    <div class="title">
      <img src="../../assets/images/logo.gif" class="logo" />
      <h1 class="tit">咕咕~</h1>
      <icon-svg
        class="icon-svg search"
        name="icon-search"
        v-jump="['search']"
      ></icon-svg>
    </div>
    <!--tab选项卡的切换-->
    <van-tabs v-model="tabActive" line-height="1px">
      <van-tab title="首页" to="home"></van-tab>
      <van-tab title="歌手" to="singer"></van-tab>
      <van-tab title="排行" to="rank"></van-tab>
      <van-tab title="我的" to="my"></van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabActive: 0 //tab选中项
    };
  },
  mounted() {
    let arr = ['home', 'singer', 'rank', 'my'];
    //根据路由设定tab的位置
    setTimeout(() => {
      this.tabActive = arr.findIndex(
        value => value === this.$route.matched[0].name
      );
    }, 200);
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.header-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0.1rem 0;
  .title {
    margin-bottom: 0.1rem;
    text-align: center;
    line-height: 0.75rem;
    .logo {
      margin-right: 0.1rem;
      width: 0.7rem;
      height: 0.7rem;
      vertical-align: middle;
      border-radius: 50%;
    }
    .tit {
      display: inline-block;
      font-size: 0.24rem;
    }
    .search.icon-svg {
      position: absolute;
      right: 0.2rem;
      top: 0.35rem;
      width: 0.36rem;
      height: 0.36rem;
    }
  }
  /deep/.van-tabs--line .van-tabs__wrap {
    height: 0.8rem;
    .van-tab {
      line-height: 0.8rem;
      font-size: 14px;
    }
  }
}
</style>
