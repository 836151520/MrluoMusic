<template>
    <div class="player" v-show="playerList.length > 0">
        <!-- 播放页面全屏 -->
        <transition name='normal'>
            <div class="normal-player" v-show="fullScreen">
                <!-- 背景模糊 -->
                <div class="background">
                    <img :src="currentSong.img" alt="" width="100%" height="100%" >
                </div>
                <!-- 顶部 -->
                <div class="top">
                    <div class="back" >
                        <i class="icon-back" @click="back"></i>
                    </div>
                    <h1 class="title">{{currentSong.name}}</h1>
                    <h2 class="subtitle"><span v-for="a in currentSong.singer">{{a.name}}</span></h2>
                </div>
                <!-- 中间cd部分 -->
                <div class="middle swiper-container">
                    <div class="swiper-wrapper">
                        <div class="middle-l swiper-slide">
                            <div class="cd-wrapper">
                                <div class="cd" :class="cdState">
                                    <img :src="currentSong.img" alt="" class="image" > 
                                </div>
                            </div>
                            <!-- 一条歌词滚动 -->
                            <div class="playing-lyric-wrapper">
                                <div class="playing-lyric">{{currentLyric}}</div>
                            </div>
                        </div>
                        <!-- 歌词滚动 -->
                        <scroll class="middle-r swiper-slide" ref="lyriclist">
                            <div class="lyric-wrapper" >
                                <div v-for="(item,index) in lyric.lines" :key="item.key" ref="lyricLine">
                                    <p class="text" :class="{current:index==currentLine}">{{item.txt}}</p>
                                </div>
                            </div>
                        </scroll>
                    </div>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{startTime}}</span>
                        <!-- 播放进度 -->
                        <div class="progress-bar-wrapper">
                            <!-- :percent="percent"是为了传给子组件 --><!-- @percentChange是为了接受从子组件传过来的值 -->
                            <progressBar :percent="percent" @percentChange="newPer"></progressBar>
                        </div>
                        <span class="time time-r">{{getInterval}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i :class='getMode' @click="cMode"></i>
                        </div>
                        <div class="icon i-left">
                            <i class="icon-prev"  @click="prev"></i>
                        </div>
                        <div class="icon i-center" @click="play">
                            <i :class="baState"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon-next" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 小屏 -->
        <transition name="mini" >
            <div class="mini-player" v-show="!fullScreen" @click="toBack">
                <div class="icon">
                    <img :src="currentSong.img" alt="" width="40" height="40" :class="cdState">
                </div>
                <div class="text">
                    <h2 class="name">{{currentSong.name}}</h2>
                    <p class="desc">
                        <span v-for="a in currentSong.singer">{{a.name}}</span>
                    </p>
                </div>
                <div class="control" @click.stop="play">
                    <i :class="xaState"></i>
                </div>
                <div class="control">
                    <i class="icon-playlist" @click.stop="openList"></i>
                </div>
            </div>
        </transition>
        <!-- h5播放器 -->
        <audio ref="audio" :src="currentSong.url" @canplay='changeIsReady' @error='changeIsReady' @timeupdate='timedate' @ended='ended'></audio>
        <play-list v-show="isOpenList" @isCloseChange="nShow"></play-list>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {mapMutations} from 'vuex'
import {getLyric} from '@/api/api.js'
import { Base64 } from 'js-base64'//为了转码歌词
import Lyric from 'lyric-parser'//为了解析转码后的歌词
import playList from '@/components/playlist/index.vue'
import Scroll from "@/components/scroll"
import Swiper from "swiper"
import "swiper/dist/css/swiper.css"
import progressBar from '@/components/progressbar'
export default {
  data(){
    return {
        //播放链接加载状态是否加载完成
        isReady:false,
        //初始播放时间
        currentTime:0,
        lyric:{},//存歌词
        currentLyric:"",//d当前播放的歌词
        currentLine:0,//当前播放的第几条歌词
        isOpenList:false//播放列表状态
    }
  },
  components:{
    Scroll,
    progressBar,
    Lyric,
    playList
  },
  computed:{
    //根据播放状态来判断cd是否旋转
    cdState(){
      return this.playing ? 'play' : 'pause'
    },
    //根据播放状态来判断播放按钮的样式
    baState(){
        return this.playing ? 'icon-pause' : 'icon-play'
    },
    //根据播放状态来判断小屏播放按钮的样式
    xaState(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    //转换歌曲时长
    getInterval(){
        let x = this.currentSong.interval % 60 | 0;
        x = x<10? `0${x}` : x;
        let y = this.currentSong.interval / 60 | 0;
        return `${y}:${x}`
    },
    //转换初始时长
    startTime(){
       let x = this.currentTime % 60 | 0;
        x = x<10 ? `0${x}` : x;
        let y = this.currentTime / 60 | 0;
        return `${y}:${x}`
    },
    //为了能让进度条滚动，要计算已播放时间占总时间的百分比
    percent(){
        return this.currentTime /this.currentSong.interval
    },
    //判断播放模式
    getMode(){
      switch(this.mode){
        case 0 :
          return 'icon-sequence'
          break;
        case 1 :
          return 'icon-random'
          break;
        case 2 :
          return 'icon-loop'
          break;
      }
    },
    ...mapGetters([
      'playerList',
      'fullScreen',
      'playing',
      'currentIndex',
      'currentSong',
      'mode'
    ])
  },
  
  methods:{
    //播放列表
    openList(){
      this.isOpenList = true
    },
    nShow(v){
      this.isOpenList = v
    },
    //播放全屏切换小屏
     back(){
        this.changeFullScreen(!this.fullScreen)
     },
     //播放小屏切换全屏
     toBack(){
        this.changeFullScreen(!this.fullScreen)
     },
     //点击切换播放还是暂停
     play(){
        this.changePlaying(!this.playing)
        //歌词//歌词组件提供的方法
        this.lyric.togglePlay()
     },
     //下一首和上一首
     prev(){
        if(!this.isReady){
            return
        }
        let index = this.currentIndex - 1;
        if(index == -1){
            index = this.playerList.length - 1
        }
        this.changeCurrentIndex(index);
        this.isReady = false;
        console.log(this.playing)
        if(!this.playing){
            this.play()
        }
     },
     next(){
        if(!this.isReady){
            return
        }
        let index = this.currentIndex + 1;
        if(index >= this.playerList.length){
            index = 3
        }
        this.isReady = false;
        this.changeCurrentIndex(index);
        if(this.playing == false){
          this.play()
        }
     },
     //为了解决一直点下一首的bug
     changeIsReady(){
        this.isReady = true;
     },
     //初始时间进度,为了让左边的时间一直加，传到上面的computed进一步加工
     timedate(ev){
        this.currentTime = ev.target.currentTime;
    },
    //根据子组件传过来的百分比，使点进度条歌曲可以快进
    newPer(v){
      let w = this.currentSong.interval * v;
      this.$refs.audio.currentTime = w;
      //currentTime是audio自带的事件，可以根据时间调整歌曲的进度
      //如果当歌曲是暂停状态，拖动进度条到任意另一位置，自动变为播放状态
      if(!this.playing){
        this.togglePlaying()
      }
      //点进度条，歌词跳到对应的位置
      if(this.lyric){
        this.lyric.seek(w*1000)
      }
    },
    //获取歌词
    getLyic(){
        //传id进去，获取对应的歌词
        getLyric(this.currentSong.id).then((res) => {
          console.log(new Lyric(Base64.decode(res.lyric)))
          //hanld是回调函数
          this.lyric = new Lyric(Base64.decode(res.lyric),this.hanlder)
        if(this.playing){
            //当歌曲播放时
            this.lyric.play()
            // play()是我们引用github  Lyric里面带的函数
        }
       })
        var banne = new Swiper ('.middle' ,{
            // 增加小圆点
          pagination: {
            el: '.dot-wrapper',
            bulletClass:'dot',
            bulletActiveClass:'active'
            //一定要删除样式那里的scoped 不然不会生效
          }
          //如果不写下面两个属性就会产生划不动的现象
          // observer:true,
          // observerParents:true
        })
    },
    //回调函数
    hanlder({lineNum,txt}){
      console.log(lineNum)
      console.log(txt)
      
      this.currentLine = lineNum
      //让歌词变颜色的部分自己滚动
      if(lineNum>5){
        let x = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyriclist.scrollToElement(x,1000)
      }else{
        this.$refs.lyriclist.scrollTo(0,0,1000)
      }
      this.currentLyric = txt;
    },
    //点击切换播放模式
    cMode(){
        let mode = (this.mode + 1) % 3
        this.changeMode(mode)//调用mapMutations里面的方法
    },
    //播放完成后
    ended(){
      if(this.mode == 0){
        this.next()
      }else if(this.mode == 1){
        this.next()
      }else if(this.mode == 2){
        this.loop()
      }
    },
    //单曲循环
    loop(){
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play()
      this.lyric.seek(0)
    },
     //当我们需要调用mutations里面的方法时，就需要在mapMutations里面加
     ...mapMutations([
      'changePlayList',
      'changeFullScreen',
      'changePlaying',
      'changeCurrentIndex',
      'changeMode'
    ])
  },
  watch:{
    playing(val){
        // this.$nextTick()  页面加载完成后再执行
        this.$nextTick(() => {
            val ? this.$refs.audio.play() : this.$refs.audio.pause()
        })
    },
    //当点击下一首 上一首时需要重新监听，然后重启audio
    currentSong(val){
      if(val.url){
        this.$nextTick(() => {
            this.getLyic()
            val ? this.$refs.audio.play() : this.$refs.audio.pause()
        })
      }

    }
  }
}
</script>

<style lang="less">
@import url('~@/assets/less/variable.less');
.player{
    .normal-player{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: @color-background;
      .background{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top{
        position: relative;
        margin-bottom: 0.25rem;
        .back{
          position: absolute;
          top: 0;
          left: 0.06rem;
          z-index: 50;
          .icon-back{
            display: block;
            padding: 0.09rem;
            font-size: @font-size-large-x;
            color: @color-theme;
            transform: rotate(-90deg);
          }
        }
        .title{
          width: 70%;
          margin: 0 auto;
          line-height: 0.4rem;
          text-align: center;
          font-size: @font-size-large;
          color: @color-text;
        }
        .subtitle{
          line-height: 0.2rem;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }
      }
      .middle{
        position: fixed;
        width: 100%;
        top: 0.8rem;
        bottom: 1.7rem;
        white-space: nowrap;
        font-size: 0;
        .middle-l{
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper{
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd{
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 0.1rem solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              // cd中间的照片旋转样式
              &.play{
                // infinite意思是永久循环，rotate是动画的名称（见本文件最底部）
                animation: rotate 20s linear infinite;
              }
              &.pause{
                animation-play-state: paused;
              }
              .image{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper{
            width: 80%;
            margin: 0.3rem auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric{
              height: 0.2rem;
              line-height: 0.2rem;
              font-size: @font-size-medium;
              color: @color-text-l;
            }
          }
        }
        .middle-r{
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper{
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text{
              line-height: 0.32rem;
              color: @color-text-l;
              font-size: @font-size-medium;
              &.current{
                color: @color-text;
              }
            }
          }
        }
      }
      .bottom{
        position: absolute;
        bottom: 0.3rem;
        width: 100%;
        .dot-wrapper{
          text-align: center;
          font-size: 0;
          .dot{
            display: inline-block;
            vertical-align: middle;
            margin: 0 0.04rem;
            width: 0.08rem;
            height: 0.08rem;
            border-radius: 50%;
            background: @color-text-l;
            &.active{
              width: 0.2rem;
              border-radius: 0.05rem;
              background: @color-text-ll;
            }
          }
        }
        .progress-wrapper{
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 0.2rem 0 0 0;
          margin-bottom: -0.2rem;
          .time{
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0.1rem 0.1rem 0;
            width: 1.5rem;
            &.time-l{
              text-align: left;
            }
            &.time-r{
              text-align: right;
            }
          }
          .progress-bar-wrapper{
            width:7rem;
          }
        }
        .operators{
          height: 0.8rem;
          display: flex;
          align-items: center;
          .icon{
            flex: 1;
            color: @color-theme;
            &.disable{
              color: @color-theme-d;
            }
            i{
              font-size: 0.3rem;
            }
          }
          .i-left{
            text-align: right;
          }
          .i-center{
            padding: 0 0.2rem;
            text-align: center;
            i{
              font-size: 0.4rem;
            }
          }
          .i-right{
            text-align: left;
          }
          .icon-favorite{
            color: @color-sub-theme;
          }
        }
      }
      // 播放器大屏切换动画效果
      &.normal-enter-active, &.normal-leave-active{
        transition: all 0.4s;
        .top, .bottom{
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to{
        opacity: 0;
        .top{
          transform: translate3d(0, -1rem, 0);
        }
        .bottom{
          transform: translate3d(0, 1rem, 0);
        }
      }
    }
    .mini-player{
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 0.6rem;
      background: @color-highlight-background;
      // 播放器小屏切换动画效果
      &.mini-enter-active, &.mini-leave-active{
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to{
        opacity: 0;
      }
      .icon{
        flex: 0 0 0.4rem;
        width: 0.4rem;
        padding: 0 0.1rem 0.3rem 0.2rem;
        img{
          border-radius: 50%;
          //margin-bottom: 0.15rem;
          &.play{
            animation: rotate 10s linear infinite;
          }
          &.pause{
            animation-play-state: paused;
          }
        }
      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 0.2rem;
        overflow: hidden;
        .name{
          margin-bottom: 0.02rem;
          font-size: @font-size-medium;
          color: @color-text;
        }
        .desc{
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
      .control{
        flex: 0 0 0.3rem;
        width: 0.3rem;
        padding: 0 0.1rem 0.45rem 0.05rem;
        .icon-play-mini, .icon-pause-mini, .icon-playlist{
          font-size: 0.3rem;
          color: @color-theme-d;
        }
        .icon-mini{
          font-size: 0.32rem;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }
  @keyframes rotate{
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>
