<!-- @format -->
<!--我的-详情-->

<template>
  <div class="my-detail">
    <van-icon name="arrow-left" size="0.4rem" v-back />
    <!--我喜欢的&最近播放-->
    <div
      class="like"
      :class="{ history: type === 'history' }"
      v-if="type === 'like' || type === 'history'"
    >
      <ul v-if="songList.length">
        <li
          v-for="(item, index) in songList"
          :key="index"
          @click="selectSong(index)"
        >
          <span class="order">{{ index + 1 }}</span>
          <div class="con">
            <!--歌名-->
            <h3>
              <label
                class="van-ellipsis"
                :style="{ maxWidth: (item.songName && '5rem') || '4rem' }"
                >{{ item.songName }}</label
              >
              <img
                :src="require('@/assets/images/rank/SQ.png')"
                v-if="item.hasSQqq"
              />
            </h3>
            <!--歌手-->
            <p class="van-ellipsis">
              <span v-for="(name, i) in item.singerName" :key="i"
                >{{ (i && ',') || '' }}{{ name }}</span
              >
            </p>
          </div>
        </li>
      </ul>
      <van-empty image="error" description="暂无数据" v-else />
    </div>
    <!--自建歌单-->
    <div class="custom" v-else-if="type === 'custom'">
      <div class="sheet-list" v-if="songSheetList.length">
        <van-swipe-cell v-for="(item, index) in songSheetList" :key="index">
          <div class="sheet-cell" @click="clickSheet(item, index)">
            <img
              :src="item.photo || require('@/assets/images/logo.gif')"
              class="logo"
            />
            <div class="right-part">
              <p>{{ item.name }}</p>
              <span>{{ item.count }}首</span>
            </div>
            <van-icon name="arrow" />
          </div>
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button"
              @click="delSheet(index)"
            />
          </template>
        </van-swipe-cell>
      </div>
      <van-empty image="error" description="暂无数据" v-else />
      <!--歌单歌曲-->
      <van-popup v-model="show" position="right" :style="{ height: '100%' }">
        <van-icon name="arrow-left" size="0.4rem" @click="show = false" />
        <h2>{{ sheetName }}</h2>
        <div v-if="songList.length">
          <van-swipe-cell v-for="(item, index) in songList" :key="index">
            <div class="sheet-song-cell" @click="selectSong(index)">
              <span class="order">{{ index + 1 }}</span>
              <div class="con">
                <!--歌名-->
                <h3>
                  <label
                    class="van-ellipsis"
                    :style="{ maxWidth: (item.songName && '5rem') || '4rem' }"
                    >{{ item.songName }}</label
                  >
                  <img
                    :src="require('@/assets/images/rank/SQ.png')"
                    v-if="item.hasSQqq"
                  />
                </h3>
                <!--歌手-->
                <p class="van-ellipsis">
                  <span v-for="(name, i) in item.singerName" :key="i"
                    >{{ (i && ',') || '' }}{{ name }}</span
                  >
                </p>
              </div>
            </div>
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="delSheetSong(index)"
              />
            </template>
          </van-swipe-cell>
        </div>
        <van-empty image="error" description="暂无数据" v-else />
      </van-popup>
    </div>
    <!--主题换肤-->
    <div class="skin" v-else-if="type === 'skin'">
      <h3>官方推荐</h3>
      <ul>
        <li
          :class="[{ active: $store.state.themeSkin === index }, item.type]"
          v-for="(item, index) in theme"
          :key="index"
          @click="changeTheme(index)"
        >
          <img :src="require('@/assets/images/logo.gif')" class="logo" />
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { Dialog } from 'vant';
export default {
  data() {
    return {
      type: this.$route.query.type, //需要显示的页面
      show: false, //歌单弹窗是否显示
      songList: [], //喜欢&最近播放列表
      songSheetList: [], //歌单列表
      sheetIndex: 0, //歌单下标
      sheetName: '', //歌单名
      //主题列表
      theme: [
        {
          type: 'default',
          name: '深色经典'
        },
        {
          type: 'light',
          name: '活力青春'
        }
      ]
    };
  },
  created() {
    this.songList =
      JSON.parse(localStorage.getItem(this.type + 'SongList')) || []; //喜欢&最近播放列表

    //歌单列表
    this.songSheetList =
      JSON.parse(localStorage.getItem('songSheetList')) || [];
  },
  methods: {
    ...mapActions(['selectPlay']),
    /**
     * 换肤
     * @index {number} 使用的主题索引
     */
    changeTheme(index) {
      this.$store.commit('SET_THEMESKIN', index);
      document.getElementById('app').className = this.theme[index].type;
    },
    /**
     * 点击歌单
     * @item {object} 歌单对象
     * @index {number} 歌单下标
     */
    clickSheet(item, index) {
      this.sheetIndex = index;
      this.songList = item.songList;
      this.sheetName = item.name;
      this.show = true;
    },
    /**
     * 删除歌单
     * @index {number} 要删除歌单的下标
     */
    delSheet(index) {
      Dialog.confirm({
        message: '确定删除该歌单？'
      })
        .then(() => {
          this.songSheetList.splice(index, 1);
          localStorage.setItem(
            'songSheetList',
            JSON.stringify(this.songSheetList)
          );
        })
        .catch(() => {
          // on cancel
        });
    },
    /**
     * 删除歌单歌曲
     * @index {number} 要删除歌曲的下标
     */
    delSheetSong(index) {
      Dialog.confirm({
        message: '确定删除该歌曲？'
      })
        .then(() => {
          this.songList.splice(index, 1);
          this.songSheetList[this.sheetIndex].songList.splice(index, 1);
          this.songSheetList[this.sheetIndex].count--;
          localStorage.setItem(
            'songSheetList',
            JSON.stringify(this.songSheetList)
          );
        })
        .catch(() => {
          // on cancel
        });
    },
    /**
     * 点击播放歌曲
     * @index {number} 歌曲在列表的下标
     */
    selectSong(index) {
      let isFilter = false; //过滤后的列表，无需再次过滤
      //播放歌曲
      this.selectPlay({
        list: JSON.parse(JSON.stringify(this.songList)),
        index,
        isFilter
      });
    }
  }
};
</script>

