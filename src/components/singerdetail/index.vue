<template>
  <div class="details">
    <div class="header" ref="hd" >
      <div :style="bgImg" ref="bgImg" class="bgImg"></div>
      <span class="icon-back" @click="back"></span>
      <p>{{title}}</p>
      <div class="random" ref="random">
        <span><span class="icon-play"></span>随机播放全部</span>
      </div>
    </div>
    <!-- 滑动辅助层 -->
    <div class="bg-layer" ref="layer"></div>
    <scroll ref='list' class="list" :listenScroll=true :probeType=3 @scroll="scroll">
      <ul>
        <li v-for='(i,index) in songList'
          :key="i.key">
          <div class="rank">
            {{index+1}}
          </div>
          <div class="r">
            <p>{{i.songname}}</p>
            <p><span v-for="b in i.singer" :key="b.key">{{b.name}} . </span>{{i.albumname}}</p>
          </div>
        </li>
      </ul>
    </scroll>
    <!-- <div class="loading" v-show="isLoading">
      <loading></loading>
    </div> -->
  </div>
</template>

<script>
import Scroll from "@/components/scroll"
import Loading from "@/components/loading"
export default {
  data(){
    return {
      isLoading:true,
      scrollY:0
    }
  },
  props:{//父组件向子组件传值，通过prop来接受
    title:{
      type:String,
      default:''
    },
    bgUrl:{
      type:String,
      default:''
    },
    songList:{
      type:Array,
      default:[]
    },
  },
  // created() {
  //   this.getSlide()
  // },
  mounted(){
    //获取背景图片的高度，并将滚动区域的top设置为背景图片的高度
    this.h = this.$refs.bgImg.clientHeight;
    this.$refs.list.$el.style.top = `${this.h}px`;
    this.ty = -this.h + 44  
  },
  methods: {
    back:function(){
      this.$router.back();
    },
    //要判断scroll是向上滚还是向下滚，要给scroll绑定一个scroll事件
    scroll(pos){
      console.log(pos.y)
      this.scrollY = pos.y
    }
  },
  components:{
    Scroll,
    Loading
  },
  //歌单详情的图片要的是背景图片，不能直接img，
  computed:{
    bgImg(){
      return `background-image:url(${this.bgUrl})`
    }
  },
  //监听
  watch:{
    scrollY(v){
      //辅助层用的东西
      let translateY = Math.max(this.ty,v)
      let zIndex = 0
      //缩放
      let scale = 1;
      const p = Math.abs(v/this.h)
      //判断
      if (v>0) {
        scale = 1 + p;
        zIndex = 10
      }
      this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`;
      if (v<this.ty) {
        zIndex = 8;
        this.$refs.hd.style.zIndex = 8;
        this.$refs.bgImg.style.paddingTop = 0;
        this.$refs.bgImg.style.height = "44px";
        this.$refs.random.style.display = "none";
      }else{
        this.$refs.bgImg.style.paddingTop = "70%";
        this.$refs.bgImg.style.height = 0;
        this.$refs.random.style.display = "block";
      }
      this.$refs.hd.style.zIndex = zIndex;
      this.$refs.bgImg.style.transform = `scale(${scale})`
    }
  },
  updated(){
    this.isLoading = false
  }
}
</script>

<style lang='less' scoped>
@import "~@/assets/less/variable.less";
.details{
  position:fixed;
  width: 100%;
  top:0;
  bottom:0;
  overflow: hidden;
  background: @color-background;
  z-index:1;
  .header{
    position: relative;
    width: 100%;
    height: 2.24rem;
    .bgImg{
      position: relative;
      width:100%;
      padding-top:70%;
      transform-origin:top;
      background-size: cover;

    }
    .icon-back{
      position: absolute;
      top:0.1rem;
      left:0.2rem;
      font-size: 0.25rem;
      color:@color-theme;
      z-index:2;
    }
    p{
      position: absolute;
      top:0.12rem;
      width: 100%;
      text-align: center;
      font-size: @font-size-large;
    }
    .random{
      position: absolute;
      bottom:0.2rem;
      left:50%;
      margin-left:-0.66rem;
      width: 1.32rem;
      border: 1px solid @color-theme;
      border-radius: 0.25rem;
      font-size:@font-size-medium;
      padding: 0.07rem 0;
      span{
        display: flex;
        align-items: center;
        justify-content: center;
        color:@color-theme;
      }
      .icon-play{
        margin-right:0.06rem;
        font-size: @font-size-medium-x;
      }
    }
  }
  .bg-layer{
    position: relative;
    height:100%;
    background:@color-background;
  }
  .list{
    position: fixed;
    top: 0;
    bottom:0;
    width: 100%;
    font-size: @font-size-small;
    transition: all 0.5s;
    ul{
      padding: 0.33rem 0.30rem;
      li{
        .rank{
            float: left;
            line-height: 0.36rem;
            color: @color-theme ;
            font-size: @font-size-medium-x;
        }
        .r{
          margin-left: 0.30rem;
          p{
            font-size:@font-size-small;
          }
          p:nth-child(2){
            margin-top: 0.12rem;
            color:@color-text-d;
          }
        }
      }
      li~li{
        margin-top: 0.33rem ;
      }
    }
  }
  .loading{
    position: absolute;
    width: 100%;
    top: 50%;
    transform:translateY(-50%);
    height: 100%;
    background:#222;
  }
}
</style>
