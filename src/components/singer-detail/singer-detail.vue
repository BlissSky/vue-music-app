<template>
  <transition name="slide">
   <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data(){
      return {
        songs: []
      }
    },
    computed:{
      ...mapGetters(
        [
          'singer'
        ]
      ),
      title(){
          return this.singer.name
      },
      bgImage(){
          return this.singer.avatar
      }
    },
    methods:{
      _getSingerDetail(){
        if(!this.singer.mid){
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.mid).then((res) => {
          if(res.code === ERR_OK){
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if(musicData.songid && musicData.albummid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    created(){
      this._getSingerDetail()
    },
    components:{
      MusicList
    }
  }
</script>

<style lang='less'>
  .slide-enter-active, .slide-leave-active {
    transition: all;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
   }

</style>
