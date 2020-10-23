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
    path: '/search',
    name: 'search',
    desc: '搜索',
    components: {
      default: getPage('search')
    }
  }
  // {
  //   path: '/singerDetail',
  //   name: 'singerDetail',
  //   desc: '歌手详情',
  //   components: {
  //     default: getPage('detail/singerDetail')
  //   }
  // }
];
