<template>
  <transition name="slide">
     <music-list :title="title" :bgUrl="bgUrl" :songList="songList"></music-list>
  </transition>
</template>

<script>
  import MusicList from '@/components/musiclist'//引用公共组件
  import {getCdInfo} from "@/api"
  export default {
    data() {
      return {
        title:"",
        bgUrl:"",
        songList:[]
      }
    },
    created() {
      this.getSlide();
    },
    methods: {
      getSlide(){
       getCdInfo().then((res) =>{
         // return res.data;
         console.log(res)
         this.title=res.data.cdlist[0].dissname;
         this.bgUrl=res.data.cdlist[0].logo;
         // this.songList=res.data.cdlist[0].songlist;
         this.songList=this.editSongs(res.data.cdlist[0].songlist);
       })
      },
      //处理songlist
      editSongs(list){
        //通过上面的这个list就等于this.songList
        let nSongList = [];
        for(let i= 0;i<list.length;i++){
          let item = {
            //歌曲id
            id:list[i].songid,
            //mid
            mid:list[i].songmid,
            //歌曲名
            name:list[i].songname,
            //专辑名
            album:list[i].albumname,
            //歌曲时长
            interval:list[i].interval,
            //专辑封面
             img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].albummid}.jpg?max_age=2592000`,
            //歌曲链接
            url:`http://dl.stream.qqmusic.qq.com/C400${list[i].songmid}/${list[i].songid}.m4a?guid=983915916&fromtag=66`,
            //g歌手
            singer:list[i].singer
          }
          nSongList.push(item)
        }
        return nSongList
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style lang="less" scoped>
  .slide-enter-active,.slide-leave-active{
    transition: all 0.5s;
  }
  .slide-enter,.slide-leave-to{
    transform: translate3d(100%,0,0);
  }
</style>
