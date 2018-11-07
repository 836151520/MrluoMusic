<template>
  <div class="search">
    <input type="text" name="">
    <i class="iconfont icon-search"></i>
  </div>
</template>
<script>
export default {
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
 @import url('~@/assets/less/variable.less');
 .search{
 	margin-top: 4%;
	  input{
	  	  font-size: @font-size-medium;
	  	  display: block;
	      height: 0.2rem;
	      width: 100%;
	      background-color: @color-text-ll;
	  	}
 }
</style>
