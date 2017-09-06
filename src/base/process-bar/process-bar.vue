<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
      @touchstart.prevent="processTouchStart"
      @touchmove.prevent="processTouchMove"
      @touchend="processTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')
  export default{
    props:{
      persent:{
        type: Number,
        default: 0
      }
    },
    created(){
      this.touch = {}
    },
    methods:{
      processTouchStart(e){
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      processTouchMove(e){
        if(!this.touch.initiated){
          return
        }
        const moveX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth,Math.max(moveX + this.touch.left, 0))
        this._offset(offsetWidth)
      },
      processTouchEnd(){
        this.touch.initiated = false
        this._triggerPersent()
      },
      progressClick(e){
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPersent()
      },
      _triggerPersent(){
        this.$emit("percentChange", this._getPercent())
      },
      _getPercent(){
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        return this.$refs.progress.clientWidth / barWidth
      },
      _offset(offsetWidth){
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      }
    },
    watch:{
      persent(newPersent){
        if(newPersent > 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPersent * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style lang='less'>
  @import "~common/less/variable";

  .progress-bar {
    height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

  .progress {
    position: absolute;
    height: 100%;
    background:@color-theme;
  }

  .progress-btn-wrapper {
    position: absolute;
    left: -8px;
    top: -13px;
    width: 30px;
    height: 30px;

  .progress-btn {
    position: relative;
    top: 7px;
    left: 7px;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border: 3px solid @color-text;
    border-radius: 50%;
    background: @color-theme;
  }

  }
  }
  }

</style>
