<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" ></music-list>
  </transition>
</template>

<script>
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'

  export default{
    data(){
      return {
        songs: []
      }
    },
    computed:{
      ...mapGetters([
        'disc'
      ]),
      title(){
        return this.disc.dissname
      },
      bgImage(){
        return this.disc.imgurl
      }
    },
    created(){
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if(!this.disc.dissid){
          this.$router.push("/recommend")
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if(res.code === ERR_OK){
            this.songs = this. _normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style lang='less'>
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
