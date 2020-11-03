<!-- @format -->
<!--歌手详情页（搜索用）-->

<template>
  <div class="singer-detail">
    <commonDetail
      :singer-id="$route.query.artistId"
      :avatar="$route.query.img"
    ></commonDetail>
  </div>
</template>

<script>
import commonDetail from './child/commonDetail';
export default {
  components: { commonDetail }
};
</script>

<style lang="less" scoped>
.singer-detail {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100%;
  min-height: 100%;
}
</style>
