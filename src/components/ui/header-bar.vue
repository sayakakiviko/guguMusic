<!-- @format -->
<template>
  <div class="header-bar">
    <div class="title">
      <img src="../../assets/images/logo.gif" class="logo" />
      <h1 class="title">咕咕~</h1>
      <div class="user">
        <i class="iconfont icon-user"></i>
      </div>
    </div>
    <!--tab选项卡的切换-->
    <van-tabs
      v-model="tabActive"
      background="#222"
      color="#ffcd32"
      title-active-color="#ffcd32"
      line-height="1px"
    >
      <van-tab title="首页" to="home"></van-tab>
      <van-tab title="歌手" to="singer"></van-tab>
      <van-tab title="排行" to="rank"></van-tab>
      <van-tab title="搜索" to="search"></van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabActive: 0 //tab选中项
    };
  }
};
</script>

<style lang="less" scoped>
.header-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0.1rem 0;
  background-color: #222;
  .title {
    margin-bottom: 0.1rem;
    text-align: center;
    line-height: 0.35rem;
    .logo {
      margin-right: 0.1rem;
      width: 0.5rem;
      height: 0.5rem;
      vertical-align: middle;
      border-radius: 50%;
    }
    .title {
      display: inline-block;
      font-size: 0.24rem;
      color: #ffcd32;
    }
    .user {
      position: absolute;
      right: 0.1rem;
      top: 0.1rem;
      padding: 0.15rem;
      width: 0.2rem;
      height: 0.2rem;
      color: #ffcd32;
      font-size: 0.2rem;
      .iconfont {
        position: absolute;
        left: 0;
        right: 0;
        top: 0.1rem;
        bottom: 0;
        margin: auto;
      }
    }
  }
  /deep/.van-tabs--line .van-tabs__wrap {
    height: 0.5rem;
    .van-tab {
      line-height: 0.5rem;
      font-size: 0.14rem;
      color: #909090;
    }
  }
  /deep/.van-hairline--top-bottom::after,
  /deep/.van-hairline-unset--top-bottom::after {
    border-width: 0;
  }
}
</style>
