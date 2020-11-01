<!-- @format -->
<!--搜索-->

<template>
  <div class="search">
    <!--    <icon-svg class="icon-svg search" name="icon-search"></icon-svg>-->
    <van-search
      v-model="value"
      show-action
      autofocus
      shape="round"
      background="transparent"
      placeholder="请输入搜索关键词"
      @input="onInput"
      @search="onSearch"
      @clear="showResult = false"
      @cancel="$router.go(-1)"
    />
    <!--搜索结果-->
    <div class="result" v-if="showResult && value">
      <van-tabs v-model="active" line-height="1px" :offset-top="54" sticky>
        <van-tab title="歌曲">
          <ul>
            <li
              class="van-clearfix"
              v-for="(item, index) in result"
              :key="index"
            >
              <img :src="item.cover || require('@/assets/images/logo.gif')" />
              <div class="music-name">
                <h4 class="van-ellipsis">{{ item.songName }}</h4>
                <p>{{ item.singerName }}</p>
                <i><icon-svg class="icon-svg" name="icon-more"></icon-svg></i>
              </div>
            </li>
          </ul>
        </van-tab>
        <van-tab title="歌手">内容</van-tab>
      </van-tabs>
    </div>
    <!--搜索关键词-->
    <div v-else>
      <!--输入后-->
      <div class="search-key" v-if="value">
        <p @click="onSearch">搜索"{{ value }}"</p>
        <ul>
          <li
            v-for="(item, index) in keyword"
            :key="index"
            @click="selectKeyword(item.name + '-' + item.singer)"
          >
            <van-icon name="search" />
            {{ item.name }}-{{ item.singer }}
          </li>
        </ul>
      </div>
      <!--输入前-->
      <div class="main" v-else>
        <div class="history" v-if="historyKey.length">
          <p>
            搜索历史
            <i class="clear" @click="deleteHistory"
              ><icon-svg class="icon-svg" name="icon-delete"></icon-svg
            ></i>
          </p>
          <ul>
            <li
              v-for="(item, index) in historyKey"
              :key="index"
              @click="selectKeyword(item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="hot-key">
          <p>热门搜索</p>
          <ul>
            <li
              v-for="(item, index) in hotKey"
              :key="index"
              @click="selectKeyword(item.txtData.txtName)"
            >
              {{ item.txtData.txtName }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant';

export default {
  data() {
    return {
      active: 0, //tab激活项
      value: '', //搜索内容
      showResult: false, //是否显示搜索结果列表
      historyKey: [], //搜索历史
      hotKey: [], //热门搜索关键词
      keyword: [], //输入词列表
      result: [] //搜索结果
    };
  },
  created() {
    this.getHotKey();
    //获取本地的搜索记录
    localStorage.getItem('historyKey') &&
      (this.historyKey = JSON.parse(localStorage.getItem('historyKey')));
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
     * 点击关键词搜索
     * @val {string} 选中的关键词
     * */
    selectKeyword(val) {
      this.value = val;
      this.onSearch();
    },
    /**
     * 获取输入内容联想词
     * @val {string} 输入的内容
     * */
    onInput(val) {
      this.$api['search/getKeyword']({ keyword: val }).then(res => {
        this.keyword = res.key;
      });
    },
    /** 点击搜索 */
    onSearch() {
      this.$api['search/getSearchResult']({
        keyword: this.value, //搜索词
        rows: 20, //每页显示数
        pgc: 1, //页码
        type: 2 //1为歌手，2为歌曲，4为专辑，6为歌单
      }).then(res => {
        this.result = res.musics;
        this.showResult = true;

        //将搜索词存入本地历史记录
        this.historyKey.length >= 10 && this.historyKey.pop(); //最多10条搜索历史
        this.historyKey.unshift(this.value); //往数组前添加
        localStorage.setItem('historyKey', JSON.stringify(this.historyKey));
      });
    },
    /** 清空搜索历史 */
    deleteHistory() {
      Dialog.confirm({
        message: '确定要清空搜索历史？'
      })
        .then(() => {
          this.historyKey = [];
          localStorage.removeItem('historyKey');
        })
        .catch(() => {
          // on cancel
        });
    }
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
  min-height: 100vh;
  background-color: #222;
  .search.icon-svg {
    position: absolute;
    right: 0.2rem;
    top: 0.15rem;
  }
  /deep/.van-icon {
    color: #999 !important;
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
  .hot-key,
  .history {
    margin-bottom: 20px;
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
  .history .clear {
    float: right;
    .icon-svg {
      width: 0.36rem;
      height: 0.36rem;
      color: #666;
    }
  }
  .search-key {
    padding: 0 0.25rem;
    color: #fff;
    font-size: 16px;
    p {
      padding: 5px 0 10px;
      border-bottom: 1px solid #333;
      color: #ffcd32;
    }
    li {
      position: relative;
      margin-left: 26px;
      padding: 10px 0 10px 10px;
      border-bottom: 1px solid #333;
      line-height: 24px;
      i {
        position: absolute;
        left: -24px;
        top: 14px;
        color: #999 !important;
      }
    }
  }
  .result {
    /deep/.van-tabs--line .van-tabs__wrap {
      height: 0.5rem;
      .van-tab {
        line-height: 0.5rem;
        font-size: 0.16rem;
      }
      .van-tabs__content {
        padding: 0 0.25rem;
      }
    }
    ul {
      margin-top: 20px;
      padding: 0 0.25rem;
      li {
        margin-top: 0.2rem;
        color: #fff;
        img {
          float: left;
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
        }
        .music-name {
          position: relative;
          float: right;
          width: 85%;
          border-bottom: 1px solid #333;
          padding-bottom: 0.2rem;
          font-size: 0.28rem;
          h4 {
            width: 92%;
            margin-bottom: 0.1rem;
            color: #b9b9b9;
          }
          p {
            width: 92%;
            color: #666;
          }
          i {
            position: absolute;
            right: 0;
            top: 0.22rem;
            .icon-svg {
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>
