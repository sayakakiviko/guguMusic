<!-- @format -->
<!--登录页-->

<template>
  <div class="login">
    <h2>账号登录</h2>
    <van-cell-group>
      <van-field
        v-model.trim="user"
        clearable
        left-icon="contact"
        placeholder="请输入账号"
      />
      <van-field
        v-model.trim="pwd"
        clearable
        type="password"
        left-icon="lock"
        placeholder="请输入密码"
      />
    </van-cell-group>
    <van-button type="primary" :disabled="!user || !pwd" round @click="login"
      >登录</van-button
    >
  </div>
</template>

<script>
import { Toast } from 'vant';

export default {
  data() {
    return {
      user: '', //账号
      pwd: '' //密码
    };
  },
  methods: {
    /** 登录 */
    login() {
      if (this.user !== 'admin' || this.pwd !== '000000') {
        Toast({
          message: '账号或密码错误',
          position: 'top'
        });
        return;
      }

      localStorage.setItem('isLogin', true);
      Toast('登录成功');

      setTimeout(() => {
        this.$router.replace('/home');
      }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  width: 100%;
  min-height: 100vh;
  background-color: #222;
  h2 {
    text-align: center;
    font-size: 18px;
    line-height: 50px;
    color: #fff;
  }
  .van-cell {
    background-color: #222;
    &::after {
      border-color: #999;
    }
    &:last-child::after {
      display: block;
    }
    /deep/.van-icon-clear {
      color: #666 !important;
    }
    /deep/.van-field__control {
      color: #ddd;
    }
  }
  button {
    display: block;
    width: 92%;
    margin: 20px auto;
    background-color: #ffcd32;
    border: none;
  }
}
</style>
