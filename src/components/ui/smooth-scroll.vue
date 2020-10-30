<!-- @format -->
<template>
  <div
    ref="smoothScroll"
    class="smooth-scroll"
    @touchstart="touchstart"
    @touchend="touchend"
    @touchmove="touchmove"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    touchstart(e) {
      console.log(e);
      // console.log(this.$refs.smoothScroll.scrollTop);
    },
    touchend(e) {},
    touchmove(e) {
      // if(!document.documentElement.scrollTop){
      // }
      // console.log(e);
    }
  }
};
</script>

<style lang="less" scoped>
.smooth-scroll {
  transition: transform 1s;
  /*transform: translateY(0);*/
}
</style>
