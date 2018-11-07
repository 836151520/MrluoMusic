<template>
  <div class="qq" ref="qq">
    <scroll class="rank" ref="scroll">
      <div>
        <ul v-for="item in topList" @click="detail(item.id)" :key="item.key">
          <img :src="item.picUrl">
          <div class="ss">
            <div class="ranking" v-for="(_item,index) in item.songList"   :key="index">
              <p>{{index+1}} {{_item.songname}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-{{_item.singername}}</p>
            </div>
          </div>
        </ul>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import {getRankList} from "@/api"
import Scroll from '@/components/scroll'
import {myMixin} from "@/assets/js/mixin.js"
export default {
  mixins:[myMixin],
  props:{
    topList:{
      type:Array,
      default:[]
    }
  },
  components:{
    Scroll
  },
  methods:{
    watchPlayerList(playerList){
      if(playerList.length>0){
        this.$refs.qq.style.bottom = "100px"
        this.$refs.scroll.refresh()
      }else{
        this.$refs.qq.style.bottom = "18px"
        this.$refs.scroll.refresh()
      }
    },
    detail(id){
      this.$router.push({path:`/ranking/${id}`});
    }
  }
}

</script>

<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .qq{
    position: fixed;
    top: 88px;
    bottom:0;
    width: 100%;
  }
  .rank{
    margin-top: 4%;
    height: 100%;
    overflow:hidden;
    ul{
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
        background: #333;

        .ranking{
          width:1.9rem;
          color:hsla(0,0%,100%,.3);
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