<template>
  <div id="appmusc">
    <m-header></m-header>
    <v-tab></v-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import MHeader from "components/m-header/m-header.vue"
  import VTab from "components/v-tab/v-tab.vue"
  import Player from 'components/player/palyer.vue'
  export default {
    components: {
      MHeader,
      VTab,
      Player
    }
  }
</script>

<style lang='less'>
</style>
