<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          @scroll="scroll">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)"  class="list-group-item" v-for="item in group.items">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :data-index="index"
            :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom.js'
  import Loading from 'base/loading/loading'

  const ANCHOR_HEIGHT = 18, TITLE_HEIGHT = 30
  export default{
    data(){
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    created(){
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
      this.listHeight = []
    },
    components: {
      Scroll,
      Loading
    },
    methods: {
      selectItem(item){
        this.$emit("select",item)
      },
      onShortcutTouchStart(e){
        let anchorIndex = getData(e.target, "index")
        let firstPageY = e.touches[0].pageY
        this.touch.y1 = firstPageY
        this.touch.anchorIndex = anchorIndex
        this._scroll(anchorIndex)
      },
      onShortcutTouchMove(e){
        let firstPageY = e.touches[0].pageY
        this.touch.y2 = firstPageY
        let delta = parseInt(this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = this.touch.anchorIndex + delta
        this._scroll(anchorIndex)
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      calculateHeight(){
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (var i = 0; i < list.length; i++) {
          height += list[i].clientHeight
          this.listHeight.push(height)
        }
      },
      _scroll(index){
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 1) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    computed: {
      shortcutList(){
        return this.data.map((gruop) => {
          return gruop.title.substring(0, 1)
        })
      },
      fixedTitle(){
        if (this.scrollY > 0) {
          return ""
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ""
      }
    },
    watch: {
      data(){
        setTimeout(() => {
          this.calculateHeight()
        }, 20)
      },
      scrollY(y){
        let listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (y > 0 ) {
          this.currentIndex = 0
          return
        }
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-y >= height1 && -y < height2) {
            this.currentIndex = i
            this.diff = height2 + y
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal){
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform =`translate3d(0,${fixedTop}px,0)`

      }
    }
  }
</script>

<style lang='less'>
  @import "~common/less/variable.less";

  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: @color-background;

  .list-group {
    padding-bottom: 30px;

  .list-group-title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: @font-size-small;
    color: @color-text-l;
    background: @color-highlight-background;
  }

  .list-group-item {
    display: flex;
    align-items: center;
    padding: 20px 0 0 30px;

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .name {
    margin-left: 20px;
    color: @color-text-l;
    font-size: @font-size-medium;
  }

  }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: @color-background-d;
    font-family: Helvetica;

  .item {
    padding: 3px;
    line-height: 1;
    color: @color-text-l;
    font-size: @font-size-small;

  &.current {
    color: @color-theme;

  }

  }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

  .fixed-title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: @font-size-small;
    color: @color-text-l;
    background: @color-highlight-background;
  }

  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  }
</style>
