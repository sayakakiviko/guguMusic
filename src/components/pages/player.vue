<!-- @format -->
<!--歌曲播放页面-->

<template>
  <div class="player" v-show="playList.length">
    <div class="normal-player" v-show="fullScreen">
      <van-icon name="arrow-down" size="0.42rem" v-back />
      <van-icon name="like-o" size="0.42rem" />
      <van-icon name="play-circle-o" size="0.42rem" />
      <van-icon name="pause-circle-o" size="0.42rem" />
      <van-icon name="icon-order" size="0.42rem" />
    </div>
    <div class="mini-player" v-show="!fullScreen"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {};
  },
  created() {},
  computed: mapState(['playList', 'fullScreen']),
  methods: {}
};
</script>

<style lang="less" scoped>
.player {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: #222;
}
</style>
