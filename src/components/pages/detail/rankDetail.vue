<!-- @format -->
<!--排行榜单详情列表-->

<template>
  <div class="rank-detail">
    <van-icon name="arrow-left" size="0.4rem" v-back />
    <!--动态绑定banner图。周榜图是绑在style上，其他的绑在class上-->
    <div
      class="banner"
      :class="[{ sticky: isSticky }, bannerClass]"
      :style="
        bannerClass === undefined && {
          backgroundImage: `url(${$route.query.img})`
        }
      "
    >
      <p :class="{ show: isSticky }" v-backTop>{{ $route.query.name }}</p>
    </div>

    <!--列表-->
    <ul
      class="list"
      :class="{ sticky: isSticky }"
      v-show="listShow"
      v-if="dataList.length"
    >
      <li
        v-for="(item, index) in dataList"
        :key="index"
        @click="selectSong(index, item)"
      >
        <span class="ranking">{{ (index > 2 && index + 1) || '' }}</span>
        <img
          class="avatar"
          :src="item.localArtistPicM || item.localAlbumPicM"
          v-if="!item.songName"
        />
        <div class="con">
          <!--歌名or歌手or专辑-->
          <h2>
            <label
              class="van-ellipsis"
              :style="{ maxWidth: (item.songName && '5rem') || '4rem' }"
              >{{ item.songName || item.singerName || item.albumName }}</label
            >
            <img
              :src="require('@/assets/images/rank/SQ.png')"
              v-if="item.songName && item.hasSQqq"
            />
          </h2>
          <!--歌手-->
          <p class="van-ellipsis" v-if="item.songName">
            <span v-for="(name, i) in item.singerName" :key="i"
              >{{ (i && ',') || '' }}{{ name }}</span
            >
          </p>
        </div>
      </li>
    </ul>
    <van-loading v-else type="spinner" vertical style="margin-top: 40px;"
      >加载中...
    </van-loading>

    <!--歌手详情-->
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      listShow: true, //列表显示状态
      topHigh: 282, //顶部标签栏需空出的高度，基于750px
      isSticky: false, //滑动一定距离后背景图是否固定
      bannerClass: undefined, //横幅图类名
      dataList: [] //榜单列表
    };
  },
  created() {
    this.bannerClass = this.$route.query.banner; //存入横幅类名，避免进入子路由时改变横幅
    this.getRankData(this.$route.query.id, this.$route.query.type);
  },
  mounted() {
    document.documentElement.scrollTop = this.$store.state.rankScrollTop; //返回时设置滚动距离
    window.addEventListener('scroll', this.getScrollTop); //监听滚动事件
    this.topHigh =
      (this.topHigh * parseFloat(document.documentElement.style.fontSize)) /
      100; //计算应该空出的高度
  },
  destroyed() {
    window.removeEventListener('scroll', this.getScrollTop); //解绑监听
  },
  watch: {
    $route(route) {
      this.listShow = route.name !== 'rankSingerDetail'; //若处于歌手详情页，隐藏列表
    }
  },
  methods: {
    ...mapMutations(['SET_PLAYLIST', 'SET_RANKSCROLLTOP']),
    ...mapActions(['selectPlay']),
    /**
     * 获取排行榜单
     * @id {string} 榜单id，用于获取是哪个榜单
     * @type {number} 榜单类型，用于获取是哪个榜单
     */
    getRankData(id, type) {
      let param = {
        nid: id,
        pageNo: 0,
        pageSize: 100
      };
      type && (param.type = type); //若有type需要加type
      this.$api['rank/getRankData'](param)
        .then(res => {
          if (res.results[0].songData) {
            //歌曲列表
            res.results.forEach(item => {
              item.songData && this.dataList.push(item.songData);
            });
          } else if (res.results[0].singerData) {
            //歌手列表
            res.results.forEach(item => {
              this.dataList.push(item.singerData);
            });
          } else if (res.results[0].albumData) {
            //专辑列表
            res.results.forEach(item => {
              this.dataList.push(item.albumData);
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    /** 获取页面滚动距离以固定顶部 */
    getScrollTop() {
      let Y = window.pageYOffset; //滚动距离
      this.isSticky = (Y >= this.topHigh && true) || false;
    },
    /**
     * 点击播放歌曲or进入歌曲列表
     * @index {number} 歌曲在列表的下标
     * @item {string} 点击的对象。若有歌名则直接播放歌曲，否则跳转链接
     */
    selectSong(index, item) {
      if (item.songName) {
        //播放歌曲
        this.selectPlay({
          list: this.dataList.slice(),
          index
        });
      } else {
        //进入列表
        this.SET_RANKSCROLLTOP(document.documentElement.scrollTop); //先存入滚动高度
        this.$router.push({
          name: 'rankSingerDetail',
          query: {
            artistId: item.albumId || item.singerId,
            img: item.localAlbumPicM || item.localArtistPicM,
            albumFlag: item.albumName
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.rank-detail {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  min-height: 100%;
  background-color: #222;

  .banner {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 3.6rem;
    background: url('~@/assets/images/rank/detail/banner1.jpg') no-repeat
      center/cover;

    &.sticky {
      position: fixed;
      top: -2.82rem;
      z-index: 1;
    }

    &.banner1 {
      background-image: url('~@/assets/images/rank/detail/banner1.jpg');
    }

    &.banner2 {
      background-image: url('~@/assets/images/rank/detail/banner2.jpg');
    }

    &.banner3 {
      background-image: url('~@/assets/images/rank/detail/banner3.jpg');
    }

    &.banner4 {
      background-image: url('~@/assets/images/rank/detail/banner4.jpg');
    }

    &.banner5 {
      background-image: url('~@/assets/images/rank/detail/banner5.jpg');
    }

    &.banner6 {
      background-image: url('~@/assets/images/rank/detail/banner6.jpg');
    }

    &.special1 {
      background-image: url('~@/assets/images/rank/detail/special1.jpg');
    }

    &.special2 {
      background-image: url('~@/assets/images/rank/detail/special2.jpg');
    }

    &.special3 {
      background-image: url('~@/assets/images/rank/detail/special3.jpg');
    }

    &.special4 {
      background-image: url('~@/assets/images/rank/detail/special4.jpg');
    }

    &.special5 {
      background-image: url('~@/assets/images/rank/detail/special5.jpg');
    }

    &.special6 {
      background-image: url('~@/assets/images/rank/detail/special6.jpg');
    }

    &.special7 {
      background-image: url('~@/assets/images/rank/detail/special7.jpg');
    }

    &.global1 {
      background-image: url('~@/assets/images/rank/detail/global1.jpg');
    }

    &.global2 {
      background-image: url('~@/assets/images/rank/detail/global2.jpg');
    }

    &.global3 {
      background-image: url('~@/assets/images/rank/detail/global3.jpg');
    }

    &.global4 {
      background-image: url('~@/assets/images/rank/detail/global4.jpg');
    }

    &.global5 {
      background-image: url('~@/assets/images/rank/detail/global5.jpg');
    }

    &.global6 {
      background-image: url('~@/assets/images/rank/detail/global6.jpg');
    }

    p {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -0.8rem;
      text-align: center;
      font-size: 0.38rem;
      line-height: 0.8rem;
      color: #fff;
      transition: bottom 0.3s;

      &.show {
        bottom: 0;
      }
    }
  }

  .list {
    padding: 0 20px 20px;

    &.sticky {
      padding-top: 3.6rem;
    }

    li {
      display: flex;
      align-items: center;
      height: 64px;
      padding-top: 10px;
      font-size: 14px;

      .avatar {
        width: 1.16rem;
        height: 1.16rem;
        margin-right: 20px;
        border-radius: 50%;
      }

      .ranking {
        width: 25px;
        height: 24px;
        margin-right: 20px;
        text-align: center;
        font-size: 18px;
        color: #ffcd32;
      }

      &:nth-child(1) .ranking {
        background: url('~@/assets/images/rank/ranking1.png') no-repeat
          center/cover;
      }

      &:nth-child(2) .ranking {
        background: url('~@/assets/images/rank/ranking2.png') no-repeat
          center/cover;
      }

      &:nth-child(3) .ranking {
        background: url('~@/assets/images/rank/ranking3.png') no-repeat
          center/cover;
      }

      .con {
        line-height: 20px;
        color: #888;

        h2 {
          font-size: 14px;
          color: #fff;

          p {
            margin-top: 4px;
          }

          label {
            display: inline-block;
          }

          img {
            width: 0.38rem;
            margin-left: 0.1rem;
            vertical-align: text-top;
          }
        }

        p {
          max-width: 5rem;
        }
      }
    }
  }
}
</style>
