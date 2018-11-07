<template>
  <transition name="slide">
     <music-list :title="title" :bgUrl="bgUrl" :songList="songList"></music-list>
  </transition>
</template>

<script>
  import MusicList from '@/components/musiclist'
  import {getRankInfo} from "@/api"
  export default {
    data() {
      return {
        title:"",
        bgUrl:"",
        songList:[],
      }
    },
    created(){
      this.getSlide()
    },
    methods:{
      getSlide(){
       getRankInfo(this.$route.params.id).then((res) =>{
           // console.log(res)
           console.log(res.songlist)
           this.title=res.topinfo.ListName;
           this.bgUrl=`http://imgcache.qq.com/music/photo_new/T002R300x300M000${res.songlist[0].data.albummid}.jpg`;
           for(let i = 0;i<res.songlist.length;i++){
             this.songList.push({
                //歌曲id
                id:res.songlist[i].data.songid,
                //mid
                mid:res.songlist[i].data.songmid,
                //歌曲名
                name:res.songlist[i].data.albumname,
                //专辑名
                album:res.songlist[i].data.singer[0].name,
                // //歌曲时长
                interval:res.songlist[i].data.interval,
                // //专辑封面
                 img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${res.songlist[i].data.albummid}.jpg?max_age=2592000`,
                // //歌曲链接
                url:`http://dl.stream.qqmusic.qq.com/C400${res.songlist[i].data.songmid}/${res.songlist[i].data.songid}.m4a?guid=983915916&fromtag=66`,
                // //g歌手
                singer:res.songlist[i].data.singer
             })
           //   this.songList.push({
           //     songname:res.data.songlist[i].data.albumname,
           //     // albumname:res.data.songlist[i].data.albumname,
           //     img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${res.data.list[i].data.songmid}.jpg?max_age=2592000`,
           //     // singer:[
           //     // {
           //     //   name:res.data.singer_name
           //     // }
           //     // ]
           //   })
           }
         })
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
