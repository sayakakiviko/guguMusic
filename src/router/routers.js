/** @format */

/** @format */
const getPage = name => () => import('@/components/pages/' + name + '.vue');

export default [
  {
    path: '/',
    redirect: { name: 'home' }
  },
  {
    path: '/home',
    name: 'home',
    desc: '首页',
    components: {
      default: getPage('home')
    }
  },
  {
    path: '/login',
    name: 'login',
    desc: '登录',
    components: {
      default: getPage('login')
    }
  },
  {
    path: '/singer',
    name: 'singer',
    desc: '歌手',
    components: {
      default: getPage('singer')
    },
    children: [
      {
        path: '/singerDetail',
        name: 'singerDetail',
        desc: '歌手详情',
        components: {
          default: getPage('detail/singerDetail')
        }
      }
    ]
  },
  {
    path: '/rank',
    name: 'rank',
    desc: '排行',
    components: {
      default: getPage('rank')
    },
    children: [
      {
        path: '/rankDetail',
        name: 'rankDetail',
        desc: '排行榜单详情',
        components: {
          default: getPage('detail/rankDetail')
        },
        children: [
          {
            path: '/rankSingerDetail',
            name: 'rankSingerDetail',
            desc: '歌手详情',
            components: {
              default: getPage('detail/rankSingerDetail')
            }
          }
        ]
      }
    ]
  },
  {
    path: '/my',
    name: 'my',
    desc: '我的',
    components: {
      default: getPage('my')
    },
    children: [
      {
        path: '/myDetail',
        name: 'myDetail',
        desc: '我的-详情',
        components: {
          default: getPage('detail/myDetail')
        }
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    desc: '搜索',
    components: {
      default: getPage('search')
    },
    children: [
      {
        path: '/searchSingerDetail',
        name: 'searchSingerDetail',
        desc: '歌手详情',
        components: {
          default: getPage('detail/searchSingerDetail')
        }
      }
    ]
  }
];
