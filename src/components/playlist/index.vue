<template>
  <transition name="list-fade">
    <div class="playlist">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">         
            <span class="text">{{modeTxt}}</span>
            <span class="clear" @click="clearAll">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent">
          <transition  name="list">
            <ul>
              <li class="item" ref="listItem" v-for='(item,index) in playerList' :key='item.key' @click="changeSong(index)">
                <i class="current" :class="currentClass(item)"></i>
                <span class="text">{{item.name}}</span>
                <span class="like">
                  <i></i>
                </span>
                <span class="delete" @click.stop="del(item)">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </ul>
          </transition>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click='isClose'>
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>
content
<script>
import Scroll from "@/components/scroll/index.vue"
import {mapGetters,mapMutations,mapActions} from 'vuex'
import { MessageBox } from 'mint-ui'

export default {
  data(){
    return {
    }
  },
  components:{
    Scroll
  },
  //不写这个就只有在列表页面点歌曲播放才能滑动
  updated(){
    this.$refs.listContent.refresh()
  },
  computed:{
    modeTxt(){
      return this.mode == 0 ? "顺序播放" : this.mode == 1 ? "随机播放" : "单曲循环"
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
    isClose(){
      this.$emit('isCloseChange',false)
    },
    currentClass(item){
       return item.id == this.currentSong.id ? "icon-play" : ""
    },
    //改变歌曲
    changeSong(index){
      this.changeCurrentIndex(index)
    },
    del(item){
      this.delone(item)
    },
    clearAll(){
      MessageBox.confirm('是否清空播放列表?').then(() => {
        this.clear()
      });
    },
    ...mapMutations([
      "changeCurrentIndex"
    ]),
    ...mapActions([
      'delone',
      'clear'
    ])
  }
}
</script>
<style scoped lang='less'>
@import "~@/assets/less/variable.less";
@import url("//unpkg.com/mint-ui/lib/style.css");
.playlist{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: @color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active{
    transition: opacity 0.3s;
    .list-wrapper{
      transition: all 0.3s;
    }
  }
  &.list-fade-enter, &.list-fade-leave-to{
    opacity: 0;
    .list-wrapper{
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: @color-highlight-background;
    .list-header{
      position: relative;
      padding: 20px 30px 10px 20px;
      .title{
        display: flex;
        height: 30px;
        align-items: center;
        .icon{
          margin-right: 10px;
          font-size: 30px;
          color: @color-theme-d;
        }
        .text{
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
        .clear{
          position: relative;
          .icon-clear{
            position: absolute;
            top: -10px;
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
      }
    }
    .list-content{
      max-height: 240px;
      overflow-y:hidden;
      .item{
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.list-enter-active, &.list-leave-active{
          transition: all 0.1s;
        }
        &.list-enter, &.list-leave-to{
          height: 0;
        }
        .current{
          flex: 0 0 20px;
          width: 20px;
          font-size: @font-size-small;
          color: @color-theme-d;
        }
        .text{
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-d
        }
        .like{
          margin-right: 15px;
          font-size: @font-size-small;
          color: @color-theme;
          .icon-favorite{
            color: @color-sub-theme;
          }
        }
        .delete{
          font-size: @font-size-small;
          color: @color-theme;
        }
      }
      
    }
    .list-operate{
      width: 140px;
      margin: 20px auto 30px auto;
      .add{
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid @color-text-l;
        border-radius: 100px;
        color: @color-text-l;
        .icon-add{
          margin-right: 5px;
          font-size: @font-size-small-s;
        }
        .text{
          font-size: @font-size-small;
        }
      }
    }
    .list-close{
      z-index: 10;
      text-align: center;
      line-height: 50px;
      background: @color-background;
      font-size: @font-size-medium-x;
      color: @color-text-l;
    }
  }
}
</style>
