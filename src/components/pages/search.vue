<!-- @format -->

<template>
  <div class="search">
    <!--    <icon-svg class="icon-svg" name="icon-search"></icon-svg>-->
    <van-search
      v-model="value"
      show-action
      autofocus
      shape="round"
      background="transparent"
      placeholder="请输入搜索关键词"
      @input="onInput"
      @search="onSearch"
      @cancel="$router.go(-1)"
    />
    <div class="hot-key">
      <p>热门搜索</p>
      <ul>
        <li v-for="(item, index) in hotKey" :key="index">
          {{ item.txtData.txtName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '', //搜索内容
      hotKey: [] //热门搜索关键词
    };
  },
  created() {
    this.getHotKey();
  },
  methods: {
    /** 获取热门搜索 */
    getHotKey() {
      this.$api['rank/getRankData']({
        nid: 24041523,
        type: 2005,
        pageSize: 10,
        pageNo: 0
      }).then(res => {
        this.hotKey = res.results;
      });
    },
    /**
     * 输入内容
     * @val {string} 输入的内容
     * */
    onInput(val) {
      this.$api['search/getKeyword']({ keyword: val }).then(res => {
        console.log(res);
        // this.hotKey = res.results;
      });
    },
    /**
     * 点击搜索
     * @val {string} 搜索的内容
     * */
    onSearch(val) {}
  }
};
</script>

<style lang="less" scoped>
.search {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100vh;
  background-color: #222;
  .icon-svg {
    position: absolute;
    right: 0.2rem;
    top: 0.15rem;
  }
  /deep/.van-search__content {
    background-color: #333;
    .van-field__control {
      color: #fff;
    }
  }
  .van-search__action {
    color: #fff;
  }
  .hot-key {
    padding: 0 0.25rem;
    color: #999;
    p {
      margin: 10px 0 20px;
      font-size: 14px;
    }
    li {
      display: inline-block;
      margin: 0 10px 10px 0;
      padding: 5px 10px;
      background-color: #333;
      border-radius: 0.5rem;
    }
  }
}
</style>
