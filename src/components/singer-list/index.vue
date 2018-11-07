<template>
  <div class="q" ref="q">
    <scroll class="list-view" ref="scroll" @scroll="scroll" :listenScroll=true :probeType=3>
          <ul class="uu">
            <li class="list-group" ref="listGroup" v-for="a in list" :key="a.key">
                <h2 class="list-group-title">{{a.title}}</h2>
                <ul>
                  <li class="list-group-item" v-for="b in a.items" :key="b.key" @click="detail(b.id)">
                      <img alt="" class="avatar" :src="b.img">
                      <span class="name">{{b.name}}</span>
                  </li>
                </ul>
            </li>
          </ul>
      
          <!--右侧快速定位列表-->
          <!-- touchstart 触摸开始，给div加，不要给li加 -->
          <div class="list-shortcut" @touchstart="touchStart" @touchmove.stop.prevent="touchMove">
              <ul>
                  <li class="item" v-for="(c,index) in touchList" :key='c.key' :data-index="index" :class="{current:currentIndex == index}">{{c}}</li>
              </ul>
          </div>
    </scroll>
    <div class="loading-container" v-show="isloading">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerInfo} from "@/api"
import Scroll from '@/components/scroll'
import Loading from "@/components/loading"
import {myMixin} from "@/assets/js/mixin.js"
export default {
  mixins:[myMixin],
  props:{
        list:{
            type:Array,
            default:[]
        }
    },
    data(){
        return {
            //建立一个对象存储第一次手指触摸的位置及index
            touch:{},
            currentIndex:0,//高亮显示 变色
            listHeight:[],
            scrollY:0,//scroll函数的需要
            isloading:true
        }
    },
    components:{
        Scroll,
        Loading
    },
    updated () {//数据加载完成后
      this.getLiHeight(); 
      this.isloading = false 
    },
    //热门只显示热一个字，处理数据用计算  substring() 方法用于提取字符串中介于两个指定下标之间的字符。
    computed: {
        touchList(){
            let arr = [];
            for(let i=0; i<this.list.length;i++){
                arr.push(this.list[i].title.substring(0,1))
            }
            return arr;
        }
    },
    methods:{
        watchPlayerList(playerList){
          if(playerList.length>0){
            this.$refs.q.style.bottom = "100px"
            this.$refs.scroll.refresh()
          }else{
            this.$refs.q.style.bottom = "18px"
            this.$refs.scroll.refresh()
          }
        },
        detail(id){
          this.$router.push({path:`/singer/${id}`});
        },
        //ev是touchStart自带的参数 触摸开始
        touchStart(ev){
          console.log(this.list)
            // console.log(ev)
            //获取手指点击的那个li的下标
            let cIndex = ev.target.attributes['data-index'].value
            //手指触摸时记录当前的index还有位置
            this.touch.index = cIndex
            this.touch.y1 = ev.touches[0].pageY

            this.scrollTo(cIndex)
        },
        touchMove(ev){
            //手指在滑动时也要记录滑动的位置
            this.touch.y2 = ev.touches[0].pageY
            //计算滑动的距离经过几个li，向下取整(自行百度Math.floor 和 | 0)
            let aIndex = (this.touch.y2 - this.touch.y1) / 18 | 0 
            let cIndex = aIndex + parseInt(this.touch.index)

            this.scrollTo(cIndex)
        },
        //拖动的时候要改变scrollY的值，因为往下拖，scrollY是负值
        scrollTo(index){
            this.scrollY = -this.listHeight[index]
            //左边的scroll也跳转至点击的cIndex
            //scrollToElement是scroll文件夹里面封装的方法，有两个参数 后面一个0是延时
            this.$refs.scroll.scrollToElement(this.$refs.listGroup[index],0)
        },
        //在scroll函数中要获取当前的位置 要开启:listenScroll=true :probeType=3
        scroll(pos){
            this.scrollY = pos.y
        },
        //获取所有li单独的高度
        getLiHeight(){
            const  list = this.$refs.listGroup;//获取所有li
            let height = 0;
            this.listHeight.push(height)
            for(let i=0;i<list.length;i++){
                height += list[i].clientHeight;
                this.listHeight.push(height)
            }
        }
    },
    watch:{//监听
        scrollY(v){
            //顶端
            if(v>0){
                this.currentIndex = 0
                return
            }
            //中间
            for(let i=0;i<this.listHeight.length;i++){
                let h1 = this.listHeight[i]
                let h2 = this.listHeight[i+1]
                //v是负数
                if(-v >= h1 && -v < h2){
                    this.currentIndex = i
                    return
                }
            }
            //底下
            this.currentIndex = this.listHeight.length
        }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.q{
  position: fixed;
  top: 88px;
  bottom:0;
  width: 100%;
}
.list-view{
    margin-top: 4%;
    height: 100%;
    overflow: hidden;
    background: @color-background;
    .uu{
    }
    .list-group{
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size:@font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
      .list-group-item{
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name{
          margin-left: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
    }
    .list-shortcut{
      position: absolute;
      right: 0;
      top: 54%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: @color-background-d;
      font-family: Helvetica;
      .item{
        padding: 3px;
        line-height: 1;
        color: @color-text-l;
        font-size: @font-size-small;
        &.current{
          color: @color-theme;
        }
      }
    }
    .list-fixed{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
    }
    
}
.loading-container{
      position: absolute;
      width: 100%;
      top: 20%;
      transform: translateY(-50%);
    }
</style>
