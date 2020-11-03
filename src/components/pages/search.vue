<!-- @format -->
<!--搜索-->

<template>
  <div ref="search" class="search" :class="{ 'show-child': showChild }">
    <van-search
      v-model="value"
      show-action
      autofocus
      :disabled="disabled"
      :class="{ 'search-run': searchRun }"
      shape="round"
      background="#222"
      placeholder="请输入搜索关键词"
      @focus="onFocus"
      @input="onInput"
      @search="onSearch(value, 1)"
      @clear="showResult = false"
      @cancel="$router.go(-1)"
    />
    <!--搜索结果-->
    <div
      class="result"
      :class="{ pt60: $store.state.miniMode }"
      v-if="showResult && value"
    >
      <van-tabs
        v-model="active"
        sticky
        :offset-top="54"
        line-height="1px"
        :before-change="beforeChange"
        @rendered="onSearch(value, 1)"
        @change="changeTab"
      >
        <van-tab title="歌曲">
          <van-list
            v-if="result.musics.length"
            v-model="loading[active]"
            :finished="finished[active]"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div
              class="cell van-clearfix"
              :class="{ 'no-play': item.unuseFlag }"
              v-for="(item, index) in result.musics"
              :key="item.id"
              @click="selectSong(index, item.unuseFlag)"
            >
              <img :src="item.cover || require('@/assets/images/logo.gif')" />
              <div class="right-part">
                <h4 class="van-ellipsis">
                  {{ item.songName }}
                </h4>
                <p>
                  {{ item.singerName }}
                </p>
                <icon-svg class="icon-svg" name="icon-more"></icon-svg>
              </div>
            </div>
          </van-list>
        </van-tab>
        <van-tab title="歌手">
          <van-list
            v-if="result.artists.length"
            v-model="loading[active]"
            :finished="finished[active]"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div
              class="singer cell van-clearfix"
              v-for="(item, index) in result.artists"
              :key="index"
              v-jump="[
                'searchSingerDetail',
                { artistId: item.id, img: item.artistPicM }
              ]"
            >
              <img
                :src="item.artistPicM || require('@/assets/images/logo.gif')"
              />
              <div class="right-part">
                <h4>{{ item.title }}</h4>
                <p>歌曲数量 {{ item.songNum }}</p>
                <p>专辑数量 {{ item.albumNum }}</p>
                <van-icon class="icon-svg" name="arrow" />
              </div>
            </div>
          </van-list>
        </van-tab>
        <van-tab title="专辑">
          <van-list
            v-if="result.albums.length"
            v-model="loading[active]"
            :finished="finished[active]"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div
              class="singer cell van-clearfix"
              v-for="(item, index) in result.albums"
              :key="index"
            >
              <img
                :src="item.albumPicM || require('@/assets/images/logo.gif')"
              />
              <div class="right-part">
                <h4>{{ item.title }}</h4>
                <p>
                  <span v-for="(singer, i) in item.singer" :key="i"
                    >{{ (i && ',') || '' }}{{ singer.name }}</span
                  >
                </p>
                <p>{{ item.publishDate }}</p>
                <van-icon class="icon-svg" name="arrow" />
              </div>
            </div>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
    <!--搜索关键词-->
    <div v-else>
      <!--输入后-->
      <div class="search-key" v-if="value && !disabled">
        <p @click="onSearch(value, 1)">搜索"{{ value }}"</p>
        <ul>
          <li
            v-for="(item, index) in keyword"
            :key="index"
            @click="clickSearch(item.name + '-' + item.singer)"
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
              @click="clickSearch(item)"
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
              @click="clickSearch(item.txtData.txtName)"
            >
              {{ item.txtData.txtName }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!--歌手详情-->
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import { mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      active: 0, //tab激活项
      value: '', //搜索内容
      tabScrollTop: [0, 0, 0], //每个标签页的滚动距离
      showChild: false, //是否打开了子路由
      loading: [false, false, false], //列表是否正在加载
      finished: [false, false, false], //是否全部加载完毕
      disabled: false, //是否禁用输入框
      searchRun: false, //搜索框是否载入动画
      showResult: false, //是否显示搜索结果列表
      historyKey: [], //搜索历史
      hotKey: [], //热门搜索关键词
      keyword: [], //输入词列表
      //搜索结果
      result: {
        musics: [], //歌曲列表
        artists: [], //歌手列表
        albums: [] //专辑列表
      },
      resultType: [2, 1, 4], //搜索结果类型。1为歌手，2为歌曲，4为专辑，6为歌单
      pageNum: [1, 1, 1], //页码
      nowTime: 0 //请求的时间戳，以便节流处理
    };
  },
  created() {
    this.getHotKey();
    //获取本地的搜索记录
    localStorage.getItem('historyKey') &&
      (this.historyKey = JSON.parse(localStorage.getItem('historyKey')));
  },
  watch: {
    $route(newVal, oldVal) {
      this.searchRun = newVal.name !== oldVal.name; //其他页进入搜索页才有动画
      this.showChild = (newVal.name === 'searchSingerDetail' && true) || false;
    }
  },
  methods: {
    ...mapMutations(['SET_PLAYLIST']),
    ...mapActions(['selectPlay']),
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
    clickSearch(val) {
      this.disabled = true; //避免出现onInput的情况；结果出现前禁止再次获取input焦点
      this.value = val;
      this.onSearch(val, 1);
    },
    /** 获得焦点时 */
    onFocus() {
      this.showResult = false;
      this.onInput(this.value);
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
    /**
     * 点击搜索
     * @val {string} 输入的内容
     * @page {number} 页码
     * */
    onSearch(val, page) {
      let type = ['musics', 'artists', 'albums'], //列表类型
        active = this.active,
        listType = type[active];

      this.$api['search/getSearchResult']({
        keyword: val || this.value, //搜索词
        rows: 30, //每页显示数
        type: this.resultType[active], //列表类型。1为歌手，2为歌曲，4为专辑，6为歌单
        pgc: page //页码
      })
        .then(res => {
          this.pageNum[active] = page;

          //loadMore时为push，否则直接赋值
          (page > 1 && this.result[listType].push(...res[listType])) ||
            (this.result[listType] = res[listType]);

          this.result[listType].length >= res.pgt &&
            (this.finished[active] = true); //数据全部加载完毕

          !active && this.SET_PLAYLIST(this.result[listType]); //歌曲列表要把歌曲存入vuex
          //将搜索词存入本地历史记录
          if (page === 1) {
            this.showResult = true;
            this.disabled = false;

            this.historyKey.unshift(this.value); //往数组前添加
            this.historyKey = this.$removal(this.historyKey); //去重
            this.historyKey.length >= 10 && this.historyKey.pop(); //最多10条搜索历史
            localStorage.setItem('historyKey', JSON.stringify(this.historyKey));
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    /** 加载更多 */
    onLoad() {
      let time = Date.now();
      //节流处理
      if (time - this.nowTime > 200) {
        this.onSearch(this.value, ++this.pageNum[this.active]);
        this.nowTime = time;
      }
      this.$set(this.loading, this.active, false);
    },
    /** tab切换前 */
    beforeChange() {
      this.tabScrollTop[this.active] = this.$refs.search.scrollTop; //记录当前标签页的滚动距离
      return true;
    },
    /**
     * tab切换后
     * @index {number} 激活项下标
     * */
    changeTab(index) {
      this.$nextTick(() => {
        this.$refs.search.scrollTop = this.tabScrollTop[index]; //还原tab的滚动距离
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
    },
    /**
     * 点击播放歌曲
     * @index {number} 歌曲在列表的下标
     * @bool {boolean} 歌曲是否禁放
     */
    selectSong(index, bool) {
      if (bool) {
        Toast('该歌曲暂时无法播放');
        return false;
      }
      //播放歌曲
      this.selectPlay({
        list: JSON.parse(JSON.stringify(this.result.musics)),
        index
      });
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  overflow-y: scroll;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  width: 100%;
  min-height: 100vh;
  background-color: #222;
  &.show-child {
    overflow-y: unset;
    position: absolute;
  }
  /deep/.van-search {
    position: sticky;
    top: 0;
    z-index: 1;
    width: 100%;
    .van-icon {
      color: #999 !important;
      &.van-icon-search {
        font-size: 22px;
      }
    }
  }
  .search-run {
    transform: translateX(87%);
    animation: searchRun 0.3s forwards;
  }
  @keyframes searchRun {
    to {
      transform: translateX(0);
    }
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
    .van-list {
      margin-top: 20px;
      padding: 0 0.25rem;
      .cell {
        position: relative;
        margin-top: 0.2rem;
        color: #fff;
        &.no-play {
          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 0.8rem;
            height: 0.8rem;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
          }
          h4 {
            color: #666;
          }
        }
        img {
          float: left;
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
        }
        .right-part {
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
          .icon-svg {
            position: absolute;
            right: 0;
            top: 0.22rem;
            color: #666;
          }
        }
      }
      .singer {
        img {
          width: 1rem;
          height: 1rem;
        }
        .right-part {
          width: 80%;
          h4 {
            font-weight: bold;
          }
          .icon-svg {
            top: 0.42rem;
            color: #999 !important;
          }
        }
      }
    }
  }
}
</style>
