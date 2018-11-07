<template>
  <transition name="slide">
     <music-list :title="title" :bgUrl="bgUrl" :songList="songList"></music-list>
  </transition>
</template>

<script>
  import MusicList from '@/components/musiclist'//引用公共组件
  import {getSingerInfo} from "@/api"
  export default {
    data() {
      return {
        songList:[],
        title:"",
        bgUrl:""
      }
    },
    created(){
      this.getSlide()
    },
    methods:{
      getSlide(){
          getSingerInfo(this.$route.params.id).then((res) =>{
           // return res.data;
            console.log(res.data)
            this.title=res.data.singer_name;
            this.bgUrl=`https://y.gtimg.cn/music/photo_new/T001R300x300M000${res.data.singer_mid}.jpg?max_age=2592000`;
            for(let i = 0;i<res.data.list.length;i++){
              this.songList.push({
                //歌曲id
              id:res.data.list[i].musicData.songid,
              //mid
              mid:res.data.list[i].musicData.songmid,
              //歌曲名
              name:res.data.list[i].musicData.songname,
              //专辑名
              album:res.data.list[i].musicData.albumname,
              //歌曲时长
              interval:res.data.list[i].musicData.interval,
              //专辑封面
               img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${res.data.list[i].musicData.albummid}.jpg?max_age=2592000`,
              //歌曲链接
              url:`http://dl.stream.qqmusic.qq.com/C400${res.data.list[i].musicData.songmid}/${res.data.list[i].musicData.songid}.m4a?guid=983915916&fromtag=66`,
              //g歌手
              singer:res.data.list[i].musicData.singer
              })
            }
            console.log(this.songList)
          })
      },
      //处理songlist
      // editSongs(list){
      //   //通过上面的这个list就等于this.songList
      //   let nSongList = [];
      //   for(let i= 0;i<list.length;i++){
      //     let item = {
      //       //歌曲id
      //       id:list[i].musicData.albumid,
      //       //mid
      //       mid:list[i].musicData.albummid,
      //       //歌曲名
      //       name:list[i].musicData.songname,
      //       //专辑名
      //       album:list[i].musicData.albumname,
      //       //歌曲时长
      //       interval:list[i].musicData.interval,
      //       //专辑封面
      //        img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].musicData.albummid}.jpg?max_age=2592000`,
      //       //歌曲链接
      //       url:`http://dl.stream.qqmusic.qq.com/C400${list[i].musicData.albummid}/${list[i].musicData.albumid}.m4a?guid=983915916&fromtag=66`,
      //       //g歌手
      //       singer:list[i].musicData.singer
      //     }
      //     nSongList.push(item)
      //   }
      //   return nSongList
      // }
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
