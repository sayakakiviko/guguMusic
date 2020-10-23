<!-- @format -->
<!--榜单排行-->

<template>
  <div class="rank">
    <!--周榜-->
    <div
      class="week-rank"
      v-jump="[
        'rankDetail',
        {
          id: 33400255,
          name: '周榜',
          img: weekData.contentId && weekData.columnData.columnPicUrl
        }
      ]"
    >
      <div class="info">
        <p class="title">音乐 · 周榜>></p>
        <h3>
          {{ weekData.contentId && weekData.columnData.columnTitle }}
        </h3>
        <span>DJ点评，每周更新</span>
      </div>
      <img :src="weekData.contentId && weekData.columnData.columnSmallPicUrl" />
    </div>
    <!--官方榜-->
    <div class="main-rank">
      <h2>官方榜</h2>
      <ul v-if="rankData.length === 6">
        <li
          v-for="(res, j) in rankData"
          :key="j"
          v-jump="[
            'rankDetail',
            {
              id: idsList[0][j].id,
              name: idsList[0][j].name,
              banner: `banner${j + 1}`
            }
          ]"
        >
          <img :src="require('@/assets/images/rank/rank' + (j + 1) + '.jpg')" />
          <div class="right">
            <p v-for="(item, index) in res" :key="index">
              {{ index + 1 }}.{{ item.songData.songName }} -
              <span v-for="(name, i) in item.songData.singerName" :key="i"
                >{{ (i && ',') || '' }}{{ name }}</span
              >
            </p>
          </div>
          <van-icon name="arrow" />
        </li>
      </ul>
      <van-loading v-else type="spinner" vertical style="margin-top: 40px;"
        >加载中...</van-loading
      >
    </div>
    <!--特色榜-->
    <div class="special-rank rank-list">
      <h2>特色榜</h2>
      <ul>
        <li
          v-for="(item, index) in idsList[1]"
          :key="index"
          v-jump="[
            'rankDetail',
            {
              id: item.id,
              type: item.type,
              name: item.name,
              banner: `special${index + 1}`
            }
          ]"
        >
          <img
            :src="
              require('@/assets/images/rank/special' + (index + 1) + '.jpg')
            "
          />
        </li>
      </ul>
    </div>
    <!--全球权威榜-->
    <div class="global-rank rank-list">
      <h2>全球权威榜</h2>
      <ul>
        <li
          v-for="(item, index) in idsList[2]"
          :key="index"
          v-jump="[
            'rankDetail',
            {
              id: item.id,
              type: item.type,
              name: item.name,
              banner: `global${index + 1}`
            }
          ]"
        >
          <img
            :src="require('@/assets/images/rank/global' + (index + 1) + '.jpg')"
          />
        </li>
      </ul>
    </div>

    <!--榜单排行详情-->
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weekData: {}, //周榜
      rankData: [], //官方榜数据列表
      //榜单id列表
      idsList: [
        //官方榜
        [
          { id: 23603703, name: '音乐榜' },
          { id: 23603721, name: '影视榜' },
          { id: 23603926, name: '华语内地榜' },
          { id: 23603954, name: '华语港台榜' },
          { id: 23603974, name: '欧美榜' },
          { id: 23603982, name: '日韩榜' }
        ],
        //特色榜
        [
          { id: 23603993, type: 2002, name: '新人榜' },
          { id: 23604008, type: 2002, name: '唱作人榜' },
          { id: 23604023, name: '彩铃榜' },
          { id: 23604032, name: '原创榜' },
          { id: 23604040, name: 'KTV榜' },
          { id: 23604058, name: '网络榜' },
          { id: 23604500, type: 2003, name: '新专辑榜' }
          // { id: 23604509, type: 2033, name: 'MV榜' }
        ],
        //全球权威榜
        [
          { id: 23634243, name: '苹果iTunes榜' },
          { id: 23634252, name: '美国公告榜' },
          { id: 23634262, name: 'hito中文榜' },
          { id: 23634280, name: '中国top榜' },
          { id: 23634290, name: '韩国Mnet榜' },
          { id: 23634298, name: '英国UK榜' }
        ]
      ],
      //特色榜
      specialData: [
        'newtalent',
        'singer',
        'coloring',
        'original',
        'ktv',
        'network',
        'newalbum',
        'mv'
      ],
      //全球权威榜
      globalData: ['itunes', 'billboard', 'hito', 'top_mainland', 'mnet', 'uk']
    };
  },
  async created() {
    await this.getRankData(23603695, 2011); //周榜
    await this.getRankData(this.idsList[0][0].id); //音乐榜
    await this.getRankData(this.idsList[0][1].id); //影视
    await this.getRankData(this.idsList[0][2].id); //华语内地
    await this.getRankData(this.idsList[0][3].id); //港台
    await this.getRankData(this.idsList[0][4].id); //欧美
    await this.getRankData(this.idsList[0][5].id); //日韩
  },
  methods: {
    /**
     * 获取排行榜单
     * @id {number} 榜单id，用于获取是哪个榜单
     * @type {number} 榜单类型，用于获取是哪个榜单
     */
    async getRankData(id, type) {
      let param = {
        nid: id,
        pageNo: 0,
        pageSize: 3
      };
      type && (param.type = type); //若有type需要加type

      return new Promise((resolve, reject) => {
        this.$api['rank/getRankData'](param)
          .then(res => {
            switch (id) {
              case 23603695:
                this.weekData = res.results[0]; //周榜
                break;
              case 23603703:
                this.$set(this.rankData, 0, res.results); //音乐榜
                break;
              case 23603721:
                this.$set(this.rankData, 1, res.results); //影视
                break;
              case 23603926:
                this.$set(this.rankData, 2, res.results); //华语内地
                break;
              case 23603954:
                this.$set(this.rankData, 3, res.results); //港台
                break;
              case 23603974:
                this.$set(this.rankData, 4, res.results); //欧美
                break;
              case 23603982:
                this.$set(this.rankData, 5, res.results); //日韩
                break;
            }
            resolve();
          })
          .catch(e => {
            console.log(e);
          });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.rank {
  padding: 0 0.25rem 20px;
  h2 {
    margin: 0.4rem 0;
    text-align: center;
    font-size: 0.38rem;
    color: #ffcd32;
  }
  .week-rank {
    position: relative;
    width: 7rem;
    height: 2rem;
    margin-top: 0.44rem;
    background: url('../../assets/images/rank/week-rank.png') no-repeat
      center/cover;
    border-radius: 0.1rem;
    .info {
      position: absolute;
      left: 0.2rem;
      top: -0.2rem;
      width: 5.4rem;
      .title {
        width: 2.04rem;
        background-color: #151515;
        text-align: center;
        font-size: 0.3rem;
        line-height: 0.56rem;
        color: #ffcd32;
        border-radius: 3px;
      }
      h3 {
        margin: 0.2rem 0 0.1rem;
        font-size: 0.3rem;
        color: #333;
      }
      span {
        font-size: 0.22rem;
        color: #8d8d8d;
      }
    }
    img {
      position: absolute;
      right: 0.1rem;
      top: 50%;
      width: 1.8rem;
      border-radius: 3px;
      transform: translateY(-50%);
    }
  }
  .main-rank {
    ul {
      color: #666;
      li {
        padding-top: 20px;
        &:first-child {
          padding-top: 0;
        }
        img {
          width: 1.96rem;
          vertical-align: middle;
        }
        .right {
          display: inline-block;
          width: 4.3rem;
          margin-left: 20px;
          vertical-align: middle;
          p {
            overflow: hidden;
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
            line-height: 28px;
          }
        }
        .van-icon {
          margin-left: 0.1rem;
          vertical-align: middle;
          color: #999 !important;
        }
      }
    }
  }
  .rank-list {
    ul {
      width: 102%;
      li {
        display: inline-block;
        margin-top: 0.15rem;
        &:nth-child(3n + 2) {
          margin: 0.15rem 0.15rem 0;
        }
        img {
          width: 2.2rem;
        }
      }
    }
  }
}
</style>
