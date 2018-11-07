<template>
  <div class="music_header">
    <img src="../../assets/logo.jpg">
    <h2>Mr'Luo  Music</h2>
  </div>
</template>

<script>
export default {
}
</script>
  <!-- ~@是直接在当前目录下找，@的意思是指向src文件夹 -->
<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .music_header{
    height: 0.44rem;
    display: flex;
    align-items: center;
    justify-content: center;
    h2{
      font-size: @font-size-medium-x;
      color:@color-theme;
      margin-left: 0.08rem;
    }
  }
</style>
