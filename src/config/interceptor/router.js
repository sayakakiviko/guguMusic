/** @format */
import store from '@/store';

export function routerBeforeEachFunc(to, from, next) {
  let isLogin = localStorage.getItem('isLogin') || false; //是否登录
  // 是否已登录
  if (isLogin) {
    from.path !== '/login' && to.path === '/login' ? next(false) : next(); //登录后就不能再返回登录页了
  } else {
    //未登录，需要判断是否正处于登录页，否则会无限循环
    from.path !== '/login' && to.path === '/login' ? next() : next('/login'); //处于登录页则放行，否则跳转登录页
  }
  // if (store.state.user.id) {
  //   next();
  // } else {
  //   store
  //     .dispatch('getUserInfo', {})
  //     .then(data => {
  //       //router.addRoutes是异步的，同时使用 next({ ...to, replace: true })重新载入。
  //       next({ ...to, replace: true });
  //     })
  //     .catch(() => {});
  // }
}

export function routerAfterEachFunc(to, from) {}