<style lang="less" scoped>
.my-detail {
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  min-height: 100%;
  padding-top: 0.85rem;
  .like,
  .history,
  .custom,
  .skin {
    padding: 0 0.28rem 20px;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0.16rem;
      margin: auto;
      text-align: center;
      font-size: 0.38rem;
    }
  }
  .like {
    &:before {
      content: '我喜欢的';
    }
    &.history:before {
      content: '最近播放';
    }
    li {
      display: flex;
      align-items: center;
      height: 64px;
      padding-top: 10px;
      font-size: 14px;
      .order {
        width: 15px;
        height: 24px;
        margin-right: 15px;
        text-align: center;
        font-size: 18px;
      }
      .con {
        line-height: 20px;
        color: #888;
        h3 {
          font-size: 14px;
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
  .custom {
    &:before {
      content: '自建歌单';
    }
    .sheet-list .sheet-cell {
      position: relative;
      margin-top: 15px;
      img {
        width: 1rem;
        height: 1rem;
        margin-right: 10px;
        vertical-align: middle;
        border-radius: 3px;
      }
      .right-part {
        display: inline-block;
        vertical-align: middle;
        p {
          font-size: 16px;
        }
        span {
          font-size: 14px;
          color: #888;
        }
      }
      .van-icon {
        position: absolute;
        right: 0.28rem;
        top: 0.36rem;
      }
    }
  }
  .skin {
    &:before {
      content: '主题换肤';
    }
    h3 {
      margin-bottom: 0.25rem;
      font-size: 0.3rem;
    }
    li {
      display: inline-block;
      position: relative;
      width: 30%;
      height: 3rem;
      margin: 0 0.25rem 40px 0;
      vertical-align: middle;
      border-radius: 5px;
      &.active:after {
        content: '使用中';
        display: block;
        width: 50px;
        margin: auto;
        padding: 0 0.25rem;
        background-color: #ddd;
        text-align: center;
        color: #666;
        border-radius: 10px;
      }
      &.default {
        background-color: #333;
      }
      &.light {
        background-color: #f4f4f4;
      }
      img {
        display: block;
        width: 80px;
        height: 80px;
        margin: 0.4rem auto;
        border-radius: 50%;
      }
      p {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -30px;
        margin: auto;
        text-align: center;
      }
    }
  }
  .van-popup {
    box-sizing: border-box;
    width: 100%;
    padding: 0 0.28rem;
    .van-button {
      height: 100%;
    }
    h2 {
      text-align: center;
      font-size: 0.38rem;
      line-height: 0.85rem;
    }
    li,
    .sheet-song-cell {
      display: flex;
      align-items: center;
      height: 64px;
      padding-top: 10px;
      font-size: 14px;
      .order {
        width: 15px;
        height: 24px;
        margin-right: 15px;
        text-align: center;
        font-size: 18px;
      }
      .con {
        line-height: 20px;
        color: #888;
        h3 {
          font-size: 14px;
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
