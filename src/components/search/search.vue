<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll  ref="shortcut" class="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span  class="clear" @click="showConfirm">
                  <i class="icon-clear"></i>
                </span>
            </h1>
            <search-list :searches="searchHistory" @delete="deleteSearchHistory" ></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result"  ref="searchResult" v-show="query">
      <suggest :query="query" @listScroll="blurInput" ref="suggest" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm"
             text="是否清空所有搜索历史"
             confirmBtnText="清空"
             @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Suggest from 'components/suggest/suggest'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {mapActions,mapGetters} from 'vuex'
  import {playlistMixin,searchMixin} from 'common/js/mixin'
  export default{
    mixins: [playlistMixin,searchMixin],
    data(){
      return{
        hotKey: [],
       /* query: ""*/
      }
    },
    computed:{
      shortcut(){
        return this.hotKey.concat(this.searchHistory)
      },
    /*  ...mapGetters([
        "searchHistory"
      ])*/
    },
    methods:{
      _getHotKey(){
        getHotKey().then((res) => {
          console.log(res)
          if(res.code === ERR_OK){
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      /*addQuery(query){
        this.$refs.searchBox.setQury(query)
        this.query =query
      },
      onQueryChange(newQuery){
        this.query = newQuery
      },
      blurInput(){
        this.$refs.searchBox.blur()
      },
      saveSearch(){
        this.saveSearchHistory(this.query)
      },*/
      showConfirm(){
        this.$refs.confirm.show()
      },
      ...mapActions([
       /* 'saveSearchHistory',
        'deleteSearchHistory',*/
        'clearSearchHistory'
      ]),
    },
    watch:{
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    created(){
      this._getHotKey()
    },
    components:{
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
  }
</script>

<style lang='less'>
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .search {

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

  .shortcut {
    height: 100%;
    overflow: hidden;

  .hot-key {
    margin: 0 20px 20px 20px;

  .title {
    margin-bottom: 20px;
    font-size: @font-size-medium;
    color: @color-text-l;
  }

  .item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background: @color-highlight-background;
    font-size: @font-size-medium;
    color: @color-text-d;
  }

  }
  .search-history {
    position: relative;
    margin: 0 20px;

  .title {
    display: flex;
    align-items: center;
    height: 40px;
    font-size: @font-size-medium;
    color: @color-text-l;

  .text {
    flex: 1;
  }

  .clear {
    .extend-click();

  .icon-clear {
    font-size: @font-size-medium;
    color: @color-text-d;
  }

  }
  }
  }
  }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }

  }

</style>
