<!-- @format -->
<!--我的-详情-->

<template>
  <div class="my-detail">
    <van-icon name="arrow-left" size="0.4rem" v-back />
    <!--我喜欢的-->
    <div class="like" v-if="$route.query.type === 'like'">
      <ul>
        <li v-for="(item, index) in likeList" :key="index">
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
    </div>
    <!--主题换肤-->
    <div class="skin" v-if="$route.query.type === 'skin'">
      <h3>官方推荐</h3>
      <ul>
        <li
          :class="[{ active: active === index }, item.type]"
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
import commonDetail from '@/components/ui/commonDetail';
export default {
  // components: { commonDetail },
  data() {
    return {
      likeList: [], //喜欢列表
      active: 0, //使用的主题
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
    this.likeList = JSON.parse(localStorage.getItem('likeSongList'));
  },
  methods: {
    /**
     * 换肤
     * @index {number} 使用的主题索引
     */
    changeTheme(index) {
      this.active = index;
      document.getElementById('app').className = this.theme[index].type;
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
  background-color: #222;
  .like {
    &:before {
      content: '我喜欢的';
      position: absolute;
      left: 0;
      right: 0;
      top: 0.16rem;
      margin: auto;
      text-align: center;
      font-size: 0.38rem;
      color: #fff;
    }
    ul {
      padding: 0 20px 20px;
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
        .order {
          width: 25px;
          height: 24px;
          margin-right: 20px;
          text-align: center;
          font-size: 18px;
          color: #ffcd32;
        }
        .con {
          line-height: 20px;
          color: #888;
          h3 {
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
  .skin {
    &:before {
      content: '主题换肤';
      position: absolute;
      left: 0;
      right: 0;
      top: 0.16rem;
      margin: auto;
      text-align: center;
      font-size: 0.38rem;
      color: #fff;
    }
    h3 {
      margin: 0 0 0.25rem 0.25rem;
      font-size: 0.3rem;
      color: #fff;
    }
    li {
      display: inline-block;
      position: relative;
      width: 30%;
      height: 3rem;
      margin: 0 0 40px 0.25rem;
      vertical-align: middle;
      border-radius: 5px;
      &.active:after {
        content: '使用中';
        display: block;
        width: 50px;
        margin: auto;
        padding: 0 0.25rem;
        background-color: #fff;
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
        color: #fff;
      }
    }
  }
}
</style>
