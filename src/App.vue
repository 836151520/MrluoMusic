<template>
  <div id="app">
    <!-- 头部公共组件 -->
    <music-header></music-header>
    <!-- 选项卡公共组件 -->
    <tab></tab>
    <!-- 路由页面 -->
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>

    <player></player>
  </div>
</template>

<script>
  import MusicHeader from "@/components/music_header"
  import Tab from "@/components/tabs"
  import Player from "@/components/player/index.vue"
export default {
  components:{
    MusicHeader,
    Tab,
    Player
  }
}
</script>

<style lang="less">
  @import '~@/assets/less/index.less';
  .fade-enter{
    opacity: 0
  }
  .fade-leave{
    opacity: 1
  }
  .fade-enter-active{
    transition:0.5s;
  }
  .fade-leave-active{
    opacity: 0;
    transition: 0.2s;
  }
</style>
