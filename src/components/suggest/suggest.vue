<template>
  <scroll ref="suggest"class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          :beforescroll="beforescroll"
          @beforScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
  import {search} from 'api/search'
  import {createSong} from 'common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import Singer from 'common/js/singer'

  const TYPE_SINGER = 'singer'
  const perpage = 20
  export default{
    props:{
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data(){
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true,
        beforescroll: true
      }
    },
    methods:{
      refresh() {
      this.$refs.suggest.refresh()
    },
      searchMore(){
        if(!this.hasMore){
          return
        }
        this.page++
        search(this.query,this.page,this.showSinger,perpage).then((res) => {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        })
      },
      getIconCls(item){
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item){
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      search(){
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query,this.page,this.showSinger,perpage).then((res) => {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        })
      },
      selectItem(item){
        if(item.type === TYPE_SINGER){
          const singer = new Singer({
            id: item.singerid,
            name: item.singername,
            mid: item.singermid,
          })
          this.$router.push({
            path: `/search/${singer.mid}`
          })
          this.setSinger(singer)
        } else{
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      listScroll(){
        this.$emit('listScroll')
      },
      _checkMore(data){
        const song = data.song
        if(!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum){
          this.hasMore = false
        }
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: "SET_SINGER"
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch:{
      query(){
        this.search()
      }
    },
    components:{
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style lang='less'>
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .suggest {
    height: 100%;
    overflow: hidden;

  .suggest-list {
    padding: 0 30px;

  .suggest-item {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
  }

  .icon {
    flex: 0 0 30px;
    width: 30px;

  [class^="icon-"] {
    font-size: 14px;
    color: @color-text-d;
  }

  }
  .name {
    flex: 1;
    font-size: @font-size-medium;
    color: @color-text-d;
    overflow: hidden;

  .text {
   .no-wrap();
  }

  }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  }

</style>
