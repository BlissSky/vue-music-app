<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
  export default{
    props: {
      title: {
        type: String,
        defult: "正在载入...",
      }
    }
  }
</script>

<style lang='less'>
  @import "~common/less/variable.less";

  .loading {
    width: 100%;
    text-align: center;

  .desc {
    line-height: 20px;
    font-size: @font-size-small;
    color: @color-text-l;
  }
  }
</style>
