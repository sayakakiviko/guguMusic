<!-- @format -->
<!--歌手详情页-->

<template>
  <div class="singer-detail">
    <van-icon name="arrow-left" color="#ffcd32" size="0.42rem" v-back />
    <div class="singer-img">
      <div>
        <img :src="singerDetail.localArtistPicM" />
        <p>{{ singerDetail.artistName }}</p>
      </div>
    </div>
    <div class="song-list">
      <van-list finished-text="没有更多了">
        <div class="cell" v-for="item in songList" :key="item.songId">
          <p class="no-wrap">{{ item.songName }}</p>
          <p class="no-wrap name">
            <span v-for="(name, index) in item.singerName" :key="index">{{
              name
            }}</span>
          </p>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      singerId: 0, //歌手id
      singerDetail: {}, //歌手信息
      songList: [], //歌曲列表
      pageNum: 0 //歌曲页码
    };
  },
  created() {
    this.singerId = this.$route.query.artistId;
    this.getDetail();
    this.getSong();
  },
  methods: {
    /** 获取歌手详情 */
    getDetail() {
      this.$api['singer/getSingerDetail']({ artistId: this.singerId }).then(
        res => {
          this.singerDetail = res;
        }
      );
    },
    /** 获取歌手作品 */
    getSong() {
      this.$api['singer/getSongList']({
        artistId: this.singerId,
        pageNo: this.pageNum,
        pageSize: 20
      }).then(res => {
        this.songList = res.results;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.singer-detail {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  min-height: 100%;
  background-color: #222;
  .singer-img {
    position: relative;
    height: 3.72rem;
    background-image: url('~@/assets/images/singer_detail_bg.jpg');
    div {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 1.68rem;
      height: 1.68rem;
      text-align: center;
      font-size: 0.28rem;
      font-weight: bold;
      color: #fff;
      img {
        margin-bottom: 0.2rem;
        width: 1.68rem;
        height: 1.68rem;
        border-radius: 50%;
      }
    }
  }
  .song-list {
    padding: 0.3rem 0;
    background-color: #222;
    //transform: translateY(-3rem);
    transform: translateY(0);
    transition-duration: 0.3s;
    .cell {
      padding: 0.15rem 0.4rem;
      p {
        font-size: 0.28rem;
        color: #fff;
        &.name {
          margin-top: 0.1rem;
          span {
            margin-right: 0.2rem;
            font-size: 0.26rem;
            color: hsla(0, 0%, 100%, 0.3);
          }
        }
      }
    }
  }
}
</style>
