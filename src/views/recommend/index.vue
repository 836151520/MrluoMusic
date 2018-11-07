<template>
  <div class="h" ref="h">
   <scroll class="content" ref="scroll">
     <div>
       <div class="swiper-container qwe">
         <div class="swiper-wrapper">
              <!-- :key="item.key"  没什么用，如果不写可能会报错，这个是vue要求的 -->
           <div class="swiper-slide" v-for="item in slider" :key="item.key">
             <img :src="item.picUrl" width="100%">
           </div>
         </div>
         <div class="swiper-pagination"></div>
       </div>
       <div class="hot_recommmend">
         <h2 class="ss">热门歌单推荐</h2>
         <div class="list" v-for="_item in list" :key="_item.key" @click="detail(_item.id)">
          <img :src="_item.picUrl">
          <div class="list_txt">
            <p class="songListDesc">{{_item.songListDesc}}</p>
            <p class="author">{{_item.songListAuthor}}</p>
          </div>
        </div>
      </div>
     </div>
     <div class="loading-container" v-show="isLoading">
       <loading></loading>
     </div>
   </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import {getRecommend} from "@/api"
import  Scroll from '@/components/scroll'//因为每个页面都要使用scroll，所以我们要把scroll封装为一个组件，再引用组件
import Swiper from "swiper"
// import "../../static/css/swiper.min.css"
import "swiper/dist/css/swiper.css"
import Loading from "@/components/loading"
import {myMixin} from "@/assets/js/mixin.js"
// import axios from "axios"
export default {
  mixins:[myMixin],
  data:function(){
    return {
      slider:[],
      list:[],
      isLoading:true
    }
  },
  components:{
    Scroll,
    Loading
  },
  created(){
    this.getSlide();
  },
  methods:{
    watchPlayerList(playerList){
        if(playerList.length>0){
          this.$refs.h.style.bottom = "110px"
          this.$refs.scroll.refresh()
        }else{
          this.$refs.h.style.bottom = "30px"
          this.$refs.scroll.refresh()
        }
    },
    getSlide:function(){//getSlide 上面创建的钩子函数
      getRecommend().then(res => {//getRecommend 是api
        console.log(res);
        this.slider = res.data.slider;
        this.list = res.data.songList;
        this.isLoading = false;
        var banner = new Swiper ('.qwe' ,{
            // 增加小圆点
          pagination: {
            el: '.swiper-pagination',
            clickable :true,
          },
          autoplay:{
            delay:2000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          //如果不写下面两个属性就会产生划不动的现象
          observer:true,
          observerParents:true
        })
      })
    },
    detail(id){
      this.$router.push({path:`/recommend/${id}`});
    }
  },
  
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import url('~@/assets/less/variable.less');
  .h{
    position: fixed;
    top: 88px;
    bottom:0;
    width: 100%;
  }
  .content{
    margin-top: 7%;
    height: 100%;
    overflow:hidden;
    .swiper-container{
    }
    .hot_recommmend{
      h2{
        color: @color-theme;
        font-size: @font-size-medium !important;
        height:0.24rem;
          width:100%;
          text-align:center;
          margin-top:0.1rem;
        }
      .list{
        margin-left: 0.2rem;
        margin-bottom: 0.2rem;
        display: flex;
        img{
          width: 0.6rem;
          height:0.6rem;
        }
        .list_txt{
          margin-left: 0.2rem;
          display: flex;
          flex-direction:column;
          justify-content: space-around;
          width: 2.2rem;
          p{
            font-size: @font-size-medium;
          }
          .songListDesc{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .author{
            color: @color-text-ll;
          }
        }
      }
    }
    .loading-container{
    position: absolute;
    width: 100%;
    top: 50%;
    transform:translateY(-50%);
    height: 100%;
    background:#222;
  }

  }


</style>