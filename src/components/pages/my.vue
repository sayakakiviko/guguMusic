<!-- @format -->
<!--我的-->

<template>
  <div class="my">
    <img src="../../assets/images/logo.gif" class="avatar" />
    <p class="name">那个念想</p>
    <ul class="menu">
      <li>
        <i><icon-svg class="icon-svg" name="icon-like-fill"></icon-svg></i
        >我喜欢的
      </li>
      <li>
        <i><icon-svg class="icon-svg" name="icon-time"></icon-svg></i>最近播放
      </li>
      <li>
        <i><icon-svg class="icon-svg" name="icon-user"></icon-svg></i>自建歌单
      </li>
      <li @click="changeTheme('light')">
        <i><icon-svg class="icon-svg" name="icon-skin"></icon-svg></i>主题换肤
      </li>
    </ul>
    <button @click="loginOut">退出登录</button>
  </div>
</template>

<script>
import { Dialog } from 'vant';

export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    changeTheme(theme) {
      document.getElementById('app').className = theme;
    },
    /** 退出登录  */
    loginOut() {
      Dialog.confirm({
        message: '确定退出登录？'
      })
        .then(() => {
          //
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>

<style lang="less" scoped>
.my {
  padding: 0.44rem 0.25rem 20px;
  .avatar {
    width: 50px;
    height: 50px;
    margin: 0 15px;
    vertical-align: middle;
    border-radius: 50%;
  }
  .name {
    display: inline-block;
    vertical-align: middle;
    font-size: 22px;
  }
  .menu {
    display: flex;
    width: 7rem;
    margin-top: 0.44rem;
    border-radius: 5px;
    li {
      width: 25%;
      padding: 20px 0;
      text-align: center;
      i {
        display: block;
        margin-bottom: 10px;
      }
    }
  }
  button {
    display: block;
    width: 7rem;
    height: 40px;
    margin: 20px auto;
    background-color: #333;
    border: none;
    border-radius: 30px;
    /*color: #ee807d;*/
  }
}
</style>
