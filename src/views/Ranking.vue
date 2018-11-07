<template>
  <div class="rank">
  	<div class="topList" v-for="(item,index) in topList"   :key="index">
  		<img :src="item.picUrl">
  		<div class="ss">
  	    <div class="ranking" v-for="(_item,index) in item.songList" :key="index">
  	    	<p>{{index+1}} {{_item.songname}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-{{_item.singername}}</p>
  	    </div>
  		</div>
  	</div>
  </div>
</template>

<script>
import axios from "axios"
export default {
  data:function(){
    return {
      topList:{},
    }
  },
  created(){
    this.getSlide();
  },
  methods:{
    getSlide:function(){
      let _this = this;
      axios.get("https://www.easy-mock.com/mock/5bc0abe0164f020fff0f4161/rank/").then(function(res){
          console.log(res);
          _this.topList = res.data.data.topList;
      })
    }
  },
}

</script>

<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .rank{
  	margin-top: 4%;
  	.topList{
  		padding:0.1rem 0 0 0.2rem;
  		display: flex;
  		img{
  			width: 1rem;
  			height:1rem;
  		}
  		.ss{
  			display: flex;
        flex-direction:column;
        justify-content:space-around;
        flex: 1;
  		.ranking{
  			width:1.9rem;
  			p{
  				overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
  				font-size: @font-size-medium;
  				margin-left: 0.2rem;
  			}
  		}
  		}
  	}
  }
</style>