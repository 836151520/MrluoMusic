<template>
  <div class="tabs">
    <router-link class="router-link"  to="/recommend">推荐</router-link>
    <router-link class="router-link"  to="/singer">歌手</router-link>
    <router-link class="router-link"  to="/ranking">排行</router-link>
    <router-link class="router-link"  to="/search">搜索</router-link>
  </div>
</template>

<script>
export default {
}
</script>
  <!-- ~@是直接在当前目录下找，@的意思是指向src文件夹 -->
<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .tabs{
    height:0.44rem;
    display: flex;
    justify-content: space-around;
    a{
      font-size: @font-size-medium;
      text-align: center;
      line-height: 0.44rem;
      color:@color-text-ll;
      &.router-link-active{
        color:@color-theme;
        border-bottom: 2px solid;
      }
    }
  }
</style>
