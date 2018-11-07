<template>
  <div class="rank">
  	<rank-detail :topList="topList"></rank-detail>
  </div>
</template>

<script>
import RankDetail from "@/components/rankdetail"
import {getRankList} from "@/api"
export default {
  data:function(){
    return {
      topList:[]
    }
  },
  components:{
    RankDetail
  },
  created(){
    this.getSlide();
  },
  methods:{
    detail(id){
      this.$router.push({path:`/ranking/${id}`});
    },
    getSlide:function(){
      getRankList().then(res => {
        this.topList = res.data.topList
      }).catch(function(reason) {
         });
    }
  }
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