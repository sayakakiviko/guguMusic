<!-- @format -->

<template>
  <div class="rank">排行{{ playing }}</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {};
  },
  created() {},
  computed: mapState(['playing']),
  methods: {}
};
</script>

<style lang="less" scoped>
.rank {
}
</style>
