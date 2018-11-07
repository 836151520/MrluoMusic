<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div><!-- 黄色进度条 -->
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart="start" @touchmove="move" @touchend="end"><!-- 按钮 -->
        <div class="progress-btn" ></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        touch:{}
      }
    },
    props:{
      percent:{
        type:Number,
        default:0
      }
    },
    methods:{
      //progressClick要实现两个功能，1、点进度条，按钮要跳到点的位置，2、歌曲也要跳
      progressClick(ev){
        //获取鼠标的位置
        let x = ev.pageX - this.$refs.progressBar.offsetLeft;
         this.$refs.progress.style.width = x + 'px'
         this.$refs.progressBtn.style.transform = `translate(${x}px,0)`
         this.newPercent()
      },
      //重新计算百分比，传给父组件
      newPercent(){
        //this.$refs.progress.clientWidth播放后黄条的长度
        let bar = this.$refs.progressBar.clientWidth - 16;
        let p = this.$refs.progress.clientWidth / bar;
        this.$emit("percentChange",p)//传给父组件
      },
      //写按钮的拖动
      
      start(ev){
        this.touch.percent = true;
        console.log(ev)
        //记录刚开始拖动的位置
        this.touch.x = ev.touches[0].pageX
        //记录已播放的进度条的长度
        this.touch.y = this.$refs.progress.clientWidth
      },
      move(ev){
        //记录手指一动的距离
        this.touch.x2 = ev.touches[0].pageX
        //要判断拖拽进度条的距离，不判断的话，进度条可以无限的拖，会出在屏幕外面
        if(this.touch.x2 > this.$refs.progressBar.clientWidth + this.$refs.progressBar.offsetLeft){
          this.touch.x2 = this.$refs.progressBar.clientWidth + this.$refs.progressBar.offsetLeft
        }
        if(this.touch.x2 < this.$refs.progressBar.offsetLeft){
          this.touch.x2 = 0
        }
        //偏移量
        let offset = this.touch.x2 - this.touch.x + this.touch.y;
        this.$refs.progress.style.width = offset + "px";
        this.$refs.progressBtn.style.transform = `translate(${offset}px,0)`;
        //此时可以拖动，但拖完立马要回去，是因为我们监听的percent是随着时间改变而自动变化，我们给start一个变量，在监听之前判断一下
      },
      //拖动结束时重新计算百分比
      end(ev){
        this.touch.percent = false;
        let bar = this.$refs.progressBar.clientWidth - 16;
        //this.$refs.progress.clientWidth播放后黄条的长度
        let p = this.$refs.progress.clientWidth / bar;
        this.$emit("percentChange",p)//传给父组件
      }
    },
    watch:{
      percent(val){
        if(this.touch.percent){
          return
        }
        let w = this.$refs.progressBar.clientWidth - 16;//黄色进度条的总长
        let offset = w * val;//val是从父组件传过来的百分比
        this.$refs.progress.style.width = offset + 'px'
        this.$refs.progressBtn.style.transform = `translate(${offset}px,0)`
      }
    }
  }
</script>

<style lang='less' scoped>
@import "~@/assets/less/variable.less";
.progress-bar{
  height: 0.4rem;

  .bar-inner{
    position: relative;
    top: 0.18rem;
    height: 9px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 9px;
    .progress{
      position: absolute;
      height: 100%;
      background: @color-theme;
    }
    .progress-btn-wrapper{
      position: absolute;
      left: -0.1rem;
      top: -0.1rem;
      width: 0.3rem;
      height: 0.3rem;
      .progress-btn{
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid @color-text;
        border-radius: 50%;
        background: @color-theme;
      }
    }
  }
}
</style>
