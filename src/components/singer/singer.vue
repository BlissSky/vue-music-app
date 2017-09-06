<template>
    <div class="singer" ref="singer">
      <list-view @select="selectSinger"  :data="singers" ref="list"></list-view>
      <router-view></router-view>
    </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config.js'
  import Singer from 'common/js/singer'
  import ListView from 'base/listView/listView'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门',HOT_NAME_LEN = 10
  export default({
    mixins: [playlistMixin],
    data(){
      return {
        singers: []
      }
    },
    methods:{
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer){
        this.$router.push({
          path:`/singer/${singer.mid}`
        })
        this.setSinger(singer)
      },
      _getSingerList(){
        getSingerList().then((res) => {
          this.singers = this._normalSingerList( res.data.list)
        })
      },
      _normalSingerList(singerList){
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }

        singerList.forEach((item, index) => {
          if (index < HOT_NAME_LEN) {
            map.hot.items.push(new Singer({
              id :item.Fsinger_id,
              name: item.Fsinger_name,
              mid :item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: item.Findex,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id :item.Fsinger_id,
            name: item.Fsinger_name,
            mid :item.Fsinger_mid
          }))
        })
        //对map对象进行处理，得到有序的数组列表
        let ret = [], hot = []
        for (let k in map) {
          let val = map[k]
          if(val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }else if (val.title == HOT_NAME){
            hot.push(val)
          }
        }
        ret.sort((a,b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
       return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components:{
      ListView
    },
    created(){
      this._getSingerList()
    }
  })
</script>

<style lang='less'>
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
